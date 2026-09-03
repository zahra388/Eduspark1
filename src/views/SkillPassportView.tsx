import React, { useState } from "react";
import { Award, ShieldCheck, CheckCircle2, Share2, Copy, Download, Sparkles, ExternalLink } from "lucide-react";

export const SkillPassportView: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const certificates = [
    {
      id: "EDUSPARK-DS-8842",
      title: "Data Science & Algorithmic Foundations",
      level: "Level 3 Mastery",
      score: "89%",
      issuedDate: "August 2026",
      issuer: "EduSpark AI Adaptive Certification Authority",
      skills: ["Python Data Structures", "Algorithmic Complexity", "Statistical Foundations"],
      hash: "0x7f2a...9b41",
    },
    {
      id: "EDUSPARK-BIO-3319",
      title: "Cellular Bioenergetics & Photosystems",
      level: "Level 2 Mastery",
      score: "92%",
      issuedDate: "July 2026",
      issuer: "EduSpark STEM Knowledge Graph",
      skills: ["Light Reactions", "Chemiosmotic ATP Synthase", "Carbon Fixation"],
      hash: "0x3e1c...7d98",
    },
    {
      id: "EDUSPARK-MECH-1094",
      title: "Classical Newtonian Dynamics",
      level: "Level 2 Mastery",
      score: "85%",
      issuedDate: "June 2026",
      issuer: "EduSpark STEM Knowledge Graph",
      skills: ["Kinematic Equations", "Free Body Diagrams", "Work-Energy Theorem"],
      hash: "0x88f4...112e",
    },
  ];

  const handleCopy = (id: string) => {
    navigator.clipboard?.writeText(`https://eduspark.ai/verify/${id}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-semibold mb-1">
            <Award className="w-3.5 h-3.5" />
            <span>Verifiable Micro-Credentials</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Skill Passport
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Cryptographically signed mastery badges based on objective concept quiz benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" />
            <span>3 Verified Badges</span>
          </span>
        </div>
      </div>

      {/* Grid of Verifiable Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-indigo-400 dark:hover:border-indigo-600 transition"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-xs">
                  <Award className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {cert.level}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {cert.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Issued by {cert.issuer} • {cert.issuedDate}
                </p>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {cert.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="font-mono text-[11px]">{cert.id}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{cert.score} Score</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(cert.id)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedId === cert.id ? "Link Copied!" : "Share Link"}</span>
                </button>

                <button
                  onClick={() => alert(`Certificate ${cert.id} verification verified on chain: ${cert.hash}`)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                  title="Verify Badge Authenticity"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
