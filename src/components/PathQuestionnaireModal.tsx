import React, { useState } from "react";
import {
  Compass,
  Bot,
  Code2,
  BarChart3,
  Atom,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Target,
  Brain,
  Zap,
  BookOpen,
  MessageSquare,
  Layers,
  X,
  FileText,
  Volume2,
} from "lucide-react";
import { UserLearningPath, PathQuestionnaireAnswers } from "../types";
import { PATH_TRACK_PRESETS, generateCustomPath } from "../data/pathPresets";

interface PathQuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePath: (path: UserLearningPath) => void;
  studentName: string;
  userId: string;
  initialPath?: UserLearningPath | null;
  allowDismiss?: boolean;
}

export const PathQuestionnaireModal: React.FC<PathQuestionnaireModalProps> = ({
  isOpen,
  onClose,
  onSavePath,
  studentName,
  userId,
  initialPath,
  allowDismiss = true,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 5;

  // Answers State
  const [answers, setAnswers] = useState<PathQuestionnaireAnswers>({
    trackId: initialPath?.trackId || "ai_engineer",
    customGoal: initialPath?.customGoal || "",
    level: initialPath?.level || "intermediate",
    learningStyle: initialPath?.learningStyle || "Visual-Interactive",
    dailyCommitmentMinutes: initialPath?.dailyCommitmentMinutes || 30,
    primaryPriority: initialPath?.primaryPriority || "Fix foundational math & logic bottlenecks",
  });

  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesizedBlueprint, setSynthesizedBlueprint] = useState<UserLearningPath | null>(null);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === totalSteps) {
      // Transition to Blueprint Review (Step 6)
      setIsSynthesizing(true);
      setTimeout(() => {
        const generated = generateCustomPath(answers, studentName, userId);
        setSynthesizedBlueprint(generated);
        setIsSynthesizing(false);
        setCurrentStep(6);
      }, 700);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirmPath = () => {
    if (synthesizedBlueprint) {
      onSavePath(synthesizedBlueprint);
    } else {
      const generated = generateCustomPath(answers, studentName, userId);
      onSavePath(generated);
    }
    onClose();
  };

  const selectedPreset = PATH_TRACK_PRESETS.find((p) => p.id === answers.trackId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 transition-all">
        {/* Top Header with Progress */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Personalized Path Setup
                </span>
                {currentStep <= totalSteps && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    Step {currentStep} of {totalSteps}
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                {currentStep === 1 && "Choose Your Target Learning Path"}
                {currentStep === 2 && "Assess Your Baseline Experience"}
                {currentStep === 3 && "Select Your Primary Learning Style"}
                {currentStep === 4 && "Set Your Daily Study Commitment"}
                {currentStep === 5 && "Define Your Immediate Focus Priority"}
                {currentStep === 6 && "Your Calibrated Learning Roadmap"}
              </h2>
            </div>
          </div>

          {allowDismiss && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Close and explore default track"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Step Indicator Bar */}
        {currentStep <= totalSteps && (
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-7 max-h-[70vh] overflow-y-auto">
          {/* STEP 1: CHOOSE TARGET TRACK */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Where do you want to direct your focus? Choose an industry-aligned role or specify your own custom target.
              </p>

              <div className="grid grid-cols-1 gap-3">
                {PATH_TRACK_PRESETS.map((preset) => {
                  const isSelected = answers.trackId === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => setAnswers((prev) => ({ ...prev, trackId: preset.id }))}
                      className={`p-4 rounded-2xl border-2 transition cursor-pointer relative ${
                        isSelected
                          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 shadow-xs"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/50"
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`p-2.5 rounded-xl shrink-0 ${
                            isSelected
                              ? "bg-blue-600 text-white"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {preset.id === "ai_engineer" && <Bot className="w-5 h-5" />}
                          {preset.id === "fullstack_developer" && <Code2 className="w-5 h-5" />}
                          {preset.id === "data_scientist" && <BarChart3 className="w-5 h-5" />}
                          {preset.id === "stem_academic" && <Atom className="w-5 h-5" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                              {preset.roleTitle}
                            </h3>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                              {preset.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                            {preset.tagline}
                          </p>

                          <div className="mt-2.5 flex flex-wrap gap-1.5">
                            {preset.targetSkills.slice(0, 4).map((skill, idx) => (
                              <span
                                key={idx}
                                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 self-center" />
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Custom Track Option */}
                <div
                  onClick={() => setAnswers((prev) => ({ ...prev, trackId: "custom" }))}
                  className={`p-4 rounded-2xl border-2 transition cursor-pointer relative ${
                    answers.trackId === "custom"
                      ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 shadow-xs"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/50"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`p-2.5 rounded-xl shrink-0 ${
                        answers.trackId === "custom"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <Target className="w-5 h-5" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          Custom / Self-Directed Goal
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                          Tailored
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Define your own specific target role, examination, or topic area.
                      </p>

                      {answers.trackId === "custom" && (
                        <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            placeholder="e.g. Cybersecurity Analyst, Robotics Engineer, MCAT Bio..."
                            value={answers.customGoal}
                            onChange={(e) =>
                              setAnswers((prev) => ({ ...prev, customGoal: e.target.value }))
                            }
                            className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: EXPERIENCE LEVEL */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                How would you describe your baseline familiarity with this track? This calibrates your initial diagnostic challenge and prerequisite depth.
              </p>

              <div className="grid grid-cols-1 gap-3">
                {[
                  {
                    id: "beginner" as const,
                    title: "Beginner / Ground Floor",
                    tag: "First Principles",
                    desc: "Starting fresh or rebuilding fundamentals. You prefer intuitive mental models, zero jargon, and guided step-by-step clarity.",
                    icon: "🌱",
                  },
                  {
                    id: "intermediate" as const,
                    title: "Intermediate / Active Builder",
                    tag: "Applied Practice",
                    desc: "You understand syntax and basic formulas. You want hands-on challenges, to connect disparate concepts, and eliminate subtle misconceptions.",
                    icon: "⚡",
                  },
                  {
                    id: "advanced" as const,
                    title: "Advanced / High-Stakes Practitioner",
                    tag: "Mastery & Speed",
                    desc: "Strong foundational grasp. Aiming for complex system architecture, competitive speed benchmarks, and professional capstones.",
                    icon: "🚀",
                  },
                ].map((lvl) => {
                  const isSelected = answers.level === lvl.id;
                  return (
                    <div
                      key={lvl.id}
                      onClick={() => setAnswers((prev) => ({ ...prev, level: lvl.id }))}
                      className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-start gap-3.5 ${
                        isSelected
                          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 shadow-xs"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div className="text-2xl shrink-0 p-1">{lvl.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            {lvl.title}
                          </h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {lvl.tag}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {lvl.desc}
                        </p>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 self-center" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: LEARNING STYLE */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Which cognitive modality helps you retain complex topics best? Your AI Learning Twin and Socratic Tutor will adapt their explanations to this preference.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: "Visual-Interactive" as const,
                    title: "Visual-Interactive",
                    desc: "Simulations, concept graphs, mental models, flowchart diagrams, and spatial relationships.",
                    icon: Brain,
                  },
                  {
                    id: "Socratic-Inquiry" as const,
                    title: "Socratic-Inquiry",
                    desc: "Guided discovery through question-and-answer dialogue, revealing underlying logic step-by-step.",
                    icon: MessageSquare,
                  },
                  {
                    id: "Text-Structured" as const,
                    title: "Text-Structured",
                    desc: "Clean markdown outlines, first-principles mathematical derivations, formula cards, and structured bullets.",
                    icon: FileText,
                  },
                  {
                    id: "Auditory-Verbal" as const,
                    title: "Auditory-Verbal",
                    desc: "Spoken explanations, voice synthesis pacing, storytelling analogies, and conversational debriefs.",
                    icon: Volume2,
                  },
                ].map((style) => {
                  const isSelected = answers.learningStyle === style.id;
                  const Icon = style.icon;
                  return (
                    <div
                      key={style.id}
                      onClick={() => setAnswers((prev) => ({ ...prev, learningStyle: style.id }))}
                      className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 shadow-xs"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div
                            className={`p-2 rounded-xl ${
                              isSelected
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {style.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {style.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: DAILY COMMITMENT */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                How much dedicated study time can you commit daily? We will configure your streak protection and milestone pacing accordingly.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    minutes: 15,
                    title: "15 min / day",
                    label: "Micro-Sprints",
                    desc: "Targeted single-concept focus + 90s speed arena. Optimal for busy schedules with Smart Streak protection.",
                    weeks: "10-12 Weeks",
                  },
                  {
                    minutes: 30,
                    title: "30-45 min / day",
                    label: "Recommended",
                    desc: "Daily diagnostic review, Socratic tutor exploration, and 1 core milestone task.",
                    weeks: "6-8 Weeks",
                  },
                  {
                    minutes: 60,
                    title: "60+ min / day",
                    label: "Accelerator",
                    desc: "Intensive immersion: deep architecture builds, mistake autopsies, and rapid capstone development.",
                    weeks: "4-6 Weeks",
                  },
                ].map((item) => {
                  const isSelected = answers.dailyCommitmentMinutes === item.minutes;
                  return (
                    <div
                      key={item.minutes}
                      onClick={() =>
                        setAnswers((prev) => ({ ...prev, dailyCommitmentMinutes: item.minutes }))
                      }
                      className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 shadow-xs"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                            {item.label}
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                        </div>
                        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                        <span>Est: {item.weeks}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: IMMEDIATE PRIORITY */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                What is your most pressing learning priority or current roadblock right now? We will prioritize this in your Day 1 recovery blueprint.
              </p>

              <div className="grid grid-cols-1 gap-3">
                {[
                  {
                    id: "Fix foundational math & logic bottlenecks",
                    title: "Fix Foundational Math, Logic & Concept Gaps",
                    desc: "Resolve prerequisite blind spots (e.g. Bayes priors, call stacks, formulas) preventing higher-level progress.",
                    icon: Zap,
                  },
                  {
                    id: "Build high-impact portfolio capstone projects",
                    title: "Build Standout Portfolio Capstones",
                    desc: "Direct hands-on focus on creating verified, production-grade applications that demonstrate real competence.",
                    icon: Layers,
                  },
                  {
                    id: "Prepare for high-stakes exam or technical interview",
                    title: "Exam & Technical Assessment Preparation",
                    desc: "Timed speed practice, trick question identification, and rigorous misconception eradication.",
                    icon: Target,
                  },
                  {
                    id: "Master long-term retention and avoid forgetting",
                    title: "Long-Term Retention & Active Spaced Recall",
                    desc: "Systematic smart review intervals, active flashcard quizzing, and confidence tracking.",
                    icon: Brain,
                  },
                ].map((pri) => {
                  const isSelected = answers.primaryPriority === pri.id;
                  const Icon = pri.icon;
                  return (
                    <div
                      key={pri.id}
                      onClick={() => setAnswers((prev) => ({ ...prev, primaryPriority: pri.id }))}
                      className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-start gap-3.5 ${
                        isSelected
                          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 shadow-xs"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div
                        className={`p-2.5 rounded-xl shrink-0 ${
                          isSelected
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {pri.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {pri.desc}
                        </p>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 self-center" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: AI BLUEPRINT SYNTHESIS & REVIEW */}
          {currentStep === 6 && synthesizedBlueprint && (
            <div className="space-y-5">
              {/* Top Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/20 uppercase tracking-wider">
                    Custom Path Generated
                  </span>
                  <span className="text-xs font-semibold text-blue-100 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{synthesizedBlueprint.completionEstimateWeeks} Weeks to Target Readiness</span>
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold">{synthesizedBlueprint.roleTitle}</h3>
                <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                  {synthesizedBlueprint.description}
                </p>
              </div>

              {/* Profile Config Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Level</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white capitalize">
                    {synthesizedBlueprint.level}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Modality</span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    {synthesizedBlueprint.learningStyle}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Daily Goal</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {synthesizedBlueprint.dailyCommitmentMinutes} mins/day
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Starting Step</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 truncate block">
                    Phase 1 Active
                  </span>
                </div>
              </div>

              {/* Roadmap Milestones */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Your Bespoke 3-Phase Roadmap
                </h4>
                <div className="space-y-2">
                  {synthesizedBlueprint.roadmap.map((phase) => (
                    <div
                      key={phase.phase}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex items-start gap-3"
                    >
                      <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {phase.phase}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                            {phase.title}
                          </h5>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {phase.duration}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {phase.focus}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 flex items-center justify-between">
          <div>
            {currentStep > 1 && currentStep <= totalSteps && (
              <button
                type="button"
                onClick={handleBack}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}
            {currentStep === 6 && (
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Modify Answers</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {allowDismiss && currentStep <= totalSteps && (
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
              >
                Skip for now
              </button>
            )}

            {currentStep < totalSteps && (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs sm:text-sm hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {currentStep === totalSteps && (
              <button
                type="button"
                onClick={handleNext}
                disabled={isSynthesizing}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs sm:text-sm hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSynthesizing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Calibrating Path...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate My Path</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}

            {currentStep === 6 && (
              <button
                type="button"
                onClick={handleConfirmPath}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs sm:text-sm hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/25 transition flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch My Learning Path</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
