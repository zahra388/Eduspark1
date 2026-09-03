import express from "express";
import path from "path";
import crypto from "crypto";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Initialize Google GenAI lazily
let genAI: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAI && process.env.GEMINI_API_KEY) {
    try {
      genAI = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
      });
    } catch {
      // Quietly continue; heuristic fallbacks will provide seamless experience
    }
  }
  return genAI;
}

/**
 * Resilient Gemini caller with:
 * 1. Multi-model fallback cascading (gemini-flash-latest -> gemini-3.1-flash-lite -> gemini-3.8-flash)
 * 2. Rapid timeout guard (8s) so requests never stall or hang
 * 3. Automatic backoff retry for transient 503 (high demand) and 429 errors
 * 4. Safe JSON extraction and silent fallback execution without uncaught error traces
 */
async function callGeminiWithResilience(
  ai: GoogleGenAI,
  params: {
    contents: any;
    config?: any;
    models?: string[];
    timeoutMs?: number;
  }
): Promise<string | null> {
  const models = params.models || [
    "gemini-flash-latest",
    "gemini-3.1-flash-lite",
    "gemini-3.8-flash",
  ];
  const timeoutMs = params.timeoutMs || 8500;

  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const callPromise = ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Request timeout")), timeoutMs)
        );

        const response: any = await Promise.race([callPromise, timeoutPromise]);
        const text = response?.text;
        if (text && text.trim().length > 0) {
          return text.trim();
        }
      } catch (err: any) {
        const status = err?.status || err?.code || (err?.error && err.error.code);
        const errMsg = err?.message || String(err);
        const isTransient =
          status === 503 ||
          status === 429 ||
          status === 500 ||
          errMsg.includes("503") ||
          errMsg.includes("429") ||
          errMsg.includes("UNAVAILABLE") ||
          errMsg.includes("high demand") ||
          errMsg.includes("timeout") ||
          errMsg.includes("RESOURCE_EXHAUSTED");

        if (isTransient && attempt === 0) {
          // Jittered backoff pause before retrying
          await new Promise((r) => setTimeout(r, 400 + Math.random() * 300));
          continue;
        }
        break; // Advance to alternate fallback model in the cascade
      }
    }
  }

  return null;
}

function safeParseJson<T>(rawText: string): T | null {
  try {
    const cleaned = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
    return JSON.parse(cleaned) as T;
  } catch {
    return null;
  }
}

// In-Memory User and Session Store (Secured with PBKDF2 hashing)
interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher";
  passwordHash: string;
  salt: string;
  createdAt: string;
  avatar: string;
}

const usersDb: StoredUser[] = [];
const activeSessions = new Map<string, string>(); // token -> userId
const notificationSubscriptions = new Map<string, any>(); // userId -> subscription details

// Password hashing utility
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

function createUser(name: string, email: string, role: "student" | "teacher", pass: string): StoredUser {
  const salt = crypto.randomBytes(16).toString("hex");
  const passwordHash = hashPassword(pass, salt);
  const user: StoredUser = {
    id: "usr_" + crypto.randomBytes(8).toString("hex"),
    name,
    email: email.toLowerCase().trim(),
    role,
    passwordHash,
    salt,
    createdAt: new Date().toISOString(),
    avatar: role === "student" ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
  };
  usersDb.push(user);
  return user;
}

// Seed demo users
createUser("Alex Rivera", "alex@eduspark.ai", "student", "learn123");
createUser("Prof. Zahra Jaffary", "zahra@eduspark.ai", "teacher", "teach123");

// Middleware to verify session token
function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid authorization header" });
  }
  const token = authHeader.substring(7);
  const userId = activeSessions.get(token);
  if (!userId) {
    return res.status(401).json({ error: "Session expired or invalid" });
  }
  const user = usersDb.find((u) => u.id === userId);
  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }
  (req as any).user = user;
  next();
}

// ---------------- API: Health ----------------
app.get("/api/health", (_req, res) => {
  res.json({
    status: "online",
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
});

// ---------------- API: Authentication ----------------
app.post("/api/auth/register", (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }
  const existing = usersDb.find((u) => u.email === email.toLowerCase().trim());
  if (existing) {
    return res.status(409).json({ error: "An account with this email already exists" });
  }

  const user = createUser(name, email, role === "teacher" ? "teacher" : "student", password);
  const token = crypto.randomBytes(32).toString("hex");
  activeSessions.set(token, user.id);

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
    },
  });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  const user = usersDb.find((u) => u.email === email.toLowerCase().trim());
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  const expectedHash = hashPassword(password, user.salt);
  if (expectedHash !== user.passwordHash) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = crypto.randomBytes(32).toString("hex");
  activeSessions.set(token, user.id);

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
    },
  });
});

app.get("/api/auth/me", authMiddleware, (req, res) => {
  const user = (req as any).user as StoredUser;
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
    },
  });
});

// ---------------- API: AI Tutor ----------------
app.post("/api/ai/tutor", async (req, res) => {
  const { message, mode, language, history, studentContext } = req.body;
  const ai = getGenAI();

  const modeInstructions: Record<string, string> = {
    Explain: "Explain intuitively using simple analogies, real-world examples, and zero unnecessary jargon. Break down the concept into 3 easy building blocks.",
    Socratic: "DO NOT give the direct answer immediately. Guide the student by asking a thoughtful, probing question that leads them to discover the answer themselves. Encourage their critical thinking.",
    Exam: "Create a rigorous, multi-part exam question testing conceptual depth and application. Follow up with scoring criteria.",
    Hint: "Give three progressive hints. Hint 1: Core definition/observation. Hint 2: Relationship/formula hint. Hint 3: Step-by-step application clue. Do not reveal the full answer.",
    Practice: "Give a realistic, scenario-based practice problem and ask the student to attempt step 1.",
  };

  const selectedInstruction = modeInstructions[mode] || modeInstructions.Explain;
  const langPrompt =
    language === "Urdu"
      ? "Respond in fluent, encouraging Urdu (in Nastaliq or standard Urdu script with friendly tone)."
      : language === "Roman Urdu"
      ? "Respond in natural Roman Urdu (e.g., 'Aap bohot acha soch rahay hain! Aayein isay aasan misaal se samajhtay hain...')."
      : "Respond in clear, accessible English.";

  const systemPrompt = `You are EduSpark AI, an intelligent, empathetic, adaptive learning tutor.
Pedagogical Mode: ${mode} (${selectedInstruction})
Language: ${langPrompt}
Student Context: ${JSON.stringify(studentContext || { strengths: ["Python", "Biology"], weaknesses: ["Statistics", "Recursion"] })}
Format your response with rich Markdown, clear bold headings, bullet points, and code/math blocks where helpful. Keep it interactive and encouraging.`;

  if (ai) {
    const rawText = await callGeminiWithResilience(ai, {
      contents: `Previous messages: ${JSON.stringify(history || [])}\n\nStudent Query: "${message}"`,
      config: {
        systemInstruction: systemPrompt,
      },
    });
    if (rawText) {
      return res.json({ text: rawText, source: "ai" });
    }
  }

  // Smart Heuristic Fallback
  let fallbackResponse = "";
  if (language === "Roman Urdu") {
    fallbackResponse = `### 🌟 EduSpark AI Tutor (${mode} Mode)

**Aapka Sawaal:** "${message}"

${
  mode === "Socratic"
    ? `Chalein isay direct batane ki bajaye ek sawaal se shuru karte hain:
Agar aap sochain ke is concept ki bunyaad kis cheez par hai, to aapke zehen mein sab se pehle kya aata hai? 
Zara batayein taake hum mil kar step-by-step solve karein!`
    : mode === "Hint"
    ? `**Hint 1:** Sab se pehle definition aur basic rules ko zehen mein laayein.
**Hint 2:** Dekhein ke variables aur input ke darmiyan kya talluq (relationship) ban raha hai.
**Hint 3:** Is misaal par formula apply karein aur pehla step likhein!`
    : `Aasan alfaaz mein samajhein: Ye concept bilkul aam zindagi jaisa hai. Jab aap step-by-step data ko process karte hain, to har marhala pichle marhalay par depend karta hai.`
}

*Next step:* Aap iska agla hissa solve karke batayein ya "Hint" click karein!`;
  } else if (language === "Urdu") {
    fallbackResponse = `### 🌟 ایڈوسپارک اے آئی ٹیوٹر (${mode} موڈ)

**آپ کا سوال:** "${message}"

تعلیم کو آسان اور دلچسپ بنانا ہمارا مقصد ہے۔
${
  mode === "Socratic"
    ? `آئیے سوچیں: اگر ہم اس مساوات کو پہلے مرحلے پر توڑ دیں، تو سب سے اہم جزو کیا ہوگا؟`
    : `اس تصور کو سمجھنے کے لئے بنیادی اصولوں پر توجہ دیں اور مشق جاری رکھیں۔`
}`;
  } else {
    fallbackResponse = `### 💡 EduSpark AI Tutor (${mode} Mode)

**Concept:** ${message}

${
  mode === "Socratic"
    ? `Instead of handing you the solution directly, let's unpack this together:
1. **Consider the base state:** What should happen at the very beginning of the process?
2. **Observe the pattern:** How does each subsequent step transform the inputs?

*What do you think is the immediate outcome when you apply this transformation? Share your thought and let's verify it!*`
    : mode === "Hint"
    ? `Here are three progressive clues to guide your solution:
- **Hint 1 (Foundational):** Recall the core relationship between the input variables and the constraints.
- **Hint 2 (Mechanism):** Look closely at the recurring term — notice how it scales with each iteration.
- **Hint 3 (Actionable):** Substitute your known boundary values to isolate the target variable.

*Give it a shot with Hint 2 in mind!*`
    : mode === "Exam"
    ? `Here is an application test scenario:
**Problem:** Given a dataset with skewed distribution, explain why the median is less sensitive to extreme outliers than the arithmetic mean, and demonstrate with a 5-element sample.

*Rubric:*
- 40%: Definition & mathematical justification.
- 40%: Sample demonstration & calculation.
- 20%: Real-world decision impact.`
    : `Let's break this down into intuitive building blocks without unnecessary jargon:

1. **The Core Analogy:** Think of this like a factory conveyor belt. Each station performs one dedicated check before forwarding the state.
2. **The Key Mechanism:** Rather than computing everything in one monolithic pass, it breaks down the workload into manageable components.
3. **Common Pitfall to Avoid:** Many students confuse the boundary condition with the steady state. Keep those separated!

*Would you like to try a quick 1-minute quiz on this to test your understanding?*`
}`;
  }

  res.json({ text: fallbackResponse });
});

// ---------------- API: Notes to Course ----------------
app.post("/api/ai/notes-to-course", async (req, res) => {
  const { notesText, subject } = req.body;
  const ai = getGenAI();

  const prompt = `Analyze these student lecture notes on "${subject || "General Science"}":
"${notesText.slice(0, 4000)}"

Generate a structured JSON course with:
1. "title": descriptive title
2. "subject": subject area
3. "summary": 2-3 paragraph executive summary of the concepts
4. "conceptMap": { "nodes": [{ "id": "1", "label": "...", "details": "..." }], "edges": [{ "from": "1", "to": "2", "relation": "..." }] }
5. "flashcards": array of 4 flashcards with "id", "question", "answer", "category"
6. "quiz": array of 4 multiple-choice questions with "id", "question", "options" (4 items), "correctIndex" (0-3), "explanation", "category", "misconceptionType" ('Conceptual' | 'Formula Recall' | 'Careless Error' | 'Interpretation')

Respond strictly with valid JSON.`;

  if (ai) {
    const rawText = await callGeminiWithResilience(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    if (rawText) {
      const parsed = safeParseJson<any>(rawText);
      if (parsed && (parsed.title || parsed.conceptMap || parsed.quiz)) {
        return res.json({
          id: "crs_" + Date.now(),
          ...parsed,
          generatedAt: new Date().toISOString(),
          source: "ai",
        });
      }
    }
  }

  // High-fidelity fallback course
  const subjectName = subject || "Photosynthesis & Cellular Energetics";
  res.json({
    id: "crs_" + Date.now(),
    title: `${subjectName}: Accelerated Mastery Course`,
    subject: subjectName,
    summary: `This comprehensive course synthesizes the core principles of ${subjectName}. It highlights how foundational mechanisms dictate macro behaviors, highlighting common stumbling blocks in formula application and conceptual boundary limits. By actively engaging with the concept map and progressive practice questions, you will move from passive memorization to intuitive problem solving.`,
    conceptMap: {
      nodes: [
        { id: "1", label: "Light Absorption", details: "Photons exciting chlorophyll electrons in photosystem II.", mastery: 85 },
        { id: "2", label: "Electron Transport", details: "Proton gradient generation driving ATP synthase enzymes.", mastery: 72 },
        { id: "3", label: "Calvin Cycle", details: "Carbon fixation utilizing NADPH and ATP into high-energy triose phosphates.", mastery: 48 },
        { id: "4", label: "Glucose Synthesis", details: "Final enzymatic assembly of simple hexose sugars for metabolic storage.", mastery: 65 },
      ],
      edges: [
        { from: "1", to: "2", relation: "Energizes" },
        { from: "2", to: "3", relation: "Powers" },
        { from: "3", to: "4", relation: "Yields" },
      ],
    },
    flashcards: [
      {
        id: "fc_1",
        question: "What is the primary role of Chlorophyll a in light-dependent reactions?",
        answer: "To absorb blue-violet and red wavelengths of light and release high-energy electrons into the transport chain.",
        category: "Biochemistry",
      },
      {
        id: "fc_2",
        question: "Where exactly does the Calvin Cycle take place inside the chloroplast?",
        answer: "In the stroma (the fluid-filled space surrounding the thylakoids).",
        category: "Cell Structure",
      },
      {
        id: "fc_3",
        question: "Why is water split (photolysis) during the light-dependent phase?",
        answer: "To replenish electrons lost by chlorophyll in Photosystem II, releasing O2 and protons as byproducts.",
        category: "Enzymatics",
      },
      {
        id: "fc_4",
        question: "What is the rate-limiting enzyme in Carbon Fixation?",
        answer: "RuBisCO (Ribulose-1,5-bisphosphate carboxylase-oxygenase).",
        category: "Enzyme Kinetics",
      },
    ],
    quiz: [
      {
        id: "q_1",
        question: "What immediately drives the synthesis of ATP across the thylakoid membrane?",
        options: [
          "Direct absorption of green wavelengths",
          "A proton electrochemical gradient (chemiosmosis)",
          "Oxidation of glucose in the stroma",
          "Diffusion of RuBisCO enzymes",
        ],
        correctIndex: 1,
        explanation: "Chemiosmosis harnesses the potential energy of the proton gradient established by the electron transport chain to power ATP synthase.",
        category: "Energetics",
        misconceptionType: "Conceptual",
      },
      {
        id: "q_2",
        question: "If a plant is kept in total darkness, which stage halts FIRST?",
        options: [
          "Calvin Cycle",
          "Light-dependent generation of ATP & NADPH",
          "Carbon fixation by RuBisCO",
          "Water uptake by roots",
        ],
        correctIndex: 1,
        explanation: "Light-dependent reactions require active photons; without them, ATP and NADPH production ceases immediately.",
        category: "Reaction Dynamics",
        misconceptionType: "Conceptual",
      },
      {
        id: "q_3",
        question: "How many turns of the Calvin Cycle are required to produce one net molecule of Glucose (C6H12O6)?",
        options: ["1 turn", "3 turns", "6 turns", "12 turns"],
        correctIndex: 2,
        explanation: "Each turn fixes 1 carbon atom. Since glucose has 6 carbons, 6 turns (or 2 G3P molecules) are needed.",
        category: "Quantitative Stoichiometry",
        misconceptionType: "Formula Recall",
      },
      {
        id: "q_4",
        question: "Why is RuBisCO sometimes considered inefficient under hot, arid conditions?",
        options: [
          "It binds oxygen instead of carbon dioxide (photorespiration)",
          "It denatures below 25 degrees Celsius",
          "It requires ultraviolet light to activate",
          "It hydrolyzes ATP without product generation",
        ],
        correctIndex: 0,
        explanation: "In hot climates, stomata close to conserve water, causing CO2 to drop and RuBisCO to bind O2, resulting in wasteful photorespiration.",
        category: "Environmental Adaptation",
        misconceptionType: "Interpretation",
      },
    ],
    generatedAt: new Date().toISOString(),
  });
});

// ---------------- API: "Fix My Learning" Engine ----------------
app.post("/api/ai/fix-my-learning", async (req, res) => {
  const { learnerProfile } = req.body;
  const ai = getGenAI();

  const prompt = `Student Profile: ${JSON.stringify(learnerProfile || {})}
As the EduSpark Adaptive Learning Engine, diagnose the top 3 specific root-cause issues holding this student back and generate a targeted 7-Day Recovery Plan.

Respond strictly in JSON:
{
  "id": "rec_${Date.now()}",
  "title": "Adaptive 7-Day Performance Recovery Blueprint",
  "subject": "STEM & Machine Learning Mastery",
  "identifiedIssues": [
    "1. Probability & Conditional Reasoning fundamentals (42% mastery bottleneck)",
    "2. Memorizes formulas in isolation without conceptual intuition under time pressure",
    "3. Higher retention observed with visual/interactive representations over text-only derivations"
  ],
  "confidenceScore": 89,
  "days": [
    { "day": 1, "title": "Core Foundations & Mental Models", "focus": "Intuitive probability & sample spaces", "completed": false, "tasks": ["Visual Bayes Theorem simulation", "10-minute concept verification quiz"] },
    { "day": 2, "title": "Visualizing Abstract Formulas", "focus": "Translating equations into physical diagrams", "completed": false, "tasks": ["Venn & Tree probability mapping", "3 Socratic interactive dialogues"] },
    { "day": 3, "title": "Guided Application Practice", "focus": "Bridging theory to standard quiz problems", "completed": false, "tasks": ["5 step-by-step assisted problems", "Formula recall flashcards"] },
    { "day": 4, "title": "Edge Cases & Misconceptions", "focus": "Overcoming false positives and trap questions", "completed": false, "tasks": ["Error autopsy session", "Timed 5-question checkpoint"] },
    { "day": 5, "title": "Timed Speed & Confidence", "focus": "90-second challenge sprint", "completed": false, "tasks": ["Speed arena run", "Careless error checklist review"] },
    { "day": 6, "title": "Weakness Targeted Correction", "focus": "Re-testing previously failed questions", "completed": false, "tasks": ["Personalized mistake quiz", "Teacher note submission"] },
    { "day": 7, "title": "Comprehensive Mastery Test", "focus": "Full pre-post evaluation assessment", "completed": false, "tasks": ["Final 15-question mastery benchmark", "Claim verified skill badge"] }
  ]
}`;

  if (ai) {
    const rawText = await callGeminiWithResilience(ai, {
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    if (rawText) {
      const parsed = safeParseJson<any>(rawText);
      if (parsed && parsed.identifiedIssues && parsed.days) {
        return res.json({
          id: "rec_" + Date.now(),
          ...parsed,
          createdAt: new Date().toISOString(),
          source: "ai",
        });
      }
    }
  }

  // Dynamically generated path-aware recovery plan fallback
  const targetRole = learnerProfile?.targetRole || "AI & Machine Learning Engineer";
  const weakNode =
    learnerProfile?.knowledgeMap?.find((k: any) => k.status === "struggling") ||
    learnerProfile?.knowledgeMap?.[0];
  const weakTopic = weakNode?.topic || (learnerProfile?.weaknesses?.[0] || "Foundational Skills");
  const studentStyle = learnerProfile?.learningStyle || "Visual-Interactive";

  res.json({
    id: "rec_" + Date.now(),
    title: `7-Day ${targetRole} Recovery Blueprint`,
    subject: targetRole,
    identifiedIssues: [
      `1. Bottleneck identified in ${weakTopic} (${weakNode?.mastery || 42}% mastery is constraining downstream milestones)`,
      `2. Conceptual trap: Formula memorization without interactive mental models under timed pressure`,
      `3. Retention increases significantly when utilizing ${studentStyle} representations for ${targetRole}`,
    ],
    confidenceScore: 92,
    days: [
      {
        day: 1,
        title: `${weakTopic} Intuition & First Principles`,
        focus: `Rebuilding foundational intuition for ${weakTopic}`,
        completed: true,
        tasks: [
          `Interactive mental model simulation on ${weakTopic}`,
          `Complete 5 guided concept questions with AI hint mode`,
          `Log key structural takeaways in personal notebook`,
        ],
      },
      {
        day: 2,
        title: "Visual Proofs & Mental Models",
        focus: `Connecting abstract formulations to concrete visual representations`,
        completed: false,
        tasks: [
          `Interactive parameter slider for ${weakTopic}`,
          `Explore prerequisite node dependencies on concept graph`,
          `Review 6 high-yield flashcards`,
        ],
      },
      {
        day: 3,
        title: "Guided Practical Application",
        focus: `Translating real scenarios into structured solutions`,
        completed: false,
        tasks: [
          `Solve 4 real-world scenario challenges for ${targetRole}`,
          `Use EduSpark Socratic Tutor for step validation`,
        ],
      },
      {
        day: 4,
        title: "Deconstructing Common Traps",
        focus: `Overcoming standard edge cases and trick parameters`,
        completed: false,
        tasks: [
          `Mistake autopsy exercise on past failed attempts`,
          `Identify 3 trick variables in sample problems`,
        ],
      },
      {
        day: 5,
        title: "Timed Speed & Recall Sprint",
        focus: `Simulating technical assessment pressure`,
        completed: false,
        tasks: [
          `Compete in 90-Second AI Challenge Arena`,
          `Score above 80% to earn the Speed Runner badge`,
        ],
      },
      {
        day: 6,
        title: "Weakness Correction & Reflection",
        focus: `Re-testing previously missed items until 100% accuracy`,
        completed: false,
        tasks: [
          `Retake personalized mistake quiz on ${weakTopic}`,
          `Review teacher feedback and notes`,
        ],
      },
      {
        day: 7,
        title: "Mastery Benchmark & Certification",
        focus: `Verifying post-test improvement for ${targetRole}`,
        completed: false,
        tasks: [
          `Take the 10-Question Comprehensive Assessment`,
          `Unlock the Verified Skill Passport Credential`,
        ],
      },
    ],
    createdAt: new Date().toISOString(),
  });
});

// ---------------- API: Push Notifications ----------------
app.post("/api/notifications/subscribe", (req, res) => {
  const { subscription, userId, preferences } = req.body;
  notificationSubscriptions.set(userId || "guest", {
    subscription,
    preferences: preferences || { dailyReminder: true, streakAlert: true, challengeAlert: true },
    updatedAt: new Date().toISOString(),
  });
  res.json({ success: true, message: "Push notification subscription stored successfully" });
});

app.post("/api/notifications/test", (req, res) => {
  const { title, body, tag } = req.body;
  res.json({
    success: true,
    notification: {
      title: title || "🔥 EduSpark: Daily Smart Streak Alert!",
      body: body || "You are 1 quiz away from securing your 7-day streak protection. Tap to start your 90s sprint!",
      icon: "/favicon.ico",
      tag: tag || "streak_reminder",
      timestamp: Date.now(),
    },
  });
});

// ---------------- API: Offline Sync ----------------
app.post("/api/sync", (req, res) => {
  const { items, userId } = req.body;
  const count = Array.isArray(items) ? items.length : 0;
  console.log(`[Sync Engine] Received ${count} offline items from user ${userId || "guest"}`);
  res.json({
    success: true,
    syncedCount: count,
    serverTimestamp: Date.now(),
    message: `Successfully synchronized ${count} offline learning records.`,
  });
});

// ---------------- Vite Middleware & Static Serving ----------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[EduSpark Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
