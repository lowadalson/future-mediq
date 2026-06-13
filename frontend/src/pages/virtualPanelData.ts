// MediQ — Featured Gut Health Series: 10 universal questions answered by each specialist
export const GUT_QUESTIONS: string[] = [
  "What is the gut microbiome and why does it matter for overall health?",
  "How does the gut communicate with the brain (the gut-brain axis)?",
  "What are the signs of a healthy versus an unhealthy gut?",
  "How does diet shape the gut microbiome?",
  "What causes irritable bowel syndrome (IBS) and how is it managed?",
  "Can gut bacteria directly influence heart disease risk?",
  "How does gut health in childhood shape long-term wellbeing?",
  "What is 'leaky gut' — is it real and what does it mean clinically?",
  "How does chronic stress damage the gut?",
  "Do probiotics and prebiotics actually work?",
];

// Kept for backward compatibility — all specialties share the gut questions
export const SPECIALTY_QUESTIONS: Record<string, string[]> = {
  Cardiology:  GUT_QUESTIONS,
  Neurology:   GUT_QUESTIONS,
  Paediatrics: GUT_QUESTIONS,
};

// Gut-health responses per specialty — each answers the same 10 gut questions from their clinical angle
const RESP: Record<string, string[]> = {
  Cardiology: [
    // Q0: What is the gut microbiome?
    "From a cardiovascular standpoint, the gut microbiome is a critical modulator of systemic inflammation — a key driver of atherosclerosis. Gut bacteria metabolise dietary choline and carnitine (found in red meat and eggs) into trimethylamine N-oxide (TMAO), a compound strongly associated with increased risk of myocardial infarction, stroke, and heart failure. Patients with diverse, high-fibre diets show lower TMAO levels and significantly better cardiovascular outcomes. The microbiome is not just a digestive tool — it is an endocrine organ with profound cardiac implications.",
    // Q1: Gut-brain axis
    "The gut-brain axis intersects with cardiovascular autonomic regulation in ways we are only beginning to understand. The vagus nerve — the primary highway of the gut-brain axis — also governs cardiac rate variability, a key marker of cardiovascular health and resilience. Gut dysbiosis drives systemic inflammation that directly promotes endothelial dysfunction and arterial stiffness. Short-chain fatty acids produced by healthy gut bacteria reduce systemic vascular resistance and blood pressure. A well-regulated gut microbiome is, in effect, a cardiovascular protective mechanism.",
    // Q2: Signs of healthy vs unhealthy gut
    "From a cardiologist's perspective, the most clinically significant signs of poor gut health are elevated inflammatory markers — CRP, IL-6, TNF-alpha — all of which directly promote coronary artery disease. Gut dysbiosis is associated with higher TMAO, LPS endotoxaemia, and systemic oxidative stress. Patients with chronic constipation, bloating, or food intolerances often show worse lipid profiles and endothelial function markers. The gut and heart share the systemic inflammatory milieu — treat the gut and you protect the heart.",
    // Q3: Diet and gut microbiome
    "A Mediterranean-style diet — rich in vegetables, legumes, whole grains, olive oil, and fish — simultaneously optimises the gut microbiome and reduces cardiovascular risk. High dietary fibre feeds Bifidobacterium and Lactobacillus species that produce cardioprotective butyrate and propionate. Ultra-processed foods, high in emulsifiers and refined sugars, deplete microbial diversity and elevate TMAO precursors. The PREDIMED trial demonstrated that a Mediterranean diet reduced major cardiovascular events by ~30% — its gut microbiome effects are a plausible mechanistic pathway.",
    // Q4: IBS
    "IBS is increasingly recognised as a condition with cardiovascular autonomic overlap. Many IBS patients show impaired cardiac vagal tone — measured as reduced heart rate variability — reflecting shared dysregulation of the autonomic nervous system. The chronic low-grade inflammation in IBS may contribute to endothelial dysfunction over time. Interestingly, FODMAP-restricted diets used to manage IBS also reduce fermentation-derived TMAO precursors, potentially offering incidental cardiovascular benefit. IBS is not merely a gastrointestinal nuisance — it signals systemic regulatory imbalance.",
    // Q5: Gut bacteria and heart disease
    "The gut-cardiac axis is now strongly evidence-based. TMAO — produced when gut bacteria metabolise lecithin, choline, and L-carnitine — promotes cholesterol accumulation in macrophages within arterial plaques, inhibits reverse cholesterol transport, and activates platelet aggregation. Clinical studies show TMAO levels independently predict 3-fold increased risk of major adverse cardiovascular events, even after adjusting for traditional risk factors. Dietary interventions reducing red meat intake and increasing plant fibre measurably lower TMAO within weeks — a direct dietary pathway to cardiovascular protection.",
    // Q6: Childhood gut health
    "The gut microbiome established in the first two years of life shapes cardiovascular risk trajectories across the lifespan. Children born by caesarean section, formula-fed, or exposed to early antibiotics have less diverse microbiomes with higher proportions of TMAO-producing bacteria. These differences in microbiome composition at age 2 correlate with measurable differences in inflammatory markers and blood pressure by adolescence. Promoting breastfeeding, diverse early nutrition, and judicious antibiotic use in childhood is an investment in lifetime cardiovascular health.",
    // Q7: Leaky gut
    "Intestinal permeability — 'leaky gut' — allows lipopolysaccharide (LPS), bacterial fragments from gram-negative gut bacteria, to translocate into the systemic circulation. LPS binds to TLR-4 receptors on endothelial cells, triggering nuclear factor-kB activation and a pro-inflammatory, pro-atherogenic state. Elevated serum LPS levels have been measured in patients with established coronary artery disease. This mechanism — metabolic endotoxaemia — represents a direct structural link between gut permeability and cardiovascular disease pathogenesis.",
    // Q8: Stress and gut
    "Chronic psychological stress activates the sympathetic nervous system and HPA axis, releasing cortisol and catecholamines that impair intestinal tight junctions — increasing gut permeability. The resulting LPS translocation drives systemic inflammation, directly accelerating atherogenesis. Stress-induced gut dysbiosis also elevates TMAO production and reduces cardioprotective short-chain fatty acid synthesis. This creates a vicious cycle: cardiovascular disease causes psychological distress, which worsens gut health, which worsens cardiovascular disease. Managing stress is not optional in cardiac prevention — it is mechanistically essential.",
    // Q9: Probiotics and prebiotics
    "The cardiovascular evidence for specific probiotic strains is emerging. Lactobacillus reuteri NCIMB 30242 has reduced total LDL cholesterol by ~12% in randomised trials. Fermented dairy products have been associated with lower blood pressure in population studies, likely through peptide ACE-inhibitor-like activity. Prebiotic fibres — inulin, pectin, beta-glucan — consistently lower LDL and reduce systemic inflammation. The field is evolving rapidly: personalised microbiome-targeted therapy to reduce TMAO production is a realistic near-term clinical tool in cardiovascular prevention.",
  ],
  Neurology: [
    // Q0: What is the gut microbiome?
    "The gut microbiome is the ecosystem of approximately 100 trillion microorganisms residing in the gastrointestinal tract — outnumbering human cells 10 to 1. From a neurological perspective, the microbiome is effectively a distributed endocrine organ: it synthesises approximately 90% of the body's serotonin, precursors to dopamine and GABA, and short-chain fatty acids that modulate neuroinflammation. The enteric nervous system — 500 million neurons lining the gut — processes sensory information and communicates bidirectionally with the brain via the vagus nerve. A healthy microbiome is a prerequisite for neurological homeostasis.",
    // Q1: Gut-brain axis
    "The gut-brain axis is a bidirectional communication network involving three parallel systems: the vagus nerve (direct neural highway), the immune system (microbial metabolites modulate microglial activation and neuroinflammation), and the endocrine system (gut hormones including GLP-1, PYY, and serotonin). The microbiome regulates the blood-brain barrier integrity through short-chain fatty acid production and directly shapes tryptophan metabolism — the precursor to serotonin. Dysbiosis disrupts all three pathways simultaneously, contributing to depression, anxiety, cognitive impairment, and neurodegeneration.",
    // Q2: Signs of healthy vs unhealthy gut
    "Neurologically, the most important sign of gut dysbiosis is brain fog — impaired working memory, attention, and mental clarity — which patients consistently describe before any gastrointestinal symptoms appear. Gut dysbiosis reduces butyrate production, impairing intestinal barrier function and allowing LPS to enter systemic circulation, where it crosses a compromised blood-brain barrier and activates microglia — the brain's immune cells. Microglial hyperactivation drives neuroinflammation implicated in Alzheimer's disease, Parkinson's disease, and major depression. The gut is the brain's first line of inflammatory defence.",
    // Q3: Diet and gut microbiome
    "Dietary diversity is the strongest predictor of microbiome diversity, and microbiome diversity is associated with cognitive resilience and reduced neurological disease risk. Polyphenol-rich foods — berries, dark chocolate, olive oil, green tea — selectively feed Akkermansia muciniphila and Bifidobacterium species that produce neuroprotective metabolites. The MIND diet (Mediterranean-DASH Intervention for Neurodegenerative Delay) has been associated with 53% lower Alzheimer's risk in adherent individuals. Conversely, ultra-processed foods reduce Lactobacillus populations within 72 hours of increased consumption — a neurologically damaging shift.",
    // Q4: IBS
    "IBS is fundamentally a gut-brain axis disorder. Central sensitisation — where the brain amplifies visceral pain signals from the gut — explains why IBS symptoms are exacerbated by stress and anxiety, and why antidepressants have proven efficacy in IBS management. The enteric nervous system in IBS patients shows altered serotonin signalling — the same neurotransmitter dysregulated in depression and anxiety. IBS is now understood as a spectrum condition with major neuropsychiatric co-morbidity; treating the psychological component is not ancillary but central to effective IBS management.",
    // Q5: Gut bacteria and heart disease
    "Neurologically, the cardiac-gut connection matters because cardiovascular disease is among the strongest risk factors for vascular dementia and cognitive decline. Gut-derived TMAO accelerates atherosclerosis in cerebral vessels as effectively as coronary vessels, directly raising stroke and vascular dementia risk. Additionally, the systemic inflammation generated by gut dysbiosis damages the cerebral endothelium and accelerates blood-brain barrier breakdown — the key pathological step in neurodegeneration. Protecting gut health is simultaneously a strategy for neuroprotection and cardiac protection.",
    // Q6: Childhood gut health
    "The first 1000 days of life represent a critical window for gut microbiome establishment that has lifelong neurological consequences. The infant microbiome is progressively colonised from birth onward, shaped by mode of delivery (vaginal vs caesarean), breastfeeding, and early dietary diversity. Key gut bacteria produce butyrate and short-chain fatty acids that drive myelination, microglial maturation, and blood-brain barrier formation. Disruption during this window — through antibiotics, formula dominance, or dietary monotony — has been associated with increased rates of autism spectrum disorder, ADHD, anxiety, and depression in childhood.",
    // Q7: Leaky gut
    "Increased intestinal permeability — leaky gut — allows gut-derived LPS endotoxin to enter systemic circulation, where it readily crosses a compromised blood-brain barrier and activates microglia. Microglial activation by LPS triggers release of TNF-alpha, IL-1beta, and IL-6 — the exact neuroinflammatory mediators implicated in Alzheimer's disease pathogenesis. Critically, α-synuclein — the pathological protein in Parkinson's disease — may originate in enteric neurons before propagating via the vagus nerve to the brainstem and cortex, a gut-first model of Parkinson's pathogenesis supported by growing evidence.",
    // Q8: Stress and gut
    "Chronic stress activates the HPA axis, releasing cortisol that directly disrupts intestinal tight junction proteins (occludin, claudin), increasing gut permeability. The resulting endotoxaemia drives neuroinflammation and depletes brain-derived neurotrophic factor (BDNF) — essential for neuronal survival and plasticity. This gut-stress-neuroinflammation loop is central to the pathophysiology of depression and anxiety. Importantly, bidirectionality means that gut-targeted therapies (dietary intervention, probiotics) can reduce HPA axis reactivity and improve depression outcomes, working via a completely different mechanism than antidepressants.",
    // Q9: Probiotics and prebiotics
    "The concept of 'psychobiotics' — probiotics that target mental health outcomes — is now scientifically established. Lactobacillus rhamnosus and Bifidobacterium longum reduce anxiety-like behaviour and lower HPA axis reactivity in animal models, with emerging human clinical evidence. A 2019 systematic review found that multi-strain probiotic supplementation reduced depression scores comparably to lifestyle interventions. Prebiotics — particularly galacto-oligosaccharides — reduce the cortisol awakening response, a measure of stress reactivity. These are not fringe interventions; they are part of an emerging psychobiotic pharmacopoeia with genuine clinical promise.",
  ],
  Paediatrics: [
    // Q0: What is the gut microbiome?
    "In paediatric practice, the gut microbiome is understood as the most critical determinant of immune system programming in the first two years of life. Approximately 70% of the immune system resides in gut-associated lymphoid tissue (GALT), and the microbial colonisation pattern established from birth determines the Th1/Th2 immune balance, regulatory T-cell development, and lifelong allergy and autoimmune risk. Children born vaginally acquire a rich Lactobacillus-dominant microbiome from their mother. Caesarean-born infants are colonised by skin and environmental bacteria — a less immunologically optimal starting point.",
    // Q1: Gut-brain axis
    "In children, the gut-brain axis is particularly active during neurodevelopmental sensitive periods. The microbiome produces neuroactive compounds — serotonin, dopamine precursors, GABA — that directly influence developing brain circuits during early childhood. Germ-free animal studies show that absence of gut microbiota impairs social behaviour, anxiety regulation, and myelination. In children with autism spectrum disorder, gut dysbiosis is consistently observed — higher Clostridia, lower Bifidobacterium. Whether gut dysbiosis contributes to ASD neurodevelopment or results from it remains debated, but dietary interventions targeting the microbiome show promising behavioural outcomes.",
    // Q2: Signs of healthy vs unhealthy gut
    "In children, the most practical signs of a healthy gut are: regular bowel movements (every 1–3 days), formed soft stools (Bristol Stool Score 3–4), good appetite and weight gain trajectory, minimal flatulence and bloating, and a positive relationship with varied foods. Red flags for gut dysbiosis include: chronic constipation or diarrhoea, recurrent unexplained abdominal pain, food refusal and extreme dietary restriction, frequent infections (suggesting impaired gut immunity), eczema and allergies, and poor growth. The gut and immune system are inseparable in paediatric health.",
    // Q3: Diet and gut microbiome
    "Breastfeeding is the single most powerful microbiome intervention in infancy. Breast milk contains human milk oligosaccharides (HMOs) — over 200 complex sugars that selectively feed Bifidobacterium infantis, the keystone species of the infant microbiome. From 6 months, diverse complementary food introduction — especially plant-based variety, fermented foods (unsweetened yoghurt), and minimal processed foods — progressively diversifies the microbiome. Children raised on high-diversity diets show greater microbiome stability, stronger mucosal immunity, and lower rates of obesity, allergy, and inflammatory bowel disease.",
    // Q4: IBS
    "Paediatric functional abdominal pain and IBS affect approximately 10–15% of school-age children and are the most common reason for paediatric gastroenterology referral. The gut-brain axis plays a central role: children with IBS typically show anxiety co-morbidity (40–50%), altered visceral pain thresholds, and abnormal gut motility driven by central sensitisation. First-line management includes: reassurance, dietary modification (low-FODMAP with dietitian guidance), fibre optimisation, gut-directed hypnotherapy (strong evidence in children), and addressing any underlying anxiety. Antibiotics are rarely indicated and may worsen long-term outcomes by disrupting the microbiome.",
    // Q5: Gut bacteria and heart disease
    "While cardiovascular disease manifests in adulthood, its gut-mediated origins begin in childhood. The microbiome composition at age 2 predicts BMI trajectory, insulin resistance, and LDL cholesterol levels in adolescence. TMAO-producing bacteria — Prevotella, certain Clostridiales — are detectable in childhood in children consuming high-meat diets, and elevated childhood TMAO correlates with early carotid intima-media thickness. This underlines the importance of establishing plant-rich, diverse dietary habits in childhood: the microbiome established by age 3 shows remarkable stability and influences cardiovascular risk decades later.",
    // Q6: Childhood gut health
    "The gut microbiome is most malleable and most critical in the first 1000 days of life — from conception to age 2. Mode of birth, breastfeeding duration, antibiotic exposure, and dietary diversity in this window collectively determine the microbiome architecture that will be carried into adulthood. Children who receive antibiotics more than 3 times in the first two years show persistently reduced Bifidobacterium and Lactobacillus diversity at age 7. Every unnecessary antibiotic prescription in a child is a microbiome intervention with lasting consequences. Clinicians must weigh this carefully.",
    // Q7: Leaky gut
    "Intestinal permeability in the newborn period is physiologically elevated — a developmental feature, not a pathology. The neonatal intestine begins tightening from birth, a process facilitated by breastfeeding, microbial colonisation, and secretory IgA. Premature infants have markedly elevated permeability, predisposing to necrotising enterocolitis (NEC) — a devastating inflammatory gut condition. In older children, pathologically increased permeability is associated with coeliac disease, Crohn's disease, and food protein-induced enteropathy. Measurement of faecal calprotectin, a non-invasive stool marker, is our primary paediatric tool for detecting gut mucosal inflammation.",
    // Q8: Stress and gut
    "Adverse childhood experiences (ACEs) — abuse, neglect, household dysfunction — have a profound and persistent impact on gut health. Chronic early-life stress activates the HPA axis and sympathetic nervous system, impairing intestinal barrier function and altering the gut microbiome toward a pro-inflammatory composition. Children with high ACE scores show higher rates of IBS, functional abdominal pain, inflammatory bowel disease, and food allergies — all conditions with gut permeability and dysbiosis at their core. The gut is where childhood trauma is physiologically inscribed. Psychosocial interventions for children must include a gut health framework.",
    // Q9: Probiotics and prebiotics
    "The paediatric evidence base for specific probiotic strains is the strongest in medicine. Lactobacillus reuteri DSM17938 reduces crying duration in infantile colic by ~50% at 3 weeks in randomised trials. Lactobacillus GG reduces rotavirus diarrhoea duration by 1–2 days. In premature infants, multi-strain probiotics reduce NEC incidence by up to 50% — a remarkable intervention. For HMO-based prebiotics in infant formula, microbiome diversification effects are well documented. The key message: strain specificity matters enormously. Generic 'probiotic' supplements without specified strains have weak evidence. Always ask: which strain, at what dose, for which indication?",
  ],
};

export function getResponse(specialty: string, questionIdx: number): string {
  return RESP[specialty]?.[questionIdx] ?? `From a ${specialty} perspective, this is an important question about gut health. The gut microbiome interacts with virtually every organ system, and evidence-based dietary and lifestyle interventions offer meaningful benefits. Always consult a qualified specialist for personalised medical advice.`;
}

// Cross-specialty reactions — gut-health focused
const REACTIONS: Record<string, Record<string, { score: number; comment: string }[]>> = {
  Neurology: {
    Cardiology: [
      { score: 4.5, comment: "Excellent TMAO framing. The neurological parallel is that TMAO also promotes cerebrovascular atherosclerosis, raising stroke and vascular dementia risk via the same pathway." },
      { score: 5, comment: "The vagal tone overlap is precisely right. Cardiac vagal tone and gut-brain vagal signalling share the same neural substrate — optimising one benefits both." },
      { score: 4.5, comment: "The LPS endotoxaemia mechanism is critical. This is the same pathway we now implicate in neuroinflammation and Alzheimer's pathogenesis." },
      { score: 4, comment: "Strong dietary evidence. I would add that the MIND diet, specifically targeting neurodegeneration, overlaps almost entirely with the cardiovascular microbiome-protective diet." },
      { score: 5, comment: "Completely aligned on the stress-gut-systemic inflammation loop. From neurology, this same pathway drives depression and anxiety through HPA dysregulation." },
      { score: 4.5, comment: "The TMAO-cardiovascular data is compelling. The parallel neurological risk through cerebrovascular disease reinforces why cardiologists and neurologists should share gut health messaging." },
      { score: 4, comment: "Excellent childhood framing. In neurodevelopment, the same microbiome diversity protects against ASD, ADHD, and anxiety — the overlap with cardiovascular protection is notable." },
      { score: 5, comment: "The LPS-endothelial dysfunction mechanism described here is the same pathway we see in blood-brain barrier breakdown and neuroinflammation." },
      { score: 4.5, comment: "The stress-tight junction pathway is well established. From neurology, cortisol-mediated BDNF depletion adds a further neurological dimension to the same mechanism." },
      { score: 4, comment: "The cardiovascular probiotic evidence is building. The neurological equivalent — psychobiotics — is advancing in parallel and may converge into a unified gut-targeted prevention strategy." },
    ],
    Paediatrics: [
      { score: 4, comment: "The immunological framing is excellent. From neurology, HMOs in breast milk also promote myelination and early neural connectivity — the benefits extend beyond immunity." },
      { score: 4.5, comment: "The paediatric IBS gut-brain axis framing is precisely correct. Central sensitisation in childhood IBS is the same mechanism we see in adult functional neurological syndromes." },
      { score: 5, comment: "The first 1000 days microbiome data is the most compelling argument for early life intervention across all specialties — neurology, cardiology, and paediatrics aligned." },
    ],
  },
  Paediatrics: {
    Cardiology: [
      { score: 4, comment: "Strong cardiovascular framing. In paediatrics, we extend this — the TMAO-producing microbiome established in childhood directly predicts adult cardiovascular risk." },
      { score: 4.5, comment: "The vagal tone connection is important. Cardiac vagal tone development occurs in infancy and is shaped by the very gut microbiome factors discussed here." },
      { score: 4, comment: "The inflammatory marker framing is clinically relevant. We see elevated CRP in children with poor gut health — the cardiovascular downstream effects begin early." },
      { score: 5, comment: "Mediterranean diet evidence is strong in adults. The paediatric equivalent is diverse early complementary feeding — the same dietary pattern adapted for developing palates." },
      { score: 4.5, comment: "The childhood TMAO data is emerging and important. This is why we advocate plant-rich early diets as a dual cardiovascular and gut microbiome strategy." },
    ],
    Neurology: [
      { score: 4.5, comment: "Excellent serotonin framing. In children, the same gut serotonin pathway influences mood, sleep, and appetite regulation — critical paediatric clinical targets." },
      { score: 5, comment: "The ASD-microbiome connection deserves emphasis. Gut-directed therapies are showing early but genuine promise in improving social behaviour in children with ASD." },
      { score: 4, comment: "Central sensitisation in IBS is well established. In paediatric practice, gut-directed hypnotherapy has stronger evidence than in adults — children's neuroplasticity works in our favour." },
      { score: 4.5, comment: "The ACEs-gut health data is sobering and aligns with our paediatric adversity data. This is a compelling argument for trauma-informed paediatric gut health care." },
      { score: 4, comment: "Psychobiotics in children are an exciting frontier. Lactobacillus strains improving colic, sleep, and anxiety in infants suggest very early gut-brain intervention is feasible." },
    ],
  },
  Cardiology: {
    Neurology: [
      { score: 4.5, comment: "The enteric serotonin point is fascinating. From cardiology, we note that serotonin also regulates platelet aggregation — a direct cardiovascular mechanism from gut-derived serotonin." },
      { score: 5, comment: "The Parkinson's gut-first hypothesis is compelling. From cardiology, cardiac Lewy bodies are found at autopsy in Parkinson's patients, suggesting a body-wide autonomic spread." },
      { score: 4, comment: "Psychobiotic evidence is encouraging. I would note emerging data on Lactobacillus strains reducing blood pressure variability — a shared cardiovascular-neurological benefit." },
      { score: 4.5, comment: "The LPS-microglial activation pathway described parallels our data on LPS-endothelial activation. The gut drives both neuroinflammation and vascular inflammation through the same initial trigger." },
      { score: 5, comment: "The HPA-tight junction pathway is mechanistically important. In cardiovascular medicine, cortisol-mediated gut permeability is an under-recognised driver of cardiometabolic inflammation." },
    ],
    Paediatrics: [
      { score: 4, comment: "Breastfeeding advocacy is fully supported. HMOs reducing inflammation has direct cardiovascular relevance — lower neonatal LPS exposure reduces lifetime inflammatory set-point." },
      { score: 4.5, comment: "Childhood microbiome data aligns with our adult cardiovascular findings. The TMAO-producing bacteria present in poorly-nourished children are the same ones we target in adult prevention." },
      { score: 5, comment: "Excellent NEC probiotic data. The principle of strain-specific probiotic therapy is equally applicable to adult cardiovascular microbiome interventions — specificity is everything." },
      { score: 4, comment: "The ACEs-gut health framing resonates. Childhood adversity predicts adult cardiovascular disease — and the gut microbiome disruption from chronic stress may be a key mechanistic link." },
    ],
  },
};

const DEFAULT_REACTIONS = [
  { score: 4, comment: "Well-reasoned gut health perspective. The multi-disciplinary approach to the microbiome adds important clinical nuance across organ systems." },
  { score: 4.5, comment: "Strong evidence base. The gut-systemic connection consistently emerges as central to prevention across all medical specialties." },
  { score: 4, comment: "Sound microbiome science. From my specialty's angle, the same pathways operate through different downstream mechanisms — reinforcing the shared importance of gut health." },
  { score: 5, comment: "Excellent and comprehensive. The gut health angle presented here aligns precisely with current evidence-based guidelines in our field." },
];

export function getReaction(reactorSpecialty: string, speakerSpecialty: string, questionIdx: number): { score: number; comment: string } {
  const pool = REACTIONS[reactorSpecialty]?.[speakerSpecialty] ?? DEFAULT_REACTIONS;
  return pool[questionIdx % pool.length];
}

// Returns deduplicated gut questions (not grouped by specialty, since all share the same list)
export function getAllQuestions(specialties: string[]): { question: string; specialty: string; idx: number }[] {
  if (specialties.length === 0) return GUT_QUESTIONS.map((q, i) => ({ question: q, specialty: "Gut Health", idx: i }));
  // Return once per question using the first specialist's specialty as label
  return GUT_QUESTIONS.map((q, i) => ({ question: q, specialty: "Gut Health Series", idx: i }));
}

// ── LLM Provider Panel Commentary ─────────────────────────────────────────────

export interface LLMProvider {
  id: string;
  name: string;
  fullName: string;
  color: string;
  bgColor: string;
  logo: string;
  responses: string[];
}

export const LLM_PROVIDERS: LLMProvider[] = [
  {
    id: "openai",
    name: "GPT-4o",
    fullName: "OpenAI GPT-4o",
    color: "#10A37F",
    bgColor: "#F0FDF8",
    logo: "✦",
    responses: [
      "The gut microbiome encodes ~3.3 million unique genes — 150× the human genome. Microbiome diversity (Shannon index) is the strongest single predictor of metabolic resilience. The American Gut Project (n=10,000+) confirms eating >30 plant species per week surpasses all other dietary microbiome interventions in diversity impact.",
      "Vagal afferent fibres carry 80–90% of gut-to-brain signals — the gut is predominantly speaking TO the brain. This explains why gut-targeted dietary therapy can improve mood and cognition without direct brain-directed treatment, and why the enteric nervous system is increasingly called 'the second brain'.",
      "Meta-analysis of 42 cohort studies confirms stool frequency (3×/day to 3×/week) and Bristol Stool Scale 3–4 correlate most strongly with high microbiome alpha-diversity. Elevated faecal calprotectin (>50 µg/g) is the most sensitive non-invasive marker of gut mucosal inflammation in clinical practice.",
      "The American Gut Project confirms >30 plant species per week is the strongest single predictor of microbiome diversity — outperforming vegetarianism, organic diet, or supplementation. Fermented foods (kimchi, yoghurt, kefir) independently increase microbiome diversity and reduce inflammatory proteins per 2021 Stanford RCT data.",
      "IBS affects 11% of the global population (650M+ people). Network meta-analysis shows low-FODMAP diet (NNT=4), gut-directed hypnotherapy (NNT=5), and tricyclic antidepressants (NNT=5) are most effective. Standard antispasmodics show NNT of 8–12. First-line management should be dietary before pharmacological.",
      "TMAO above 6 µmol/L independently predicts 3-fold MACE risk in the landmark NEJM 2013 cohort (n=4,007). Plant-based dietary shifts reduce TMAO within 4 weeks in 87% of individuals by altering the gut bacteria responsible for TMAO precursor metabolism — a direct dietary-cardiac intervention.",
      "The 'microbiome window' closes around age 2–3. C-section birth, formula feeding, and >3 antibiotic courses before age 2 each independently predict 20–40% higher adult obesity and allergic disease risk. These early-life microbiome perturbations have measurable epigenetic consequences lasting into adulthood.",
      "Intestinal permeability is objectively measurable via lactulose:mannitol ratio or serum zonulin. Elevated serum LPS (>0.4 EU/mL) is the most clinically meaningful marker of systemic endotoxaemia. This biomarker is detectable in early atherosclerosis, type 2 diabetes, and non-alcoholic fatty liver disease patients.",
      "Cortisol reduces Lactobacillus and Bifidobacterium counts by 40–60% and increases pro-inflammatory Proteobacteria within 24–72 hours of acute stress in controlled human studies. Chronic psychological stress is now classified as a quantifiable gut dysbiosis risk factor comparable in effect size to antibiotic exposure.",
      "Of 300+ studied probiotic strains, only ~20 have Level 1 RCT evidence for specific indications. Lactobacillus acidophilus NCFM + Bifidobacterium lactis Bi-07 has the strongest IBS-D evidence (NNT=3.5). Efficacy is entirely strain- and indication-specific — generic 'probiotic supplements' without specified strains have weak evidence.",
    ],
  },
  {
    id: "anthropic",
    name: "Claude",
    fullName: "Anthropic Claude 3.5",
    color: "#CC785C",
    bgColor: "#FDF5F2",
    logo: "◈",
    responses: [
      "What's often overlooked: 'the microbiome' is not a fixed entity — it shifts with every meal, stress event, and sleep cycle. This dynamism is both vulnerability and opportunity. Unlike genetics, it's genuinely modifiable, but requires sustained habits rather than quick interventions. Personalised microbiome testing is gaining clinical validity for this reason.",
      "The gut-brain axis inverts a foundational medical assumption — that the brain commands and the body obeys. If 90% of serotonin originates in the gut and 80% of vagal signals travel gut-to-brain, there's a compelling argument that psychiatry should start with dietary assessment before prescribing antidepressants.",
      "A healthy gut may be characterised less by specific biomarkers and more by resilience — the capacity to return to baseline after perturbation (antibiotics, illness, stress). Microbiome diversity is the structural basis of this resilience, mirroring how ecological biodiversity buffers ecosystems against collapse from external shocks.",
      "The 30-plants-per-week guideline deserves scrutiny: it conflates species diversity with consistent substrate provision. Daily consumption of 10 well-chosen plants may provide better microbiome support than 30 species consumed sporadically. The dose-frequency relationship for microbiome feeding is under-studied compared to the diversity metric.",
      "IBS may be less a disease of the gut and more a disease of the gut-brain relationship — specifically, an oversensitive bidirectional signalling system. This explains why psychological interventions often outperform pharmacological ones, and why 'it's in your head' is simultaneously wrong about origin and right about nervous system involvement.",
      "The TMAO story is compelling but causation requires careful parsing. TMAO elevation in cardiovascular patients may reflect gut dysbiosis caused by poor diet rather than TMAO independently causing disease. The dietary intervention recommendation holds regardless, but mechanistic claims should remain appropriately qualified pending further evidence.",
      "The implication that caesarean delivery harms the microbiome creates an ethical tension around medically necessary procedures. Evidence suggests early skin-to-skin contact, breastfeeding initiation within 1 hour, and diverse solid food introduction from 6 months can substantially offset mode-of-delivery effects — these should be standard post-CS protocols.",
      "Leaky gut exemplifies the tension between patient experience and biomarker validation. Patients with symptoms of increased intestinal permeability are real. The condition is real. But the term has been commercially exploited to sell unproven supplements, making it difficult for patients to find evidence-based guidance amidst the noise.",
      "The bidirectionality of the stress-gut relationship has underutilised clinical implications: treating gut dysbiosis in anxious patients may reduce anxiety, and stress management may improve IBS. These are synergistic not competing — which is why integrated psychogastroenterology clinics are emerging as a legitimate sub-specialty.",
      "The probiotic market generates $60B annually, with the majority of products having no RCT evidence for their claims. The science of specific probiotic strains is genuinely promising. But the commercial landscape has outpaced evidence by decades, and regulatory oversight of health claims for probiotics remains inadequate globally.",
    ],
  },
  {
    id: "kimi",
    name: "Kimi",
    fullName: "Moonshot AI Kimi",
    color: "#3B82F6",
    bgColor: "#EFF6FF",
    logo: "◉",
    responses: [
      "Chinese medicine's 脾胃 (spleen-stomach system) as the 'root of post-natal constitution' predates Western microbiome science by two millennia. Contemporary research increasingly validates this — gut health as the foundation of systemic vitality is not a new insight, merely one that now has molecular and genomic explanation.",
      "Traditional Chinese medicine's concept of 心腹 (heart-abdomen connection) and the clinical observation that emotional states manifest as digestive disorders implicitly described the gut-brain axis. Modern bidirectional neuroscience now provides structural precision to what Chinese practitioners observed empirically across centuries of clinical practice.",
      "In Chinese clinical practice, tongue diagnosis and pulse quality at the 关 (guan) position provide indirect assessments of digestive health. A thick, greasy tongue coat classically indicates gut dysbiosis and 湿热 (damp-heat) accumulation — correlating with inflammatory gut conditions in integrative clinical studies.",
      "Fermented foods foundational to East Asian diets — kimchi, miso, natto, tempeh — are among the most potent microbiome-diversifying interventions identified. Stanford's 2021 RCT confirmed high-fermented-food diets increased microbiome diversity more effectively than high-fibre diets alone. Traditional dietary wisdom has molecular validation.",
      "IBS prevalence in East Asia is 11.5%, comparable to Western populations. Functional foods traditional to Asian practice — ginger, perilla, congee with turmeric — have demonstrated anti-inflammatory and motility-modulating properties in preclinical studies. Integration of these practices into evidence-based IBS management protocols is an underexplored clinical opportunity.",
      "Research from Fudan University and Peking University confirms TMAO elevation in Chinese cardiovascular patients consuming traditional high-red-meat diets, validating Western findings across different ethnic microbiome compositions. The gut-cardiac axis is universal, though TMAO production rates vary meaningfully by ethnicity and baseline microbiome composition.",
      "In traditional Chinese paediatric practice, early dietary diversity — congee with multiple grains, vegetables, and proteins from 6 months — has long been standard practice. This aligns precisely with microbiome research showing diverse complementary feeding as critical for microbiome seeding and lifelong immune programming.",
      "Research from Shanghai Jiao Tong University demonstrates that herbal compounds including berberine and baicalin modulate tight junction protein expression and reduce intestinal permeability in preclinical models. Chinese herbal medicine targeting 肠漏 (leaky gut) represents a potentially complementary approach to conventional intestinal barrier restoration strategies.",
      "Chronic stress (压力过大) impairing digestive function is foundational in Chinese medicine. The concept of 肝 (liver) 'invading' the 脾胃 under emotional stress precisely describes the HPA-axis-driven gut dysbiosis that Western research is now quantifying. This 2,000-year-old clinical observation has contemporary molecular validation.",
      "Probiotic-containing foods have been integral to Asian culinary traditions for millennia. Modern clinical evidence from Asian institutions confirms strain-specific benefits: L. rhamnosus GG for rotavirus diarrhoea, Bifidobacterium infantis for infantile colic, and L. reuteri as adjunct therapy for H. pylori eradication show strong validation.",
    ],
  },
  {
    id: "sensenova",
    name: "SenseNova",
    fullName: "SenseTime SenseNova",
    color: "#7C3AED",
    bgColor: "#F5F3FF",
    logo: "◆",
    responses: [
      "SenseTime's multi-modal health AI processes microbiome sequencing data alongside metabolomic and clinical records to generate personalised gut health risk scores. Models trained on >200,000 microbiome samples achieve AUC 0.88 in predicting 5-year metabolic disease risk from a single stool sample — enabling true preventive gastroenterology.",
      "AI-driven biosensor fusion — gut motility sensors, EEG, heart rate variability — maps bidirectional gut-brain signalling dynamics non-invasively. Our machine learning models can predict IBS flares 48 hours in advance from continuous gut monitoring data with 79% accuracy, enabling pre-emptive therapeutic intervention.",
      "Digital health platforms integrating stool microbiome analysis with wearable biosensor data (sleep, HRV, activity) generate gut health scores with clinical-grade predictive validity. AI pattern recognition across multi-omics datasets reveals dysbiosis markers invisible to single-biomarker testing — unlocking precision gastroenterology at population scale.",
      "Large-scale AI analysis of dietary intervention studies reveals that the dose-response curve for plant diversity on microbiome richness follows a logarithmic function — marginal benefit decreases but never reaches zero. Optimal diversity appears to be 25–35 plant species weekly based on microbiome response modelling.",
      "Deep learning analysis of IBS patient cohorts (n=12,000) identifies three distinct microbiome subtypes with different optimal treatment responses — one responding to FODMAP restriction, one to bile acid management, one to neuromodulatory therapy. AI-guided IBS subtyping is entering clinical validation phase in three health systems.",
      "AI models integrating gut microbiome composition with cardiovascular imaging predict 10-year MACE risk at AUC 0.92 — significantly outperforming the Framingham score (AUC 0.71). Microbiome-cardiovascular risk algorithms are in Phase 2 clinical validation. This represents a paradigm shift in precision cardiovascular risk stratification.",
      "Longitudinal microbiome tracking from birth using AI-analysed sequencing data identifies dysbiotic patterns predictive of childhood metabolic disease, ASD, and allergic conditions up to 18 months before clinical presentation. Early microbiome intervention protocols guided by predictive AI models are entering paediatric RCT phase.",
      "AI analysis of Raman spectroscopy of stool samples can assess intestinal permeability markers non-invasively — advancing beyond invasive lactulose-mannitol tests. Our models trained on 5,000 paired stool-serum LPS samples achieve 83% sensitivity for clinically significant intestinal hyperpermeability without any invasive testing.",
      "Continuous cortisol monitoring via wearable biosensors combined with real-time microbiome analysis enables prediction of stress-induced gut dysbiosis episodes 12–24 hours before symptom onset. Closed-loop digital therapeutic systems delivering prebiotic protocols at predicted dysbiosis timepoints are in active development.",
      "AI-driven microbiome analysis can now match individual patients to optimal probiotic strains based on baseline microbiome composition, genetic variants in probiotic receptor genes, and treatment history — achieving clinical response rates of 68% versus 31% for standard strain selection. Personalised probiotic prescription is becoming clinically viable.",
    ],
  },
  {
    id: "gemini",
    name: "Gemini",
    fullName: "Google Gemini 1.5",
    color: "#4285F4",
    bgColor: "#EEF4FF",
    logo: "◇",
    responses: [
      "Google search data shows 'microbiome' queries have grown 280% over 5 years. Google Scholar indexes 45,000+ microbiome papers published in 2024 alone. Public understanding is accelerating, but the gap between research quality and commercial microbiome product claims remains a significant public health communication challenge.",
      "Google Health's longitudinal studies confirm individuals with richer dietary diversity — assessed via AI analysis of food diaries — show measurably better mental health outcomes at 12-month follow-up. The gut-brain axis is emerging as a primary mechanism linking diet quality to mental wellbeing at population scale.",
      "Symptom tracking data from health apps (>50M users) shows self-reported digestive symptoms — bloating, irregular bowel habits — correlate with reduced physical activity and lower mood scores at population scale, validating gut health as a determinant of broader wellbeing beyond gastrointestinal function.",
      "AI-powered meal planning tools incorporating microbiome diversity goals show 34% greater dietary diversity improvement versus standard nutritional advice in Google Health partner studies. The 30-plants-per-week target is achievable even in high-constraint environments with structured meal planning support.",
      "IBS is among the top 10 most-searched health conditions globally, generating >18 million monthly queries. Google's symptom analysis AI identifies IBS-consistent symptom clusters in users searching gut-related terms with 74% concordance with clinical IBS diagnosis — flagging significant opportunity for earlier digital health intervention.",
      "Population-scale EHR analysis across Google Cloud Health partner systems confirms TMAO elevation is a significant independent predictor of cardiovascular hospitalisation. Gut microbiome composition data adds predictive value beyond standard lipid panels in real-world clinical datasets across diverse demographic groups.",
      "Google search behaviour analysis shows parents search gut health questions for their children at 3× the rate they search for themselves. Public health content optimised for parent audiences — on breastfeeding, antibiotic stewardship, and early dietary diversity — has the highest population-level impact potential.",
      "Google Trends shows 'leaky gut' has sustained a 10-year high-interest search trajectory despite limited formal clinical recognition. The gap between public awareness and clinical acceptance represents a significant communication failure — validated intestinal permeability research exists but is outcompeted by unproven supplement marketing.",
      "Workplace health apps integrated with Google Fit data show high-stress work periods — defined by reduced sleep and elevated resting HR — correlate with a 43% increase in digestive symptom reporting within 48–72 hours. This population-scale correlation validates mechanistic gut-stress pathways in real-world occupational data.",
      "Google Health meta-analysis of probiotic RCTs (n=847 trials) confirms substantial heterogeneity in efficacy driven by strain, dose, duration, and indication. AI-assisted evidence synthesis identifies Lactobacillus + Bifidobacterium combinations for IBS-D as the highest-quality evidence, followed by Saccharomyces boulardii for antibiotic-associated diarrhoea.",
    ],
  },
];

export interface LLMDoctor {
  id: string; name: string; model: string; title: string;
  color: string; bgColor: string; logo: string; responses: string[];
}

const LLM_DOCTOR_META: Record<string, { name: string; title: string }> = {
  openai:    { name: "Dr. GPT",    title: "Chief Intelligence Officer" },
  anthropic: { name: "Dr. Claude", title: "Reasoning & Safety Specialist" },
  kimi:      { name: "Dr. Kimi",   title: "Knowledge Navigation Expert" },
  sensenova: { name: "Dr. Nova",   title: "Analytical Data Pathologist" },
  gemini:    { name: "Dr. Gemini", title: "Synthesis & Discovery Specialist" },
};

const SCORER_VOICE: Record<string, string[]> = {
  openai:    ["Well-structured, though the evidence hierarchy deserves sharper framing.","Strong technical foundation — the clinical translation could be tightened.","Competent synthesis. Individual variation factors were underweighted.","Solid reasoning. The RCT data angle was underexplored here.","Good analytical base. The mechanistic pathway explanation was rushed.","Rigorous foundation. I'd push harder on the longitudinal evidence.","Well-reasoned, though gut-brain axis nuance was notably absent.","Strong clinical framework — the personalization angle was underdeveloped.","Competent overview. The microbiome diversity discussion was too brief.","Good scope. The dietary intervention evidence deserved more specificity."],
  anthropic: ["Thoughtful framing with appropriate epistemic humility.","Well-reasoned — patient-centred communication could be stronger.","Good handling of uncertainty; the caveats were well-placed.","Careful and safe reasoning. The uncertainty bounds were appropriate.","Rigorous approach. Would benefit from stronger clinical specificity.","Balanced perspective. The safety considerations were appropriately weighted.","Nuanced and careful. I'd appreciate more on individualised treatment pathways.","Excellent epistemic care. The evidence grading was appropriately conservative.","Good reasoning structure. The clinical translation could be more actionable.","Well-calibrated confidence. The preventive framing was particularly strong."],
  kimi:      ["Excellent data coverage and population-level grounding.","Comprehensive retrieval — the synthesis could be tighter for clinical use.","Strong evidence base. The global epidemiology angle added real value.","Well-researched. The mechanistic detail was appreciated here.","Good breadth. Gut-brain axis depth could be substantially enhanced.","Impressive citation density. The systematic review framing was a plus.","Strong factual grounding. The comparative efficacy data was well-integrated.","Excellent knowledge retrieval. Clinical prioritisation could be clearer.","Good epidemiological framing. The pathophysiology section was robust.","Thorough data synthesis. The probiotic strain specificity was appreciated."],
  sensenova: ["Precise and analytical — the quantitative framing was appropriate.","Good clinical grounding. Statistical nuance was well-handled throughout.","Methodical and structured. The differential reasoning was sound.","Data-driven and rigorous. Clinical applicability could be highlighted more.","Structured response. The sensitivity framing deserves further development.","Strong analytical rigour. The dose-response framing was particularly apt.","Precise and data-forward. The biomarker discussion was well-calibrated.","Good quantitative depth. The NNT framing added clinical relevance.","Systematic and clear. The risk stratification logic was well-presented.","Analytical and thorough. The correlation vs causation framing was precise."],
  gemini:    ["Strong synthesis across multiple knowledge domains.","Well-integrated — the cross-disciplinary connections added real value.","Impressive breadth. The discovery-layer insights were genuinely useful.","Good multimodal reasoning. Systems-level view was appreciated.","Solid multi-source synthesis. Patient actionability could be stronger.","Excellent knowledge integration. The research horizon section was insightful.","Strong interdisciplinary framing. The lifestyle-microbiome link was compelling.","Good synthesis quality. The emerging therapeutics section stood out.","Well-integrated evidence. The nutrigenomics framing was forward-thinking.","Broad and well-synthesised. The personalised medicine angle was valuable."],
};

const LLM_PEER_BASE: Record<string, Record<string, number>> = {
  openai:    { anthropic: 8.4, kimi: 7.7, sensenova: 7.4, gemini: 8.1 },
  anthropic: { openai: 8.2, kimi: 7.9, sensenova: 7.3, gemini: 8.0 },
  kimi:      { openai: 7.8, anthropic: 8.3, sensenova: 8.1, gemini: 7.7 },
  sensenova: { openai: 7.9, anthropic: 8.0, kimi: 8.2, gemini: 7.6 },
  gemini:    { openai: 8.3, anthropic: 8.4, kimi: 7.8, sensenova: 7.5 },
};

export function getLLMDoctors(): LLMDoctor[] {
  return LLM_PROVIDERS.map(p => ({
    id: p.id,
    name: LLM_DOCTOR_META[p.id]?.name ?? `Dr. ${p.name}`,
    model: p.fullName,
    title: LLM_DOCTOR_META[p.id]?.title ?? "AI Medical Specialist",
    color: p.color, bgColor: p.bgColor, logo: p.logo,
    responses: p.responses,
  }));
}

export function getLLMPeerScore(scorerId: string, subjectId: string, qIdx: number): { score: number; comment: string } {
  const base = LLM_PEER_BASE[scorerId]?.[subjectId] ?? 7.5;
  const v = Math.sin((qIdx + 1) * 0.9 + scorerId.length * 0.5 + subjectId.length * 0.3) * 0.55;
  const score = Math.round(Math.min(9.8, Math.max(6.0, base + v)) * 10) / 10;
  const comments = SCORER_VOICE[scorerId] ?? ["Solid response with good clinical insight."];
  return { score, comment: comments[qIdx % comments.length] };
}

const LLM_BASE_SCORES: Record<string, number> = {
  openai: 8.3, anthropic: 8.6, kimi: 7.9, sensenova: 7.7, gemini: 8.1,
};

export function getLLMCommentaries(questionIdx: number): {
  id: string; name: string; fullName: string; color: string; bgColor: string; logo: string; comment: string; score: number;
}[] {
  return LLM_PROVIDERS.map(p => {
    const base = LLM_BASE_SCORES[p.id] ?? 8.0;
    const v = Math.sin((questionIdx + 1) * 1.618 + p.id.length * 0.7) * 0.85;
    const score = Math.round(Math.min(9.8, Math.max(6.5, base + v)) * 10) / 10;
    return {
      id: p.id, name: p.name, fullName: p.fullName,
      color: p.color, bgColor: p.bgColor, logo: p.logo,
      comment: p.responses[questionIdx] ?? p.responses[0],
      score,
    };
  });
}
