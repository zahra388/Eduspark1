import React, { useState } from "react";
import {
  Crosshair,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Search,
} from "lucide-react";
import { initialMistakes } from "../data/initialData";
import { MistakeRecord } from "../types";

export const MistakeAnalyzerView: React.FC = () => {
  const [mistakes, setMistakes] = useState<MistakeRecord[]>(initialMistakes);
  const [selectedMistake, setSelectedMistake] = useState<MistakeRecord>(initialMistakes[0]);
  const [retestAnswer, setRetestAnswer] = useState<number | null>(null);
  const [retestSubmitted, setRetestSubmitted] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("All");

  const categories = ["All", "Conceptual Misunderstanding", "Formula Recall", "Misreading Question", "Calculation Error"];

  const filteredMistakes =
    filterCategory === "All"
      ? mistakes
      : mistakes.filter((m) => m.errorType.includes(filterCategory));

  const handleSelectMistake = (m: MistakeRecord) => {
    setSelectedMistake(m);
    setRetestAnswer(null);
    setRetestSubmitted(false);
  };

  const handleRetestSubmit = () => {
    setRetestSubmitted(true);
    if (selectedMistake.followUpPractice && retestAnswer === selectedMistake.followUpPractice.correctIndex) {
      // Mark as reviewed
      setMistakes((prev) =>
        prev.map((item) => (item.id === selectedMistake.id ? { ...item, reviewed: true } : item))
      );
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-semibold mb-1">
            <Crosshair className="w-3.5 h-3.5" />
            <span>AI Error Autopsy & Cognitive Diagnostics</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Mistake Analyzer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Categorizing root cognitive causes behind wrong answers, with targeted variant re-tests.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                filterCategory === cat
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {cat.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Mistake History List + Diagnostic Deep-Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: Mistake List */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Recorded Errors ({filteredMistakes.length})
            </span>
            <span className="text-xs text-rose-600 font-semibold">Priority Review</span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredMistakes.map((item) => {
              const isSelected = selectedMistake.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectMistake(item)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                    isSelected
                      ? "bg-rose-50/80 dark:bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/20"
                      : "bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                      {item.topic}
                    </span>
                    {item.reviewed ? (
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Fixed
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-600">Pending</span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                    {item.question}
                  </p>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    Type: {item.errorType}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Deep Autopsy & Interactive Re-Test */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          {/* Question & Mistake Overview */}
          <div className="space-y-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                Cognitive Flaw: {selectedMistake.errorType}
              </span>
              <span className="text-xs text-slate-400">{selectedMistake.timestamp}</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {selectedMistake.question}
            </h2>
          </div>

          {/* Comparison of Student Answer vs Correct Answer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-1">
              <span className="text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                Your Selection
              </span>
              <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                {selectedMistake.studentAnswer}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-1">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Correct Answer
              </span>
              <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                {selectedMistake.correctAnswer}
              </p>
            </div>
          </div>

          {/* Why It Happened & Correct Thinking */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>AI Cognitive Diagnosis & Root Cause</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {selectedMistake.whyItHappened}
            </p>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-0.5">
                Target Mental Model
              </span>
              <p className="text-slate-600 dark:text-slate-300">{selectedMistake.correctThinking}</p>
            </div>
          </div>

          {/* Interactive Re-Test Variant */}
          {selectedMistake.followUpPractice && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-purple-50/40 dark:from-indigo-950/30 dark:to-slate-900 border border-indigo-200 dark:border-indigo-900/50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-bold text-xs sm:text-sm">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Immediate Fix Variant (Retest)</span>
                </div>
                {retestSubmitted && (
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      retestAnswer === selectedMistake.followUpPractice.correctIndex
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {retestAnswer === selectedMistake.followUpPractice.correctIndex
                      ? "Flaw Resolved! +50 XP"
                      : "Try Again"}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                {selectedMistake.followUpPractice.question}
              </p>

              <div className="space-y-2">
                {selectedMistake.followUpPractice.options.map((opt, optIdx) => {
                  const isSelected = retestAnswer === optIdx;
                  let btnClass = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300";

                  if (retestSubmitted) {
                    if (optIdx === selectedMistake.followUpPractice!.correctIndex) {
                      btnClass = "bg-emerald-100 dark:bg-emerald-950 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold";
                    } else if (isSelected) {
                      btnClass = "bg-rose-100 dark:bg-rose-950 border-rose-500 text-rose-900 dark:text-rose-200";
                    }
                  } else if (isSelected) {
                    btnClass = "bg-indigo-50 dark:bg-indigo-950 border-indigo-600 text-indigo-900 dark:text-indigo-200 font-bold";
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => !retestSubmitted && setRetestAnswer(optIdx)}
                      className={`w-full p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${btnClass}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {!retestSubmitted ? (
                <button
                  onClick={handleRetestSubmit}
                  disabled={retestAnswer === null}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs disabled:opacity-50 transition cursor-pointer"
                >
                  Verify Fix
                </button>
              ) : (
                <p className="text-xs text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  {selectedMistake.followUpPractice.explanation}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
