const { supabase } = require('./db');

async function generateDivisionReport(divisionId) {
  try {
    // Get division info
    const { data: division, error: divError } = await supabase
      .from('divisions')
      .select('*')
      .eq('id', divisionId)
      .single();

    if (divError || !division) {
      throw new Error('Division not found');
    }

    // Get all findings for this division
    const { data: findings, error: findingsError } = await supabase
      .from('findings')
      .select(`
        *,
        agents:agent_id (name),
        citations (*)
      `)
      .eq('division_id', divisionId)
      .order('created_at', { ascending: false });

    if (findingsError) throw findingsError;

    const totalFindings = findings?.length || 0;
    const passedFindings = findings?.filter(f => f.qc_status === 'passed') || [];
    const qcPassRate = totalFindings > 0 ? (passedFindings.length / totalFindings) * 100 : 0;

    // Get hypotheses for this division
    const { data: hypotheses, error: hypothesesError } = await supabase
      .from('hypotheses')
      .select(`
        *,
        agents:agent_id (name)
      `)
      .eq('division_id', divisionId)
      .order('votes_up', { ascending: false });

    if (hypothesesError) throw hypothesesError;

    // Analyze contradictions across findings
    const contradictions = [];
    const researchGaps = [];
    const methodologyScores = [];
    const studyTypes = [];
    const clinicalRelevance = [];

    findings?.forEach(finding => {
      if (finding.contradictions?.trim()) {
        contradictions.push(finding.contradictions.trim());
      }
      if (finding.research_gaps?.trim()) {
        researchGaps.push(finding.research_gaps.trim());
      }
      if (finding.study_assessment) {
        const assessment = finding.study_assessment;
        if (assessment.methodology_score) {
          methodologyScores.push(assessment.methodology_score);
        }
        if (assessment.study_types) {
          studyTypes.push(...assessment.study_types);
        }
        if (assessment.clinical_relevance) {
          clinicalRelevance.push(assessment.clinical_relevance);
        }
      }
    });

    // Calculate data quality summary
    const avgMethodologyScore = methodologyScores.length > 0 
      ? methodologyScores.reduce((sum, score) => sum + score, 0) / methodologyScores.length 
      : null;

    // Count study type distribution
    const studyTypeDistribution = studyTypes.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    // Count clinical relevance distribution
    const clinicalRelevanceDistribution = clinicalRelevance.reduce((acc, relevance) => {
      acc[relevance] = (acc[relevance] || 0) + 1;
      return acc;
    }, {});

    // Extract top contradictions (by frequency of similar themes)
    const topContradictions = contradictions
      .slice(0, 5)
      .map((contradiction, index) => ({
        id: index + 1,
        description: contradiction.length > 200 
          ? contradiction.substring(0, 200) + '...' 
          : contradiction
      }));

    // Extract top research gaps
    const topResearchGaps = researchGaps
      .slice(0, 5)
      .map((gap, index) => ({
        id: index + 1,
        description: gap.length > 200 
          ? gap.substring(0, 200) + '...' 
          : gap
      }));

    // Generate actionable next steps based on gaps and contradictions
    const actionableNextSteps = generateActionableSteps(
      topContradictions,
      topResearchGaps,
      division.name,
      avgMethodologyScore
    );

    // Active hypotheses (top 3 by votes)
    const activeHypotheses = (hypotheses || [])
      .filter(h => h.status === 'proposed')
      .slice(0, 3)
      .map(h => ({
        id: h.id,
        hypothesis: h.hypothesis.length > 150 
          ? h.hypothesis.substring(0, 150) + '...' 
          : h.hypothesis,
        feasibility: h.feasibility,
        votes: h.votes_up - h.votes_down,
        author: h.agents?.name || 'Unknown'
      }));

    return {
      division: {
        id: division.id,
        name: division.name,
        description: division.description
      },
      summary: {
        totalFindings,
        passedFindings: passedFindings.length,
        qcPassRate: Math.round(qcPassRate * 100) / 100,
        totalCitations: findings?.reduce((sum, f) => sum + (f.citations?.length || 0), 0) || 0,
        totalHypotheses: hypotheses?.length || 0
      },
      dataQuality: {
        avgMethodologyScore: avgMethodologyScore ? Math.round(avgMethodologyScore * 100) / 100 : null,
        studyTypeDistribution,
        clinicalRelevanceDistribution,
        totalAssessments: methodologyScores.length
      },
      topContradictions,
      topResearchGaps,
      activeHypotheses,
      actionableNextSteps,
      generatedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('Division report generation error:', error);
    throw error;
  }
}

function generateActionableSteps(contradictions, researchGaps, divisionName, avgMethodologyScore) {
  const steps = [];

  // Based on contradictions
  if (contradictions.length > 0) {
    steps.push({
      priority: 'high',
      category: 'Research Harmonization',
      action: `Conduct systematic review to resolve contradictory findings in ${divisionName.toLowerCase()}`,
      rationale: `${contradictions.length} conflicting findings identified that need resolution`,
      estimatedImpact: 'High - will clarify research direction'
    });
  }

  // Based on research gaps
  if (researchGaps.length > 0) {
    steps.push({
      priority: 'high',
      category: 'Gap Filling Research',
      action: `Priority research initiatives needed in ${researchGaps.length} identified gap areas`,
      rationale: 'Multiple research gaps consistently identified across findings',
      estimatedImpact: 'High - will advance field knowledge'
    });
  }

  // Based on methodology quality
  if (avgMethodologyScore && avgMethodologyScore < 3.0) {
    steps.push({
      priority: 'medium',
      category: 'Quality Improvement',
      action: 'Focus on higher-quality study designs and larger sample sizes',
      rationale: `Average methodology score (${avgMethodologyScore.toFixed(1)}) indicates room for improvement`,
      estimatedImpact: 'Medium - will improve evidence reliability'
    });
  }

  // Generic recommendations based on division
  const divisionLower = divisionName.toLowerCase();
  if (divisionLower.includes('diagnostic')) {
    steps.push({
      priority: 'medium',
      category: 'Clinical Translation',
      action: 'Accelerate point-of-care diagnostic validation studies',
      rationale: 'Diagnostics require real-world clinical validation',
      estimatedImpact: 'High - direct clinical benefit'
    });
  } else if (divisionLower.includes('therapeutic') || divisionLower.includes('novel')) {
    steps.push({
      priority: 'medium',
      category: 'Clinical Translation',
      action: 'Prioritize Phase I/II clinical trials for promising therapies',
      rationale: 'Novel therapeutics need clinical validation',
      estimatedImpact: 'High - potential new treatments'
    });
  } else if (divisionLower.includes('mechanism') || divisionLower.includes('resistance')) {
    steps.push({
      priority: 'medium',
      category: 'Mechanistic Research',
      action: 'Deepen molecular-level understanding through structural studies',
      rationale: 'Mechanism research benefits from structural and biochemical approaches',
      estimatedImpact: 'Medium - foundational knowledge'
    });
  }

  // Ensure we have 3-5 steps
  if (steps.length < 3) {
    steps.push({
      priority: 'low',
      category: 'Synthesis',
      action: 'Develop comprehensive synthesis paper',
      rationale: `${divisionName} findings would benefit from systematic synthesis`,
      estimatedImpact: 'Medium - knowledge consolidation'
    });
  }

  return steps.slice(0, 5); // Top 5 steps max
}

module.exports = {
  generateDivisionReport
};