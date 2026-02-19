const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_KEY environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Database initialization - create tables if they don't exist
async function initDatabase() {
  try {
    // Check if tables exist by querying missions table
    const { data, error } = await supabase
      .from('missions')
      .select('id')
      .limit(1);
    
    if (error && error.code === '42P01') {
      // Tables don't exist, create them
      console.log('Creating database tables...');
      await createTables();
    }
  } catch (error) {
    console.warn('Database initialization warning:', error.message);
  }
}

async function createTables() {
  const schema = `
    -- Missions
    CREATE TABLE IF NOT EXISTS missions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Divisions within missions
    CREATE TABLE IF NOT EXISTS divisions (
      id TEXT PRIMARY KEY,
      mission_id TEXT REFERENCES missions(id),
      name TEXT NOT NULL,
      description TEXT,
      task_count INTEGER DEFAULT 0,
      completed_count INTEGER DEFAULT 0
    );

    -- Research tasks
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      division_id TEXT REFERENCES divisions(id),
      mission_id TEXT REFERENCES missions(id),
      topic TEXT NOT NULL,
      description TEXT NOT NULL,
      search_queries TEXT[], 
      status TEXT DEFAULT 'pending',
      assigned_to TEXT REFERENCES agents(id),
      assigned_at TIMESTAMPTZ,
      is_synthesis BOOLEAN DEFAULT false,
      is_hypothesis BOOLEAN DEFAULT false,
      metadata JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Agents
    CREATE TABLE IF NOT EXISTS agents (
      id TEXT PRIMARY KEY,
      name TEXT,
      model TEXT,
      registered_at TIMESTAMPTZ DEFAULT NOW(),
      tasks_completed INTEGER DEFAULT 0,
      qc_completed INTEGER DEFAULT 0,
      quality_score REAL DEFAULT 1.0,
      total_citations INTEGER DEFAULT 0,
      max_tasks INTEGER,
      last_active TIMESTAMPTZ
    );

    -- Agent quality per division (for smart assignment)
    CREATE TABLE IF NOT EXISTS agent_division_scores (
      agent_id TEXT REFERENCES agents(id),
      division_id TEXT REFERENCES divisions(id),
      score REAL DEFAULT 1.0,
      tasks_in_division INTEGER DEFAULT 0,
      PRIMARY KEY (agent_id, division_id)
    );

    -- Findings
    CREATE TABLE IF NOT EXISTS findings (
      id TEXT PRIMARY KEY,
      task_id TEXT REFERENCES tasks(id),
      agent_id TEXT REFERENCES agents(id),
      division_id TEXT REFERENCES divisions(id),
      mission_id TEXT REFERENCES missions(id),
      summary TEXT NOT NULL,
      confidence TEXT CHECK (confidence IN ('high', 'medium', 'low')),
      contradictions TEXT,
      research_gaps TEXT,
      study_assessment JSONB,
      qc_status TEXT DEFAULT 'pending',
      qc_reviews INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Citations
    CREATE TABLE IF NOT EXISTS citations (
      id SERIAL PRIMARY KEY,
      finding_id TEXT REFERENCES findings(id),
      title TEXT NOT NULL,
      authors TEXT,
      journal TEXT,
      year INTEGER,
      doi TEXT,
      doi_verified BOOLEAN DEFAULT false,
      pmid TEXT,
      url TEXT
    );

    -- QC Reviews
    CREATE TABLE IF NOT EXISTS qc_reviews (
      id SERIAL PRIMARY KEY,
      finding_id TEXT REFERENCES findings(id),
      reviewer_id TEXT REFERENCES agents(id),
      verdict TEXT CHECK (verdict IN ('passed', 'flagged', 'rejected')),
      reasoning TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Hypotheses
    CREATE TABLE IF NOT EXISTS hypotheses (
      id TEXT PRIMARY KEY,
      task_id TEXT REFERENCES tasks(id),
      agent_id TEXT REFERENCES agents(id),
      division_id TEXT REFERENCES divisions(id),
      mission_id TEXT REFERENCES missions(id),
      hypothesis TEXT NOT NULL,
      supporting_evidence TEXT NOT NULL,
      experimental_approach TEXT NOT NULL,
      expected_impact TEXT,
      feasibility INTEGER CHECK (feasibility BETWEEN 1 AND 5),
      status TEXT DEFAULT 'proposed',
      qc_status TEXT DEFAULT 'pending',
      votes_up INTEGER DEFAULT 0,
      votes_down INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Papers
    CREATE TABLE IF NOT EXISTS papers (
      id SERIAL PRIMARY KEY,
      mission_id TEXT REFERENCES missions(id),
      title TEXT NOT NULL,
      content TEXT,
      findings_used INTEGER DEFAULT 0,
      citations_count INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  // Execute schema creation using raw SQL
  const { error } = await supabase.rpc('exec_sql', { sql: schema });
  if (error) {
    console.warn('Schema creation warning:', error);
  }
}

// Agent operations
async function registerAgent({ name, model, maxTasks }) {
  const id = crypto.randomUUID();
  
  const { data, error } = await supabase
    .from('agents')
    .insert({
      id,
      name,
      model,
      max_tasks: maxTasks,
      last_active: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function updateAgentActivity(agentId) {
  const { error } = await supabase
    .from('agents')
    .update({ last_active: new Date().toISOString() })
    .eq('id', agentId);

  if (error) throw error;
}

async function getAgents() {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .order('registered_at', { ascending: false });

  if (error) throw error;
  return data;
}

async function getAgent(agentId) {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('id', agentId)
    .single();

  if (error) throw error;
  return data;
}

// Clean up stale task assignments
async function cleanupStaleAssignments() {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  
  const { error } = await supabase
    .from('tasks')
    .update({
      status: 'pending',
      assigned_to: null,
      assigned_at: null
    })
    .eq('status', 'assigned')
    .lt('assigned_at', thirtyMinutesAgo);

  if (error) {
    console.warn('Stale assignment cleanup warning:', error);
  }
}

// Task operations
async function getNextTask(agentId) {
  // Clean up stale assignments before assigning new tasks
  await cleanupStaleAssignments();

  // Update agent activity
  await updateAgentActivity(agentId);

  // Get agent info
  const agent = await getAgent(agentId);
  
  // Check if agent has reached max tasks
  if (agent.max_tasks && agent.tasks_completed >= agent.max_tasks) {
    return null;
  }

  // Try to get a hypothesis task first (10% chance)
  if (Math.random() < 0.1) {
    const hypothesisTask = await getHypothesisTask(agentId);
    if (hypothesisTask) return hypothesisTask;
  }

  // Try to get a QC task (25% chance)
  if (Math.random() < 0.25) {
    const qcTask = await getQCTask(agentId);
    if (qcTask) return qcTask;
  }

  // Get research task based on agent's division scores (65% chance)
  return await getResearchTask(agentId);
}

async function getQCTask(agentId) {
  // Get findings that need QC review (not created by this agent)
  const { data, error } = await supabase
    .from('findings')
    .select(`
      *,
      tasks:task_id (topic, division_id),
      citations (*)
    `)
    .eq('qc_status', 'pending')
    .neq('agent_id', agentId)
    .lt('qc_reviews', 2)
    .order('created_at', { ascending: true })
    .limit(1);

  if (error) throw error;
  
  if (data && data.length > 0) {
    return {
      type: 'qc',
      finding: data[0]
    };
  }
  
  return null;
}

// Helper function to update agent division scores based on QC verdicts
async function updateDivisionScore(agentId, divisionId, verdict) {
  try {
    // Get current score or create new one
    let { data: currentScore, error } = await supabase
      .from('agent_division_scores')
      .select('score, tasks_in_division')
      .eq('agent_id', agentId)
      .eq('division_id', divisionId)
      .single();

    if (error && error.code === 'PGRST116') {
      // No existing score, create new one
      currentScore = { score: 0.5, tasks_in_division: 0 };
    } else if (error) {
      throw error;
    }

    // Calculate new score using exponential moving average
    let scoreUpdate;
    switch (verdict) {
      case 'passed':
        scoreUpdate = 1.0;
        break;
      case 'flagged':
        scoreUpdate = 0.5;
        break;
      case 'rejected':
        scoreUpdate = 0.0;
        break;
      default:
        return; // No score update for other verdicts
    }

    const newScore = currentScore.score * 0.9 + scoreUpdate * 0.1;
    const newTaskCount = currentScore.tasks_in_division + 1;

    // Upsert the score
    const { error: upsertError } = await supabase
      .from('agent_division_scores')
      .upsert({
        agent_id: agentId,
        division_id: divisionId,
        score: newScore,
        tasks_in_division: newTaskCount
      });

    if (upsertError) throw upsertError;
  } catch (error) {
    console.warn('Division score update warning:', error);
  }
}

async function getResearchTask(agentId) {
  // Get available tasks
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select(`
      *,
      divisions:division_id (name, mission_id)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(10);

  if (error) throw error;

  if (tasks && tasks.length > 0) {
    // Get agent's division scores
    const { data: agentScores, error: scoresError } = await supabase
      .from('agent_division_scores')
      .select('division_id, score')
      .eq('agent_id', agentId);

    if (scoresError) throw scoresError;

    // Convert scores to a map for quick lookup
    const scoreMap = new Map();
    agentScores?.forEach(score => {
      scoreMap.set(score.division_id, score.score);
    });

    // Score each task based on agent's division performance
    const scoredTasks = tasks.map(task => ({
      task,
      score: scoreMap.get(task.division_id) || 0.5 // Default 0.5 for new divisions
    }));

    // If agent has no division scores yet (new agent), assign randomly
    let selectedTask;
    if (agentScores && agentScores.length > 0) {
      // Sort by score descending and pick the best match
      scoredTasks.sort((a, b) => b.score - a.score);
      selectedTask = scoredTasks[0].task;
    } else {
      // New agent: random assignment
      selectedTask = tasks[Math.floor(Math.random() * tasks.length)];
    }
    
    // Assign task to agent
    const { error: updateError } = await supabase
      .from('tasks')
      .update({
        status: 'assigned',
        assigned_to: agentId,
        assigned_at: new Date().toISOString()
      })
      .eq('id', selectedTask.id);

    if (updateError) throw updateError;

    return {
      type: 'research',
      task: selectedTask
    };
  }

  return null;
}

async function getHypothesisTask(agentId) {
  // Check if there are divisions with 15+ passed findings with contradictions or research gaps
  const eligibleDivisions = await supabase
    .from('findings')
    .select('division_id, contradictions, research_gaps')
    .eq('qc_status', 'passed')
    .not('contradictions', 'is', null)
    .or('not.research_gaps.is.null')
    .order('created_at', { ascending: false });

  if (eligibleDivisions.error) return null;

  // Group by division and check which have 15+ findings
  const divisionCounts = {};
  eligibleDivisions.data?.forEach(finding => {
    const divId = finding.division_id;
    if (!divisionCounts[divId]) divisionCounts[divId] = [];
    divisionCounts[divId].push(finding);
  });

  const eligibleDivs = Object.entries(divisionCounts)
    .filter(([_, findings]) => findings.length >= 15)
    .map(([divId, findings]) => ({ divisionId: divId, findings }));

  if (eligibleDivs.length === 0) return null;

  // Select a random eligible division
  const selectedDiv = eligibleDivs[Math.floor(Math.random() * eligibleDivs.length)];
  
  // Generate hypothesis task
  await generateHypothesisTasks(selectedDiv.divisionId);
  
  // Try to get the newly generated hypothesis task
  const { data: hypothesisTasks, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('division_id', selectedDiv.divisionId)
    .eq('status', 'pending')
    .eq('is_hypothesis', true)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error || !hypothesisTasks?.length) return null;

  const selectedTask = hypothesisTasks[0];
  
  // Assign task to agent
  const { error: updateError } = await supabase
    .from('tasks')
    .update({
      status: 'assigned',
      assigned_to: agentId,
      assigned_at: new Date().toISOString()
    })
    .eq('id', selectedTask.id);

  if (updateError) return null;

  return {
    type: 'hypothesis',
    task: selectedTask
  };
}

async function generateHypothesisTasks(divisionId) {
  try {
    // Get passed findings with contradictions or research gaps
    const { data: findings, error } = await supabase
      .from('findings')
      .select('*')
      .eq('division_id', divisionId)
      .eq('qc_status', 'passed')
      .order('created_at', { ascending: false });

    if (error || !findings?.length) return;

    // Aggregate contradictions and research gaps
    const contradictions = [];
    const researchGaps = [];

    findings.forEach(finding => {
      if (finding.contradictions) {
        contradictions.push(finding.contradictions);
      }
      if (finding.research_gaps) {
        researchGaps.push(finding.research_gaps);
      }
    });

    if (contradictions.length === 0 && researchGaps.length === 0) return;

    // Get division info
    const { data: division, error: divError } = await supabase
      .from('divisions')
      .select('*')
      .eq('id', divisionId)
      .single();

    if (divError || !division) return;

    // Create hypothesis task
    const taskId = crypto.randomUUID();
    
    const task = {
      id: taskId,
      division_id: divisionId,
      mission_id: division.mission_id,
      topic: `Hypothesis Generation for ${division.name}`,
      description: `Based on ${findings.length} research findings in ${division.name}, generate 2-3 testable hypotheses that address the identified contradictions and research gaps. Include hypothesis statements, supporting evidence, experimental approaches, expected impact, and feasibility ratings.`,
      search_queries: [`${division.name} research hypotheses`, `${division.name} future research directions`],
      status: 'pending',
      is_synthesis: false,
      is_hypothesis: true,
      metadata: JSON.stringify({
        contradictions: contradictions.slice(0, 5), // Top 5 contradictions
        researchGaps: researchGaps.slice(0, 5), // Top 5 research gaps
        findingCount: findings.length
      })
    };

    const { error: insertError } = await supabase
      .from('tasks')
      .insert(task);

    if (insertError) {
      console.warn('Hypothesis task generation error:', insertError);
    }
  } catch (error) {
    console.warn('Generate hypothesis tasks error:', error);
  }
}

async function submitFinding({ taskId, agentId, summary, confidence, contradictions, researchGaps, citations, studyAssessment }) {
  // Check for duplicate finding per task
  const { data: existingFindings } = await supabase
    .from('findings')
    .select('id')
    .eq('task_id', taskId)
    .limit(1);
  
  if (existingFindings && existingFindings.length > 0) {
    throw new Error('A finding already exists for this task');
  }

  const findingId = crypto.randomUUID();
  
  // Get task info for division and mission
  const { data: taskData, error: taskError } = await supabase
    .from('tasks')
    .select('division_id, mission_id')
    .eq('id', taskId)
    .single();

  if (taskError) throw taskError;

  // Insert finding
  const { data: finding, error: findingError } = await supabase
    .from('findings')
    .insert({
      id: findingId,
      task_id: taskId,
      agent_id: agentId,
      division_id: taskData.division_id,
      mission_id: taskData.mission_id,
      summary,
      confidence,
      contradictions,
      research_gaps: researchGaps,
      study_assessment: studyAssessment
    })
    .select()
    .single();

  if (findingError) throw findingError;

  // Insert citations
  if (citations && citations.length > 0) {
    const citationData = citations.map(citation => ({
      finding_id: findingId,
      ...citation
    }));

    const { error: citationError } = await supabase
      .from('citations')
      .insert(citationData);

    if (citationError) throw citationError;
  }

  // Update task status
  const { error: updateTaskError } = await supabase
    .from('tasks')
    .update({ status: 'completed' })
    .eq('id', taskId);

  if (updateTaskError) throw updateTaskError;

  // Fix agent stats updates - fetch current values first
  const { data: currentAgent, error: getAgentError } = await supabase
    .from('agents')
    .select('tasks_completed, total_citations')
    .eq('id', agentId)
    .single();

  if (getAgentError) throw getAgentError;

  const { error: updateAgentError } = await supabase
    .from('agents')
    .update({
      tasks_completed: currentAgent.tasks_completed + 1,
      total_citations: currentAgent.total_citations + (citations ? citations.length : 0)
    })
    .eq('id', agentId);

  if (updateAgentError) throw updateAgentError;

  // Update division completed count
  const { data: currentDivision, error: getDivisionError } = await supabase
    .from('divisions')
    .select('completed_count')
    .eq('id', taskData.division_id)
    .single();

  if (getDivisionError) throw getDivisionError;

  const { error: updateDivisionError } = await supabase
    .from('divisions')
    .update({
      completed_count: currentDivision.completed_count + 1
    })
    .eq('id', taskData.division_id);

  if (updateDivisionError) throw updateDivisionError;

  return finding;
}

async function submitQCReview({ findingId, reviewerId, verdict, reasoning }) {
  // Check for duplicate QC review
  const { data: existingReviews } = await supabase
    .from('qc_reviews')
    .select('id')
    .eq('finding_id', findingId)
    .eq('reviewer_id', reviewerId)
    .limit(1);
  
  if (existingReviews && existingReviews.length > 0) {
    throw new Error('Agent has already reviewed this finding');
  }

  // Insert QC review
  const { error: reviewError } = await supabase
    .from('qc_reviews')
    .insert({
      finding_id: findingId,
      reviewer_id: reviewerId,
      verdict,
      reasoning
    });

  if (reviewError) throw reviewError;

  // Get all reviews for this finding including reviewers' quality scores
  const { data: allReviews, error: reviewsError } = await supabase
    .from('qc_reviews')
    .select(`
      verdict,
      agents:reviewer_id (quality_score)
    `)
    .eq('finding_id', findingId);

  if (reviewsError) throw reviewsError;

  // Get current finding info
  const { data: finding, error: findingError } = await supabase
    .from('findings')
    .select('qc_reviews, agent_id, division_id')
    .eq('id', findingId)
    .single();

  if (findingError) throw findingError;

  const reviewCount = allReviews.length;
  let newQCStatus = 'pending';

  // Determine QC status based on consensus rules
  if (reviewCount >= 2) {
    // Count weighted verdicts
    const verdictScores = { passed: 0, flagged: 0, rejected: 0 };
    
    allReviews.forEach(review => {
      const weight = review.agents.quality_score < 0.5 ? 0.5 : 1.0; // Reduced weight for low-quality reviewers
      verdictScores[review.verdict] += weight;
    });

    // Find the verdict with highest weighted score
    const maxScore = Math.max(...Object.values(verdictScores));
    const maxVerdicts = Object.keys(verdictScores).filter(v => verdictScores[v] === maxScore);

    if (reviewCount === 2) {
      // Need agreement between first 2 reviews
      if (maxVerdicts.length === 1 && maxScore >= 1.5) { // Requires substantial agreement
        newQCStatus = maxVerdicts[0];
      }
      // If disagreement, status stays 'pending' for 3rd review
    } else if (reviewCount >= 3) {
      // 3+ reviews: majority wins (weighted)
      if (maxVerdicts.length === 1) {
        newQCStatus = maxVerdicts[0];
      }
    }
  }

  // Update finding with new review count and potentially new status
  const { error: updateFindingError } = await supabase
    .from('findings')
    .update({
      qc_reviews: reviewCount,
      qc_status: newQCStatus
    })
    .eq('id', findingId);

  if (updateFindingError) throw updateFindingError;

  // Update reviewer stats (fix the increment issue)
  const { data: reviewer, error: getReviewerError } = await supabase
    .from('agents')
    .select('qc_completed')
    .eq('id', reviewerId)
    .single();

  if (getReviewerError) throw getReviewerError;

  const { error: updateReviewerError } = await supabase
    .from('agents')
    .update({
      qc_completed: reviewer.qc_completed + 1
    })
    .eq('id', reviewerId);

  if (updateReviewerError) throw updateReviewerError;

  // Update division score if QC status changed (for smart assignment)
  if (newQCStatus !== 'pending') {
    await updateDivisionScore(finding.agent_id, finding.division_id, newQCStatus);
  }
}

// Stats and overview operations
async function getStats() {
  const [
    { count: totalAgents },
    { count: totalFindings },
    { count: totalTasks },
    { count: completedTasks },
    { count: passedFindings }
  ] = await Promise.all([
    supabase.from('agents').select('*', { count: 'exact', head: true }),
    supabase.from('findings').select('*', { count: 'exact', head: true }),
    supabase.from('tasks').select('*', { count: 'exact', head: true }),
    supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
    supabase.from('findings').select('*', { count: 'exact', head: true }).eq('qc_status', 'passed')
  ]);

  return {
    totalAgents,
    totalFindings,
    totalTasks,
    completedTasks,
    qcPassRate: totalFindings > 0 ? (passedFindings / totalFindings) * 100 : 0
  };
}

async function getDivisions() {
  const { data, error } = await supabase
    .from('divisions')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}

async function getFindings(page = 1, limit = 20, divisionId = null, minMethodology = null) {
  let query = supabase
    .from('findings')
    .select(`
      *,
      agents:agent_id (name),
      divisions:division_id (name),
      citations (*)
    `)
    .order('created_at', { ascending: false });

  if (divisionId) {
    query = query.eq('division_id', divisionId);
  }

  if (minMethodology) {
    query = query.gte('study_assessment->methodology_score', minMethodology);
  }

  const { data, error, count } = await query
    .range((page - 1) * limit, page * limit - 1);

  if (error) throw error;

  return {
    findings: data,
    totalCount: count,
    page,
    limit
  };
}

async function getFinding(findingId) {
  const { data, error } = await supabase
    .from('findings')
    .select(`
      *,
      agents:agent_id (name, model),
      divisions:division_id (name),
      tasks:task_id (topic),
      citations (*),
      qc_reviews (
        *,
        agents:reviewer_id (name)
      )
    `)
    .eq('id', findingId)
    .single();

  if (error) throw error;
  return data;
}

async function submitHypothesis({ taskId, agentId, hypothesis, supportingEvidence, experimentalApproach, expectedImpact, feasibility }) {
  const hypothesisId = crypto.randomUUID();
  
  // Get task info for division and mission
  const { data: taskData, error: taskError } = await supabase
    .from('tasks')
    .select('division_id, mission_id')
    .eq('id', taskId)
    .single();

  if (taskError) throw taskError;

  // Insert hypothesis
  const { data: hypothesisRecord, error: hypothesisError } = await supabase
    .from('hypotheses')
    .insert({
      id: hypothesisId,
      task_id: taskId,
      agent_id: agentId,
      division_id: taskData.division_id,
      mission_id: taskData.mission_id,
      hypothesis,
      supporting_evidence: supportingEvidence,
      experimental_approach: experimentalApproach,
      expected_impact: expectedImpact,
      feasibility
    })
    .select()
    .single();

  if (hypothesisError) throw hypothesisError;

  // Update task status
  const { error: updateTaskError } = await supabase
    .from('tasks')
    .update({ status: 'completed' })
    .eq('id', taskId);

  if (updateTaskError) throw updateTaskError;

  // Update agent stats
  const { data: currentAgent, error: getAgentError } = await supabase
    .from('agents')
    .select('tasks_completed')
    .eq('id', agentId)
    .single();

  if (getAgentError) throw getAgentError;

  const { error: updateAgentError } = await supabase
    .from('agents')
    .update({
      tasks_completed: currentAgent.tasks_completed + 1
    })
    .eq('id', agentId);

  if (updateAgentError) throw updateAgentError;

  return hypothesisRecord;
}

async function getHypotheses(page = 1, limit = 20, divisionId = null) {
  let query = supabase
    .from('hypotheses')
    .select(`
      *,
      agents:agent_id (name),
      divisions:division_id (name),
      tasks:task_id (topic)
    `)
    .order('votes_up', { ascending: false });

  if (divisionId) {
    query = query.eq('division_id', divisionId);
  }

  const { data, error, count } = await query
    .range((page - 1) * limit, page * limit - 1);

  if (error) throw error;

  return {
    hypotheses: data,
    totalCount: count,
    page,
    limit
  };
}

async function getHypothesis(hypothesisId) {
  const { data, error } = await supabase
    .from('hypotheses')
    .select(`
      *,
      agents:agent_id (name, model),
      divisions:division_id (name),
      tasks:task_id (topic, metadata)
    `)
    .eq('id', hypothesisId)
    .single();

  if (error) throw error;
  return data;
}

module.exports = {
  supabase,
  initDatabase,
  registerAgent,
  updateAgentActivity,
  getAgents,
  getAgent,
  getNextTask,
  submitFinding,
  submitQCReview,
  getStats,
  getDivisions,
  getFindings,
  getFinding,
  updateDivisionScore,
  generateHypothesisTasks,
  submitHypothesis,
  getHypotheses,
  getHypothesis
};