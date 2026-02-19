const crypto = require('crypto');

// AMR Mission Definition
const AMR_MISSION = {
  id: 'amr-mission-2026',
  name: 'Antimicrobial Resistance Research Initiative',
  description: 'Comprehensive multi-agent research coordination platform focused on understanding, combating, and preventing antimicrobial resistance across all domains of health and medicine.',
  active: true
};

// AMR Research Divisions
const AMR_DIVISIONS = [
  {
    id: 'resistance-mechanisms',
    mission_id: AMR_MISSION.id,
    name: 'Resistance Mechanisms',
    description: 'Molecular and biochemical mechanisms by which microorganisms develop and maintain resistance to antimicrobial agents',
    task_count: 0,
    completed_count: 0
  },
  {
    id: 'priority-pathogens',
    mission_id: AMR_MISSION.id,
    name: 'Priority Pathogens',
    description: 'Research on WHO priority pathogens, ESKAPE organisms, and other critical resistant microorganisms',
    task_count: 0,
    completed_count: 0
  },
  {
    id: 'novel-therapeutics',
    mission_id: AMR_MISSION.id,
    name: 'Novel Therapeutics',
    description: 'Development and evaluation of new antimicrobial approaches, alternative therapies, and innovative treatment strategies',
    task_count: 0,
    completed_count: 0
  },
  {
    id: 'diagnostics-surveillance',
    mission_id: AMR_MISSION.id,
    name: 'Diagnostics & Surveillance',
    description: 'Advanced diagnostic methods, surveillance systems, and resistance detection technologies',
    task_count: 0,
    completed_count: 0
  },
  {
    id: 'one-health',
    mission_id: AMR_MISSION.id,
    name: 'One Health',
    description: 'Integrated approach to AMR spanning human, animal, agricultural, and environmental health sectors',
    task_count: 0,
    completed_count: 0
  },
  {
    id: 'stewardship-policy',
    mission_id: AMR_MISSION.id,
    name: 'Stewardship & Policy',
    description: 'Antimicrobial stewardship programs, policy interventions, and governance approaches to combat resistance',
    task_count: 0,
    completed_count: 0
  },
  {
    id: 'infection-prevention',
    mission_id: AMR_MISSION.id,
    name: 'Infection Prevention',
    description: 'Infection control measures, prevention strategies, and interventions to reduce transmission of resistant organisms',
    task_count: 0,
    completed_count: 0
  },
  {
    id: 'clinical-outcomes',
    mission_id: AMR_MISSION.id,
    name: 'Clinical Outcomes',
    description: 'Treatment outcomes, clinical effectiveness, mortality, and morbidity associated with antimicrobial resistance',
    task_count: 0,
    completed_count: 0
  },
  {
    id: 'genomics-evolution',
    mission_id: AMR_MISSION.id,
    name: 'Genomics & Evolution',
    description: 'Evolutionary biology of resistance, genomic surveillance, and molecular epidemiology of AMR',
    task_count: 0,
    completed_count: 0
  },
  {
    id: 'economic-impact',
    mission_id: AMR_MISSION.id,
    name: 'Economic Impact',
    description: 'Economic burden, cost-effectiveness analysis, and market dynamics related to antimicrobial resistance',
    task_count: 0,
    completed_count: 0
  },
  {
    id: 'vaccines-prevention',
    mission_id: AMR_MISSION.id,
    name: 'Vaccines & Prevention',
    description: 'Vaccination strategies, immunization approaches, and preventive interventions to reduce AMR burden',
    task_count: 0,
    completed_count: 0
  },
  {
    id: 'quality-control',
    mission_id: AMR_MISSION.id,
    name: 'Quality Control',
    description: 'Cross-verification, validation, and quality assurance of AMR research findings',
    task_count: 0,
    completed_count: 0
  }
];

// Comprehensive AMR Research Tasks (200+ tasks)
const AMR_TASKS = [
  // Resistance Mechanisms Division (35 tasks)
  {
    division_id: 'resistance-mechanisms',
    topic: 'NDM-1 β-lactamase structural analysis and inhibitor design',
    description: 'Investigate the three-dimensional structure of New Delhi metallo-β-lactamase-1 (NDM-1) and identify potential binding sites for novel inhibitors. Focus on recent crystallographic studies and computational drug design approaches.',
    search_queries: ['NDM-1 beta-lactamase structure', 'NDM-1 inhibitor design', 'metallo-beta-lactamase crystal structure', 'NDM-1 binding sites']
  },
  {
    division_id: 'resistance-mechanisms',
    topic: 'KPC carbapenemase evolution and dissemination patterns',
    description: 'Analyze the evolutionary history and global spread of Klebsiella pneumoniae carbapenemase (KPC) enzymes. Examine genetic variations, transmission mechanisms, and geographic distribution patterns.',
    search_queries: ['KPC carbapenemase evolution', 'KPC global dissemination', 'KPC genetic variants', 'KPC transmission patterns']
  },
  {
    division_id: 'resistance-mechanisms',
    topic: 'OXA-48 family β-lactamases: diversity and clinical impact',
    description: 'Review the diversity within the OXA-48 β-lactamase family, including OXA-48, OXA-181, OXA-232, and other variants. Assess their clinical significance and detection challenges.',
    search_queries: ['OXA-48 beta-lactamase family', 'OXA-181 OXA-232 variants', 'OXA-48 clinical impact', 'OXA-48 detection methods']
  },
  {
    division_id: 'resistance-mechanisms',
    topic: 'AcrAB-TolC efflux pump mechanism and inhibition strategies',
    description: 'Examine the molecular mechanism of the AcrAB-TolC efflux system in E. coli and related enterobacteria. Investigate current and potential efflux pump inhibitors.',
    search_queries: ['AcrAB-TolC efflux pump mechanism', 'efflux pump inhibitors', 'AcrAB-TolC structure function', 'multidrug efflux systems']
  },
  {
    division_id: 'resistance-mechanisms',
    topic: 'MexAB-OprM efflux system in Pseudomonas aeruginosa',
    description: 'Analyze the MexAB-OprM efflux system in P. aeruginosa, its regulation, substrate specificity, and role in multidrug resistance. Include recent advances in efflux inhibition.',
    search_queries: ['MexAB-OprM Pseudomonas', 'MexAB-OprM regulation', 'Pseudomonas efflux pump', 'MexAB-OprM inhibitors']
  },
  {
    division_id: 'resistance-mechanisms',
    topic: 'Penicillin-binding protein mutations in β-lactam resistance',
    description: 'Investigate how mutations in penicillin-binding proteins (PBPs) contribute to β-lactam resistance across different bacterial species. Focus on PBP2, PBP3, and mosaic PBP patterns.',
    search_queries: ['PBP mutations beta-lactam resistance', 'penicillin-binding protein variants', 'mosaic PBP patterns', 'PBP2 PBP3 mutations']
  },
  {
    division_id: 'resistance-mechanisms',
    topic: '16S rRNA methylation and aminoglycoside resistance',
    description: 'Examine 16S rRNA methyltransferases (such as RmtA, RmtB, ArmA) and their role in high-level aminoglycoside resistance. Analyze their distribution and clinical significance.',
    search_queries: ['16S rRNA methyltransferases', 'RmtA RmtB ArmA', 'aminoglycoside resistance mechanisms', '16S rRNA methylation']
  },
  {
    division_id: 'resistance-mechanisms',
    topic: 'Biofilm-mediated antimicrobial resistance mechanisms',
    description: 'Investigate how biofilm formation contributes to antimicrobial resistance, including extracellular matrix protection, persister cell formation, and altered gene expression.',
    search_queries: ['biofilm antimicrobial resistance', 'biofilm matrix protection', 'persister cells biofilm', 'biofilm resistance mechanisms']
  },
  {
    division_id: 'resistance-mechanisms',
    topic: 'Plasmid-mediated quinolone resistance (PMQR) mechanisms',
    description: 'Analyze plasmid-mediated quinolone resistance genes including qnr, aac(6\')-Ib-cr, and qepA. Examine their contribution to fluoroquinolone resistance and co-resistance patterns.',
    search_queries: ['plasmid quinolone resistance PMQR', 'qnr genes fluoroquinolone', 'aac(6\'-Ib-cr qepA', 'PMQR mechanisms']
  },
  {
    division_id: 'resistance-mechanisms',
    topic: 'Integron-mediated resistance gene dissemination',
    description: 'Study the role of integrons in capturing and disseminating antibiotic resistance genes. Focus on class 1, 2, and 3 integrons and their gene cassette arrays.',
    search_queries: ['integron resistance gene dissemination', 'class 1 integron', 'integron gene cassettes', 'integron antibiotic resistance']
  },
  {
    division_id: 'resistance-mechanisms',
    topic: 'Transposon-mediated horizontal gene transfer of resistance',
    description: 'Examine how transposons facilitate the horizontal transfer of resistance genes. Focus on composite transposons, insertion sequences, and conjugative transposons.',
    search_queries: ['transposon resistance gene transfer', 'composite transposons', 'conjugative transposons', 'insertion sequences resistance']
  },
  {
    division_id: 'resistance-mechanisms',
    topic: 'ESBL evolution and substrate profile expansion',
    description: 'Analyze the evolution of extended-spectrum β-lactamases (ESBLs), particularly CTX-M, SHV, and TEM variants, and their expanding substrate profiles.',
    search_queries: ['ESBL evolution CTX-M', 'SHV TEM ESBL variants', 'ESBL substrate profile', 'extended-spectrum beta-lactamases']
  },
  {
    division_id: 'resistance-mechanisms',
    topic: 'Vancomycin resistance mechanisms in enterococci',
    description: 'Investigate vanA, vanB, and other vancomycin resistance gene clusters in enterococci. Analyze the molecular basis of glycopeptide resistance.',
    search_queries: ['vancomycin resistance enterococci', 'vanA vanB gene clusters', 'glycopeptide resistance mechanisms', 'VRE resistance genes']
  },
  {
    division_id: 'resistance-mechanisms',
    topic: 'mecA and PBP2a in methicillin-resistant Staphylococcus aureus',
    description: 'Examine the mecA gene and PBP2a protein in MRSA, including SCCmec cassette types and their evolution. Analyze structure-function relationships.',
    search_queries: ['mecA gene MRSA', 'PBP2a structure function', 'SCCmec cassette types', 'methicillin resistance mechanisms']
  },
  {
    division_id: 'resistance-mechanisms',
    topic: 'Aminoglycoside-modifying enzymes: AAC, ANT, and APH',
    description: 'Study the three major classes of aminoglycoside-modifying enzymes: acetyltransferases (AAC), nucleotidyltransferases (ANT), and phosphotransferases (APH).',
    search_queries: ['aminoglycoside modifying enzymes', 'AAC ANT APH enzymes', 'aminoglycoside resistance enzymes', 'gentamicin resistance enzymes']
  },
  {
    division_id: 'resistance-mechanisms',
    topic: 'Chloramphenicol acetyltransferases and resistance patterns',
    description: 'Investigate chloramphenicol acetyltransferase (CAT) enzymes and their role in chloramphenicol resistance. Examine structural variants and catalytic mechanisms.',
    search_queries: ['chloramphenicol acetyltransferase CAT', 'chloramphenicol resistance mechanisms', 'CAT enzyme variants', 'chloramphenicol resistance genes']
  },
  {
    division_id: 'resistance-mechanisms',
    topic: 'Tetracycline resistance: efflux pumps vs ribosomal protection',
    description: 'Compare tetracycline resistance mechanisms including efflux pumps (TetA, TetB) and ribosomal protection proteins (TetM, TetO). Analyze their relative prevalence and effectiveness.',
    search_queries: ['tetracycline resistance mechanisms', 'TetA TetB efflux pumps', 'TetM TetO ribosomal protection', 'tetracycline resistance genes']
  },
  {
    division_id: 'resistance-mechanisms',
    topic: 'Sulfonamide and trimethoprim resistance mechanisms',
    description: 'Examine resistance to folate pathway inhibitors including sulfonamides and trimethoprim. Focus on sul genes and dhfr mutations.',
    search_queries: ['sulfonamide resistance mechanisms', 'trimethoprim resistance dhfr', 'sul genes sulfonamide', 'folate pathway resistance']
  },
  {
    division_id: 'resistance-mechanisms',
    topic: 'Macrolide resistance: target modification and efflux',
    description: 'Analyze macrolide resistance mechanisms including 23S rRNA methylation (erm genes) and efflux pumps (mef genes). Compare their clinical impact.',
    search_queries: ['macrolide resistance mechanisms', 'erm genes rRNA methylation', 'mef genes macrolide efflux', 'erythromycin resistance']
  },
  {
    division_id: 'resistance-mechanisms',
    topic: 'Lincosamide and streptogramin resistance patterns',
    description: 'Study resistance to lincosamides (clindamycin) and streptogramins, including MLSB resistance phenotypes and their molecular basis.',
    search_queries: ['lincosamide resistance clindamycin', 'streptogramin resistance', 'MLSB resistance phenotype', 'clindamycin resistance mechanisms']
  },
  {
    division_id: 'resistance-mechanisms',
    topic: 'Colistin resistance: mcr genes and chromosomal mechanisms',
    description: 'Investigate colistin resistance mechanisms including plasmid-mediated mcr genes and chromosomal modifications of lipopolysaccharide biosynthesis.',
    search_queries: ['colistin resistance mcr genes', 'polymyxin resistance mechanisms', 'mcr-1 mcr-2 colistin', 'lipopolysaccharide modification resistance']
  },
  {
    division_id: 'resistance-mechanisms',
    topic: 'Daptomycin resistance in Gram-positive bacteria',
    description: 'Examine daptomycin resistance mechanisms in enterococci and staphylococci, including cell membrane modifications and regulatory changes.',
    search_queries: ['daptomycin resistance mechanisms', 'daptomycin resistance enterococci', 'daptomycin resistance staphylococci', 'lipopeptide resistance']
  },
  {
    division_id: 'resistance-mechanisms',
    topic: 'Tigecycline resistance in multidrug-resistant pathogens',
    description: 'Analyze tigecycline resistance mechanisms including efflux pumps, ribosomal modifications, and enzymatic inactivation in MDR pathogens.',
    search_queries: ['tigecycline resistance mechanisms', 'tigecycline efflux pumps', 'tigecycline ribosomal modifications', 'MDR tigecycline resistance']
  },
  {
    division_id: 'resistance-mechanisms',
    topic: 'Rifamycin resistance in mycobacteria and other pathogens',
    description: 'Study rifamycin resistance mechanisms, particularly rpoB mutations in Mycobacterium tuberculosis and rifamycin resistance in other bacterial species.',
    search_queries: ['rifamycin resistance rpoB', 'rifampicin resistance tuberculosis', 'rpoB mutations mycobacteria', 'rifamycin resistance mechanisms']
  },
  {
    division_id: 'resistance-mechanisms',
    topic: 'Isoniazid and ethambutol resistance in tuberculosis',
    description: 'Examine resistance mechanisms to first-line anti-TB drugs isoniazid (katG, inhA mutations) and ethambutol (embB mutations).',
    search_queries: ['isoniazid resistance katG inhA', 'ethambutol resistance embB', 'tuberculosis drug resistance', 'TB first-line drug resistance']
  },
  {
    division_id: 'resistance-mechanisms',
    topic: 'Fluoroquinolone resistance: target mutations and efflux',
    description: 'Analyze fluoroquinolone resistance mechanisms including gyrA/gyrB and parC/parE mutations, plus efflux pump contributions.',
    search_queries: ['fluoroquinolone resistance gyrA', 'parC parE mutations quinolone', 'fluoroquinolone efflux pumps', 'quinolone resistance mechanisms']
  },
  {
    division_id: 'resistance-mechanisms',
    topic: 'Fosfomycin resistance mechanisms and clinical relevance',
    description: 'Study fosfomycin resistance including fosA/fosB/fosC genes, murA mutations, and transport defects. Assess clinical implications.',
    search_queries: ['fosfomycin resistance fosA', 'fosfomycin resistance murA', 'fosfomycin transport defects', 'fosfomycin resistance mechanisms']
  },
  {
    division_id: 'resistance-mechanisms',
    topic: 'Nitrofurantoin resistance in urinary tract pathogens',
    description: 'Examine nitrofurantoin resistance mechanisms including nfsA/nfsB mutations and their impact on urinary tract infection treatment.',
    search_queries: ['nitrofurantoin resistance nfsA nfsB', 'nitrofurantoin UTI resistance', 'nitrofurantoin resistance mechanisms', 'urinary tract pathogen resistance']
  },
  {
    division_id: 'resistance-mechanisms',
    topic: 'Antifungal resistance mechanisms in Candida species',
    description: 'Investigate antifungal resistance in Candida species including azole resistance (ERG11 mutations, efflux pumps), echinocandin resistance (FKS mutations).',
    search_queries: ['Candida antifungal resistance', 'azole resistance ERG11', 'echinocandin resistance FKS', 'Candida drug resistance mechanisms']
  },
  {
    division_id: 'resistance-mechanisms',
    topic: 'Multidrug efflux systems in Gram-negative bacteria',
    description: 'Compare multidrug efflux systems across Gram-negative bacteria including AcrAB, MexAB, AdeABC, and their role in multidrug resistance.',
    search_queries: ['multidrug efflux systems', 'AcrAB MexAB AdeABC', 'Gram-negative efflux pumps', 'multidrug resistance efflux']
  },
  {
    division_id: 'resistance-mechanisms',
    topic: 'Persister cell formation and tolerance mechanisms',
    description: 'Study bacterial persister cell formation, dormancy mechanisms, and their contribution to antimicrobial tolerance and recurrent infections.',
    search_queries: ['persister cells antimicrobial tolerance', 'bacterial dormancy mechanisms', 'persister cell formation', 'antimicrobial tolerance']
  },
  {
    division_id: 'resistance-mechanisms',
    topic: 'Small colony variants and antimicrobial resistance',
    description: 'Examine small colony variant (SCV) phenotypes and their association with antimicrobial resistance, particularly in staphylococci and pseudomonads.',
    search_queries: ['small colony variants SCV', 'SCV antimicrobial resistance', 'small colony variant phenotype', 'SCV staphylococcus pseudomonas']
  },
  {
    division_id: 'resistance-mechanisms',
    topic: 'Adaptive resistance and heteroresistance mechanisms',
    description: 'Investigate adaptive resistance responses and heteroresistance phenomena, including their clinical significance and detection methods.',
    search_queries: ['adaptive resistance mechanisms', 'heteroresistance antimicrobials', 'adaptive antimicrobial resistance', 'heteroresistance detection']
  },
  {
    division_id: 'resistance-mechanisms',
    topic: 'Quorum sensing and antimicrobial resistance regulation',
    description: 'Analyze the role of quorum sensing systems in regulating antimicrobial resistance gene expression and biofilm-associated resistance.',
    search_queries: ['quorum sensing antimicrobial resistance', 'QS resistance gene regulation', 'quorum sensing biofilm resistance', 'QS systems resistance']
  },
  {
    division_id: 'resistance-mechanisms',
    topic: 'Two-component systems in resistance regulation',
    description: 'Study two-component regulatory systems that control antimicrobial resistance gene expression, including PhoP-PhoQ, PmrA-PmrB, and others.',
    search_queries: ['two-component systems resistance', 'PhoP-PhoQ resistance regulation', 'PmrA-PmrB antimicrobial', 'two-component resistance regulation']
  },

  // Priority Pathogens Division (32 tasks)
  {
    division_id: 'priority-pathogens',
    topic: 'Carbapenem-resistant Enterobacteriaceae (CRE) epidemiology',
    description: 'Analyze global epidemiology of carbapenem-resistant Enterobacteriaceae, including species distribution, resistance mechanisms, and transmission patterns.',
    search_queries: ['carbapenem-resistant Enterobacteriaceae CRE', 'CRE global epidemiology', 'CRE transmission patterns', 'CRE resistance mechanisms']
  },
  {
    division_id: 'priority-pathogens',
    topic: 'Extensively drug-resistant Pseudomonas aeruginosa (XDR-PA)',
    description: 'Investigate extensively drug-resistant P. aeruginosa strains, their resistance profiles, clinical outcomes, and treatment challenges.',
    search_queries: ['XDR Pseudomonas aeruginosa', 'extensively drug-resistant pseudomonas', 'XDR-PA treatment', 'multidrug resistant pseudomonas']
  },
  {
    division_id: 'priority-pathogens',
    topic: 'Carbapenem-resistant Acinetobacter baumannii (CRAB) infections',
    description: 'Examine carbapenem-resistant A. baumannii infections, including outbreak investigations, risk factors, and mortality outcomes.',
    search_queries: ['carbapenem-resistant Acinetobacter CRAB', 'CRAB infections outcomes', 'Acinetobacter baumannii outbreaks', 'CRAB mortality']
  },
  {
    division_id: 'priority-pathogens',
    topic: 'Vancomycin-resistant Enterococcus (VRE) transmission dynamics',
    description: 'Study VRE transmission in healthcare settings, including environmental contamination, colonization patterns, and infection control challenges.',
    search_queries: ['vancomycin-resistant Enterococcus VRE', 'VRE transmission healthcare', 'VRE environmental contamination', 'VRE colonization']
  },
  {
    division_id: 'priority-pathogens',
    topic: 'Methicillin-resistant Staphylococcus aureus (MRSA) evolution',
    description: 'Analyze the evolution of MRSA strains, including hospital-associated (HA-MRSA) and community-associated (CA-MRSA) lineages.',
    search_queries: ['MRSA evolution strains', 'HA-MRSA CA-MRSA', 'methicillin-resistant Staphylococcus aureus', 'MRSA lineages evolution']
  },
  {
    division_id: 'priority-pathogens',
    topic: 'Extended-spectrum β-lactamase producing Klebsiella pneumoniae',
    description: 'Examine ESBL-producing K. pneumoniae strains, their global distribution, sequence types, and association with carbapenem resistance.',
    search_queries: ['ESBL Klebsiella pneumoniae', 'K. pneumoniae ESBL strains', 'ESBL sequence types Klebsiella', 'Klebsiella carbapenem resistance']
  },
  {
    division_id: 'priority-pathogens',
    topic: 'Multidrug-resistant Enterobacter species infections',
    description: 'Study multidrug resistance in Enterobacter species, including E. cloacae and E. aerogenes, and their clinical significance.',
    search_queries: ['multidrug-resistant Enterobacter', 'Enterobacter cloacae resistance', 'Enterobacter aerogenes MDR', 'MDR Enterobacter infections']
  },
  {
    division_id: 'priority-pathogens',
    topic: 'Candida auris: emerging multidrug-resistant fungal pathogen',
    description: 'Investigate the emergence of C. auris as a multidrug-resistant fungal pathogen, including its global spread and antifungal resistance patterns.',
    search_queries: ['Candida auris emergence', 'C. auris antifungal resistance', 'Candida auris global spread', 'multidrug-resistant Candida auris']
  },
  {
    division_id: 'priority-pathogens',
    topic: 'Drug-resistant Neisseria gonorrhoeae surveillance',
    description: 'Analyze surveillance data for drug-resistant N. gonorrhoeae, including ceftriaxone and azithromycin resistance trends.',
    search_queries: ['drug-resistant Neisseria gonorrhoeae', 'gonorrhea antibiotic resistance', 'ceftriaxone resistance gonorrhea', 'azithromycin resistance gonorrhea']
  },
  {
    division_id: 'priority-pathogens',
    topic: 'Multidrug-resistant tuberculosis (MDR-TB) burden',
    description: 'Assess the global burden of multidrug-resistant tuberculosis, including transmission patterns and risk factors for resistance.',
    search_queries: ['multidrug-resistant tuberculosis MDR-TB', 'MDR-TB global burden', 'TB drug resistance patterns', 'MDR-TB transmission']
  },
  {
    division_id: 'priority-pathogens',
    topic: 'Extensively drug-resistant tuberculosis (XDR-TB) outcomes',
    description: 'Examine treatment outcomes for extensively drug-resistant tuberculosis, including mortality rates and successful treatment strategies.',
    search_queries: ['extensively drug-resistant tuberculosis XDR-TB', 'XDR-TB treatment outcomes', 'XDR-TB mortality', 'XDR tuberculosis therapy']
  },
  {
    division_id: 'priority-pathogens',
    topic: 'Drug-resistant Plasmodium falciparum malaria',
    description: 'Study artemisinin resistance in P. falciparum malaria, including K13 mutations and geographic distribution of resistance.',
    search_queries: ['artemisinin resistance Plasmodium falciparum', 'K13 mutations malaria', 'drug-resistant malaria', 'antimalarial resistance']
  },
  {
    division_id: 'priority-pathogens',
    topic: 'Carbapenem-resistant Klebsiella pneumoniae (CRKP) infections',
    description: 'Investigate CRKP infections, including carbapenemase types, clinical outcomes, and combination therapy effectiveness.',
    search_queries: ['carbapenem-resistant Klebsiella CRKP', 'CRKP infections outcomes', 'CRKP carbapenemases', 'CRKP combination therapy']
  },
  {
    division_id: 'priority-pathogens',
    topic: 'Colistin-resistant Enterobacteriaceae emergence',
    description: 'Examine the emergence of colistin resistance in Enterobacteriaceae, including mcr gene prevalence and clinical implications.',
    search_queries: ['colistin-resistant Enterobacteriaceae', 'mcr genes Enterobacteriaceae', 'colistin resistance emergence', 'polymyxin resistant bacteria']
  },
  {
    division_id: 'priority-pathogens',
    topic: 'Penicillin-resistant Streptococcus pneumoniae trends',
    description: 'Analyze trends in penicillin resistance among S. pneumoniae isolates and impact of pneumococcal vaccination on resistance patterns.',
    search_queries: ['penicillin-resistant Streptococcus pneumoniae', 'pneumococcal resistance trends', 'S. pneumoniae PBP mutations', 'pneumococcal vaccine resistance']
  },
  {
    division_id: 'priority-pathogens',
    topic: 'Fluoroquinolone-resistant Escherichia coli infections',
    description: 'Study fluoroquinolone resistance in E. coli, including sequence type distribution, resistance mechanisms, and clinical impact.',
    search_queries: ['fluoroquinolone-resistant E. coli', 'quinolone resistance Escherichia coli', 'E. coli gyrA mutations', 'FQ-resistant E. coli ST131']
  },
  {
    division_id: 'priority-pathogens',
    topic: 'Vancomycin-intermediate Staphylococcus aureus (VISA) mechanisms',
    description: 'Investigate vancomycin-intermediate S. aureus (VISA) and heterogeneous VISA (hVISA) mechanisms and clinical significance.',
    search_queries: ['vancomycin-intermediate VISA', 'heterogeneous VISA hVISA', 'VISA resistance mechanisms', 'vancomycin tolerance staph']
  },
  {
    division_id: 'priority-pathogens',
    topic: 'Linezolid-resistant enterococci and staphylococci',
    description: 'Examine linezolid resistance in Gram-positive bacteria, including cfr gene mechanisms and 23S rRNA mutations.',
    search_queries: ['linezolid resistance enterococci', 'linezolid resistance staphylococci', 'cfr gene linezolid', '23S rRNA linezolid resistance']
  },
  {
    division_id: 'priority-pathogens',
    topic: 'Tigecycline-resistant Acinetobacter baumannii',
    description: 'Study tigecycline resistance mechanisms in A. baumannii and its impact on treatment options for MDR infections.',
    search_queries: ['tigecycline-resistant Acinetobacter', 'tigecycline resistance mechanisms Acinetobacter', 'A. baumannii tigecycline', 'MDR Acinetobacter treatment']
  },
  {
    division_id: 'priority-pathogens',
    topic: 'Ampicillin-resistant Enterococcus faecium',
    description: 'Analyze ampicillin resistance in E. faecium, including PBP5 mutations and the emergence of hospital-adapted lineages.',
    search_queries: ['ampicillin-resistant Enterococcus faecium', 'E. faecium PBP5 mutations', 'hospital-adapted enterococci', 'ampicillin resistance enterococci']
  },
  {
    division_id: 'priority-pathogens',
    topic: 'Third-generation cephalosporin-resistant Salmonella',
    description: 'Investigate resistance to third-generation cephalosporins in non-typhoidal Salmonella and Salmonella Typhi.',
    search_queries: ['cephalosporin-resistant Salmonella', 'third-generation cephalosporin resistance', 'Salmonella ESBL resistance', 'MDR Salmonella Typhi']
  },
  {
    division_id: 'priority-pathogens',
    topic: 'Azithromycin-resistant Shigella infections',
    description: 'Study azithromycin resistance in Shigella species and its impact on treatment of shigellosis, particularly in endemic areas.',
    search_queries: ['azithromycin-resistant Shigella', 'macrolide resistance Shigella', 'Shigella antibiotic resistance', 'shigellosis treatment resistance']
  },
  {
    division_id: 'priority-pathogens',
    topic: 'Multidrug-resistant Campylobacter jejuni trends',
    description: 'Examine antimicrobial resistance trends in C. jejuni, including fluoroquinolone and macrolide resistance patterns.',
    search_queries: ['multidrug-resistant Campylobacter jejuni', 'C. jejuni antibiotic resistance', 'fluoroquinolone resistance Campylobacter', 'macrolide resistance Campylobacter']
  },
  {
    division_id: 'priority-pathogens',
    topic: 'Drug-resistant Haemophilus influenzae surveillance',
    description: 'Analyze antimicrobial resistance in H. influenzae, including β-lactamase production and ampicillin resistance trends.',
    search_queries: ['drug-resistant Haemophilus influenzae', 'H. influenzae beta-lactamase', 'ampicillin resistance Haemophilus', 'H. influenzae resistance surveillance']
  },
  {
    division_id: 'priority-pathogens',
    topic: 'Fluconazole-resistant Candida glabrata infections',
    description: 'Study fluconazole resistance in C. glabrata infections, including mechanisms and alternative treatment strategies.',
    search_queries: ['fluconazole-resistant Candida glabrata', 'C. glabrata azole resistance', 'Candida glabrata treatment', 'azole resistance mechanisms Candida']
  },
  {
    division_id: 'priority-pathogens',
    topic: 'Isavuconazole-resistant Aspergillus fumigatus',
    description: 'Investigate isavuconazole resistance in A. fumigatus, including cross-resistance patterns with other azoles.',
    search_queries: ['isavuconazole-resistant Aspergillus fumigatus', 'A. fumigatus azole resistance', 'triazole resistance Aspergillus', 'Aspergillus antifungal resistance']
  },
  {
    division_id: 'priority-pathogens',
    topic: 'Macrolide-resistant Mycoplasma pneumoniae',
    description: 'Examine macrolide resistance in M. pneumoniae, including 23S rRNA mutations and geographic distribution.',
    search_queries: ['macrolide-resistant Mycoplasma pneumoniae', 'M. pneumoniae 23S rRNA mutations', 'azithromycin resistance Mycoplasma', 'Mycoplasma antibiotic resistance']
  },
  {
    division_id: 'priority-pathogens',
    topic: 'Daptomycin-resistant enterococci mechanisms',
    description: 'Study daptomycin resistance mechanisms in enterococci, including LiaFSR system mutations and clinical outcomes.',
    search_queries: ['daptomycin-resistant enterococci', 'daptomycin resistance VRE', 'LiaFSR daptomycin resistance', 'daptomycin resistance mechanisms']
  },
  {
    division_id: 'priority-pathogens',
    topic: 'Ceftaroline-resistant MRSA emergence',
    description: 'Investigate ceftaroline resistance in MRSA strains, including PBP2a mutations and clinical implications.',
    search_queries: ['ceftaroline-resistant MRSA', 'ceftaroline resistance PBP2a', 'MRSA ceftaroline mutations', 'advanced-generation cephalosporin resistance']
  },
  {
    division_id: 'priority-pathogens',
    topic: 'Bedaquiline-resistant Mycobacterium tuberculosis',
    description: 'Analyze bedaquiline resistance in M. tuberculosis, including atpE mutations and implications for MDR-TB treatment.',
    search_queries: ['bedaquiline-resistant tuberculosis', 'bedaquiline resistance atpE', 'M. tuberculosis bedaquiline', 'TB drug resistance bedaquiline']
  },
  {
    division_id: 'priority-pathogens',
    topic: 'Meropenem-vaborbactam resistant Enterobacteriaceae',
    description: 'Study resistance to meropenem-vaborbactam combination in carbapenemase-producing Enterobacteriaceae.',
    search_queries: ['meropenem-vaborbactam resistance', 'vaborbactam resistance mechanisms', 'carbapenemase vaborbactam', 'beta-lactamase inhibitor resistance']
  },
  {
    division_id: 'priority-pathogens',
    topic: 'Ceftolozane-tazobactam resistant Pseudomonas aeruginosa',
    description: 'Investigate resistance to ceftolozane-tazobactam in P. aeruginosa, including β-lactamase mechanisms and clinical outcomes.',
    search_queries: ['ceftolozane-tazobactam resistance Pseudomonas', 'ceftolozane resistance mechanisms', 'P. aeruginosa beta-lactamase', 'tazobactam resistance']
  },

  // Novel Therapeutics Division (33 tasks)
  {
    division_id: 'novel-therapeutics',
    topic: 'Bacteriophage therapy for carbapenem-resistant infections',
    description: 'Evaluate bacteriophage therapy applications for treating carbapenem-resistant bacterial infections, including personalized phage therapy approaches.',
    search_queries: ['bacteriophage therapy carbapenem-resistant', 'phage therapy CRE infections', 'personalized phage therapy', 'bacteriophage antimicrobial therapy']
  },
  {
    division_id: 'novel-therapeutics',
    topic: 'Antimicrobial peptides: mechanism and clinical development',
    description: 'Analyze the mechanisms of action of antimicrobial peptides and their clinical development pipeline, including synthetic and naturally-derived peptides.',
    search_queries: ['antimicrobial peptides mechanisms', 'AMP clinical development', 'synthetic antimicrobial peptides', 'peptide antibiotics']
  },
  {
    division_id: 'novel-therapeutics',
    topic: 'CRISPR-Cas systems as antimicrobial agents',
    description: 'Investigate the use of CRISPR-Cas systems for targeting antimicrobial resistance genes and pathogens, including delivery mechanisms.',
    search_queries: ['CRISPR antimicrobial therapy', 'CRISPR-Cas pathogen targeting', 'CRISPR resistance genes', 'CRISPR antibiotic delivery']
  },
  {
    division_id: 'novel-therapeutics',
    topic: 'Anti-virulence strategies and pathoblockers',
    description: 'Examine anti-virulence approaches that target bacterial pathogenicity without directly killing bacteria, including quorum sensing inhibitors.',
    search_queries: ['anti-virulence strategies', 'pathoblockers antimicrobial', 'quorum sensing inhibitors', 'virulence factor targeting']
  },
  {
    division_id: 'novel-therapeutics',
    topic: 'Efflux pump inhibitors development',
    description: 'Study the development of efflux pump inhibitors as adjuvants to restore antibiotic efficacy against multidrug-resistant bacteria.',
    search_queries: ['efflux pump inhibitors', 'efflux pump inhibitor development', 'MDR efflux inhibitors', 'antibiotic adjuvants efflux']
  },
  {
    division_id: 'novel-therapeutics',
    topic: 'β-lactamase inhibitor combinations',
    description: 'Analyze novel β-lactamase inhibitor combinations, including boronic acid inhibitors, diazabicyclooctanes, and their clinical efficacy.',
    search_queries: ['beta-lactamase inhibitor combinations', 'novel beta-lactamase inhibitors', 'boronic acid inhibitors', 'diazabicyclooctane inhibitors']
  },
  {
    division_id: 'novel-therapeutics',
    topic: 'Outer membrane protein targeting antibiotics',
    description: 'Investigate antibiotics that target outer membrane proteins in Gram-negative bacteria, including novel mechanisms of action.',
    search_queries: ['outer membrane protein antibiotics', 'OMP targeting antimicrobials', 'Gram-negative membrane targeting', 'novel antibiotic mechanisms']
  },
  {
    division_id: 'novel-therapeutics',
    topic: 'Metal-based antimicrobial compounds',
    description: 'Examine metal-based antimicrobial compounds including silver, copper, and gallium-based therapies and their mechanisms.',
    search_queries: ['metal-based antimicrobials', 'silver antimicrobial compounds', 'copper antimicrobial therapy', 'gallium antimicrobial']
  },
  {
    division_id: 'novel-therapeutics',
    topic: 'Photodynamic antimicrobial chemotherapy (PACT)',
    description: 'Study photodynamic antimicrobial chemotherapy for treating localized infections, including photosensitizer development.',
    search_queries: ['photodynamic antimicrobial therapy PACT', 'photosensitizer antimicrobial', 'light-activated antimicrobials', 'PDT bacterial infections']
  },
  {
    division_id: 'novel-therapeutics',
    topic: 'Immunomodulatory antimicrobial approaches',
    description: 'Analyze immunomodulatory strategies that enhance host immune responses against antimicrobial-resistant pathogens.',
    search_queries: ['immunomodulatory antimicrobial therapy', 'immune enhancement antimicrobial', 'host-directed antimicrobial', 'immunotherapy antimicrobial resistance']
  },
  {
    division_id: 'novel-therapeutics',
    topic: 'Drug repurposing for antimicrobial applications',
    description: 'Investigate repurposing of existing non-antimicrobial drugs for treating resistant infections, including FDA-approved compounds.',
    search_queries: ['drug repurposing antimicrobial', 'repurposed drugs AMR', 'antimicrobial drug repurposing', 'FDA drugs antimicrobial activity']
  },
  {
    division_id: 'novel-therapeutics',
    topic: 'Nanotechnology-based antimicrobial delivery',
    description: 'Examine nanotechnology approaches for antimicrobial drug delivery, including nanoparticles, liposomes, and targeted delivery systems.',
    search_queries: ['nanotechnology antimicrobial delivery', 'antimicrobial nanoparticles', 'liposomal antimicrobials', 'targeted antimicrobial delivery']
  },
  {
    division_id: 'novel-therapeutics',
    topic: 'Combination therapy strategies for MDR infections',
    description: 'Study rational combination therapy approaches for treating multidrug-resistant infections, including synergy testing methods.',
    search_queries: ['combination therapy MDR infections', 'antimicrobial combination strategies', 'synergy testing antimicrobials', 'rational combination therapy']
  },
  {
    division_id: 'novel-therapeutics',
    topic: 'Biofilm-disrupting agents development',
    description: 'Analyze agents that disrupt bacterial biofilms to enhance antimicrobial penetration and efficacy.',
    search_queries: ['biofilm-disrupting agents', 'biofilm disruption antimicrobial', 'anti-biofilm compounds', 'biofilm matrix degradation']
  },
  {
    division_id: 'novel-therapeutics',
    topic: 'RNA-based antimicrobial therapeutics',
    description: 'Investigate RNA-based approaches including antisense RNA, siRNA, and riboswitches for antimicrobial therapy.',
    search_queries: ['RNA-based antimicrobials', 'antisense RNA antimicrobial', 'siRNA antimicrobial therapy', 'riboswitch antimicrobials']
  },
  {
    division_id: 'novel-therapeutics',
    topic: 'Membrane-active antimicrobial compounds',
    description: 'Study membrane-active compounds that disrupt bacterial cell membranes, including lipopeptides and membrane-targeting agents.',
    search_queries: ['membrane-active antimicrobials', 'membrane-targeting compounds', 'lipopeptide antimicrobials', 'cell membrane disruption']
  },
  {
    division_id: 'novel-therapeutics',
    topic: 'Enzyme-based antimicrobial strategies',
    description: 'Examine enzyme-based antimicrobial approaches, including lysins, DNases, and other enzymatic treatments.',
    search_queries: ['enzyme-based antimicrobials', 'lysin antimicrobial therapy', 'DNase antimicrobial', 'enzymatic antimicrobial treatment']
  },
  {
    division_id: 'novel-therapeutics',
    topic: 'Small molecule inhibitors of resistance mechanisms',
    description: 'Investigate small molecules that inhibit specific resistance mechanisms, including β-lactamase inhibitors and efflux blockers.',
    search_queries: ['small molecule resistance inhibitors', 'resistance mechanism inhibitors', 'beta-lactamase small molecules', 'efflux inhibitor compounds']
  },
  {
    division_id: 'novel-therapeutics',
    topic: 'Synthetic biology approaches to antimicrobials',
    description: 'Study synthetic biology applications in developing novel antimicrobials, including engineered biological systems.',
    search_queries: ['synthetic biology antimicrobials', 'engineered antimicrobial systems', 'synthetic antimicrobial compounds', 'bioengineered antimicrobials']
  },
  {
    division_id: 'novel-therapeutics',
    topic: 'Host-microbiome modulation for infection control',
    description: 'Examine strategies to modulate the host microbiome to prevent colonization by antimicrobial-resistant pathogens.',
    search_queries: ['microbiome modulation AMR', 'microbiome antimicrobial resistance', 'probiotics AMR prevention', 'microbiota infection control']
  },
  {
    division_id: 'novel-therapeutics',
    topic: 'Aptamer-based antimicrobial therapies',
    description: 'Investigate aptamer-based approaches for antimicrobial therapy, including DNA/RNA aptamers targeting bacterial components.',
    search_queries: ['aptamer antimicrobial therapy', 'DNA aptamers antimicrobial', 'RNA aptamer antimicrobial', 'aptamer-based antimicrobials']
  },
  {
    division_id: 'novel-therapeutics',
    topic: 'Antimicrobial hydrogels and wound care products',
    description: 'Study antimicrobial hydrogels and advanced wound care products for treating infected wounds and preventing AMR.',
    search_queries: ['antimicrobial hydrogels', 'antimicrobial wound care', 'hydrogel antimicrobial delivery', 'wound infection antimicrobials']
  },
  {
    division_id: 'novel-therapeutics',
    topic: 'Antimicrobial coatings and surface modifications',
    description: 'Examine antimicrobial coatings for medical devices and surfaces to prevent biofilm formation and device-associated infections.',
    search_queries: ['antimicrobial coatings medical devices', 'antimicrobial surface modifications', 'biofilm prevention coatings', 'device-associated infection prevention']
  },
  {
    division_id: 'novel-therapeutics',
    topic: 'Targeted antimicrobial delivery systems',
    description: 'Investigate targeted delivery systems that specifically deliver antimicrobials to infection sites or resistant bacteria.',
    search_queries: ['targeted antimicrobial delivery', 'antimicrobial targeting systems', 'site-specific antimicrobial therapy', 'pathogen-targeted delivery']
  },
  {
    division_id: 'novel-therapeutics',
    topic: 'Antimicrobial protein engineering and optimization',
    description: 'Study protein engineering approaches to optimize antimicrobial proteins and peptides for enhanced efficacy.',
    search_queries: ['antimicrobial protein engineering', 'peptide optimization antimicrobial', 'protein engineering antimicrobials', 'engineered antimicrobial proteins']
  },
  {
    division_id: 'novel-therapeutics',
    topic: 'Natural product-inspired antimicrobial discovery',
    description: 'Examine natural product-inspired approaches to antimicrobial discovery, including marine and terrestrial sources.',
    search_queries: ['natural product antimicrobials', 'marine antimicrobial compounds', 'plant antimicrobial discovery', 'natural antimicrobial sources']
  },
  {
    division_id: 'novel-therapeutics',
    topic: 'AI-driven antimicrobial drug discovery',
    description: 'Investigate artificial intelligence and machine learning applications in discovering novel antimicrobial compounds.',
    search_queries: ['AI antimicrobial discovery', 'machine learning drug discovery', 'AI-driven antimicrobials', 'computational antimicrobial design']
  },
  {
    division_id: 'novel-therapeutics',
    topic: 'Antimicrobial stewardship-guided therapeutic selection',
    description: 'Study how antimicrobial stewardship principles can guide the selection and development of novel therapeutic approaches.',
    search_queries: ['stewardship-guided therapeutics', 'antimicrobial stewardship novel drugs', 'stewardship therapeutic selection', 'responsible antimicrobial development']
  },
  {
    division_id: 'novel-therapeutics',
    topic: 'Inhaled antimicrobial therapies for respiratory infections',
    description: 'Examine inhaled antimicrobial formulations for treating respiratory tract infections, including cystic fibrosis applications.',
    search_queries: ['inhaled antimicrobial therapy', 'respiratory antimicrobial delivery', 'inhaled antibiotics CF', 'pulmonary antimicrobial treatment']
  },
  {
    division_id: 'novel-therapeutics',
    topic: 'Antimicrobial immunoconjugates and antibody-drug conjugates',
    description: 'Study antimicrobial immunoconjugates that combine antibodies with antimicrobial agents for targeted therapy.',
    search_queries: ['antimicrobial immunoconjugates', 'antibody-antimicrobial conjugates', 'targeted antimicrobial immunotherapy', 'antimicrobial ADCs']
  },
  {
    division_id: 'novel-therapeutics',
    topic: 'Calcium and magnesium potentiation of antimicrobials',
    description: 'Investigate how calcium and magnesium ions can potentiate antimicrobial activity and overcome resistance mechanisms.',
    search_queries: ['calcium antimicrobial potentiation', 'magnesium antimicrobial enhancement', 'metal ion antimicrobial synergy', 'divalent cation antimicrobials']
  },
  {
    division_id: 'novel-therapeutics',
    topic: 'Antimicrobial cycling and rotation strategies',
    description: 'Examine antimicrobial cycling and rotation strategies as therapeutic approaches to minimize resistance development.',
    search_queries: ['antimicrobial cycling strategies', 'antibiotic rotation therapy', 'antimicrobial stewardship cycling', 'cycling resistance prevention']
  },
  {
    division_id: 'novel-therapeutics',
    topic: 'Personalized antimicrobial therapy approaches',
    description: 'Study personalized medicine approaches to antimicrobial therapy, including pharmacogenomics and precision dosing.',
    search_queries: ['personalized antimicrobial therapy', 'precision antimicrobial medicine', 'antimicrobial pharmacogenomics', 'individualized antimicrobial dosing']
  },

  // Diagnostics & Surveillance Division (27 tasks)
  {
    division_id: 'diagnostics-surveillance',
    topic: 'Rapid antimicrobial susceptibility testing methods',
    description: 'Evaluate rapid AST methods including molecular diagnostics, flow cytometry, and automated systems that provide results within hours.',
    search_queries: ['rapid antimicrobial susceptibility testing', 'rapid AST methods', 'molecular AST diagnostics', 'automated AST systems']
  },
  {
    division_id: 'diagnostics-surveillance',
    topic: 'Whole genome sequencing for resistance prediction',
    description: 'Analyze the use of whole genome sequencing to predict antimicrobial resistance from genetic markers and resistance gene databases.',
    search_queries: ['WGS antimicrobial resistance prediction', 'genomic resistance prediction', 'resistance gene databases', 'WGS AST correlation']
  },
  {
    division_id: 'diagnostics-surveillance',
    topic: 'Point-of-care diagnostic tests for AMR',
    description: 'Examine point-of-care diagnostic technologies for detecting antimicrobial resistance in clinical settings.',
    search_queries: ['point-of-care AMR diagnostics', 'POC resistance testing', 'rapid AMR detection', 'bedside resistance diagnostics']
  },
  {
    division_id: 'diagnostics-surveillance',
    topic: 'Mass spectrometry in antimicrobial resistance detection',
    description: 'Study applications of mass spectrometry, including MALDI-TOF, for rapid identification of resistant pathogens and resistance mechanisms.',
    search_queries: ['mass spectrometry AMR detection', 'MALDI-TOF resistance identification', 'MS antimicrobial resistance', 'proteomics resistance detection']
  },
  {
    division_id: 'diagnostics-surveillance',
    topic: 'Biosensor technologies for antimicrobial resistance',
    description: 'Investigate biosensor approaches for detecting antimicrobial resistance, including electrochemical and optical biosensors.',
    search_queries: ['biosensors antimicrobial resistance', 'AMR biosensor technology', 'resistance detection biosensors', 'antimicrobial biosensors']
  },
  {
    division_id: 'diagnostics-surveillance',
    topic: 'Global antimicrobial resistance surveillance networks',
    description: 'Analyze global surveillance networks including WHO GLASS, EARS-Net, and NARMS for tracking resistance trends.',
    search_queries: ['global AMR surveillance networks', 'WHO GLASS surveillance', 'EARS-Net resistance surveillance', 'NARMS antimicrobial surveillance']
  },
  {
    division_id: 'diagnostics-surveillance',
    topic: 'Laboratory capacity building for AMR surveillance',
    description: 'Examine strategies for building laboratory capacity in low- and middle-income countries for AMR surveillance.',
    search_queries: ['laboratory capacity AMR surveillance', 'LMIC AMR laboratory capacity', 'surveillance capacity building', 'AMR laboratory strengthening']
  },
  {
    division_id: 'diagnostics-surveillance',
    topic: 'Molecular epidemiology of antimicrobial resistance',
    description: 'Study molecular typing methods for tracking the spread of antimicrobial-resistant pathogens and resistance genes.',
    search_queries: ['molecular epidemiology AMR', 'resistance gene tracking', 'AMR molecular typing', 'resistance epidemiology methods']
  },
  {
    division_id: 'diagnostics-surveillance',
    topic: 'Wastewater surveillance for antimicrobial resistance',
    description: 'Investigate wastewater-based epidemiology for monitoring antimicrobial resistance genes and usage in communities.',
    search_queries: ['wastewater surveillance AMR', 'wastewater epidemiology resistance', 'sewage AMR monitoring', 'environmental resistance surveillance']
  },
  {
    division_id: 'diagnostics-surveillance',
    topic: 'Antimicrobial resistance testing standardization',
    description: 'Examine standardization efforts for antimicrobial resistance testing, including CLSI and EUCAST guidelines.',
    search_queries: ['AMR testing standardization', 'CLSI EUCAST guidelines', 'AST standardization', 'resistance testing standards']
  },
  {
    division_id: 'diagnostics-surveillance',
    topic: 'Digital health tools for AMR surveillance',
    description: 'Study digital health technologies, mobile apps, and electronic systems for AMR surveillance and reporting.',
    search_queries: ['digital health AMR surveillance', 'mobile AMR surveillance', 'electronic AMR reporting', 'digital surveillance tools']
  },
  {
    division_id: 'diagnostics-surveillance',
    topic: 'Artificial intelligence in AMR diagnostics',
    description: 'Investigate AI and machine learning applications in antimicrobial resistance diagnostics and surveillance.',
    search_queries: ['AI antimicrobial resistance diagnostics', 'machine learning AMR detection', 'AI surveillance AMR', 'automated resistance detection']
  },
  {
    division_id: 'diagnostics-surveillance',
    topic: 'Microfluidics for antimicrobial susceptibility testing',
    description: 'Examine microfluidic devices and lab-on-a-chip technologies for rapid antimicrobial susceptibility testing.',
    search_queries: ['microfluidics AST', 'lab-on-chip antimicrobial testing', 'microfluidic susceptibility testing', 'microdevice AST']
  },
  {
    division_id: 'diagnostics-surveillance',
    topic: 'Phenotypic vs genotypic resistance detection',
    description: 'Compare phenotypic and genotypic methods for detecting antimicrobial resistance, including accuracy and clinical utility.',
    search_queries: ['phenotypic genotypic resistance detection', 'phenotype genotype AMR correlation', 'resistance detection methods comparison', 'AST phenotype genotype']
  },
  {
    division_id: 'diagnostics-surveillance',
    topic: 'Resistance gene transfer monitoring systems',
    description: 'Study systems for monitoring horizontal gene transfer of resistance genes in clinical and environmental settings.',
    search_queries: ['resistance gene transfer monitoring', 'horizontal gene transfer surveillance', 'plasmid transfer detection', 'conjugation monitoring AMR']
  },
  {
    division_id: 'diagnostics-surveillance',
    topic: 'Quality assurance in AMR testing laboratories',
    description: 'Examine quality assurance programs and proficiency testing for antimicrobial resistance testing laboratories.',
    search_queries: ['quality assurance AMR testing', 'proficiency testing AST', 'laboratory QA antimicrobial', 'AMR testing quality control']
  },
  {
    division_id: 'diagnostics-surveillance',
    topic: 'Antimicrobial usage monitoring and correlation with resistance',
    description: 'Study systems for monitoring antimicrobial usage and correlating consumption data with resistance patterns.',
    search_queries: ['antimicrobial usage monitoring', 'antibiotic consumption resistance correlation', 'AMR usage surveillance', 'consumption resistance patterns']
  },
  {
    division_id: 'diagnostics-surveillance',
    topic: 'Outbreak detection and investigation tools for AMR',
    description: 'Investigate tools and methods for detecting and investigating outbreaks of antimicrobial-resistant pathogens.',
    search_queries: ['AMR outbreak detection', 'resistance outbreak investigation', 'AMR epidemic detection', 'outbreak surveillance tools']
  },
  {
    division_id: 'diagnostics-surveillance',
    topic: 'International AMR data sharing and harmonization',
    description: 'Examine efforts to harmonize and share antimicrobial resistance data across international borders and surveillance systems.',
    search_queries: ['international AMR data sharing', 'AMR data harmonization', 'global resistance data exchange', 'international surveillance cooperation']
  },
  {
    division_id: 'diagnostics-surveillance',
    topic: 'Antimicrobial resistance in resource-limited settings',
    description: 'Study challenges and solutions for AMR diagnostics and surveillance in resource-limited healthcare settings.',
    search_queries: ['AMR resource-limited settings', 'resistance diagnostics LMIC', 'low-resource AMR surveillance', 'AMR diagnostics developing countries']
  },
  {
    division_id: 'diagnostics-surveillance',
    topic: 'Environmental monitoring of antimicrobial resistance',
    description: 'Investigate environmental surveillance of antimicrobial resistance in water, soil, and other environmental matrices.',
    search_queries: ['environmental AMR surveillance', 'environmental resistance monitoring', 'water soil AMR surveillance', 'environmental resistance genes']
  },
  {
    division_id: 'diagnostics-surveillance',
    topic: 'Healthcare-associated infection surveillance for AMR',
    description: 'Examine surveillance systems specifically designed to monitor healthcare-associated infections with antimicrobial resistance.',
    search_queries: ['HAI surveillance AMR', 'healthcare-associated infection resistance', 'nosocomial infection surveillance', 'hospital AMR surveillance']
  },
  {
    division_id: 'diagnostics-surveillance',
    topic: 'Community-based AMR surveillance strategies',
    description: 'Study surveillance strategies for monitoring antimicrobial resistance in community settings outside of hospitals.',
    search_queries: ['community AMR surveillance', 'community-based resistance surveillance', 'outpatient AMR monitoring', 'community resistance patterns']
  },
  {
    division_id: 'diagnostics-surveillance',
    topic: 'Real-time AMR surveillance and early warning systems',
    description: 'Investigate real-time surveillance systems that can provide early warnings of emerging antimicrobial resistance threats.',
    search_queries: ['real-time AMR surveillance', 'early warning AMR systems', 'AMR alert systems', 'rapid resistance detection alerts']
  },
  {
    division_id: 'diagnostics-surveillance',
    topic: 'Integrated surveillance of humans, animals, and environment',
    description: 'Examine integrated One Health surveillance approaches that monitor AMR across human, animal, and environmental sectors.',
    search_queries: ['integrated One Health AMR surveillance', 'cross-sector AMR surveillance', 'human animal environment surveillance', 'One Health resistance monitoring']
  },
  {
    division_id: 'diagnostics-surveillance',
    topic: 'Cost-effectiveness of AMR diagnostic technologies',
    description: 'Study the cost-effectiveness of different antimicrobial resistance diagnostic technologies and surveillance approaches.',
    search_queries: ['cost-effectiveness AMR diagnostics', 'economic evaluation AMR testing', 'AMR diagnostic cost analysis', 'surveillance cost-effectiveness']
  },
  {
    division_id: 'diagnostics-surveillance',
    topic: 'Antimicrobial resistance trend analysis and forecasting',
    description: 'Investigate methods for analyzing AMR trends over time and forecasting future resistance patterns.',
    search_queries: ['AMR trend analysis', 'resistance forecasting models', 'AMR pattern prediction', 'resistance trend surveillance']
  },

  // One Health Division (26 tasks)
  {
    division_id: 'one-health',
    topic: 'Agricultural antibiotic use and resistance development',
    description: 'Analyze the relationship between agricultural antibiotic use in livestock and poultry and the development of antimicrobial resistance.',
    search_queries: ['agricultural antibiotic use resistance', 'livestock antibiotic resistance', 'poultry antimicrobial resistance', 'farm antibiotic resistance development']
  },
  {
    division_id: 'one-health',
    topic: 'Aquaculture antimicrobial use and environmental impact',
    description: 'Examine antimicrobial use in aquaculture systems and its impact on environmental antimicrobial resistance.',
    search_queries: ['aquaculture antimicrobial use', 'fish farming antibiotic resistance', 'aquaculture environmental resistance', 'marine antimicrobial resistance']
  },
  {
    division_id: 'one-health',
    topic: 'Companion animal antimicrobial resistance patterns',
    description: 'Study antimicrobial resistance patterns in companion animals (dogs, cats, horses) and their relationship to human health.',
    search_queries: ['companion animal AMR', 'veterinary antimicrobial resistance', 'pet antibiotic resistance', 'small animal resistance patterns']
  },
  {
    division_id: 'one-health',
    topic: 'Wildlife reservoirs of antimicrobial resistance',
    description: 'Investigate wildlife as reservoirs of antimicrobial resistance genes and their role in resistance dissemination.',
    search_queries: ['wildlife antimicrobial resistance', 'wild animal resistance reservoirs', 'wildlife AMR genes', 'environmental resistance wildlife']
  },
  {
    division_id: 'one-health',
    topic: 'Zoonotic transmission of antimicrobial-resistant pathogens',
    description: 'Examine the transmission of antimicrobial-resistant pathogens between animals and humans.',
    search_queries: ['zoonotic AMR transmission', 'animal-human resistance transmission', 'zoonotic resistant pathogens', 'cross-species resistance transfer']
  },
  {
    division_id: 'one-health',
    topic: 'Food chain antimicrobial resistance contamination',
    description: 'Study contamination of the food chain with antimicrobial-resistant bacteria and resistance genes.',
    search_queries: ['food chain AMR contamination', 'food safety antimicrobial resistance', 'foodborne resistant bacteria', 'food production AMR']
  },
  {
    division_id: 'one-health',
    topic: 'Environmental antimicrobial residues and resistance selection',
    description: 'Investigate environmental antimicrobial residues from various sources and their role in selecting for resistance.',
    search_queries: ['environmental antimicrobial residues', 'antibiotic residues environment', 'environmental selection pressure', 'residue resistance selection']
  },
  {
    division_id: 'one-health',
    topic: 'Hospital wastewater and antimicrobial resistance dissemination',
    description: 'Examine hospital wastewater as a source of antimicrobial resistance genes and resistant bacteria in the environment.',
    search_queries: ['hospital wastewater AMR', 'healthcare wastewater resistance', 'hospital effluent AMR genes', 'medical waste antimicrobial resistance']
  },
  {
    division_id: 'one-health',
    topic: 'Pharmaceutical manufacturing waste and AMR hotspots',
    description: 'Study pharmaceutical manufacturing waste sites as hotspots for antimicrobial resistance development and dissemination.',
    search_queries: ['pharmaceutical waste AMR hotspots', 'drug manufacturing resistance', 'pharmaceutical pollution AMR', 'antibiotic manufacturing waste']
  },
  {
    division_id: 'one-health',
    topic: 'Soil microbiome and antimicrobial resistance ecology',
    description: 'Investigate the soil microbiome as a reservoir of antimicrobial resistance genes and its ecological dynamics.',
    search_queries: ['soil microbiome AMR', 'soil antimicrobial resistance ecology', 'terrestrial resistance genes', 'soil resistome analysis']
  },
  {
    division_id: 'one-health',
    topic: 'Water systems as AMR transmission pathways',
    description: 'Examine water systems including rivers, lakes, and groundwater as pathways for antimicrobial resistance transmission.',
    search_queries: ['water systems AMR transmission', 'aquatic antimicrobial resistance', 'water resistance pathways', 'freshwater AMR ecology']
  },
  {
    division_id: 'one-health',
    topic: 'Marine environment antimicrobial resistance pollution',
    description: 'Study antimicrobial resistance pollution in marine environments and its impact on marine ecosystems.',
    search_queries: ['marine AMR pollution', 'ocean antimicrobial resistance', 'marine resistance contamination', 'seawater AMR genes']
  },
  {
    division_id: 'one-health',
    topic: 'Antimicrobial resistance in developing vs developed countries',
    description: 'Compare One Health aspects of antimicrobial resistance between developing and developed countries.',
    search_queries: ['AMR developing vs developed countries', 'global One Health AMR patterns', 'country-level AMR differences', 'international One Health AMR']
  },
  {
    division_id: 'one-health',
    topic: 'Urban vs rural antimicrobial resistance patterns',
    description: 'Examine differences in antimicrobial resistance patterns between urban and rural environments from a One Health perspective.',
    search_queries: ['urban rural AMR patterns', 'city countryside resistance differences', 'urban environment AMR', 'rural antimicrobial resistance']
  },
  {
    division_id: 'one-health',
    topic: 'Climate change impacts on antimicrobial resistance',
    description: 'Investigate how climate change affects the development, spread, and persistence of antimicrobial resistance.',
    search_queries: ['climate change antimicrobial resistance', 'global warming AMR impact', 'temperature AMR development', 'climate AMR transmission']
  },
  {
    division_id: 'one-health',
    topic: 'One Health surveillance system integration',
    description: 'Study integrated surveillance systems that monitor antimicrobial resistance across human, animal, and environmental sectors.',
    search_queries: ['One Health AMR surveillance integration', 'integrated resistance surveillance', 'cross-sector AMR monitoring', 'unified One Health surveillance']
  },
  {
    division_id: 'one-health',
    topic: 'Antimicrobial growth promoter alternatives',
    description: 'Examine alternatives to antimicrobial growth promoters in animal agriculture and their effectiveness.',
    search_queries: ['antimicrobial growth promoter alternatives', 'AGP alternatives livestock', 'growth promoter substitutes', 'non-antibiotic growth promotion']
  },
  {
    division_id: 'one-health',
    topic: 'Veterinary prescription practices and AMR',
    description: 'Study veterinary antimicrobial prescription practices and their relationship to resistance development.',
    search_queries: ['veterinary prescription practices AMR', 'vet antimicrobial prescribing', 'veterinary stewardship', 'animal antimicrobial use patterns']
  },
  {
    division_id: 'one-health',
    topic: 'Food animal production systems and resistance ecology',
    description: 'Investigate different food animal production systems and their impact on antimicrobial resistance ecology.',
    search_queries: ['food animal production AMR ecology', 'livestock systems resistance', 'intensive farming AMR', 'organic farming antimicrobial resistance']
  },
  {
    division_id: 'one-health',
    topic: 'Manure management and antimicrobial resistance spread',
    description: 'Examine manure management practices and their role in spreading antimicrobial resistance to the environment.',
    search_queries: ['manure management AMR spread', 'livestock waste resistance', 'manure antimicrobial resistance', 'animal waste AMR transmission']
  },
  {
    division_id: 'one-health',
    topic: 'Cross-border movement and AMR transmission',
    description: 'Study how cross-border movement of animals, people, and goods facilitates antimicrobial resistance transmission.',
    search_queries: ['cross-border AMR transmission', 'international resistance spread', 'trade AMR dissemination', 'global resistance movement']
  },
  {
    division_id: 'one-health',
    topic: 'Indigenous communities and traditional antimicrobial practices',
    description: 'Investigate antimicrobial resistance patterns in indigenous communities and the role of traditional antimicrobial practices.',
    search_queries: ['indigenous communities AMR', 'traditional antimicrobial practices', 'native communities resistance', 'traditional medicine AMR']
  },
  {
    division_id: 'one-health',
    topic: 'Disaster response and antimicrobial resistance management',
    description: 'Examine antimicrobial resistance management in disaster response scenarios affecting humans, animals, and environment.',
    search_queries: ['disaster response AMR management', 'emergency antimicrobial resistance', 'disaster AMR control', 'crisis antimicrobial stewardship']
  },
  {
    division_id: 'one-health',
    topic: 'Occupational exposure to antimicrobial resistance',
    description: 'Study occupational exposure to antimicrobial-resistant pathogens in healthcare, agriculture, and veterinary workers.',
    search_queries: ['occupational AMR exposure', 'healthcare worker resistance exposure', 'farm worker AMR risk', 'veterinary worker resistance']
  },
  {
    division_id: 'one-health',
    topic: 'Antimicrobial resistance in intensive care environments',
    description: 'Investigate One Health aspects of antimicrobial resistance in intensive care units for both humans and animals.',
    search_queries: ['ICU antimicrobial resistance One Health', 'intensive care AMR environment', 'critical care resistance ecology', 'ICU environmental AMR']
  },
  {
    division_id: 'one-health',
    topic: 'Public health interventions for One Health AMR',
    description: 'Examine public health interventions that address antimicrobial resistance from a One Health perspective.',
    search_queries: ['public health One Health AMR interventions', 'population health AMR strategies', 'community One Health AMR', 'public health resistance control']
  },

  // Stewardship & Policy Division (21 tasks)
  {
    division_id: 'stewardship-policy',
    topic: 'Hospital antimicrobial stewardship program effectiveness',
    description: 'Evaluate the effectiveness of hospital antimicrobial stewardship programs in reducing inappropriate use and resistance development.',
    search_queries: ['hospital antimicrobial stewardship effectiveness', 'ASP program outcomes', 'stewardship program evaluation', 'hospital stewardship impact']
  },
  {
    division_id: 'stewardship-policy',
    topic: 'Outpatient antimicrobial prescribing interventions',
    description: 'Study interventions to improve antimicrobial prescribing in outpatient settings, including primary care and urgent care.',
    search_queries: ['outpatient antimicrobial prescribing', 'primary care stewardship', 'ambulatory antimicrobial interventions', 'outpatient prescribing improvement']
  },
  {
    division_id: 'stewardship-policy',
    topic: 'National antimicrobial resistance action plans',
    description: 'Analyze national action plans for combating antimicrobial resistance and their implementation effectiveness.',
    search_queries: ['national AMR action plans', 'country AMR strategies', 'national resistance policies', 'AMR action plan implementation']
  },
  {
    division_id: 'stewardship-policy',
    topic: 'Economic incentives for antimicrobial development',
    description: 'Examine push and pull economic incentives designed to stimulate antimicrobial drug development.',
    search_queries: ['economic incentives antimicrobial development', 'push pull incentives antibiotics', 'AMR development incentives', 'antimicrobial market incentives']
  },
  {
    division_id: 'stewardship-policy',
    topic: 'Regulatory policies for antimicrobial approval and use',
    description: 'Study regulatory policies governing antimicrobial approval, labeling, and use restrictions.',
    search_queries: ['antimicrobial regulatory policies', 'antibiotic approval regulations', 'antimicrobial use restrictions', 'drug regulatory stewardship']
  },
  {
    division_id: 'stewardship-policy',
    topic: 'WHO antimicrobial resistance global action plan',
    description: 'Analyze the WHO Global Action Plan on Antimicrobial Resistance and country-level implementation progress.',
    search_queries: ['WHO AMR global action plan', 'WHO resistance strategy', 'global AMR action plan implementation', 'WHO antimicrobial resistance policy']
  },
  {
    division_id: 'stewardship-policy',
    topic: 'CDC antimicrobial resistance threats and responses',
    description: 'Examine CDC\'s antimicrobial resistance threat assessments and recommended policy responses.',
    search_queries: ['CDC AMR threats report', 'CDC antimicrobial resistance policy', 'CDC resistance response strategies', 'US AMR policy CDC']
  },
  {
    division_id: 'stewardship-policy',
    topic: 'Antimicrobial stewardship in long-term care facilities',
    description: 'Study antimicrobial stewardship challenges and interventions in long-term care and nursing home facilities.',
    search_queries: ['antimicrobial stewardship long-term care', 'nursing home stewardship', 'LTC facility antimicrobial use', 'elderly care stewardship']
  },
  {
    division_id: 'stewardship-policy',
    topic: 'Pediatric antimicrobial stewardship considerations',
    description: 'Investigate special considerations for antimicrobial stewardship in pediatric populations.',
    search_queries: ['pediatric antimicrobial stewardship', 'children antibiotic stewardship', 'pediatric prescribing guidelines', 'child-specific stewardship']
  },
  {
    division_id: 'stewardship-policy',
    topic: 'Antimicrobial stewardship in resource-limited settings',
    description: 'Examine challenges and strategies for implementing antimicrobial stewardship in resource-limited healthcare settings.',
    search_queries: ['antimicrobial stewardship resource-limited', 'LMIC stewardship programs', 'low-resource stewardship', 'developing country stewardship']
  },
  {
    division_id: 'stewardship-policy',
    topic: 'Pharmacy-led antimicrobial stewardship interventions',
    description: 'Study the role of pharmacists in antimicrobial stewardship programs and pharmacy-led interventions.',
    search_queries: ['pharmacy-led antimicrobial stewardship', 'pharmacist stewardship role', 'clinical pharmacy stewardship', 'pharmacy stewardship interventions']
  },
  {
    division_id: 'stewardship-policy',
    topic: 'Antimicrobial de-escalation strategies and policies',
    description: 'Investigate antimicrobial de-escalation strategies and institutional policies supporting appropriate de-escalation.',
    search_queries: ['antimicrobial de-escalation strategies', 'antibiotic de-escalation policies', 'stewardship de-escalation', 'therapeutic de-escalation']
  },
  {
    division_id: 'stewardship-policy',
    topic: 'Antimicrobial formulary restrictions and outcomes',
    description: 'Examine antimicrobial formulary restrictions, prior authorization systems, and their impact on prescribing and outcomes.',
    search_queries: ['antimicrobial formulary restrictions', 'antibiotic prior authorization', 'formulary stewardship', 'restricted antimicrobial access']
  },
  {
    division_id: 'stewardship-policy',
    topic: 'Education and training in antimicrobial stewardship',
    description: 'Study educational interventions and training programs for healthcare providers in antimicrobial stewardship.',
    search_queries: ['antimicrobial stewardship education', 'stewardship training programs', 'healthcare provider education AMR', 'stewardship curriculum']
  },
  {
    division_id: 'stewardship-policy',
    topic: 'Antimicrobial stewardship metrics and quality indicators',
    description: 'Investigate metrics and quality indicators used to measure antimicrobial stewardship program performance.',
    search_queries: ['antimicrobial stewardship metrics', 'stewardship quality indicators', 'ASP performance measures', 'stewardship program evaluation']
  },
  {
    division_id: 'stewardship-policy',
    topic: 'International cooperation on antimicrobial resistance policies',
    description: 'Examine international cooperation mechanisms and agreements for addressing antimicrobial resistance.',
    search_queries: ['international AMR cooperation', 'global antimicrobial resistance policies', 'international resistance agreements', 'cross-border AMR policy']
  },
  {
    division_id: 'stewardship-policy',
    topic: 'Antimicrobial stewardship in emergency departments',
    description: 'Study antimicrobial stewardship challenges and interventions specific to emergency department settings.',
    search_queries: ['emergency department stewardship', 'ED antimicrobial stewardship', 'emergency medicine stewardship', 'acute care stewardship']
  },
  {
    division_id: 'stewardship-policy',
    topic: 'Technology-enabled antimicrobial stewardship tools',
    description: 'Investigate technology solutions including clinical decision support systems for antimicrobial stewardship.',
    search_queries: ['technology antimicrobial stewardship', 'clinical decision support stewardship', 'digital stewardship tools', 'AI stewardship systems']
  },
  {
    division_id: 'stewardship-policy',
    topic: 'Antimicrobial stewardship and healthcare quality measures',
    description: 'Examine the relationship between antimicrobial stewardship activities and healthcare quality measures.',
    search_queries: ['antimicrobial stewardship quality measures', 'stewardship healthcare quality', 'ASP quality indicators', 'stewardship patient outcomes']
  },
  {
    division_id: 'stewardship-policy',
    topic: 'Behavioral interventions for antimicrobial prescribing',
    description: 'Study behavioral science approaches to improving antimicrobial prescribing practices among healthcare providers.',
    search_queries: ['behavioral interventions antimicrobial prescribing', 'prescribing behavior change', 'behavioral stewardship interventions', 'psychology antimicrobial use']
  },
  {
    division_id: 'stewardship-policy',
    topic: 'Antimicrobial stewardship policy implementation barriers',
    description: 'Investigate barriers to implementing antimicrobial stewardship policies and strategies to overcome them.',
    search_queries: ['stewardship implementation barriers', 'ASP policy barriers', 'stewardship program challenges', 'antimicrobial stewardship obstacles']
  },

  // Infection Prevention Division (21 tasks)
  {
    division_id: 'infection-prevention',
    topic: 'Hand hygiene compliance and AMR prevention',
    description: 'Evaluate hand hygiene compliance interventions and their impact on preventing transmission of antimicrobial-resistant organisms.',
    search_queries: ['hand hygiene AMR prevention', 'hand hygiene resistant organisms', 'hand hygiene compliance interventions', 'hand sanitization resistance']
  },
  {
    division_id: 'infection-prevention',
    topic: 'Contact precautions for multidrug-resistant organisms',
    description: 'Study the effectiveness of contact precautions in preventing transmission of multidrug-resistant organisms in healthcare settings.',
    search_queries: ['contact precautions MDR organisms', 'isolation precautions MDRO', 'contact isolation effectiveness', 'MDRO transmission prevention']
  },
  {
    division_id: 'infection-prevention',
    topic: 'Environmental cleaning and disinfection for AMR control',
    description: 'Investigate environmental cleaning and disinfection strategies for controlling antimicrobial-resistant pathogens in healthcare environments.',
    search_queries: ['environmental cleaning AMR control', 'disinfection resistant organisms', 'environmental decontamination MDR', 'surface disinfection resistance']
  },
  {
    division_id: 'infection-prevention',
    topic: 'Active surveillance for antimicrobial-resistant organisms',
    description: 'Examine active surveillance strategies for detecting colonization with antimicrobial-resistant organisms.',
    search_queries: ['active surveillance MDR organisms', 'MDRO surveillance screening', 'colonization surveillance AMR', 'active screening resistant bacteria']
  },
  {
    division_id: 'infection-prevention',
    topic: 'Healthcare worker compliance with infection prevention measures',
    description: 'Study factors affecting healthcare worker compliance with infection prevention measures for antimicrobial-resistant pathogens.',
    search_queries: ['healthcare worker compliance infection prevention', 'HCW adherence AMR precautions', 'infection control compliance', 'staff adherence isolation precautions']
  },
  {
    division_id: 'infection-prevention',
    topic: 'Personal protective equipment effectiveness against AMR',
    description: 'Evaluate the effectiveness of different personal protective equipment in preventing transmission of antimicrobial-resistant organisms.',
    search_queries: ['PPE effectiveness AMR prevention', 'personal protective equipment MDRO', 'PPE resistant organism transmission', 'protective equipment infection control']
  },
  {
    division_id: 'infection-prevention',
    topic: 'Room design and AMR transmission prevention',
    description: 'Investigate how healthcare facility room design and air handling systems affect transmission of antimicrobial-resistant pathogens.',
    search_queries: ['room design AMR transmission', 'healthcare facility design infection control', 'air handling AMR prevention', 'hospital room design resistance']
  },
  {
    division_id: 'infection-prevention',
    topic: 'Decolonization strategies for resistant organisms',
    description: 'Study decolonization strategies for patients colonized with antimicrobial-resistant organisms.',
    search_queries: ['decolonization resistant organisms', 'MRSA decolonization strategies', 'VRE decolonization', 'antimicrobial decolonization protocols']
  },
  {
    division_id: 'infection-prevention',
    topic: 'Bundle interventions for AMR prevention',
    description: 'Examine care bundle interventions designed to prevent infections with antimicrobial-resistant organisms.',
    search_queries: ['care bundles AMR prevention', 'infection prevention bundles MDRO', 'bundle interventions resistant organisms', 'care bundle antimicrobial resistance']
  },
  {
    division_id: 'infection-prevention',
    topic: 'Cohorting strategies for resistant organism control',
    description: 'Investigate patient cohorting strategies for controlling outbreaks of antimicrobial-resistant organisms.',
    search_queries: ['patient cohorting resistant organisms', 'cohorting strategies MDRO', 'cohort isolation AMR', 'patient grouping infection control']
  },
  {
    division_id: 'infection-prevention',
    topic: 'Technology innovations in infection prevention for AMR',
    description: 'Study technological innovations including UV-C disinfection, copper surfaces, and automated monitoring for AMR prevention.',
    search_queries: ['technology innovations infection prevention AMR', 'UV-C disinfection resistant organisms', 'copper surfaces antimicrobial', 'automated monitoring infection control']
  },
  {
    division_id: 'infection-prevention',
    topic: 'Surgical site infection prevention and AMR',
    description: 'Examine surgical site infection prevention strategies specifically targeting antimicrobial-resistant pathogens.',
    search_queries: ['surgical site infection prevention AMR', 'SSI prevention resistant organisms', 'surgical infection control MDR', 'perioperative AMR prevention']
  },
  {
    division_id: 'infection-prevention',
    topic: 'Central line-associated bloodstream infection prevention',
    description: 'Study prevention of central line-associated bloodstream infections caused by antimicrobial-resistant organisms.',
    search_queries: ['CLABSI prevention resistant organisms', 'central line infection AMR', 'bloodstream infection prevention MDR', 'catheter-related infection AMR']
  },
  {
    division_id: 'infection-prevention',
    topic: 'Ventilator-associated pneumonia prevention and AMR',
    description: 'Investigate prevention strategies for ventilator-associated pneumonia caused by antimicrobial-resistant pathogens.',
    search_queries: ['VAP prevention resistant organisms', 'ventilator pneumonia AMR', 'mechanical ventilation infection AMR', 'respiratory infection prevention MDR']
  },
  {
    division_id: 'infection-prevention',
    topic: 'Catheter-associated urinary tract infection prevention',
    description: 'Examine prevention of catheter-associated urinary tract infections with antimicrobial-resistant uropathogens.',
    search_queries: ['CAUTI prevention resistant organisms', 'urinary catheter infection AMR', 'UTI prevention MDR', 'catheter infection control resistance']
  },
  {
    division_id: 'infection-prevention',
    topic: 'Outbreak investigation and control for resistant organisms',
    description: 'Study outbreak investigation methodologies and control measures for antimicrobial-resistant organism outbreaks.',
    search_queries: ['outbreak investigation resistant organisms', 'MDRO outbreak control', 'antimicrobial resistance outbreak management', 'resistant pathogen outbreak response']
  },
  {
    division_id: 'infection-prevention',
    topic: 'Long-term care facility infection prevention for AMR',
    description: 'Investigate infection prevention challenges and strategies in long-term care facilities for antimicrobial-resistant pathogens.',
    search_queries: ['long-term care infection prevention AMR', 'nursing home MDRO prevention', 'LTC facility resistant organisms', 'elderly care infection control AMR']
  },
  {
    division_id: 'infection-prevention',
    topic: 'Community infection prevention strategies for AMR',
    description: 'Examine community-based infection prevention strategies to reduce transmission of antimicrobial-resistant organisms.',
    search_queries: ['community infection prevention AMR', 'community MDRO prevention', 'public health infection control resistance', 'community-acquired resistant infections']
  },
  {
    division_id: 'infection-prevention',
    topic: 'Infection prevention education and training for AMR',
    description: 'Study educational interventions and training programs for infection prevention targeting antimicrobial-resistant organisms.',
    search_queries: ['infection prevention education AMR', 'MDRO prevention training', 'infection control education resistant organisms', 'AMR prevention education programs']
  },
  {
    division_id: 'infection-prevention',
    topic: 'Cost-effectiveness of AMR infection prevention strategies',
    description: 'Analyze the cost-effectiveness of different infection prevention strategies for controlling antimicrobial-resistant organisms.',
    search_queries: ['cost-effectiveness infection prevention AMR', 'economic evaluation MDRO prevention', 'infection control cost analysis', 'AMR prevention cost-effectiveness']
  },
  {
    division_id: 'infection-prevention',
    topic: 'Quality improvement initiatives for AMR prevention',
    description: 'Examine quality improvement methodologies applied to preventing infections with antimicrobial-resistant organisms.',
    search_queries: ['quality improvement AMR prevention', 'QI initiatives infection prevention', 'improvement science MDRO', 'quality measures AMR infection control']
  },

  // Clinical Outcomes Division (21 tasks)
  {
    division_id: 'clinical-outcomes',
    topic: 'Mortality rates associated with multidrug-resistant infections',
    description: 'Analyze mortality rates and risk factors for death in patients with multidrug-resistant bacterial infections.',
    search_queries: ['mortality multidrug-resistant infections', 'MDR infection mortality rates', 'death rates resistant bacteria', 'fatal outcomes AMR infections']
  },
  {
    division_id: 'clinical-outcomes',
    topic: 'Length of stay impact of antimicrobial-resistant infections',
    description: 'Study the impact of antimicrobial-resistant infections on hospital length of stay and healthcare resource utilization.',
    search_queries: ['length of stay AMR infections', 'hospital stay resistant organisms', 'healthcare utilization MDR', 'resource use antimicrobial resistance']
  },
  {
    division_id: 'clinical-outcomes',
    topic: 'Treatment outcomes for carbapenem-resistant Enterobacteriaceae',
    description: 'Examine treatment outcomes, including mortality and cure rates, for patients with carbapenem-resistant Enterobacteriaceae infections.',
    search_queries: ['CRE treatment outcomes', 'carbapenem-resistant Enterobacteriaceae outcomes', 'CRE infection mortality', 'CRE therapy effectiveness']
  },
  {
    division_id: 'clinical-outcomes',
    topic: 'Combination therapy for extensively drug-resistant pathogens',
    description: 'Evaluate combination antimicrobial therapy approaches for treating extensively drug-resistant bacterial infections.',
    search_queries: ['combination therapy XDR pathogens', 'combination antimicrobial therapy', 'synergistic antibiotic therapy', 'multi-drug combination resistant bacteria']
  },
  {
    division_id: 'clinical-outcomes',
    topic: 'Pharmacokinetic-pharmacodynamic optimization for resistant infections',
    description: 'Study PK/PD optimization strategies for antimicrobials used to treat resistant bacterial infections.',
    search_queries: ['PK/PD optimization resistant infections', 'pharmacokinetics antimicrobial resistance', 'dosing optimization MDR', 'pharmacodynamics resistant bacteria']
  },
  {
    division_id: 'clinical-outcomes',
    topic: 'ICU outcomes in patients with antimicrobial-resistant infections',
    description: 'Examine clinical outcomes in critically ill patients with antimicrobial-resistant infections in intensive care units.',
    search_queries: ['ICU outcomes AMR infections', 'critical care resistant organisms', 'intensive care MDR outcomes', 'critically ill AMR patients']
  },
  {
    division_id: 'clinical-outcomes',
    topic: 'Immunocompromised patients and resistant infection outcomes',
    description: 'Study clinical outcomes of antimicrobial-resistant infections in immunocompromised patient populations.',
    search_queries: ['immunocompromised AMR outcomes', 'resistant infections immunosuppressed', 'cancer patients AMR outcomes', 'transplant recipients resistant infections']
  },
  {
    division_id: 'clinical-outcomes',
    topic: 'Neonatal and pediatric outcomes with resistant infections',
    description: 'Examine clinical outcomes of antimicrobial-resistant infections in neonatal and pediatric populations.',
    search_queries: ['neonatal AMR outcomes', 'pediatric resistant infection outcomes', 'children MDR infection mortality', 'newborn antimicrobial resistance']
  },
  {
    division_id: 'clinical-outcomes',
    topic: 'Elderly patients and antimicrobial-resistant infection outcomes',
    description: 'Study clinical outcomes of antimicrobial-resistant infections in elderly patient populations.',
    search_queries: ['elderly AMR outcomes', 'geriatric resistant infection outcomes', 'aged patients MDR mortality', 'senior citizens antimicrobial resistance']
  },
  {
    division_id: 'clinical-outcomes',
    topic: 'Surgical outcomes in patients with resistant organisms',
    description: 'Examine surgical outcomes and complications in patients with pre-existing antimicrobial-resistant organism colonization or infection.',
    search_queries: ['surgical outcomes resistant organisms', 'surgery AMR complications', 'perioperative MDR outcomes', 'surgical site infections resistant bacteria']
  },
  {
    division_id: 'clinical-outcomes',
    topic: 'Long-term sequelae of multidrug-resistant infections',
    description: 'Study long-term health consequences and sequelae following multidrug-resistant bacterial infections.',
    search_queries: ['long-term sequelae MDR infections', 'chronic complications resistant bacteria', 'persistent effects AMR infections', 'long-term outcomes antimicrobial resistance']
  },
  {
    division_id: 'clinical-outcomes',
    topic: 'Quality of life impacts of antimicrobial-resistant infections',
    description: 'Investigate the impact of antimicrobial-resistant infections on patient quality of life and functional outcomes.',
    search_queries: ['quality of life AMR infections', 'functional outcomes resistant bacteria', 'patient-reported outcomes MDR', 'life quality antimicrobial resistance']
  },
  {
    division_id: 'clinical-outcomes',
    topic: 'Readmission rates following resistant organism infections',
    description: 'Analyze hospital readmission rates and causes in patients previously treated for antimicrobial-resistant infections.',
    search_queries: ['readmission rates AMR infections', 'hospital readmissions resistant organisms', 'recurrent infections MDR', 'repeat hospitalizations antimicrobial resistance']
  },
  {
    division_id: 'clinical-outcomes',
    topic: 'Biomarkers for predicting outcomes in resistant infections',
    description: 'Study biomarkers that can predict clinical outcomes in patients with antimicrobial-resistant infections.',
    search_queries: ['biomarkers AMR infection outcomes', 'predictive biomarkers resistant bacteria', 'prognostic markers MDR infections', 'outcome prediction antimicrobial resistance']
  },
  {
    division_id: 'clinical-outcomes',
    topic: 'Therapeutic drug monitoring in resistant infection treatment',
    description: 'Examine the role of therapeutic drug monitoring in optimizing treatment of antimicrobial-resistant infections.',
    search_queries: ['therapeutic drug monitoring AMR', 'TDM resistant infection treatment', 'antibiotic monitoring MDR therapy', 'drug level monitoring antimicrobial resistance']
  },
  {
    division_id: 'clinical-outcomes',
    topic: 'Treatment failure rates in resistant bacterial infections',
    description: 'Study treatment failure rates and associated risk factors in antimicrobial-resistant bacterial infections.',
    search_queries: ['treatment failure rates AMR', 'therapy failure resistant bacteria', 'antimicrobial failure MDR infections', 'treatment response resistant organisms']
  },
  {
    division_id: 'clinical-outcomes',
    topic: 'Organ dysfunction in severe resistant infections',
    description: 'Examine organ dysfunction patterns and severity in patients with severe antimicrobial-resistant infections.',
    search_queries: ['organ dysfunction AMR infections', 'multi-organ failure resistant bacteria', 'organ failure MDR sepsis', 'systemic effects resistant infections']
  },
  {
    division_id: 'clinical-outcomes',
    topic: 'Time to appropriate therapy and resistant infection outcomes',
    description: 'Study the relationship between time to appropriate antimicrobial therapy and clinical outcomes in resistant infections.',
    search_queries: ['time to appropriate therapy AMR', 'delayed treatment resistant infections', 'early therapy MDR outcomes', 'treatment timing antimicrobial resistance']
  },
  {
    division_id: 'clinical-outcomes',
    topic: 'Sepsis outcomes in antimicrobial-resistant infections',
    description: 'Examine sepsis severity, progression, and outcomes in patients with antimicrobial-resistant bacterial infections.',
    search_queries: ['sepsis outcomes AMR infections', 'septic shock resistant bacteria', 'severe sepsis MDR pathogens', 'sepsis mortality antimicrobial resistance']
  },
  {
    division_id: 'clinical-outcomes',
    topic: 'Discharge disposition and post-acute care needs after AMR infections',
    description: 'Study discharge patterns and post-acute care requirements following hospitalization for antimicrobial-resistant infections.',
    search_queries: ['discharge disposition AMR infections', 'post-acute care resistant infections', 'rehabilitation needs MDR patients', 'care transitions antimicrobial resistance']
  },
  {
    division_id: 'clinical-outcomes',
    topic: 'Patient satisfaction and experience with resistant infection care',
    description: 'Examine patient satisfaction and care experience measures in patients treated for antimicrobial-resistant infections.',
    search_queries: ['patient satisfaction AMR care', 'patient experience resistant infection treatment', 'care satisfaction MDR patients', 'patient-centered care antimicrobial resistance']
  },

  // Genomics & Evolution Division (21 tasks)
  {
    division_id: 'genomics-evolution',
    topic: 'Whole genome sequencing of multidrug-resistant pathogens',
    description: 'Analyze whole genome sequencing applications for characterizing multidrug-resistant pathogens and resistance mechanisms.',
    search_queries: ['whole genome sequencing MDR pathogens', 'WGS antimicrobial resistance', 'genomic characterization resistant bacteria', 'resistance genome analysis']
  },
  {
    division_id: 'genomics-evolution',
    topic: 'Phylogenetic analysis of resistance gene evolution',
    description: 'Study phylogenetic relationships and evolutionary patterns of antimicrobial resistance genes across bacterial species.',
    search_queries: ['phylogenetic analysis resistance genes', 'resistance gene evolution', 'phylogeny antimicrobial resistance', 'evolutionary tree resistance']
  },
  {
    division_id: 'genomics-evolution',
    topic: 'Horizontal gene transfer mechanisms in AMR',
    description: 'Investigate horizontal gene transfer mechanisms facilitating the spread of antimicrobial resistance genes.',
    search_queries: ['horizontal gene transfer AMR', 'HGT antimicrobial resistance', 'resistance gene transfer mechanisms', 'lateral gene transfer resistance']
  },
  {
    division_id: 'genomics-evolution',
    topic: 'Resistome analysis in clinical and environmental samples',
    description: 'Examine the resistome (collection of resistance genes) in clinical specimens and environmental samples.',
    search_queries: ['resistome analysis clinical samples', 'environmental resistome', 'resistance gene profiling', 'metagenomic resistome']
  },
  {
    division_id: 'genomics-evolution',
    topic: 'Mobile genetic elements and resistance dissemination',
    description: 'Study mobile genetic elements (plasmids, transposons, integrons) in disseminating antimicrobial resistance.',
    search_queries: ['mobile genetic elements AMR', 'plasmids antimicrobial resistance', 'transposons resistance dissemination', 'integrons resistance genes']
  },
  {
    division_id: 'genomics-evolution',
    topic: 'Evolutionary pressure of antimicrobial use on resistance',
    description: 'Analyze how antimicrobial use creates evolutionary pressure leading to resistance development and selection.',
    search_queries: ['evolutionary pressure antimicrobial use', 'selection pressure antibiotic resistance', 'antimicrobial evolution pressure', 'resistance evolution antimicrobials']
  },
  {
    division_id: 'genomics-evolution',
    topic: 'Comparative genomics of resistant vs susceptible strains',
    description: 'Compare genomes of antimicrobial-resistant and susceptible bacterial strains to identify resistance determinants.',
    search_queries: ['comparative genomics resistant susceptible', 'genome comparison AMR', 'resistant strain genomics', 'susceptible vs resistant genomes']
  },
  {
    division_id: 'genomics-evolution',
    topic: 'Single nucleotide polymorphisms in antimicrobial resistance',
    description: 'Study single nucleotide polymorphisms (SNPs) associated with antimicrobial resistance development.',
    search_queries: ['SNPs antimicrobial resistance', 'single nucleotide polymorphisms AMR', 'resistance SNP analysis', 'genomic variants resistance']
  },
  {
    division_id: 'genomics-evolution',
    topic: 'Pangenome analysis of antimicrobial-resistant bacteria',
    description: 'Examine pangenomes of antimicrobial-resistant bacterial species to understand core and accessory resistance elements.',
    search_queries: ['pangenome analysis resistant bacteria', 'bacterial pangenome AMR', 'core accessory genome resistance', 'pangenomics antimicrobial resistance']
  },
  {
    division_id: 'genomics-evolution',
    topic: 'Metagenomics of antimicrobial resistance in microbiomes',
    description: 'Study antimicrobial resistance genes and their distribution in human and environmental microbiomes using metagenomics.',
    search_queries: ['metagenomics antimicrobial resistance', 'microbiome resistome', 'metagenomic resistance analysis', 'microbiome AMR genes']
  },
  {
    division_id: 'genomics-evolution',
    topic: 'Colistin resistance evolution and mcr gene spread',
    description: 'Investigate the evolution of colistin resistance, particularly focusing on mcr gene variants and their global dissemination.',
    search_queries: ['colistin resistance evolution mcr genes', 'mcr gene evolution', 'polymyxin resistance evolution', 'colistin resistance phylogeny']
  },
  {
    division_id: 'genomics-evolution',
    topic: 'Carbapenemase gene evolution and diversity',
    description: 'Analyze the evolution and genetic diversity of carbapenemase genes including NDM, KPC, OXA-48, and VIM families.',
    search_queries: ['carbapenemase gene evolution', 'NDM KPC evolution', 'carbapenemase diversity', 'beta-lactamase gene phylogeny']
  },
  {
    division_id: 'genomics-evolution',
    topic: 'ESBL gene evolution and global spread',
    description: 'Study the evolution and worldwide dissemination of extended-spectrum β-lactamase genes, particularly CTX-M variants.',
    search_queries: ['ESBL gene evolution', 'CTX-M evolution', 'extended-spectrum beta-lactamase phylogeny', 'ESBL global spread']
  },
  {
    division_id: 'genomics-evolution',
    topic: 'Vancomycin resistance gene cluster evolution',
    description: 'Examine the evolution of vancomycin resistance gene clusters (vanA, vanB, etc.) in enterococci and other bacteria.',
    search_queries: ['vancomycin resistance gene evolution', 'vanA vanB evolution', 'VRE gene cluster phylogeny', 'glycopeptide resistance evolution']
  },
  {
    division_id: 'genomics-evolution',
    topic: 'Fluoroquinolone resistance evolution mechanisms',
    description: 'Study the evolutionary pathways leading to fluoroquinolone resistance, including target gene mutations and efflux systems.',
    search_queries: ['fluoroquinolone resistance evolution', 'quinolone resistance evolution', 'gyrA parC evolution', 'fluoroquinolone resistance phylogeny']
  },
  {
    division_id: 'genomics-evolution',
    topic: 'Molecular clock analysis of resistance gene evolution',
    description: 'Apply molecular clock methodologies to estimate evolutionary timescales of antimicrobial resistance gene emergence.',
    search_queries: ['molecular clock resistance genes', 'resistance evolution timescales', 'evolutionary rate AMR genes', 'resistance gene dating']
  },
  {
    division_id: 'genomics-evolution',
    topic: 'Population genomics of antimicrobial-resistant pathogens',
    description: 'Study population-level genomic variations and structures in antimicrobial-resistant pathogen populations.',
    search_queries: ['population genomics resistant pathogens', 'AMR population genetics', 'resistant pathogen population structure', 'genomic epidemiology AMR']
  },
  {
    division_id: 'genomics-evolution',
    topic: 'Ancient DNA and historical antimicrobial resistance',
    description: 'Investigate historical antimicrobial resistance using ancient DNA techniques to understand pre-antibiotic resistance.',
    search_queries: ['ancient DNA antimicrobial resistance', 'historical AMR evolution', 'pre-antibiotic resistance', 'ancient resistance genes']
  },
  {
    division_id: 'genomics-evolution',
    topic: 'Machine learning for resistance gene prediction',
    description: 'Apply machine learning approaches to predict antimicrobial resistance from genomic data and identify novel resistance determinants.',
    search_queries: ['machine learning resistance prediction', 'AI genomics antimicrobial resistance', 'predictive modeling AMR genes', 'computational resistance genomics']
  },
  {
    division_id: 'genomics-evolution',
    topic: 'Structural variation and antimicrobial resistance',
    description: 'Study large-scale structural variations (insertions, deletions, inversions) and their role in antimicrobial resistance evolution.',
    search_queries: ['structural variation antimicrobial resistance', 'genomic rearrangements AMR', 'large indels resistance', 'chromosomal variation resistance']
  },
  {
    division_id: 'genomics-evolution',
    topic: 'Adaptive evolution under antimicrobial pressure',
    description: 'Examine adaptive evolutionary responses in bacterial populations under antimicrobial selective pressure.',
    search_queries: ['adaptive evolution antimicrobial pressure', 'bacterial adaptation antibiotics', 'evolutionary adaptation resistance', 'antimicrobial selective pressure evolution']
  },

  // Economic Impact Division (16 tasks)
  {
    division_id: 'economic-impact',
    topic: 'Healthcare costs of antimicrobial-resistant infections',
    description: 'Quantify the direct and indirect healthcare costs associated with antimicrobial-resistant infections.',
    search_queries: ['healthcare costs AMR infections', 'economic burden resistant bacteria', 'AMR healthcare expenditure', 'costs multidrug-resistant infections']
  },
  {
    division_id: 'economic-impact',
    topic: 'Productivity losses from antimicrobial resistance',
    description: 'Estimate productivity losses due to antimicrobial-resistant infections, including lost work days and reduced economic output.',
    search_queries: ['productivity losses AMR', 'economic productivity antimicrobial resistance', 'workforce impact resistant infections', 'AMR productivity burden']
  },
  {
    division_id: 'economic-impact',
    topic: 'Cost-effectiveness of antimicrobial stewardship programs',
    description: 'Analyze the cost-effectiveness of antimicrobial stewardship interventions in reducing resistance and healthcare costs.',
    search_queries: ['cost-effectiveness antimicrobial stewardship', 'economic evaluation stewardship programs', 'ASP cost-benefit analysis', 'stewardship economic impact']
  },
  {
    division_id: 'economic-impact',
    topic: 'Market failures in antimicrobial drug development',
    description: 'Examine market failures that discourage private investment in antimicrobial drug development.',
    search_queries: ['market failures antimicrobial development', 'antibiotic market failures', 'economic incentives antimicrobial R&D', 'AMR market dynamics']
  },
  {
    division_id: 'economic-impact',
    topic: 'Global economic projections of antimicrobial resistance',
    description: 'Study global economic projections and models predicting the future economic impact of antimicrobial resistance.',
    search_queries: ['global economic projections AMR', 'worldwide AMR economic impact', 'future economic burden resistance', 'AMR economic modeling']
  },
  {
    division_id: 'economic-impact',
    topic: 'Insurance and reimbursement impacts of AMR',
    description: 'Examine how antimicrobial resistance affects health insurance costs and reimbursement patterns.',
    search_queries: ['insurance costs AMR', 'health insurance antimicrobial resistance', 'reimbursement patterns resistant infections', 'AMR insurance burden']
  },
  {
    division_id: 'economic-impact',
    topic: 'Economic burden in low- and middle-income countries',
    description: 'Assess the economic burden of antimicrobial resistance specifically in low- and middle-income countries.',
    search_queries: ['economic burden AMR LMIC', 'AMR costs developing countries', 'antimicrobial resistance economic impact low-income', 'LMIC AMR economic burden']
  },
  {
    division_id: 'economic-impact',
    topic: 'Cost of novel antimicrobial therapies vs resistance burden',
    description: 'Compare the costs of developing and using novel antimicrobial therapies against the economic burden of resistance.',
    search_queries: ['novel antimicrobial costs vs AMR burden', 'new antibiotic development costs', 'cost comparison AMR interventions', 'economic value new antimicrobials']
  },
  {
    division_id: 'economic-impact',
    topic: 'Economic incentives for antimicrobial conservation',
    description: 'Study economic incentive mechanisms designed to promote antimicrobial conservation and appropriate use.',
    search_queries: ['economic incentives antimicrobial conservation', 'financial incentives appropriate antibiotic use', 'market-based AMR interventions', 'conservation economic incentives']
  },
  {
    division_id: 'economic-impact',
    topic: 'Value of antimicrobials as a global public good',
    description: 'Analyze the economic value of antimicrobials as a global public good and implications for sustainable use.',
    search_queries: ['antimicrobials global public good', 'economic value antimicrobial effectiveness', 'public good antimicrobials', 'sustainability antimicrobial resource']
  },
  {
    division_id: 'economic-impact',
    topic: 'Economic modeling of AMR intervention strategies',
    description: 'Develop and validate economic models for evaluating different antimicrobial resistance intervention strategies.',
    search_queries: ['economic modeling AMR interventions', 'AMR intervention economic evaluation', 'resistance intervention cost models', 'economic analysis AMR strategies']
  },
  {
    division_id: 'economic-impact',
    topic: 'Pharmaceutical industry economics and antimicrobial R&D',
    description: 'Examine pharmaceutical industry economics affecting investment in antimicrobial research and development.',
    search_queries: ['pharmaceutical economics antimicrobial R&D', 'pharma industry antibiotic development', 'antimicrobial R&D investment economics', 'drug industry AMR economics']
  },
  {
    division_id: 'economic-impact',
    topic: 'Health technology assessment of AMR diagnostics',
    description: 'Conduct health technology assessments of diagnostic technologies for antimicrobial resistance detection.',
    search_queries: ['health technology assessment AMR diagnostics', 'HTA antimicrobial resistance testing', 'economic evaluation AMR diagnostics', 'diagnostic technology cost-effectiveness AMR']
  },
  {
    division_id: 'economic-impact',
    topic: 'Supply chain economics and antimicrobial access',
    description: 'Study supply chain economics affecting access to quality antimicrobials and their relationship to resistance development.',
    search_queries: ['supply chain economics antimicrobials', 'antimicrobial access economics', 'drug supply chain AMR', 'access economics antibiotics']
  },
  {
    division_id: 'economic-impact',
    topic: 'Economic impact of AMR on surgical procedures',
    description: 'Assess the economic impact of antimicrobial resistance on surgical procedures and post-operative care.',
    search_queries: ['economic impact AMR surgery', 'surgical costs antimicrobial resistance', 'AMR economic burden surgical care', 'resistant infections surgery costs']
  },
  {
    division_id: 'economic-impact',
    topic: 'Pull incentives and market entry rewards for antimicrobials',
    description: 'Evaluate pull incentive mechanisms including market entry rewards designed to stimulate antimicrobial development.',
    search_queries: ['pull incentives antimicrobial development', 'market entry rewards antibiotics', 'AMR pull mechanisms', 'incentive design antimicrobial innovation']
  },

  // Vaccines & Prevention Division (16 tasks)
  {
    division_id: 'vaccines-prevention',
    topic: 'Pneumococcal vaccines and antibiotic resistance prevention',
    description: 'Evaluate the impact of pneumococcal conjugate vaccines on reducing antibiotic-resistant Streptococcus pneumoniae infections.',
    search_queries: ['pneumococcal vaccines antibiotic resistance', 'PCV13 PCV20 resistance prevention', 'pneumococcal conjugate vaccine AMR', 'pneumonia vaccine resistance reduction']
  },
  {
    division_id: 'vaccines-prevention',
    topic: 'Haemophilus influenzae vaccines and AMR reduction',
    description: 'Study the role of Haemophilus influenzae type b (Hib) vaccines in reducing antimicrobial-resistant H. influenzae infections.',
    search_queries: ['Haemophilus influenzae vaccine AMR', 'Hib vaccine antibiotic resistance', 'H. influenzae vaccine resistance prevention', 'Haemophilus vaccine AMR reduction']
  },
  {
    division_id: 'vaccines-prevention',
    topic: 'Meningococcal vaccines and antimicrobial resistance',
    description: 'Examine meningococcal vaccination programs and their impact on reducing antimicrobial use and resistance.',
    search_queries: ['meningococcal vaccines AMR', 'meningitis vaccine antibiotic resistance', 'Neisseria meningitidis vaccine resistance', 'meningococcal vaccine antimicrobial use']
  },
  {
    division_id: 'vaccines-prevention',
    topic: 'Influenza vaccination and secondary bacterial infection prevention',
    description: 'Study influenza vaccination in preventing secondary bacterial infections and associated antimicrobial use.',
    search_queries: ['influenza vaccine secondary bacterial infections', 'flu vaccine antibiotic use reduction', 'influenza vaccination AMR prevention', 'seasonal flu vaccine resistance']
  },
  {
    division_id: 'vaccines-prevention',
    topic: 'Rotavirus vaccines and antimicrobial use reduction',
    description: 'Analyze the impact of rotavirus vaccination on reducing diarrheal disease and associated antimicrobial use.',
    search_queries: ['rotavirus vaccine antimicrobial use reduction', 'rotavirus vaccination antibiotic reduction', 'diarrheal disease vaccine AMR', 'rotavirus vaccine resistance prevention']
  },
  {
    division_id: 'vaccines-prevention',
    topic: 'Vaccines targeting antimicrobial-resistant pathogens',
    description: 'Investigate vaccine development specifically targeting antimicrobial-resistant pathogens like MRSA, VRE, and CRE.',
    search_queries: ['vaccines targeting resistant pathogens', 'MRSA vaccine development', 'VRE CRE vaccine research', 'AMR pathogen vaccines']
  },
  {
    division_id: 'vaccines-prevention',
    topic: 'Universal vaccination strategies for AMR prevention',
    description: 'Examine universal vaccination strategies and their potential for preventing antimicrobial-resistant infections.',
    search_queries: ['universal vaccination AMR prevention', 'population vaccination resistance reduction', 'mass vaccination antimicrobial resistance', 'universal immunization AMR']
  },
  {
    division_id: 'vaccines-prevention',
    topic: 'Vaccine-induced herd immunity and AMR reduction',
    description: 'Study how vaccine-induced herd immunity contributes to reducing antimicrobial-resistant pathogen transmission.',
    search_queries: ['herd immunity AMR reduction', 'vaccine herd immunity resistance', 'population immunity antimicrobial resistance', 'indirect vaccine effects AMR']
  },
  {
    division_id: 'vaccines-prevention',
    topic: 'Therapeutic vaccines for antimicrobial-resistant infections',
    description: 'Investigate therapeutic vaccine approaches for treating or managing antimicrobial-resistant infections.',
    search_queries: ['therapeutic vaccines resistant infections', 'treatment vaccines AMR', 'immunotherapy antimicrobial resistance', 'therapeutic immunization AMR']
  },
  {
    division_id: 'vaccines-prevention',
    topic: 'Passive immunization strategies for AMR prevention',
    description: 'Examine passive immunization approaches including monoclonal antibodies for preventing antimicrobial-resistant infections.',
    search_queries: ['passive immunization AMR prevention', 'monoclonal antibodies resistant infections', 'passive immunity antimicrobial resistance', 'antibody therapy AMR']
  },
  {
    division_id: 'vaccines-prevention',
    topic: 'Vaccine development challenges for resistant pathogens',
    description: 'Study technical and scientific challenges in developing vaccines against antimicrobial-resistant pathogens.',
    search_queries: ['vaccine development challenges AMR', 'resistant pathogen vaccine obstacles', 'AMR vaccine development barriers', 'vaccine design resistant bacteria']
  },
  {
    division_id: 'vaccines-prevention',
    topic: 'Cost-effectiveness of vaccination for AMR prevention',
    description: 'Analyze the cost-effectiveness of vaccination programs in preventing antimicrobial resistance.',
    search_queries: ['cost-effectiveness vaccination AMR prevention', 'vaccine economic evaluation resistance', 'vaccination cost-benefit AMR', 'economic analysis vaccine AMR']
  },
  {
    division_id: 'vaccines-prevention',
    topic: 'Maternal immunization and neonatal AMR prevention',
    description: 'Study maternal vaccination strategies for preventing antimicrobial-resistant infections in newborns.',
    search_queries: ['maternal immunization AMR prevention', 'maternal vaccination neonatal resistance', 'pregnancy vaccination AMR', 'maternal antibodies resistant infections']
  },
  {
    division_id: 'vaccines-prevention',
    topic: 'Travel vaccines and antimicrobial resistance prevention',
    description: 'Examine travel vaccination recommendations and their role in preventing acquisition of antimicrobial-resistant pathogens.',
    search_queries: ['travel vaccines AMR prevention', 'travel immunization resistant pathogens', 'vaccination travel medicine AMR', 'pre-travel vaccines resistance']
  },
  {
    division_id: 'vaccines-prevention',
    topic: 'Vaccine hesitancy impacts on AMR prevention',
    description: 'Study how vaccine hesitancy affects vaccination coverage and undermines antimicrobial resistance prevention efforts.',
    search_queries: ['vaccine hesitancy AMR prevention', 'vaccination coverage resistance prevention', 'vaccine acceptance antimicrobial resistance', 'immunization hesitancy AMR']
  },
  {
    division_id: 'vaccines-prevention',
    topic: 'Novel vaccine platforms for AMR prevention',
    description: 'Investigate novel vaccine platforms and technologies for preventing antimicrobial-resistant infections.',
    search_queries: ['novel vaccine platforms AMR', 'innovative vaccines resistant pathogens', 'new vaccine technologies resistance', 'advanced vaccine approaches AMR']
  }
];

// Generate task IDs and count tasks per division
AMR_TASKS.forEach(task => {
  task.id = crypto.randomUUID();
  task.mission_id = AMR_MISSION.id;
  task.status = 'pending';
  task.is_synthesis = false;
  task.created_at = new Date().toISOString();
  
  // Count tasks per division
  const division = AMR_DIVISIONS.find(d => d.id === task.division_id);
  if (division) {
    division.task_count++;
  }
});

console.log(`Generated ${AMR_TASKS.length} AMR research tasks across ${AMR_DIVISIONS.length} divisions`);

// Export the mission data
module.exports = {
  AMR_MISSION,
  AMR_DIVISIONS,
  AMR_TASKS
};