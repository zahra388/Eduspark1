import React, { useState } from "react";
import {
  Sparkles,
  Brain,
  MessageSquareQuote,
  FileSpreadsheet,
  Network,
  Crosshair,
  Compass,
  Trophy,
  GraduationCap,
  Award,
  ShieldCheck,
  Database,
  ArrowRight,
  Sun,
  Moon,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Flame,
  Zap,
  BookOpen,
  Lock,
  Layers,
  RefreshCw,
  Users,
  Code2,
  Check,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface StartingPageViewProps {
  onGoToSignIn: () => void;
  onGoToSignUp: () => void;
  onEnterGuestDemo: () => void;
}

export const StartingPageView: React.FC<StartingPageViewProps> = ({
  onGoToSignIn,
  onGoToSignUp,
  onEnterGuestDemo,
}) => {
  const { theme, toggleTheme, isDark } = useTheme();

  // Active feature tab selector state
  const [activeFeatureKey, setActiveFeatureKey] = useState<string>("tutor");

  // FAQ accordion state
  const [openFaqIndices, setOpenFaqIndices] = useState<number[]>([0]);

  const toggleFaq = (index: number) => {
    setOpenFaqIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Comprehensive app features breakdown
  const appFeatures = [
    {
      id: "tutor",
      name: "Socratic AI Tutor",
      shortDesc: "Real-time AI teacher with 4 pedagogical modes & multi-language voice.",
      icon: MessageSquareQuote,
      tag: "Gemini AI Core",
      color: "blue",
      details: [
        "4 Pedagogical Modes: Step-by-step Socratic inquiry, Direct breakdown, Intuitive real-world analogies, or Python code examples.",
        "8 Supported Languages: English, Spanish, Hindi, French, German, Urdu, Mandarin, and Arabic.",
        "Adaptive Cognitive Scaffolding: Prompts learners with targeted follow-up questions instead of just spoon-feeding raw answers.",
        "Mathematical & Code Syntax Highlighting with simulated audio speech synthesis.",
      ],
      badge: "Real-Time AI",
      metric: "4 Learning Modes",
    },
    {
      id: "twin",
      name: "AI Learning Twin",
      shortDesc: "Your living knowledge radar that tracks cognitive strengths & blindspots.",
      icon: Brain,
      tag: "Cognitive Engine",
      color: "indigo",
      details: [
        "Comprehensive Mastery Radar: Quantifies exact mastery percentages across multiple domains (e.g. Biology, Algorithms, Linear Algebra, Organic Chemistry).",
        "Cognitive Strengths vs. Bottlenecks: Real-time identification of conceptual friction points before exam day.",
        "Direct Tutor Handoff: One-click jump from a recognized weak spot directly into a tailored Socratic tutorial.",
        "Exam Readiness Index: Continuous statistical forecasting of performance based on recall speed and retention curves.",
      ],
      badge: "Personalized",
      metric: "98% Gap Detection",
    },
    {
      id: "notes",
      name: "Notes-to-Course Generator",
      shortDesc: "Transform raw lecture notes or textbook snippets into full interactive modules.",
      icon: FileSpreadsheet,
      tag: "Instant Curriculum",
      color: "emerald",
      details: [
        "Automated Content Synthesis: Converts unformatted lecture notes, transcripts, or PDF snippets into high-impact courses in seconds.",
        "Hierarchical Concept Graphs: Extracts key nodes and directional dependency relationships automatically.",
        "Smart Flashcard Deck: Self-generating active recall flashcards with flip-to-reveal answers.",
        "Diagnostic Multiple-Choice Quizzes: Auto-constructed assessments tagged with misconception categories and detailed rationales.",
      ],
      badge: "One-Click",
      metric: "Instant Synthesis",
    },
    {
      id: "recovery",
      name: "7-Day 'Fix My Learning'",
      shortDesc: "Algorithmic recovery plans that systematically eliminate your toughest learning gaps.",
      icon: Flame,
      tag: "Remediation Engine",
      color: "amber",
      details: [
        "Personalized Diagnostic Roadmaps: Evaluates your specific cognitive mistakes and prescribes a day-by-day 7-day micro-learning plan.",
        "Bite-Sized Milestones: 10–15 minute daily micro-tasks that prevent burnout while building lasting neural connections.",
        "Interactive Progress Tracking: Real-time completion checkboxes with instant XP and mastery recovery boosts.",
        "Cloud Saved: Synced across devices via Firebase Firestore so you never lose your progress streak.",
      ],
      badge: "Proven System",
      metric: "7-Day Milestones",
    },
    {
      id: "mistakes",
      name: "Mistake Pattern Analyzer",
      shortDesc: "Diagnoses whether errors stem from formula recall, concepts, or calculations.",
      icon: Crosshair,
      tag: "Error Analytics",
      color: "rose",
      details: [
        "Taxonomy of Errors: Automatically categorizes every failed quiz response into Formula Recall, Conceptual Misunderstanding, Calculation Slips, or Reading Misinterpretation.",
        "Targeted Remediation Action: Provides targeted advice tailored to the exact psychological root cause of the error.",
        "Trend Analysis: Identifies if fatigue or topic complexity causes spikes in specific mistake types.",
        "Zero-Judgment Learning: Empowers students to view errors as actionable feedback rather than failure.",
      ],
      badge: "Metacognitive",
      metric: "Root Cause AI",
    },
    {
      id: "arena",
      name: "90s Challenge Arena",
      shortDesc: "Gamified timed adaptive quizzes with XP, streaks, levels, and rank badges.",
      icon: Trophy,
      tag: "Gamification",
      color: "purple",
      details: [
        "Timed High-Energy Rounds: 90-second sprints designed to build fast fluency and retrieval automaticity.",
        "Dynamic XP & Streaks: Earn experience points, level up your learner profile, and unlock achievements.",
        "Immediate Pedagogical Feedback: View explanations on incorrect answers without slowing your momentum.",
        "Leaderboard & Milestones: Compare personal best scores and climb the master ranking tiers.",
      ],
      badge: "High Energy",
      metric: "90s Adaptive",
    },
    {
      id: "teacher",
      name: "Educator & Cohort Intelligence",
      shortDesc: "Live classroom analytics, student cluster tracking, and intervention alerts.",
      icon: GraduationCap,
      tag: "Teacher Portal",
      color: "cyan",
      details: [
        "Classroom Mastery Distribution: View real-time cohort curves across all enrolled students.",
        "Topic Drop-Off Radar: Pinpoints exact sub-topics where the majority of students get stuck before midterms.",
        "Student Intervention Flags: Automated identification of learners requiring extra 1-on-1 assistance.",
        "Curriculum Export: Easily generate classroom progress summaries and targeted homework modules.",
      ],
      badge: "For Educators",
      metric: "Cohort Insights",
    },
    {
      id: "passport",
      name: "Skill Passport & Verifiable Badges",
      shortDesc: "Cryptographically verifiable competency records and verifiable credentials.",
      icon: Award,
      tag: "Credentials",
      color: "violet",
      details: [
        "Verifiable Competency Badges: Displays earned achievements in Python, Data Structures, Quantum Physics, and more.",
        "Proof of Mastery: Detailed historical metrics including total study hours, average accuracy, and completed modules.",
        "Shareable Profile: Exportable skill record suitable for academic portfolios or technical job interviews.",
        "Continuous Leveling: Dynamic badge progression from Novice to Practitioner to Grandmaster.",
      ],
      badge: "Verifiable",
      metric: "Proof of Skill",
    },
    {
      id: "cloud",
      name: "Cloud Firestore & Offline-First Sync",
      shortDesc: "Google Cloud Firestore database with instant offline queueing and recovery.",
      icon: Database,
      tag: "Infrastructure",
      color: "sky",
      details: [
        "Real-Time Cloud Persistence: Backed by Google Cloud Firestore with fine-grained security rules.",
        "Reliable Offline Queue: Continue studying, completing tasks, and taking quizzes without internet; changes sync instantly upon reconnection.",
        "Universal Sync: Access your exact learning twin, notes, and progress from desktop, tablet, or mobile.",
        "End-to-End Privacy: Secure multi-tenant authentication with granular permissions for students and teachers.",
      ],
      badge: "Cloud Active",
      metric: "100% Synced",
    },
  ];

  const selectedFeature =
    appFeatures.find((f) => f.id === activeFeatureKey) || appFeatures[0];

  const faqItems = [
    {
      question: "What is EduSpark and how does it revolutionize studying?",
      answer:
        "EduSpark is an intelligent AI learning ecosystem powered by Google Gemini and Firebase Firestore. Unlike static flashcard apps or generic chatbots, EduSpark builds a persistent 'AI Learning Twin' that maps your exact knowledge gaps, diagnoses your mistake patterns, creates custom courses from raw lecture notes, and guides you with a 4-mode Socratic tutor.",
    },
    {
      question: "How does the real-time Firebase Firestore database work?",
      answer:
        "Your account, learner profile, courses, recovery plans, and progress are securely stored in Google Cloud Firestore. The platform also includes an offline sync queue—if your connection drops, all completed tasks and quizzes are preserved locally and seamlessly synced to the cloud when you reconnect.",
    },
    {
      question: "What makes the Socratic AI Tutor different from standard AI chat?",
      answer:
        "Standard chatbots simply give you the answer. EduSpark's Socratic Tutor offers 4 distinct pedagogical modes: Step-by-Step Socratic (asking guided questions so you discover the concept), Direct Conceptual Breakdown, Intuitive Real-World Analogies, or Python Code implementations. It also supports 8 global languages with audio speech synthesis.",
    },
    {
      question: "What is the 7-Day 'Fix My Learning' plan?",
      answer:
        "When EduSpark identifies weak topics or recurring mistake patterns, it algorithmically generates a structured 7-day recovery roadmap. Each day provides a targeted 10–15 minute micro-task, conceptual review, and validation check so you overcome difficult concepts without cramming or burnout.",
    },
    {
      question: "Can teachers and professors use EduSpark for classes?",
      answer:
        "Yes! EduSpark features a dedicated Educator Dashboard. Teachers can switch their account role to monitor classroom mastery curves, view drop-off rates across challenging topics, and identify students who need proactive intervention.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 selection:bg-blue-500 selection:text-white">
      {/* -------------------------------------------------------------------------- */}
      {/* TOP NAVIGATION BAR                                                        */}
      {/* -------------------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white block leading-none">
                EduSpark
              </span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                AI Learning Platform
              </span>
            </div>
          </div>

          {/* Quick Anchor Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a
              href="#features-section"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              App Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              How It Works
            </a>
            <a
              href="#architecture-section"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Cloud & AI Tech
            </a>
            <a
              href="#faq-section"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              FAQ
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Dark/Light Mode Switcher */}
            <button
              id="btn-landing-theme-toggle"
              type="button"
              onClick={toggleTheme}
              title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-2 cursor-pointer text-xs font-semibold"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-blue-500" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>

            {/* Sign In Button */}
            <button
              id="btn-landing-signin"
              type="button"
              onClick={onGoToSignIn}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
            >
              Sign In
            </button>

            {/* Get Started / Sign Up Button */}
            <button
              id="btn-landing-signup"
              type="button"
              onClick={onGoToSignUp}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(37,99,235,0.4)] transition cursor-pointer flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* -------------------------------------------------------------------------- */}
      {/* HERO SECTION                                                               */}
      {/* -------------------------------------------------------------------------- */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Decorative Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-3xl mx-auto space-y-6">
          {/* Tech Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Powered by Google Gemini 3.8 & Firebase Firestore</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Master Difficult Concepts with Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600">
              Personal AI Learning Twin
            </span>
          </h1>

          {/* Subtitle Description */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            EduSpark turns raw lecture notes into interactive mastery courses, diagnoses
            cognitive error patterns with Socratic tutoring, and generates tailored 7-Day
            recovery plans with cloud persistence.
          </p>

          {/* Action CTAs (All fully clickable!) */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-3">
            <button
              id="hero-btn-get-started"
              type="button"
              onClick={onGoToSignUp}
              className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(37,99,235,0.5)] hover:shadow-[0_0_30px_rgba(37,99,235,0.7)] transition cursor-pointer flex items-center gap-2"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-btn-signin"
              type="button"
              onClick={onGoToSignIn}
              className="px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm border border-slate-200 dark:border-slate-700 shadow-sm transition cursor-pointer flex items-center gap-2"
            >
              <Lock className="w-4 h-4 text-blue-500" />
              <span>Sign In to Portal</span>
            </button>

            <button
              id="hero-btn-guest-demo"
              type="button"
              onClick={onEnterGuestDemo}
              className="px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm border border-transparent hover:border-slate-300 dark:hover:border-slate-600 transition cursor-pointer flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Explore Live Interactive Demo</span>
            </button>
          </div>

          {/* Highlights & Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 text-left">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-lg sm:text-xl font-extrabold text-blue-600 dark:text-blue-400 block">
                98%
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Retention Boost
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-lg sm:text-xl font-extrabold text-indigo-600 dark:text-indigo-400 block">
                4 Modes
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Socratic AI Engine
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-lg sm:text-xl font-extrabold text-emerald-600 dark:text-emerald-400 block">
                7 Days
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Targeted Remediation
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-lg sm:text-xl font-extrabold text-purple-600 dark:text-purple-400 block">
                100% Cloud
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Firestore Persistence
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */}
      {/* DETAILED FEATURES SHOWCASE (ALL APP DETAILS)                                */}
      {/* -------------------------------------------------------------------------- */}
      <section
        id="features-section"
        className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800"
      >
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            Platform Capabilities
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Everything Inside EduSpark
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Explore the specialized tools designed for students, self-learners, and classroom educators. Click any capability to view detailed specifications.
          </p>
        </div>

        {/* Feature Selector Tabs (Horizontal Scrollable / Grid) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 mb-8">
          {appFeatures.slice(0, 5).map((f) => {
            const Icon = f.icon;
            const isSelected = activeFeatureKey === f.id;
            return (
              <button
                key={f.id}
                id={`feature-tab-${f.id}`}
                type="button"
                onClick={() => setActiveFeatureKey(f.id)}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                    : "bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-5 h-5 ${isSelected ? "text-white" : "text-blue-500"}`} />
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {f.badge}
                  </span>
                </div>
                <span className="text-xs font-bold truncate block">{f.name}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-10">
          {appFeatures.slice(5).map((f) => {
            const Icon = f.icon;
            const isSelected = activeFeatureKey === f.id;
            return (
              <button
                key={f.id}
                id={`feature-tab-${f.id}`}
                type="button"
                onClick={() => setActiveFeatureKey(f.id)}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                    : "bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-5 h-5 ${isSelected ? "text-white" : "text-blue-500"}`} />
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {f.badge}
                  </span>
                </div>
                <span className="text-xs font-bold truncate block">{f.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Feature Detail Hero Showcase */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold">
              <span>{selectedFeature.tag}</span>
              <span>•</span>
              <span>{selectedFeature.metric}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {selectedFeature.name}
            </h3>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedFeature.shortDesc}
            </p>

            <ul className="space-y-2.5 pt-2">
              {selectedFeature.details.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                id="btn-feature-try-now"
                type="button"
                onClick={onEnterGuestDemo}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center gap-2"
              >
                <span>Launch {selectedFeature.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="btn-feature-create-acc"
                type="button"
                onClick={onGoToSignUp}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-xs sm:text-sm transition cursor-pointer"
              >
                Sign Up to Save Progress
              </button>
            </div>
          </div>

          {/* Feature Visual Card Preview */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <selectedFeature.icon className="w-5 h-5 text-blue-500" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Live Component Preview
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold">
                READY
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Active Target</span>
                <span className="font-semibold text-blue-500">Autonomous Reasoning</span>
              </div>
              <p className="text-slate-800 dark:text-slate-200 font-medium">
                &quot;How does cellular respiration differ from photosynthesis in terms of energy transformation?&quot;
              </p>
              <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span>Confidence Score: 94%</span>
                <span className="text-emerald-500 font-bold">Concept Matched</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] block">Database</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">Cloud Firestore</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] block">AI Engine</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">Gemini 3.8 / Flash</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */}
      {/* HOW IT WORKS (3-STEP JOURNEY)                                              */}
      {/* -------------------------------------------------------------------------- */}
      <section
        id="how-it-works"
        className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800"
      >
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            User Journey
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            How EduSpark Works in 3 Steps
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            From raw study notes to guaranteed conceptual mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 dark:bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-extrabold text-lg">
              01
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Create Your Account & Calibrate
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Sign in with Email or Google to initialize your personal cloud profile. Select your role as a Student or Teacher and set your target competency goals.
            </p>
            <button
              type="button"
              onClick={onGoToSignUp}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Create Account Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-extrabold text-lg">
              02
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Synthesize Notes & Consult Tutor
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Paste your unformatted notes to generate structured flashcards, concept maps, and quizzes. When stuck, ask the Socratic AI Tutor to explain in your preferred style.
            </p>
            <button
              type="button"
              onClick={onEnterGuestDemo}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Test Interactive Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 dark:bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-extrabold text-lg">
              03
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Execute 7-Day Plans & Earn Badges
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Follow tailored remediation plans, compete in the 90-second Arena for XP, and build a verified Skill Passport proving mastery to employers and universities.
            </p>
            <button
              type="button"
              onClick={onGoToSignIn}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Sign In to Track XP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */}
      {/* SYSTEM ARCHITECTURE & SECURITY                                             */}
      {/* -------------------------------------------------------------------------- */}
      <section
        id="architecture-section"
        className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800"
      >
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 shadow-2xl space-y-8">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
              <Database className="w-3.5 h-3.5" />
              <span>Full-Stack Cloud Infrastructure</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Enterprise-Grade AI & Persistent Database
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              EduSpark combines modern server-side AI model orchestration with Google Cloud Firestore real-time storage to guarantee performance, privacy, and zero data loss.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h4 className="text-sm font-bold text-white">Firebase Firestore Database</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Deployed security rules protect user documents, course caches, recovery plans, and classroom analytics across multiple client sessions.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
              <Sparkles className="w-6 h-6 text-blue-400" />
              <h4 className="text-sm font-bold text-white">Gemini 3.8 & Flash Resiliency</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Intelligent multi-model fallback cascade automatically switches models during peak demand to ensure 100% continuous uptime.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
              <RefreshCw className="w-6 h-6 text-indigo-400" />
              <h4 className="text-sm font-bold text-white">Offline-First Synchronization</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Complete tasks and quizzes offline. Our client service maintains an indexed queue that synchronizes whenever internet access returns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */}
      {/* FREQUENTLY ASKED QUESTIONS (FAQ)                                           */}
      {/* -------------------------------------------------------------------------- */}
      <section
        id="faq-section"
        className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-200 dark:border-slate-800"
      >
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Everything you need to know about the platform, accounts, and privacy.
          </p>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, idx) => {
            const isOpen = openFaqIndices.includes(idx);
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 dark:text-white cursor-pointer"
                >
                  <span>{item.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */}
      {/* FINAL CALL TO ACTION                                                       */}
      {/* -------------------------------------------------------------------------- */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-blue-600 text-white text-center shadow-xl space-y-6 max-w-4xl mx-auto relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Accelerate Your Learning?
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto leading-relaxed">
              Join students and educators mastering complex subjects with their personal AI Learning Twin.
            </p>

            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <button
                id="btn-footer-create-account"
                type="button"
                onClick={onGoToSignUp}
                className="px-6 py-3 rounded-2xl bg-white text-blue-600 font-bold text-xs sm:text-sm shadow-md hover:bg-slate-100 transition cursor-pointer"
              >
                Create Free Account
              </button>

              <button
                id="btn-footer-signin"
                type="button"
                onClick={onGoToSignIn}
                className="px-6 py-3 rounded-2xl bg-blue-700/80 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm border border-blue-400/30 transition cursor-pointer"
              >
                Sign In to Portal
              </button>

              <button
                id="btn-footer-demo"
                type="button"
                onClick={onEnterGuestDemo}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition cursor-pointer"
              >
                Explore Live Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */}
      {/* FOOTER                                                                     */}
      {/* -------------------------------------------------------------------------- */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
            E
          </div>
          <span>EduSpark AI Learning Platform • Connected to Firebase Firestore</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
          >
            {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={onGoToSignIn}
            className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
          >
            Portal Login
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={onGoToSignUp}
            className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
          >
            Sign Up
          </button>
        </div>
      </footer>
    </div>
  );
};
