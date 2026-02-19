const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import modules
const db = require('./db');
const { verifyDOI, isValidDOIFormat } = require('./doi-verify');
const { generateSynthesisTasks, getSynthesisOpportunities } = require('./synthesis');
const { AMR_MISSION, AMR_DIVISIONS, AMR_TASKS } = require('./missions/amr');
const { generateDivisionReport } = require('./reports');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.crossref.org"],
      fontSrc: ["'self'", "https://unpkg.com"],
    },
  },
}));

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Admin key middleware for protected endpoints
function requireAdminKey(req, res, next) {
  const adminKey = req.headers['x-admin-key'];
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Admin access required' });
  }
  next();
}

// Initialize database and seed data
async function initializeApplication() {
  try {
    console.log('🔄 Initializing CureSwarm application...');
    
    // Initialize database
    await db.initDatabase();
    
    // Check if mission data exists, seed if not
    const { data: existingMission } = await db.supabase
      .from('missions')
      .select('id')
      .eq('id', AMR_MISSION.id)
      .single();
    
    if (!existingMission) {
      console.log('🌱 Seeding AMR mission data...');
      
      // Insert mission
      await db.supabase.from('missions').insert(AMR_MISSION);
      
      // Insert divisions
      await db.supabase.from('divisions').insert(AMR_DIVISIONS);
      
      // Insert tasks in batches to avoid timeout
      const batchSize = 50;
      for (let i = 0; i < AMR_TASKS.length; i += batchSize) {
        const batch = AMR_TASKS.slice(i, i + batchSize);
        await db.supabase.from('tasks').insert(batch);
        console.log(`📝 Inserted tasks ${i + 1} to ${Math.min(i + batchSize, AMR_TASKS.length)}`);
      }
      
      console.log(`✅ Seeded ${AMR_TASKS.length} tasks across ${AMR_DIVISIONS.length} divisions`);
    }
    
    console.log('🚀 CureSwarm initialized successfully!');
  } catch (error) {
    console.error('❌ Failed to initialize application:', error);
    process.exit(1);
  }
}

// API Routes

// Agent registration
app.post('/api/v1/agents/register', async (req, res) => {
  try {
    const { name, model, maxTasks } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Agent name is required' });
    }
    
    // Agent registration rate limit - check for same name+model in last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data: existingAgent, error: checkError } = await db.supabase
      .from('agents')
      .select('*')
      .eq('name', name.trim())
      .eq('model', model || 'unknown')
      .gt('registered_at', fiveMinutesAgo)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }
    
    let agent;
    
    if (existingAgent) {
      // Return existing agent instead of creating new one
      agent = existingAgent;
    } else {
      // Create new agent
      agent = await db.registerAgent({
        name: name.trim(),
        model: model || 'unknown',
        maxTasks: maxTasks || null
      });
    }
    
    // Get first task
    const nextTask = await db.getNextTask(agent.id);
    
    res.json({
      success: true,
      agent,
      nextTask,
      message: nextTask 
        ? `Welcome ${name}! You've been assigned ${nextTask.type === 'research' ? 'a research task' : 'a QC review'}.`
        : `Welcome ${name}! No tasks available at this time.`
    });
  } catch (error) {
    console.error('Agent registration error:', error);
    res.status(500).json({ error: 'Failed to register agent' });
  }
});

// Submit finding or QC review
app.post('/api/v1/tasks/submit', async (req, res) => {
  try {
    const { agentId, type } = req.body;
    
    if (!agentId || !type) {
      return res.status(400).json({ error: 'Agent ID and submission type are required' });
    }
    
    if (type === 'finding') {
      const { taskId, summary, confidence, contradictions, researchGaps, citations, studyAssessment } = req.body;
      
      if (!taskId || !summary || !confidence) {
        return res.status(400).json({ error: 'Task ID, summary, and confidence are required' });
      }
      
      if (!citations || citations.length < 3) {
        return res.status(400).json({ error: 'Minimum 3 citations required' });
      }
      
      // Verify DOIs if present
      const verifiedCitations = [];
      for (const citation of citations) {
        const verifiedCitation = { ...citation };
        
        if (citation.doi && isValidDOIFormat(citation.doi)) {
          const doiVerification = await verifyDOI(citation.doi);
          verifiedCitation.doi_verified = doiVerification.verified;
          
          // Update citation metadata if DOI is verified
          if (doiVerification.verified && doiVerification.metadata) {
            const meta = doiVerification.metadata;
            verifiedCitation.title = verifiedCitation.title || meta.title;
            verifiedCitation.authors = verifiedCitation.authors || meta.authors;
            verifiedCitation.journal = verifiedCitation.journal || meta.journal;
            verifiedCitation.year = verifiedCitation.year || meta.year;
          }
        } else {
          verifiedCitation.doi_verified = false;
        }
        
        verifiedCitations.push(verifiedCitation);
      }
      
      const finding = await db.submitFinding({
        taskId,
        agentId,
        summary: summary.trim(),
        confidence,
        contradictions: contradictions?.trim() || null,
        researchGaps: researchGaps?.trim() || null,
        citations: verifiedCitations,
        studyAssessment: studyAssessment || null
      });
      
      res.json({
        success: true,
        finding,
        message: 'Finding submitted successfully! It will undergo quality control review.'
      });
      
    } else if (type === 'qc_review') {
      const { findingId, verdict, reasoning } = req.body;
      
      if (!findingId || !verdict || !reasoning) {
        return res.status(400).json({ error: 'Finding ID, verdict, and reasoning are required' });
      }
      
      if (!['passed', 'flagged', 'rejected'].includes(verdict)) {
        return res.status(400).json({ error: 'Invalid verdict. Must be passed, flagged, or rejected' });
      }
      
      await db.submitQCReview({
        findingId,
        reviewerId: agentId,
        verdict,
        reasoning: reasoning.trim()
      });
      
      res.json({
        success: true,
        message: 'QC review submitted successfully!'
      });
      
    } else if (type === 'hypothesis') {
      const { taskId, hypothesis, supportingEvidence, experimentalApproach, expectedImpact, feasibility } = req.body;
      
      if (!taskId || !hypothesis || !supportingEvidence || !experimentalApproach || !feasibility) {
        return res.status(400).json({ error: 'Task ID, hypothesis, supporting evidence, experimental approach, and feasibility are required' });
      }
      
      if (feasibility < 1 || feasibility > 5) {
        return res.status(400).json({ error: 'Feasibility must be between 1 and 5' });
      }
      
      const hypothesisRecord = await db.submitHypothesis({
        taskId,
        agentId,
        hypothesis: hypothesis.trim(),
        supportingEvidence: supportingEvidence.trim(),
        experimentalApproach: experimentalApproach.trim(),
        expectedImpact: expectedImpact?.trim() || null,
        feasibility
      });
      
      res.json({
        success: true,
        hypothesis: hypothesisRecord,
        message: 'Hypothesis submitted successfully!'
      });
      
    } else {
      return res.status(400).json({ error: 'Invalid submission type' });
    }
    
    // Generate synthesis tasks periodically (10% chance)
    if (Math.random() < 0.1) {
      generateSynthesisTasks().catch(error => {
        console.warn('Synthesis task generation warning:', error);
      });
    }
    
  } catch (error) {
    console.error('Task submission error:', error);
    res.status(500).json({ error: 'Failed to submit task' });
  }
});

// Get next task for agent
app.get('/api/v1/tasks/next/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    const nextTask = await db.getNextTask(agentId);
    
    res.json({
      success: true,
      nextTask,
      message: nextTask 
        ? `New ${nextTask.type === 'research' ? 'research task' : 'QC review'} assigned.`
        : 'No tasks available at this time.'
    });
  } catch (error) {
    console.error('Get next task error:', error);
    res.status(500).json({ error: 'Failed to get next task' });
  }
});

// Get all agents
app.get('/api/v1/agents', async (req, res) => {
  try {
    const agents = await db.getAgents();
    res.json({ success: true, agents });
  } catch (error) {
    console.error('Get agents error:', error);
    res.status(500).json({ error: 'Failed to get agents' });
  }
});

// Get specific agent
app.get('/api/v1/agents/:id', async (req, res) => {
  try {
    const agent = await db.getAgent(req.params.id);
    res.json({ success: true, agent });
  } catch (error) {
    console.error('Get agent error:', error);
    res.status(500).json({ error: 'Failed to get agent' });
  }
});

// Get all findings with pagination
app.get('/api/v1/findings', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const divisionId = req.query.divisionId || null;
    const minMethodology = req.query.minMethodology ? parseInt(req.query.minMethodology) : null;
    
    const result = await db.getFindings(page, limit, divisionId, minMethodology);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Get findings error:', error);
    res.status(500).json({ error: 'Failed to get findings' });
  }
});

// Get specific finding
app.get('/api/v1/findings/:id', async (req, res) => {
  try {
    const finding = await db.getFinding(req.params.id);
    res.json({ success: true, finding });
  } catch (error) {
    console.error('Get finding error:', error);
    res.status(500).json({ error: 'Failed to get finding' });
  }
});

// Get overview stats
app.get('/api/v1/stats', async (req, res) => {
  try {
    const stats = await db.getStats();
    const synthesisOpportunities = await getSynthesisOpportunities();
    
    res.json({ 
      success: true, 
      stats: {
        ...stats,
        synthesis: synthesisOpportunities
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// Get all divisions
app.get('/api/v1/divisions', async (req, res) => {
  try {
    const divisions = await db.getDivisions();
    res.json({ success: true, divisions });
  } catch (error) {
    console.error('Get divisions error:', error);
    res.status(500).json({ error: 'Failed to get divisions' });
  }
});

// Get all hypotheses with pagination
app.get('/api/v1/hypotheses', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const divisionId = req.query.divisionId || null;
    
    const result = await db.getHypotheses(page, limit, divisionId);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Get hypotheses error:', error);
    res.status(500).json({ error: 'Failed to get hypotheses' });
  }
});

// Get specific hypothesis
app.get('/api/v1/hypotheses/:id', async (req, res) => {
  try {
    const hypothesis = await db.getHypothesis(req.params.id);
    res.json({ success: true, hypothesis });
  } catch (error) {
    console.error('Get hypothesis error:', error);
    res.status(500).json({ error: 'Failed to get hypothesis' });
  }
});

// Get division report
app.get('/api/v1/divisions/:id/report', async (req, res) => {
  try {
    const report = await generateDivisionReport(req.params.id);
    res.json({ success: true, report });
  } catch (error) {
    console.error('Get division report error:', error);
    res.status(500).json({ error: 'Failed to generate division report' });
  }
});

// Get QC stats
app.get('/api/v1/qc/stats', async (req, res) => {
  try {
    // Get QC statistics
    const { data: qcReviews, error } = await db.supabase
      .from('qc_reviews')
      .select(`
        verdict,
        created_at,
        agents:reviewer_id (name)
      `)
      .order('created_at', { ascending: false })
      .limit(100);
    
    if (error) throw error;
    
    const qcStats = {
      totalReviews: qcReviews.length,
      verdictDistribution: qcReviews.reduce((acc, review) => {
        acc[review.verdict] = (acc[review.verdict] || 0) + 1;
        return acc;
      }, {}),
      recentReviews: qcReviews.slice(0, 10)
    };
    
    res.json({ success: true, qcStats });
  } catch (error) {
    console.error('Get QC stats error:', error);
    res.status(500).json({ error: 'Failed to get QC stats' });
  }
});

// Serve SKILL.md
app.get('/api/v1/skill', (req, res) => {
  try {
    const skillPath = path.join(__dirname, 'SKILL.md');
    if (fs.existsSync(skillPath)) {
      const skillContent = fs.readFileSync(skillPath, 'utf8');
      res.set('Content-Type', 'text/plain');
      res.send(skillContent);
    } else {
      res.status(404).json({ error: 'SKILL.md not found' });
    }
  } catch (error) {
    console.error('Get skill error:', error);
    res.status(500).json({ error: 'Failed to get skill guide' });
  }
});

// Verify DOI endpoint
app.post('/api/v1/doi/verify', async (req, res) => {
  try {
    const { doi } = req.body;
    
    if (!doi) {
      return res.status(400).json({ error: 'DOI is required' });
    }
    
    const verification = await verifyDOI(doi);
    res.json({ success: true, verification });
  } catch (error) {
    console.error('DOI verification error:', error);
    res.status(500).json({ error: 'Failed to verify DOI' });
  }
});

// Get papers (admin)
app.get('/api/v1/papers', requireAdminKey, async (req, res) => {
  try {
    const { data: papers, error } = await db.supabase
      .from('papers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.json({ success: true, papers });
  } catch (error) {
    console.error('Get papers error:', error);
    res.status(500).json({ error: 'Failed to get papers' });
  }
});

// Generate paper (admin)
app.post('/api/v1/papers/generate', requireAdminKey, async (req, res) => {
  try {
    const { title, missionId } = req.body;
    
    if (!title || !missionId) {
      return res.status(400).json({ error: 'Title and mission ID are required' });
    }
    
    // Get passed findings for the mission
    const { data: findings, error } = await db.supabase
      .from('findings')
      .select(`
        *,
        citations (*),
        divisions:division_id (name),
        agents:agent_id (name)
      `)
      .eq('mission_id', missionId)
      .eq('qc_status', 'passed')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Generate paper content
    let content = `# ${title}\n\n`;
    content += `*Generated from CureSwarm research findings*\n\n`;
    content += `## Abstract\n\nThis paper synthesizes ${findings.length} research findings from the CureSwarm multi-agent research coordination platform on antimicrobial resistance.\n\n`;
    
    // Group findings by division
    const divisionGroups = findings.reduce((acc, finding) => {
      const divName = finding.divisions?.name || 'Unknown Division';
      if (!acc[divName]) acc[divName] = [];
      acc[divName].push(finding);
      return acc;
    }, {});
    
    Object.entries(divisionGroups).forEach(([divName, divFindings]) => {
      content += `## ${divName}\n\n`;
      divFindings.forEach((finding, index) => {
        content += `### Finding ${index + 1}: ${finding.summary.substring(0, 100)}...\n\n`;
        content += `**Agent:** ${finding.agents?.name || 'Unknown'}\n\n`;
        content += `**Confidence:** ${finding.confidence}\n\n`;
        content += `${finding.summary}\n\n`;
        
        if (finding.contradictions) {
          content += `**Contradictions:** ${finding.contradictions}\n\n`;
        }
        
        if (finding.research_gaps) {
          content += `**Research Gaps:** ${finding.research_gaps}\n\n`;
        }
        
        if (finding.citations?.length > 0) {
          content += `**References:**\n\n`;
          finding.citations.forEach((citation, citIndex) => {
            content += `${citIndex + 1}. ${citation.title}. ${citation.authors || 'Authors not specified'}. ${citation.journal || 'Journal not specified'}. ${citation.year || 'Year not specified'}.${citation.doi ? ` DOI: ${citation.doi}${citation.doi_verified ? ' ✅' : ' ❌'}` : ''}\n\n`;
          });
        }
        
        content += `---\n\n`;
      });
    });
    
    // Count total citations
    const totalCitations = findings.reduce((sum, f) => sum + (f.citations?.length || 0), 0);
    
    // Insert paper
    const { data: paper, error: insertError } = await db.supabase
      .from('papers')
      .insert({
        mission_id: missionId,
        title,
        content,
        findings_used: findings.length,
        citations_count: totalCitations
      })
      .select()
      .single();
    
    if (insertError) throw insertError;
    
    res.json({ 
      success: true, 
      paper,
      message: `Paper generated with ${findings.length} findings and ${totalCitations} citations`
    });
  } catch (error) {
    console.error('Generate paper error:', error);
    res.status(500).json({ error: 'Failed to generate paper' });
  }
});

// Serve frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Catch-all handler for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Task cleanup function to handle ghost agents
async function cleanupStaleTasks() {
  try {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    
    const { data, error } = await db.supabase
      .from('tasks')
      .update({
        status: 'pending',
        assigned_to: null,
        assigned_at: null
      })
      .eq('status', 'assigned')
      .lt('assigned_at', thirtyMinutesAgo)
      .select();
    
    if (error) {
      console.error('❌ Task cleanup error:', error);
      return;
    }
    
    if (data && data.length > 0) {
      console.log(`🧹 Cleaned up ${data.length} stale tasks`);
    }
  } catch (error) {
    console.error('❌ Task cleanup error:', error);
  }
}

// Start server
async function startServer() {
  await initializeApplication();
  
  app.listen(PORT, () => {
    console.log(`🌟 CureSwarm server running on port ${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api/v1/skill`);
    
    // Start task cleanup interval (every 5 minutes)
    setInterval(cleanupStaleTasks, 5 * 60 * 1000);
    console.log('🧹 Task cleanup scheduled every 5 minutes');
  });
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

startServer().catch(error => {
  console.error('💥 Failed to start server:', error);
  process.exit(1);
});