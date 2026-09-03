import React from "react";
import {
  Sparkles,
  Flame,
  ShieldCheck,
  TrendingUp,
  Brain,
  MessageSquareQuote,
  FileSpreadsheet,
  Trophy,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Compass,
} from "lucide-react";
import { LearningTwin, RecoveryPlan, UserLearningPath } from "../types";
import { TabKey } from "../components/Sidebar";

interface DashboardViewProps {
  learnerProfile: LearningTwin;
  activePlan: RecoveryPlan | null;
  userLearningPath?: UserLearningPath | null;
  onOpenFixLearning: () => void;
  onOpenPathQuestionnaire?: () => void;
  onNavigate: (tab: TabKey) => void;
  onCompleteTask: (dayNum: number, taskIdx: number) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  learnerProfile,
  activePlan,
  userLearningPath,
  onOpenFixLearning,
  onOpenPathQuestionnaire,
  onNavigate,
  onCompleteTask,
}) => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Welcome & Target Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Learning Ecosystem Active</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {learnerProfile.studentName.split(" ")[0]}!
          </h1>

          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Your AI Learning Twin detected a <span className="text-amber-300 font-semibold">+18% improvement</span> in loops & logic. Next, let&apos;s tackle the <span className="underline decoration-amber-400 decoration-2 font-medium">Probability & Bayes</span> bottleneck to accelerate your roadmap toward <span className="font-semibold text-white">{learnerProfile.targetRole}</span>.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              id="dash-fix-learning-cta"
              onClick={onOpenFixLearning}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white text-blue-600 shadow-md shadow-black/10 hover:bg-slate-100 active:scale-98 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Fix My Learning</span>
            </button>

            {onOpenPathQuestionnaire && (
              <button
                onClick={onOpenPathQuestionnaire}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-white/20 hover:bg-white/30 border border-white/30 text-white backdrop-blur-xs transition cursor-pointer"
              >
                <Compass className="w-4 h-4 text-amber-300" />
                <span>Customize Path</span>
              </button>
            )}

            <button
              onClick={() => onNavigate("challenge")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-slate-900/30 hover:bg-slate-900/50 border border-white/20 text-white backdrop-blur-xs transition cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>90s Challenge Arena</span>
            </button>
          </div>
        </div>

        {/* Ambient glowing circles */}
        <div className="absolute -right-6 -bottom-6 w-56 h-56 bg-white/10 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute right-20 top-0 w-72 h-72 bg-blue-400/20 blur-2xl pointer-events-none rounded-full" />
      </div>

      {/* Dedicated Active Learning Path Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0 mt-0.5">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  Active Career Path
                </span>
                {userLearningPath?.level && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize">
                    {userLearningPath.level} Level
                  </span>
                )}
                {userLearningPath?.dailyCommitmentMinutes && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{userLearningPath.dailyCommitmentMinutes}m/day</span>
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
                {userLearningPath?.roleTitle || learnerProfile.targetRole}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                {userLearningPath?.description || "Personalized curriculum aligned with real-world technical mastery."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            {onOpenPathQuestionnaire && (
              <button
                onClick={onOpenPathQuestionnaire}
                className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-50 dark:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-blue-500" />
                <span>Switch / Calibrate Path</span>
              </button>
            )}
            <button
              onClick={() => onNavigate("career")}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>View Full Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3-Phase Roadmap Timeline Preview */}
        {userLearningPath?.roadmap && userLearningPath.roadmap.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
            {userLearningPath.roadmap.map((phase) => (
              <div
                key={phase.phase}
                className={`p-3.5 rounded-xl border transition ${
                  phase.status === "in_progress"
                    ? "border-blue-500/50 bg-blue-50/40 dark:bg-blue-950/20 shadow-xs"
                    : "border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40"
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Phase {phase.phase} • {phase.duration}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      phase.status === "in_progress"
                        ? "bg-blue-500 text-white"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {phase.status === "in_progress" ? "Current Focus" : "Upcoming"}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                  {phase.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {phase.focus}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Metrics Row: Smart Streak, Mastery, Level */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Smart Streak */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Smart Streak</span>
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Flame className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
              {learnerProfile.studyStreakDays} Days
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Protected
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Weekly goal safeguards streak integrity</span>
          </p>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-amber-500/5 blur-2xl pointer-events-none" />
        </div>

        {/* Overall Mastery */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Knowledge Mastery</span>
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
              {learnerProfile.overallMastery}%
            </span>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 font-mono">+14% this week</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden mt-1">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              style={{ width: `${learnerProfile.overallMastery}%` }}
            />
          </div>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-blue-600/10 blur-2xl pointer-events-none" />
        </div>

        {/* Gamification Level & XP */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Learner Tier</span>
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Trophy className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Level {learnerProfile.level}
            </span>
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
              {learnerProfile.levelTitle}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono pt-1">
            {learnerProfile.xp} XP total • Next tier at 3,000 XP
          </p>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-blue-500/10 blur-2xl pointer-events-none" />
        </div>
      </div>

      {/* Hero Feature Spotlight: Active Recovery Plan vs Learner Twin Insight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Recovery Plan / Today's Action */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {activePlan ? activePlan.title : "Recommended Next Best Action"}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {activePlan ? "Day 1 of 7: Probability Fundamentals" : "Adaptive curriculum tailored to your gap profile"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigate("tutor")}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Ask AI Tutor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Daily check-in checklist */}
            <div className="space-y-2.5">
              {(activePlan ? activePlan.days[0].tasks : [
                "Probability tree diagram visual simulation",
                "5 Socratic questions on conditional priors",
                "90-second timed speed sprint",
              ]).map((task, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onCompleteTask(1, idx)}
                      className="w-5 h-5 rounded-md border border-blue-500/40 flex items-center justify-center hover:bg-blue-500/10 transition cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </button>
                    <span>{task}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    +40 XP
                  </span>
                </div>
              ))}
            </div>

            {/* Recovery Plan Trigger Note */}
            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>
                EduSpark detected: Your Machine Learning score is currently constrained by statistical foundations. Spend 4 days consolidating conditional probability to unlock ML algorithms.
              </span>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-600/10 blur-3xl pointer-events-none" />
          </div>

          {/* Quick Hub Launchers */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button
              onClick={() => onNavigate("tutor")}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 text-left transition-colors shadow-xs group cursor-pointer relative overflow-hidden"
            >
              <div className="p-2.5 w-fit rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-2.5 border border-blue-500/20 group-hover:scale-105 transition-transform">
                <MessageSquareQuote className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-bold block text-slate-900 dark:text-white">AI Tutor</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Voice & Socratic</span>
              <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-blue-600/5 blur-2xl pointer-events-none" />
            </button>

            <button
              onClick={() => onNavigate("notes")}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 text-left transition-colors shadow-xs group cursor-pointer relative overflow-hidden"
            >
              <div className="p-2.5 w-fit rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-2.5 border border-emerald-500/20 group-hover:scale-105 transition-transform">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-bold block text-slate-900 dark:text-white">Notes to Course</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Instant Flashcards</span>
              <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-emerald-600/5 blur-2xl pointer-events-none" />
            </button>

            <button
              onClick={() => onNavigate("career")}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 text-left transition-colors shadow-xs group cursor-pointer col-span-2 sm:col-span-1 relative overflow-hidden"
            >
              <div className="p-2.5 w-fit rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-2.5 border border-blue-500/20 group-hover:scale-105 transition-transform">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-bold block text-slate-900 dark:text-white">Career Gap</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Readiness roadmap</span>
              <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-blue-600/5 blur-2xl pointer-events-none" />
            </button>
          </div>
        </div>

        {/* Right 1 Col: AI Learning Twin Quick Peek */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <Brain className="w-4 h-4" />
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Learner Twin Snapshot
              </h2>
            </div>
            <button
              onClick={() => onNavigate("twin")}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Deep Map →
            </button>
          </div>

          <div className="space-y-3">
            {/* Strengths */}
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400">
                Top Strengths
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {learnerProfile.strengths.slice(0, 3).map((st, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium"
                  >
                    {st}
                  </span>
                ))}
              </div>
            </div>

            {/* Weaknesses / Gaps */}
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400">
                Active Growth Areas
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {learnerProfile.weaknesses.slice(0, 3).map((w, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium"
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>

            {/* Learning Style */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400">Preferred Mode</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-md">
                  {learnerProfile.learningStyle}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate("twin")}
            className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-center cursor-pointer"
          >
            Open Complete Knowledge Graph
          </button>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-600/10 blur-3xl pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
