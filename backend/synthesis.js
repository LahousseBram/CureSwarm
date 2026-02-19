const { supabase } = require('./db');
const crypto = require('crypto');

/**
 * Generate cross-domain synthesis tasks when enough findings accumulate
 * This is called periodically by the server or triggered by events
 */
async function generateSynthesisTasks() {
  try {
    console.log('Checking for synthesis opportunities...');
    
    // Get all divisions with their finding counts
    const { data: divisions, error: divisionsError } = await supabase
      .from('divisions')
      .select(`
        *,
        findings:findings(count)
      `);

    if (divisionsError) throw divisionsError;

    // Find divisions with sufficient findings for synthesis
    const synthesisCandidates = divisions.filter(division => {
      const findingCount = division.findings?.[0]?.count || 0;
      return findingCount >= 10; // Minimum threshold for synthesis
    });

    if (synthesisCandidates.length < 2) {
      console.log('Not enough divisions with sufficient findings for synthesis');
      return;
    }

    // Generate synthesis tasks for high-value combinations
    const synthesisTasksGenerated = [];
    const combinations = getSynthesisCombinations(synthesisCandidates);

    for (const combination of combinations) {
      const existingSynthesisTask = await checkExistingSynthesisTask(combination);
      
      if (!existingSynthesisTask) {
        const synthesisTask = await createSynthesisTask(combination);
        if (synthesisTask) {
          synthesisTasksGenerated.push(synthesisTask);
        }
      }
    }

    console.log(`Generated ${synthesisTasksGenerated.length} new synthesis tasks`);
    return synthesisTasksGenerated;

  } catch (error) {
    console.error('Error generating synthesis tasks:', error);
    return [];
  }
}

/**
 * Get high-value combinations of divisions for synthesis
 * @param {Array} divisions - Divisions with sufficient findings
 * @returns {Array} - Array of division combinations
 */
function getSynthesisCombinations(divisions) {
  const combinations = [];
  
  // Define strategic combinations based on AMR research synergies
  const strategicPairs = [
    // Mechanisms + Pathogens
    { div1: 'resistance-mechanisms', div2: 'priority-pathogens' },
    // Therapeutics + Mechanisms  
    { div1: 'novel-therapeutics', div2: 'resistance-mechanisms' },
    // Diagnostics + Surveillance
    { div1: 'diagnostics-surveillance', div2: 'one-health' },
    // Policy + Clinical
    { div1: 'stewardship-policy', div2: 'clinical-outcomes' },
    // Prevention + Economics
    { div1: 'infection-prevention', div2: 'economic-impact' },
    // Genomics + Evolution
    { div1: 'genomics-evolution', div2: 'priority-pathogens' },
    // One Health + Policy
    { div1: 'one-health', div2: 'stewardship-policy' },
    // Therapeutics + Clinical
    { div1: 'novel-therapeutics', div2: 'clinical-outcomes' },
    // Vaccines + Prevention
    { div1: 'vaccines-prevention', div2: 'infection-prevention' },
    // Diagnostics + Clinical
    { div1: 'diagnostics-surveillance', div2: 'clinical-outcomes' }
  ];

  // Find available strategic combinations
  for (const pair of strategicPairs) {
    const div1 = divisions.find(d => d.id === pair.div1);
    const div2 = divisions.find(d => d.id === pair.div2);
    
    if (div1 && div2) {
      combinations.push([div1, div2]);
    }
  }

  // Add some additional high-value pairs if we have many active divisions
  if (divisions.length >= 6) {
    const economicDiv = divisions.find(d => d.id === 'economic-impact');
    const mechanismDiv = divisions.find(d => d.id === 'resistance-mechanisms');
    
    if (economicDiv && mechanismDiv) {
      combinations.push([economicDiv, mechanismDiv]);
    }
  }

  return combinations.slice(0, 5); // Limit to avoid overwhelming
}

/**
 * Check if a synthesis task already exists for this combination
 * @param {Array} combination - Array of two divisions
 * @returns {Promise<boolean>} - Whether task exists
 */
async function checkExistingSynthesisTask(combination) {
  const [div1, div2] = combination;
  
  // Check for existing synthesis tasks involving these divisions
  const { data, error } = await supabase
    .from('tasks')
    .select('id')
    .eq('is_synthesis', true)
    .or(`division_id.eq.${div1.id},division_id.eq.${div2.id}`)
    .neq('status', 'completed')
    .limit(1);

  if (error) {
    console.warn('Error checking existing synthesis task:', error);
    return false;
  }

  return data && data.length > 0;
}

/**
 * Create a synthesis task for a division combination
 * @param {Array} combination - Array of two divisions  
 * @returns {Promise<Object>} - Created synthesis task
 */
async function createSynthesisTask(combination) {
  const [div1, div2] = combination;
  const taskId = crypto.randomUUID();
  
  // Generate synthesis task content based on division combination
  const synthesisPrompt = generateSynthesisPrompt(div1, div2);
  
  try {
    const { data: task, error } = await supabase
      .from('tasks')
      .insert({
        id: taskId,
        division_id: div1.id, // Primary division
        mission_id: div1.mission_id,
        topic: synthesisPrompt.topic,
        description: synthesisPrompt.description,
        search_queries: synthesisPrompt.searchQueries,
        is_synthesis: true,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    console.log(`Created synthesis task: ${synthesisPrompt.topic}`);
    return task;
    
  } catch (error) {
    console.error('Error creating synthesis task:', error);
    return null;
  }
}

/**
 * Generate synthesis prompts based on division combinations
 * @param {Object} div1 - First division
 * @param {Object} div2 - Second division  
 * @returns {Object} - Synthesis task details
 */
function generateSynthesisPrompt(div1, div2) {
  const synthesisTemplates = {
    'resistance-mechanisms_priority-pathogens': {
      topic: 'Cross-Pathogen Resistance Mechanism Analysis',
      description: 'Analyze how specific resistance mechanisms (β-lactamases, efflux pumps, target modifications) are distributed across ESKAPE pathogens and other priority organisms. Identify patterns, evolutionary relationships, and implications for treatment strategies.',
      searchQueries: ['cross-pathogen resistance mechanisms', 'ESKAPE pathogen resistance patterns', 'horizontal gene transfer resistance', 'multi-pathogen resistance analysis']
    },
    'novel-therapeutics_resistance-mechanisms': {
      topic: 'Therapeutic Target-Mechanism Interaction Analysis',
      description: 'Examine how novel antimicrobial approaches (bacteriophages, antimicrobial peptides, CRISPR) interact with known resistance mechanisms. Identify potential vulnerabilities and resistance development pathways.',
      searchQueries: ['novel antimicrobials resistance mechanisms', 'bacteriophage resistance evolution', 'antimicrobial peptide resistance', 'CRISPR antimicrobial resistance']
    },
    'diagnostics-surveillance_one-health': {
      topic: 'One Health Surveillance Integration',  
      description: 'Synthesize diagnostic and surveillance approaches across human, animal, and environmental sectors. Identify gaps in cross-sector monitoring and opportunities for integrated AMR surveillance systems.',
      searchQueries: ['one health AMR surveillance', 'integrated resistance monitoring', 'cross-sector AMR diagnostics', 'environmental resistance surveillance']
    },
    'stewardship-policy_clinical-outcomes': {
      topic: 'Policy Impact on Clinical Effectiveness',
      description: 'Analyze the relationship between antimicrobial stewardship policies and measurable clinical outcomes. Identify which policy interventions most effectively reduce resistance while maintaining treatment efficacy.',
      searchQueries: ['stewardship policy clinical outcomes', 'antimicrobial policy effectiveness', 'stewardship mortality outcomes', 'policy resistance reduction']
    },
    'infection-prevention_economic-impact': {
      topic: 'Economic Returns of Infection Prevention',
      description: 'Quantify the economic benefits of various infection prevention strategies in reducing AMR burden. Compare cost-effectiveness across different prevention approaches and healthcare settings.',
      searchQueries: ['infection prevention economic analysis', 'AMR prevention cost-effectiveness', 'hospital infection control economics', 'prevention economic modeling']
    },
    'genomics-evolution_priority-pathogens': {
      topic: 'Evolutionary Genomics of Priority Pathogen Resistance',
      description: 'Analyze the evolutionary trajectories of resistance development in priority pathogens using genomic data. Identify evolutionary hotspots and predict future resistance trends.',
      searchQueries: ['pathogen resistance evolution genomics', 'resistance gene phylogenetics', 'evolutionary AMR prediction', 'genomic resistance surveillance']
    },
    'one-health_stewardship-policy': {
      topic: 'Cross-Sector Policy Coordination for AMR',
      description: 'Examine policy coordination challenges and opportunities across human health, agriculture, and environmental sectors in AMR control. Identify successful models and implementation barriers.',
      searchQueries: ['one health AMR policy', 'cross-sector stewardship coordination', 'agricultural antimicrobial policy', 'integrated AMR governance']
    },
    'novel-therapeutics_clinical-outcomes': {
      topic: 'Clinical Translation of Novel Antimicrobial Approaches',
      description: 'Analyze clinical trial outcomes and real-world effectiveness of novel antimicrobial therapies. Identify factors influencing successful clinical translation and adoption barriers.',
      searchQueries: ['novel antimicrobial clinical trials', 'bacteriophage therapy outcomes', 'antimicrobial peptide clinical results', 'novel therapy clinical effectiveness']
    },
    'vaccines-prevention_infection-prevention': {
      topic: 'Integrated Prevention Strategy Optimization',
      description: 'Examine synergies between vaccination strategies and traditional infection prevention measures in reducing AMR burden. Identify optimal prevention combinations for different settings.',
      searchQueries: ['vaccine infection prevention AMR', 'integrated prevention strategies', 'vaccination antimicrobial reduction', 'prevention strategy synergies']
    },
    'diagnostics-surveillance_clinical-outcomes': {
      topic: 'Diagnostic-Guided Treatment Optimization',
      description: 'Analyze how rapid diagnostic technologies and surveillance data can be integrated to optimize clinical decision-making and improve patient outcomes while reducing resistance development.',
      searchQueries: ['rapid diagnostics clinical outcomes', 'surveillance-guided treatment', 'diagnostic stewardship outcomes', 'precision antimicrobial therapy']
    }
  };

  // Generate combination key
  const key1 = `${div1.id}_${div2.id}`;
  const key2 = `${div2.id}_${div1.id}`;
  
  // Try both combinations
  let template = synthesisTemplates[key1] || synthesisTemplates[key2];
  
  // Fallback to generic synthesis task
  if (!template) {
    template = {
      topic: `Cross-Domain Analysis: ${div1.name} and ${div2.name}`,
      description: `Synthesize findings from ${div1.name} and ${div2.name} research to identify connections, synergies, and integrated approaches for addressing antimicrobial resistance. Focus on actionable insights that bridge these domains.`,
      searchQueries: [
        `${div1.name} ${div2.name} AMR integration`,
        `cross-domain antimicrobial resistance analysis`,
        `integrated AMR approach ${div1.name} ${div2.name}`,
        `multidisciplinary resistance research synthesis`
      ]
    };
  }

  return template;
}

/**
 * Get synthesis opportunities summary
 * @returns {Promise<Object>} - Summary of synthesis opportunities
 */
async function getSynthesisOpportunities() {
  try {
    // Get finding counts by division
    const { data: divisionCounts, error } = await supabase
      .from('findings')
      .select('division_id, divisions!inner(name)')
      .eq('qc_status', 'passed');

    if (error) throw error;

    // Count findings per division
    const divisionMap = {};
    divisionCounts.forEach(finding => {
      const divId = finding.division_id;
      const divName = finding.divisions.name;
      
      if (!divisionMap[divId]) {
        divisionMap[divId] = { name: divName, count: 0 };
      }
      divisionMap[divId].count++;
    });

    // Identify ready divisions (>= 10 findings)
    const readyDivisions = Object.entries(divisionMap)
      .filter(([id, data]) => data.count >= 10)
      .map(([id, data]) => ({ id, ...data }));

    // Count existing synthesis tasks
    const { data: synthesisTasks, error: synthesisError } = await supabase
      .from('tasks')
      .select('id, status')
      .eq('is_synthesis', true);

    if (synthesisError) throw synthesisError;

    const pendingSynthesis = synthesisTasks.filter(t => t.status === 'pending').length;
    const completedSynthesis = synthesisTasks.filter(t => t.status === 'completed').length;

    return {
      readyDivisions: readyDivisions.length,
      possibleCombinations: Math.min(readyDivisions.length * (readyDivisions.length - 1) / 2, 10),
      pendingSynthesis,
      completedSynthesis,
      divisions: readyDivisions
    };

  } catch (error) {
    console.error('Error getting synthesis opportunities:', error);
    return {
      readyDivisions: 0,
      possibleCombinations: 0,
      pendingSynthesis: 0,
      completedSynthesis: 0,
      divisions: []
    };
  }
}

module.exports = {
  generateSynthesisTasks,
  getSynthesisOpportunities
};