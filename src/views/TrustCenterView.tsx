import React, { useState } from "react";
import { ShieldCheck, Lock, Eye, Download, Trash2, CheckCircle2, Cpu, FileJson } from "lucide-react";
import { LearningTwin } from "../types";
import { syncService } from "../services/syncService";

interface TrustCenterViewProps {
  learnerProfile: LearningTwin;
}

export const TrustCenterView: React.FC<TrustCenterViewProps> = ({ learnerProfile }) => {
  const [downloaded, setDownloaded] = useState(false);
  const [cleared, setCleared] = useState(false);

  const handleDownloadProfile = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(learnerProfile, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `eduspark_profile_${learnerProfile.studentName.replace(/\s+/g, "_")}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const handleClearCache = () => {
    if (confirm("Are you sure you want to clear your local sync queue and temporary cache?")) {
      syncService.clearQueue();
      setCleared(true);
      setTimeout(() => setCleared(false), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Transparent AI & Learner Privacy</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Safety, Ethics & Trust Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          EduSpark adheres to transparent learner modeling, verifiable citations, and local-first data ownership.
        </p>
      </div>

      {/* 3 Pillars of EduSpark Trust */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 w-fit">
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Algorithmic Explainability</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Every recovery recommendation stems from deterministic prerequisite DAG mappings, not black-box predictions.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 w-fit">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Anti-Hallucination Guard</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            All curriculum generation is grounded directly in peer-reviewed textbook citations and your uploaded source notes.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 w-fit">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Local-First Privacy</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Your notes, quiz history, and error logs are stored on-device first with end-to-end encryption.
          </p>
        </div>
      </div>

      {/* Student Data Controls */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Learner Data Ownership</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Export your complete cognitive profile or manage offline caches at any time.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleDownloadProfile}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{downloaded ? "Profile JSON Exported!" : "Export Cognitive Twin (JSON)"}</span>
          </button>

          <button
            onClick={handleClearCache}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold text-xs transition cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>{cleared ? "Queue Cleared!" : "Clear Offline Cache Queue"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
