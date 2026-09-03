import React from "react";
import {
  LayoutDashboard,
  Brain,
  MessageSquareQuote,
  FileSpreadsheet,
  Network,
  Crosshair,
  Compass,
  Trophy,
  GraduationCap,
  ShieldCheck,
  Award,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export type TabKey =
  | "dashboard"
  | "twin"
  | "tutor"
  | "notes"
  | "concept"
  | "mistakes"
  | "career"
  | "challenge"
  | "teacher"
  | "passport"
  | "trust";

interface SidebarProps {
  currentTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher";

  const navigationItems: { key: TabKey; label: string; icon: any; badge?: string; teacherOnly?: boolean }[] = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "twin", label: "AI Learning Twin", icon: Brain, badge: "Hero" },
    { key: "tutor", label: "AI Smart Tutor", icon: MessageSquareQuote, badge: "Voice" },
    { key: "notes", label: "Notes to Course", icon: FileSpreadsheet, badge: "Auto" },
    { key: "concept", label: "Concept Map", icon: Network },
    { key: "mistakes", label: "Mistake Analyzer", icon: Crosshair },
    { key: "career", label: "Career Navigator", icon: Compass },
    { key: "challenge", label: "90s Arena", icon: Trophy, badge: "XP" },
    { key: "teacher", label: "Teacher Dashboard", icon: GraduationCap, badge: isTeacher ? "Active" : undefined },
    { key: "passport", label: "Skill Passport", icon: Award },
    { key: "trust", label: "Safety & Trust", icon: ShieldCheck },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-[calc(100vh-4rem)]">
      {/* Top Section: Target Role Status Widget */}
      <div className="p-4 pb-2 space-y-4">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Target Role</span>
            <span className="text-[10px] px-2 py-0.5 font-bold rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              Lvl 3
            </span>
          </div>
          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
            {isTeacher ? "Class Educator" : "AI & Data Science"}
          </p>
          <div className="mt-3">
            <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 font-medium">
              <span>Overall Mastery</span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{isTeacher ? "71%" : "64%"}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                style={{ width: isTeacher ? "71%" : "64%" }}
              />
            </div>
          </div>
          <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-blue-600/10 blur-2xl pointer-events-none" />
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        <div className="px-2 pb-2 text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
          Navigation Hub
        </div>
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.key;
            return (
              <button
                key={item.key}
                id={`nav-${item.key}`}
                onClick={() => onSelectTab(item.key)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs sm:text-sm transition-colors cursor-pointer ${
                  isActive
                    ? "bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-600/20 font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-600 dark:text-blue-400" : "opacity-75"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer Profile Box - Sleek Interface style */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-800/60">
          <div className="w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-700 overflow-hidden ring-1 ring-blue-500/30 shrink-0">
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
              alt={user?.name || "User"}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
              {user?.name || "Alex Rivera"}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
              {isTeacher ? "Pro Educator" : "Pro Learner"}
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)] shrink-0" />
        </div>
      </div>
    </aside>
  );
};
