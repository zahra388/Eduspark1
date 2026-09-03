import React, { useState } from "react";
import {
  Network,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  ArrowRight,
  Layers,
  HelpCircle,
} from "lucide-react";

interface ConceptNode {
  id: string;
  label: string;
  category: string;
  mastery: number; // 0-100
  x: number; // percentage
  y: number; // percentage
  description: string;
  connectedTo: string[];
  keyInsight: string;
}

export const ConceptMapView: React.FC = () => {
  const [activeSubject, setActiveSubject] = useState<"Photosynthesis" | "Classical Mechanics" | "Bayesian Probability">("Photosynthesis");

  const conceptGraphs: Record<string, ConceptNode[]> = {
    Photosynthesis: [
      {
        id: "p_1",
        label: "Solar Photons",
        category: "Energy Source",
        mastery: 92,
        x: 20,
        y: 25,
        description: "Absorption of light photons primarily by Chlorophyll a and carotenoid pigments.",
        connectedTo: ["p_2"],
        keyInsight: "Photons at 680nm excite P680 reaction center in Photosystem II.",
      },
      {
        id: "p_2",
        label: "Photolysis of Water",
        category: "Light Reaction",
        mastery: 84,
        x: 48,
        y: 25,
        description: "Water splitting enzyme replenishes electrons while generating free O2 and H+ ions.",
        connectedTo: ["p_3"],
        keyInsight: "2H2O -> 4H+ + 4e- + O2. Directly drives proton gradient.",
      },
      {
        id: "p_3",
        label: "Electron Transport Chain",
        category: "Bioenergetics",
        mastery: 74,
        x: 78,
        y: 25,
        description: "Cascading redox cofactors pumping protons into the thylakoid lumen.",
        connectedTo: ["p_4", "p_5"],
        keyInsight: "Cytochrome b6f complex generates electrochemical gradient powering ATP synthase.",
      },
      {
        id: "p_4",
        label: "ATP & NADPH Synthesis",
        category: "Energy Carriers",
        mastery: 68,
        x: 40,
        y: 65,
        description: "High-energy biochemical carriers produced in the stroma.",
        connectedTo: ["p_6"],
        keyInsight: "Chemiosmotic ATP synthesis and NADP+ reductase electron reduction.",
      },
      {
        id: "p_5",
        label: "CO2 Uptake via Stomata",
        category: "Gas Exchange",
        mastery: 80,
        x: 80,
        y: 65,
        description: "Atmospheric carbon diffusion through guard cell stomatal pores.",
        connectedTo: ["p_6"],
        keyInsight: "Stomata close under drought to minimize transpiration, inducing photorespiration.",
      },
      {
        id: "p_6",
        label: "Calvin Cycle & Hexose Synthesis",
        category: "Carbon Fixation",
        mastery: 52,
        x: 60,
        y: 88,
        description: "RuBisCO fixes carbon dioxide to generate stable high-energy sugars.",
        connectedTo: [],
        keyInsight: "Requires 18 ATP and 12 NADPH per net glucose synthesized.",
      },
    ],
    "Classical Mechanics": [
      {
        id: "m_1",
        label: "Inertia & Mass",
        category: "Kinematics",
        mastery: 88,
        x: 25,
        y: 30,
        description: "Resistance of a body to changes in linear velocity.",
        connectedTo: ["m_2"],
        keyInsight: "ΣF = 0 implies acceleration a = 0.",
      },
      {
        id: "m_2",
        label: "Newton's Second Law",
        category: "Dynamics",
        mastery: 76,
        x: 55,
        y: 30,
        description: "Rate of change of momentum is proportional to net force.",
        connectedTo: ["m_3", "m_4"],
        keyInsight: "F_net = m * a = dp/dt.",
      },
      {
        id: "m_3",
        label: "Action-Reaction Pairs",
        category: "Interactions",
        mastery: 64,
        x: 35,
        y: 75,
        description: "Simultaneous forces of equal magnitude acting on separate bodies.",
        connectedTo: [],
        keyInsight: "Never cancel each other internally because they act on distinct bodies.",
      },
      {
        id: "m_4",
        label: "Work-Energy Theorem",
        category: "Energetics",
        mastery: 58,
        x: 75,
        y: 75,
        description: "Net work done by external forces equals change in kinetic energy.",
        connectedTo: [],
        keyInsight: "W_net = ΔK = 1/2 m(v_f^2 - v_i^2).",
      },
    ],
    "Bayesian Probability": [
      {
        id: "b_1",
        label: "Prior Probability P(A)",
        category: "Foundations",
        mastery: 65,
        x: 25,
        y: 30,
        description: "Initial belief estimate before observing any new evidence.",
        connectedTo: ["b_2"],
        keyInsight: "Base rate fallacy occurs when ignoring the prior in population tests.",
      },
      {
        id: "b_2",
        label: "Likelihood P(B|A)",
        category: "Conditioning",
        mastery: 48,
        x: 60,
        y: 30,
        description: "Probability that evidence B is observed given hypothesis A is true.",
        connectedTo: ["b_3"],
        keyInsight: "Often confused with posterior probability P(A|B).",
      },
      {
        id: "b_3",
        label: "Marginal Evidence P(B)",
        category: "Total Probability",
        mastery: 38,
        x: 40,
        y: 75,
        description: "Total probability of evidence across all mutually exclusive hypotheses.",
        connectedTo: ["b_4"],
        keyInsight: "P(B) = P(B|A)P(A) + P(B|not A)P(not A). Major calculation bottleneck!",
      },
      {
        id: "b_4",
        label: "Posterior P(A|B)",
        category: "Bayesian Update",
        mastery: 42,
        x: 80,
        y: 75,
        description: "Updated degree of belief after incorporating experimental observations.",
        connectedTo: [],
        keyInsight: "P(A|B) = [P(B|A) * P(A)] / P(B).",
      },
    ],
  };

  const nodes = conceptGraphs[activeSubject] || conceptGraphs.Photosynthesis;
  const [selectedNode, setSelectedNode] = useState<ConceptNode>(nodes[0]);

  const handleSelectSubject = (subj: "Photosynthesis" | "Classical Mechanics" | "Bayesian Probability") => {
    setActiveSubject(subj);
    setSelectedNode(conceptGraphs[subj][0]);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-1">
            <Network className="w-3.5 h-3.5" />
            <span>Interactive Knowledge Graph</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            AI Concept Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Explore conceptual relationships visually. Click any node to review mechanisms and formula linkages.
          </p>
        </div>

        {/* Subject switcher */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold self-start sm:self-auto">
          {(["Photosynthesis", "Classical Mechanics", "Bayesian Probability"] as const).map((subj) => (
            <button
              key={subj}
              onClick={() => handleSelectSubject(subj)}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeSubject === subj
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Graph Canvas & Node Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Graph Canvas */}
        <div className="lg:col-span-2 relative min-h-[420px] p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-inner overflow-hidden flex flex-col justify-between">
          {/* Canvas Background Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:32px_32px] opacity-30 pointer-events-none" />

          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {nodes.map((node) =>
              node.connectedTo.map((targetId) => {
                const target = nodes.find((n) => n.id === targetId);
                if (!target) return null;
                return (
                  <line
                    key={`${node.id}-${target.id}`}
                    x1={`${node.x}%`}
                    y1={`${node.y}%`}
                    x2={`${target.x}%`}
                    y2={`${target.y}%`}
                    stroke="#4f46e5"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    className="opacity-60"
                  />
                );
              })
            )}
          </svg>

          {/* Interactive Nodes */}
          <div className="relative z-10 w-full h-80">
            {nodes.map((node) => {
              const isSelected = selectedNode.id === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                >
                  <div
                    className={`px-3 py-2 rounded-2xl border backdrop-blur-md transition-all flex items-center gap-2 shadow-lg ${
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-400 scale-105 ring-4 ring-indigo-500/30"
                        : "bg-slate-800/90 text-slate-200 border-slate-700 hover:border-indigo-400"
                    }`}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        node.mastery >= 75
                          ? "bg-emerald-400"
                          : node.mastery >= 50
                          ? "bg-amber-400"
                          : "bg-rose-400"
                      }`}
                    />
                    <div className="text-left">
                      <span className="text-xs font-bold block whitespace-nowrap">{node.label}</span>
                      <span className="text-[10px] opacity-70 block">{node.mastery}% Mastery</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Canvas Footer Legend */}
          <div className="relative z-10 pt-4 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400 border-t border-slate-800/80">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>High Mastery (&gt;75%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Consolidating (50-75%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span>Bottleneck (&lt;50%)</span>
              </span>
            </div>
            <span className="text-slate-500">Tap nodes to explore</span>
          </div>
        </div>

        {/* Right 1 Col: Selected Concept Deep-Dive */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Concept Details</span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                selectedNode.mastery >= 75
                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                  : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
              }`}
            >
              {selectedNode.mastery}% Retained
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {selectedNode.category}
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {selectedNode.label}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedNode.description}
            </p>

            {/* Key Formula / Insight */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-xs space-y-1">
              <span className="font-bold text-indigo-900 dark:text-indigo-300 block">
                Crucial Mechanism / Formula
              </span>
              <p className="text-slate-700 dark:text-slate-300 font-mono text-[11px] leading-relaxed">
                {selectedNode.keyInsight}
              </p>
            </div>

            {/* Downstream Links */}
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Directly Connects To
              </span>
              {selectedNode.connectedTo.length > 0 ? (
                <div className="space-y-1">
                  {selectedNode.connectedTo.map((id) => {
                    const target = nodes.find((n) => n.id === id);
                    if (!target) return null;
                    return (
                      <div
                        key={id}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300"
                      >
                        <span className="font-medium">{target.label}</span>
                        <span className="text-[10px] text-indigo-600 dark:text-indigo-400">Downstream Step</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <span className="text-xs text-slate-400 italic">Terminal synthesis node.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
