import { KnowledgeNode, RoadmapPhase, UserLearningPath } from "../types";

export interface PathTrackPreset {
  id: string;
  roleTitle: string;
  tagline: string;
  badge: string;
  iconType: string;
  description: string;
  targetSkills: string[];
  defaultStrengths: string[];
  defaultGaps: string[];
  roadmap: RoadmapPhase[];
  knowledgeNodes: KnowledgeNode[];
}

export const PATH_TRACK_PRESETS: PathTrackPreset[] = [
  {
    id: "ai_engineer",
    roleTitle: "AI & Machine Learning Engineer",
    tagline: "Build neural nets, master transformers, and deploy predictive systems",
    badge: "AI & Deep Tech",
    iconType: "bot",
    description: "Master foundational probability, gradient descent, deep neural architectures, PyTorch pipelines, and LLM agent orchestration.",
    targetSkills: ["Python Fundamentals", "Probability & Bayes", "Gradient Descent", "Neural Architectures", "PyTorch", "Transformer Models", "System Design"],
    defaultStrengths: ["Python Syntax & Logic (85%)", "Loops & Control Flow (90%)", "Data Structures (75%)"],
    defaultGaps: ["Bayesian Probability & Priors (48%)", "Machine Learning Foundations (35%)", "Backpropagation Calculus (42%)"],
    roadmap: [
      {
        phase: 1,
        title: "Mathematical Foundations & Statistical Priors",
        duration: "Weeks 1-2",
        focus: "Bayes' Theorem, conditional probability, matrix operations, gradient vector calculus",
        status: "in_progress",
        recommendedActions: ["Explore Probability Priors on Concept Map", "Practice 5 Socratic Bayes questions", "Speed Sprint in Arena"],
      },
      {
        phase: 2,
        title: "Classical ML Algorithms & Evaluation Metrics",
        duration: "Weeks 3-4",
        focus: "Linear/logistic regression, cost functions, decision trees, bias-variance tradeoff",
        status: "upcoming",
        recommendedActions: ["Build Scikit-Learn classification pipeline", "Review overfitting autopsies"],
      },
      {
        phase: 3,
        title: "Deep Learning, PyTorch & LLM Architectures",
        duration: "Weeks 5-8",
        focus: "Convolutional layers, multi-head self-attention, fine-tuning and agent tools",
        status: "upcoming",
        recommendedActions: ["Build Capstone Bayesian Diagnostic Engine", "Verify Skill Passport"],
      },
    ],
    knowledgeNodes: [
      {
        id: "kn_ai_1",
        topic: "Python & Numerical Arrays",
        category: "Programming",
        mastery: 88,
        status: "mastered",
        prerequisites: [],
        description: "Vectorized operations, broadcasting, memory layouts, slicing, and list comprehensions.",
        keyFormulas: ["np.dot(A, B)", "arr.reshape(-1, 1)"],
        summary: "Excellent mechanical recall and fast array manipulation.",
      },
      {
        id: "kn_ai_2",
        topic: "Probability & Bayes' Theorem",
        category: "Mathematics",
        mastery: 48,
        status: "struggling",
        prerequisites: [],
        description: "Prior distributions, marginal likelihood, Bayes rule, conditional independence.",
        keyFormulas: ["P(A|B) = [P(B|A) * P(A)] / P(B)", "Total Law: Σ P(B|Ai)P(Ai)"],
        summary: "Primary bottleneck: confusion calculating base rates in false positive word problems.",
      },
      {
        id: "kn_ai_3",
        topic: "Gradient Descent & Loss Functions",
        category: "AI & ML",
        mastery: 52,
        status: "learning",
        prerequisites: ["Probability & Bayes' Theorem"],
        description: "Mean squared error, cross-entropy, partial derivatives, learning rates, momentum.",
        keyFormulas: ["w := w - α * ∇J(w)", "Loss = -Σ y * log(y_pred)"],
        summary: "Grasps 1D descent; needs practice with saddle points and Adam optimizer dynamics.",
      },
      {
        id: "kn_ai_4",
        topic: "Neural Network Forward & Backprop",
        category: "AI & ML",
        mastery: 35,
        status: "struggling",
        prerequisites: ["Gradient Descent & Loss Functions"],
        description: "Affine transformations, non-linear activations (ReLU, GeLU), chain rule propagation.",
        keyFormulas: ["z = Wx + b", "a = σ(z)", "∂L/∂W = (∂L/∂a)(∂a/∂z)(∂z/∂W)"],
        summary: "Hesitant computing chain rule dimensions across weight matrix transposes.",
      },
      {
        id: "kn_ai_5",
        topic: "Transformers & Attention Mechanisms",
        category: "AI & ML",
        mastery: 28,
        status: "unexplored",
        prerequisites: ["Neural Network Forward & Backprop"],
        description: "Scaled dot-product attention, queries, keys, values, positional encodings, causally masked heads.",
        keyFormulas: ["Attention(Q,K,V) = softmax(QK^T / √d_k)V"],
        summary: "Upcoming milestone: understand why self-attention scales quadratically with sequence length.",
      },
    ],
  },
  {
    id: "fullstack_developer",
    roleTitle: "Full-Stack AI & Cloud Software Engineer",
    tagline: "Engineer responsive reactive web systems, GenAI APIs, and robust architectures",
    badge: "Software Engineering",
    iconType: "code",
    description: "Design production TypeScript applications, master React state paradigms, server-side Express proxies, REST/WebSockets, and offline PWA resilience.",
    targetSkills: ["React & TypeScript", "Tailwind CSS", "Node.js & Express", "GenAI API Orchestration", "Async Concurrency", "Database Modeling", "Offline Syncing"],
    defaultStrengths: ["React Component Decomposition (88%)", "Tailwind CSS Styling (92%)", "Async/Await & Promises (80%)"],
    defaultGaps: ["Service Workers & Offline Sync (34%)", "API Key Proxy Security (45%)", "State Normalization (50%)"],
    roadmap: [
      {
        phase: 1,
        title: "Modern React & TypeScript Architecture",
        duration: "Weeks 1-2",
        focus: "Strict type safety, custom hooks, reducer state machines, accessibility",
        status: "in_progress",
        recommendedActions: ["Practice custom React hook patterns", "Refactor prop drilling to Context", "Test keyboard navigation"],
      },
      {
        phase: 2,
        title: "Secure Server-Side APIs & GenAI Integration",
        duration: "Weeks 3-5",
        focus: "Express middleware, Gemini API proxying, streaming responses, input sanitization",
        status: "upcoming",
        recommendedActions: ["Build secure server-side proxy route", "Handle streaming AI tokens"],
      },
      {
        phase: 3,
        title: "Offline-First Synchronization & Production Scalability",
        duration: "Weeks 6-8",
        focus: "IndexedDB queues, cache storage, optimistic UI updates, conflict resolution",
        status: "upcoming",
        recommendedActions: ["Implement background sync queue", "Deploy production bundle"],
      },
    ],
    knowledgeNodes: [
      {
        id: "kn_fs_1",
        topic: "TypeScript Strict Type Safety",
        category: "Programming",
        mastery: 86,
        status: "mastered",
        prerequisites: [],
        description: "Generics, conditional types, discriminated unions, utility types, and readonly immutability.",
        keyFormulas: ["type Result<T> = { data: T } | { error: string }", "keyof / typeof"],
        summary: "Very confident with typed props, interfaces, and generic event dispatchers.",
      },
      {
        id: "kn_fs_2",
        topic: "React State & Lifecycle Paradigms",
        category: "Frontend",
        mastery: 84,
        status: "mastered",
        prerequisites: ["TypeScript Strict Type Safety"],
        description: "Pure components, memoization (useMemo, useCallback), reducer patterns, ref synchronization.",
        keyFormulas: ["useReducer((state, action) => nextState, initial)", "useRef for mutable instances"],
        summary: "Solid grasp of component re-render trees and hook stability rules.",
      },
      {
        id: "kn_fs_3",
        topic: "Server-Side API Proxies & Security",
        category: "Backend",
        mastery: 50,
        status: "learning",
        prerequisites: ["TypeScript Strict Type Safety"],
        description: "Express routing, environment variables handling, rate limiting, and keeping keys hidden.",
        keyFormulas: ["process.env.SECRET_KEY", "app.use(express.json())"],
        summary: "Needs practice structuring server-side API proxy handlers to protect secrets.",
      },
      {
        id: "kn_fs_4",
        topic: "Offline PWA & Background Sync",
        category: "Architecture",
        mastery: 34,
        status: "struggling",
        prerequisites: ["React State & Lifecycle Paradigms"],
        description: "Service worker lifecycle, CacheStorage API, IndexedDB queueing, background reconnection.",
        keyFormulas: ["navigator.serviceWorker.register", "indexedDB.open('sync_queue')"],
        summary: "Growth opportunity: handling edge cases during offline-to-online transitions.",
      },
      {
        id: "kn_fs_5",
        topic: "GenAI Streaming & Tool Calling",
        category: "AI Integration",
        mastery: 45,
        status: "learning",
        prerequisites: ["Server-Side API Proxies & Security"],
        description: "Server-Sent Events (SSE), token streaming, structured JSON schema generation, function calls.",
        keyFormulas: ["ai.models.generateContentStream", "responseSchema: { type: 'object' }"],
        summary: "Currently exploring structured output validation and error resilience.",
      },
    ],
  },
  {
    id: "data_scientist",
    roleTitle: "Applied Data Scientist & Quantitative Analyst",
    tagline: "Extract strategic signal, design causal experiments, and build predictive models",
    badge: "Data Science",
    iconType: "chart",
    description: "Specialize in statistical hypothesis testing, exploratory data analysis, relational SQL modeling, regression algorithms, and predictive business intelligence.",
    targetSkills: ["Python & Pandas", "Relational SQL", "Hypothesis Testing", "Exploratory Data Analysis", "Regression Models", "A/B Testing", "Data Storytelling"],
    defaultStrengths: ["Exploratory Data Analysis (82%)", "Data Visualization (78%)", "Pandas DataFrames (75%)"],
    defaultGaps: ["Hypothesis Testing & P-Values (44%)", "SQL Window Functions (52%)", "Causal Inference (30%)"],
    roadmap: [
      {
        phase: 1,
        title: "Statistical Inference & Experimental Design",
        duration: "Weeks 1-2",
        focus: "Central Limit Theorem, hypothesis testing, p-values, Type I/II errors, power analysis",
        status: "in_progress",
        recommendedActions: ["Run interactive hypothesis simulation", "Calculate sample size thresholds"],
      },
      {
        phase: 2,
        title: "Relational Modeling & Advanced SQL",
        duration: "Weeks 3-4",
        focus: "Window functions, common table expressions (CTEs), cohort retention, data pipelines",
        status: "upcoming",
        recommendedActions: ["Solve 5 window aggregation challenges", "Structure normalized schema"],
      },
      {
        phase: 3,
        title: "Predictive Analytics & Executive Storytelling",
        duration: "Weeks 5-8",
        focus: "Multivariate regression, regularized models, causal trees, interactive executive dashboards",
        status: "upcoming",
        recommendedActions: ["Deploy predictive churn model", "Publish interactive report"],
      },
    ],
    knowledgeNodes: [
      {
        id: "kn_ds_1",
        topic: "Exploratory Data Analysis (EDA)",
        category: "Data Science",
        mastery: 82,
        status: "mastered",
        prerequisites: [],
        description: "Distribution profiling, outlier detection, correlation heatmaps, missing value imputation.",
        keyFormulas: ["df.describe()", "IQR = Q3 - Q1", "sns.heatmap(df.corr())"],
        summary: "Sharp intuition for anomaly detection and clean visual representations.",
      },
      {
        id: "kn_ds_2",
        topic: "Statistical Inference & P-Values",
        category: "Statistics",
        mastery: 44,
        status: "struggling",
        prerequisites: [],
        description: "Null hypothesis formulation, t-tests, ANOVA, p-value misinterpretations, confidence intervals.",
        keyFormulas: ["t = (x̄ - μ) / (s / √n)", "CI = x̄ ± z*(σ / √n)"],
        summary: "Key gap: confusing p-value definition with probability the null hypothesis is true.",
      },
      {
        id: "kn_ds_3",
        topic: "SQL Analytics & Window Functions",
        category: "Databases",
        mastery: 52,
        status: "learning",
        prerequisites: [],
        description: "OVER(PARTITION BY ... ORDER BY), ROW_NUMBER, LAG, LEAD, moving averages.",
        keyFormulas: ["SUM(amount) OVER (PARTITION BY user_id ORDER BY created_at)"],
        summary: "Good on basic joins; needs mastery of running totals and rolling frames.",
      },
      {
        id: "kn_ds_4",
        topic: "A/B Testing & Causal Inference",
        category: "Experimentation",
        mastery: 38,
        status: "struggling",
        prerequisites: ["Statistical Inference & P-Values"],
        description: "Sample ratio mismatch, minimum detectable effect, Bonferroni correction, randomization checks.",
        keyFormulas: ["MDE = (z_α/2 + z_β) * √(2σ²/n)"],
        summary: "Struggling with variance estimation in skewed metric distributions.",
      },
      {
        id: "kn_ds_5",
        topic: "Predictive Regression & Feature Selection",
        category: "Machine Learning",
        mastery: 55,
        status: "learning",
        prerequisites: ["Exploratory Data Analysis (EDA)"],
        description: "Ordinary least squares, L1 Lasso regularization, multicollinearity, VIF checks.",
        keyFormulas: ["VIF = 1 / (1 - R_i^2)", "Loss = OLS + λΣ|w_i|"],
        summary: "Grasps coefficient interpretation; needs practice diagnosing collinearity.",
      },
    ],
  },
  {
    id: "stem_academic",
    roleTitle: "Core STEM Academic Mastery",
    tagline: "Build foundational brilliance across Calculus, Physics, and Cellular Biology",
    badge: "Academic STEM",
    iconType: "atom",
    description: "Master first-principles science: differential & integral calculus, Newtonian mechanics, conservation laws, thermodynamics, and cellular bioenergetics.",
    targetSkills: ["Differential Calculus", "Integral Calculus", "Newtonian Dynamics", "Energy Conservation", "Cellular Bioenergetics", "Scientific Inquiry"],
    defaultStrengths: ["Cellular Bioenergetics (88%)", "Algebraic Manipulation (80%)", "Scientific Method (84%)"],
    defaultGaps: ["Differential Chain Rule (52%)", "Rotational Dynamics & Torque (40%)", "Thermodynamics (46%)"],
    roadmap: [
      {
        phase: 1,
        title: "Calculus & Motion Equations",
        duration: "Weeks 1-2",
        focus: "Derivatives, chain rule, kinematic integrals, velocity-time graphing",
        status: "in_progress",
        recommendedActions: ["Practice 10 chain rule problems", "Explore kinetic graphs in Concept Map"],
      },
      {
        phase: 2,
        title: "Forces, Work & Conservation Laws",
        duration: "Weeks 3-4",
        focus: "Free-body diagrams, work-energy theorem, momentum conservation, harmonic motion",
        status: "upcoming",
        recommendedActions: ["Solve inclined plane friction puzzles", "Complete timed arena challenge"],
      },
      {
        phase: 3,
        title: "Biochemical Energetics & Systems Modeling",
        duration: "Weeks 5-8",
        focus: "Enzyme kinetics, ATP synthesis, Calvin cycle carbon fixation, system equilibrium",
        status: "upcoming",
        recommendedActions: ["Analyze RuBisCO reaction kinetics", "Earn STEM Academic Mastery badge"],
      },
    ],
    knowledgeNodes: [
      {
        id: "kn_stem_1",
        topic: "Cellular Bioenergetics & Respiration",
        category: "Biology",
        mastery: 88,
        status: "mastered",
        prerequisites: [],
        description: "Glycolysis, Krebs cycle, electron transport chains, proton gradients, ATP synthase.",
        keyFormulas: ["6CO2 + 6H2O -> C6H12O6 + 6O2", "ATP synthesis via chemiosmosis"],
        summary: "Exceptional visual recall of biochemical steps and membrane transports.",
      },
      {
        id: "kn_stem_2",
        topic: "Differential Calculus & Chain Rule",
        category: "Mathematics",
        mastery: 52,
        status: "learning",
        prerequisites: [],
        description: "Limits, derivative definitions, product rule, quotient rule, composite chain rule.",
        keyFormulas: ["d/dx[f(g(x))] = f'(g(x)) * g'(x)", "d/dx[e^(kx)] = k * e^(kx)"],
        summary: "Occasional lapses identifying inner vs outer composite functions.",
      },
      {
        id: "kn_stem_3",
        topic: "Newtonian Dynamics & Free Body Diagrams",
        category: "Physics",
        mastery: 65,
        status: "learning",
        prerequisites: ["Differential Calculus & Chain Rule"],
        description: "Inertia, F = ma, third-law action-reaction pairs, static vs kinetic friction on inclines.",
        keyFormulas: ["ΣF = m * a", "f_k = μ_k * N", "W = F * d * cos(θ)"],
        summary: "Solid vector decomposition; needs caution setting up inclined coordinate axes.",
      },
      {
        id: "kn_stem_4",
        topic: "Rotational Motion & Conservation of Momentum",
        category: "Physics",
        mastery: 40,
        status: "struggling",
        prerequisites: ["Newtonian Dynamics & Free Body Diagrams"],
        description: "Angular velocity, moment of inertia, torque, conservation of angular momentum.",
        keyFormulas: ["τ = r * F * sin(θ)", "L = I * ω", "I = Σ m * r^2"],
        summary: "High error rate determining lever arm distances and rotational inertia moments.",
      },
      {
        id: "kn_stem_5",
        topic: "Enzyme Catalysis & Reaction Kinetics",
        category: "Biochemistry",
        mastery: 72,
        status: "learning",
        prerequisites: ["Cellular Bioenergetics & Respiration"],
        description: "Activation energy, substrate affinity (Km), Vmax, competitive vs allosteric inhibition.",
        keyFormulas: ["v = (Vmax * [S]) / (Km + [S])"],
        summary: "Understands active sites; needs consolidation on Lineweaver-Burk double reciprocal plots.",
      },
    ],
  },
];

export function generateCustomPath(
  answers: {
    trackId: string;
    customGoal?: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    learningStyle: 'Visual-Interactive' | 'Socratic-Inquiry' | 'Text-Structured' | 'Auditory-Verbal';
    dailyCommitmentMinutes: number;
    primaryPriority: string;
  },
  studentName: string,
  userId: string
): UserLearningPath {
  const matchedPreset = PATH_TRACK_PRESETS.find((p) => p.id === answers.trackId);
  const isCustom = answers.trackId === "custom";

  const roleTitle = isCustom
    ? (answers.customGoal?.trim() || "Specialized Self-Directed Track")
    : (matchedPreset?.roleTitle || "AI & Machine Learning Engineer");

  const description = isCustom
    ? `Custom tailored acceleration path focused on ${answers.customGoal || "specialized technical skills"}, calibrated for ${answers.level} level.`
    : (matchedPreset?.description || "");

  const targetSkills = isCustom
    ? ["Foundational Architecture", "Applied Problem Solving", "System Design", "Independent Capstone"]
    : (matchedPreset?.targetSkills || []);

  const keyStrengths = isCustom
    ? ["Analytical Thinking (78%)", "Self-Directed Inquiry (82%)"]
    : (matchedPreset?.defaultStrengths || []);

  const focusGaps = isCustom
    ? ["Core Domain Synthesis", "Advanced Specialization"]
    : (matchedPreset?.defaultGaps || []);

  // Adapt roadmap based on user commitment & priority
  const baseRoadmap = isCustom
    ? [
        {
          phase: 1,
          title: "Foundational Concepts & Diagnostics",
          duration: answers.dailyCommitmentMinutes >= 45 ? "Weeks 1-2" : "Weeks 1-3",
          focus: `Establish prerequisite intuition and address key bottlenecks for ${roleTitle}`,
          status: "in_progress" as const,
          recommendedActions: ["Explore Concept Map", "Engage with Socratic Tutor", "Review Diagnostic Flashcards"],
        },
        {
          phase: 2,
          title: "Applied Implementation & Core Architecture",
          duration: answers.dailyCommitmentMinutes >= 45 ? "Weeks 3-5" : "Weeks 4-6",
          focus: `Hands-on synthesis, intermediate challenges, and real-world scenarios`,
          status: "upcoming" as const,
          recommendedActions: ["Complete interactive arena challenges", "Build mini-projects"],
        },
        {
          phase: 3,
          title: "Portfolio Capstone & Verified Skill Passport",
          duration: answers.dailyCommitmentMinutes >= 45 ? "Weeks 6-8" : "Weeks 7-10",
          focus: `Demonstrate mastery, verify skill badges, and finalize capstone`,
          status: "upcoming" as const,
          recommendedActions: ["Publish capstone walkthrough", "Unlock Verified Passport"],
        },
      ]
    : (matchedPreset?.roadmap || []);

  // Calculate estimated completion
  const completionEstimateWeeks = answers.dailyCommitmentMinutes >= 60 ? 6 : answers.dailyCommitmentMinutes >= 30 ? 8 : 12;

  return {
    id: `path_${Date.now()}`,
    userId,
    trackId: answers.trackId,
    roleTitle,
    description,
    level: answers.level,
    learningStyle: answers.learningStyle,
    dailyCommitmentMinutes: answers.dailyCommitmentMinutes,
    primaryPriority: answers.primaryPriority,
    customGoal: answers.customGoal,
    targetSkills,
    keyStrengths,
    focusGaps,
    roadmap: baseRoadmap,
    startingMilestone: baseRoadmap[0]?.title || "Phase 1: Foundations",
    completionEstimateWeeks,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
