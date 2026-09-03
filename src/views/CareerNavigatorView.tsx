import React, { useState } from "react";
import {
  Compass,
  Briefcase,
  Target,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Award,
  Layers,
} from "lucide-react";
import { initialCareerTracks } from "../data/initialData";
import { CareerTrack, UserLearningPath } from "../types";

interface CareerNavigatorViewProps {
  userLearningPath?: UserLearningPath | null;
  onOpenPathQuestionnaire?: () => void;
  onAdoptTrack?: (roleTitle: string) => void;
}

export const CareerNavigatorView: React.FC<CareerNavigatorViewProps> = ({
  userLearningPath,
  onOpenPathQuestionnaire,
  onAdoptTrack,
}) => {
  const [tracks, setTracks] = useState<CareerTrack[]>(initialCareerTracks);
  const [selectedTrack, setSelectedTrack] = useState<CareerTrack>(initialCareerTracks[0]);
  const [isGeneratingProject, setIsGeneratingProject] = useState(false);
  const [generatedProject, setGeneratedProject] = useState<string | null>(null);

  const handleGenerateProject = () => {
    setIsGeneratingProject(true);
    setTimeout(() => {
      setGeneratedProject(
        `### 🚀 Capstone Project: Real-time Multi-Agent Bayesian Diagnostic Engine\n\nBuild an interactive dashboard that ingests medical symptom data, applies Bayes Theorem with dynamic priors, and generates confidence intervals for diagnostic recommendations. Incorporates Python, NumPy, Vector Embeddings, and Fastify backend.`
      );
      setIsGeneratingProject(false);
    }, 700);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Target Role & Industry Readiness</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            AI Career Navigator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Compare your current Learning Twin mastery against real-world tech & engineering job specifications.
          </p>
        </div>

        {/* Track Selector & Personalize Button */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold">
            {tracks.map((track) => (
              <button
                key={track.id}
                onClick={() => {
                  setSelectedTrack(track);
                  setGeneratedProject(null);
                }}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  selectedTrack.id === track.id
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {track.roleTitle.split(" ")[0]}
              </button>
            ))}
          </div>

          {onOpenPathQuestionnaire && (
            <button
              onClick={onOpenPathQuestionnaire}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Personalize Path</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Readiness Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs text-indigo-200 font-semibold">
              <Briefcase className="w-4 h-4 text-indigo-300" />
              <span>Target Role Specification</span>
            </div>
            {userLearningPath?.roleTitle.toLowerCase().includes(selectedTrack.roleTitle.toLowerCase().split(" ")[0]) && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Current Active Path
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold">{selectedTrack.roleTitle}</h2>
          <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
            {selectedTrack.description}
          </p>

          {onAdoptTrack && (
            <div className="pt-1">
              <button
                onClick={() => onAdoptTrack(selectedTrack.roleTitle)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-semibold backdrop-blur-xs transition cursor-pointer"
              >
                <Target className="w-3.5 h-3.5 text-amber-300" />
                <span>Adopt as Active Target Path</span>
              </button>
            </div>
          )}
        </div>

        {/* Readiness Radial / Percentage Pill */}
        <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0 w-full sm:w-auto">
          <span className="text-[11px] uppercase tracking-wider text-indigo-200 font-bold block">
            Readiness Index
          </span>
          <span className="text-3xl sm:text-4xl font-extrabold text-amber-300 block my-1">
            {selectedTrack.currentMatchPercent}%
          </span>
          <span className="text-xs text-indigo-100">
            {selectedTrack.skillsAcquired.length} of {selectedTrack.targetSkills.length} skills mastered
          </span>
        </div>
      </div>

      {/* Skills Matrix: Acquired vs Missing Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Acquired Skills */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Skills Mastered ({selectedTrack.skillsAcquired.length})</span>
            </span>
            <span className="text-xs text-slate-400">Verified by quizzes</span>
          </div>

          <div className="space-y-2">
            {selectedTrack.skillsAcquired.map((skill, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 text-xs font-semibold text-emerald-900 dark:text-emerald-300 flex items-center justify-between"
              >
                <span>{skill}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                  Ready
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Gaps */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Critical Gaps to Bridge ({selectedTrack.skillsMissing.length})</span>
            </span>
            <span className="text-xs text-amber-600 font-semibold">Priority Focus</span>
          </div>

          <div className="space-y-2">
            {selectedTrack.skillsMissing.map((skill, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 text-xs font-semibold text-amber-900 dark:text-amber-300 flex items-center justify-between"
              >
                <span>{skill}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                  Needs Study
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Milestone Roadmap */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Target Milestone Roadmap
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sequence of milestones required to reach 90%+ readiness benchmark
            </p>
          </div>

          <button
            onClick={handleGenerateProject}
            disabled={isGeneratingProject}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGeneratingProject ? "Generating..." : "Suggest Capstone Project"}</span>
          </button>
        </div>

        {/* Roadmap Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {selectedTrack.roadmap.map((step) => (
            <div
              key={step.step}
              className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                step.status === "completed"
                  ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50"
                  : step.status === "in_progress"
                  ? "bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/50"
                  : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-80"
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span className="text-slate-900 dark:text-white">Milestone {step.step}</span>
                <span
                  className={`text-[10px] uppercase px-1.5 py-0.2 rounded font-semibold ${
                    step.status === "completed"
                      ? "bg-emerald-100 text-emerald-800"
                      : step.status === "in_progress"
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {step.status.replace("_", " ")}
                </span>
              </div>
              <p className="font-bold text-slate-800 dark:text-slate-200">{step.title}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{step.focus}</p>
            </div>
          ))}
        </div>

        {/* AI Generated Capstone Project */}
        {generatedProject && (
          <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-xs text-slate-800 dark:text-slate-200 leading-relaxed space-y-2 animate-in fade-in duration-300">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>AI Tailored Resume Capstone</span>
            </div>
            <p className="whitespace-pre-wrap">{generatedProject}</p>
          </div>
        )}
      </div>
    </div>
  );
};
