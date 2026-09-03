import React, { useState } from "react";
import {
  Brain,
  Sparkles,
  Target,
  ArrowUpRight,
  HelpCircle,
  BarChart3,
  Layers,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Lightbulb,
} from "lucide-react";
import { LearningTwin, KnowledgeNode } from "../types";

interface LearningTwinViewProps {
  learnerProfile: LearningTwin;
  onOpenFixLearning: () => void;
  onSelectTopicForTutor: (topic: string) => void;
}

export const LearningTwinView: React.FC<LearningTwinViewProps> = ({
  learnerProfile,
  onOpenFixLearning,
  onSelectTopicForTutor,
}) => {
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(learnerProfile.knowledgeMap[4]); // default to Probability
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Programming", "Mathematics", "AI & ML", "Natural Sciences"];

  const filteredNodes =
    selectedCategory === "All"
      ? learnerProfile.knowledgeMap
      : learnerProfile.knowledgeMap.filter((n) => n.category.includes(selectedCategory));

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header with Hero Tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-1">
            <Brain className="w-3.5 h-3.5" />
            <span>Hero Feature: Continuous Learner Modeling</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Your AI Learning Twin
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            A real-time cognitive model that maps what you know, where you struggle, and what to study next.
          </p>
        </div>

        <button
          onClick={onOpenFixLearning}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl text-white bg-gradient-to-r from-amber-500 to-indigo-600 shadow-md shadow-indigo-600/20 active:scale-95 transition cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>Fix My Learning</span>
        </button>
      </div>

      {/* Triad Model Architecture Diagram */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="text-center max-w-md mx-auto space-y-1">
          <span className="text-[11px] uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400">
            Learner State Synthesis
          </span>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            Strengths ⇄ Weaknesses ⇄ Career Objective
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Column 1: Strengths */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60 dark:border-emerald-800/40">
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wide">
                1. Strengths
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                High Retention
              </span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {learnerProfile.strengths.map((st, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{st}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Weaknesses & Bottlenecks */}
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-amber-200/60 dark:border-amber-800/40">
              <span className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wide">
                2. Bottlenecks
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                Intervention Target
              </span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {learnerProfile.weaknesses.map((w, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Career Goals */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/40 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-indigo-200/60 dark:border-indigo-800/40">
              <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wide">
                3. Career Target
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                Alignment
              </span>
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">{learnerProfile.targetRole}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Targeting top 10% benchmark in Machine Learning Pipelines and Applied Inference.
            </p>
            <div className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <Target className="w-3.5 h-3.5" />
              <span>Readiness currently at 58%</span>
            </div>
          </div>
        </div>

        {/* Dynamic Insight Banner */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3">
          <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p>
            <strong className="text-slate-900 dark:text-white">AI Twin Reasoning:</strong> Instead of merely prescribing &ldquo;20 more ML videos&rdquo;, EduSpark recognizes that your Machine Learning performance is 31% specifically because foundational Probability is at 48%. Restructuring study order saves ~12 hours of confusion.
          </p>
        </div>
      </div>

      {/* Interactive Knowledge Map Table & Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Knowledge Map Table */}
        <div className="lg:col-span-2 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Mastery Knowledge Map
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Click any concept node to inspect its dependency chain</p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                    selectedCategory === cat
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {filteredNodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-500 ring-2 ring-indigo-500/20"
                      : "bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        node.mastery >= 75
                          ? "bg-emerald-500"
                          : node.mastery >= 50
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                        {node.topic}
                      </p>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                        {node.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right w-24">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{node.mastery}%</span>
                      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 mt-1 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${
                            node.mastery >= 75
                              ? "bg-emerald-500"
                              : node.mastery >= 50
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          }`}
                          style={{ width: `${node.mastery}%` }}
                        />
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Selected Node Inspector */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Node Inspector</span>
            {selectedNode && (
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  selectedNode.mastery >= 75
                    ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                    : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                }`}
              >
                {selectedNode.mastery}% Mastery
              </span>
            )}
          </div>

          {selectedNode ? (
            <div className="space-y-4 text-xs">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedNode.topic}</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {selectedNode.description}
                </p>
              </div>

              {/* Prerequisites Chain */}
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Prerequisites Required
                </span>
                {selectedNode.prerequisites.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.prerequisites.map((p, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-400 italic">Foundational Node (No prior dependencies)</span>
                )}
              </div>

              {/* Key Formulas / Syntaxes */}
              {selectedNode.keyFormulas && selectedNode.keyFormulas.length > 0 && (
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Key Syntax & Relationships
                  </span>
                  <div className="space-y-1">
                    {selectedNode.keyFormulas.map((f, idx) => (
                      <code
                        key={idx}
                        className="block px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-[11px] border border-slate-200 dark:border-slate-700 truncate"
                      >
                        {f}
                      </code>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary note */}
              {selectedNode.summary && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">Learner Twin Note</span>
                  <p>{selectedNode.summary}</p>
                </div>
              )}

              <button
                onClick={() => onSelectTopicForTutor(selectedNode.topic)}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Tutor Me on {selectedNode.topic.split(" ")[0]}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <p className="text-slate-400 text-xs text-center py-8">Select a node from the map to inspect.</p>
          )}
        </div>
      </div>
    </div>
  );
};
