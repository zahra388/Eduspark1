import React, { useState } from "react";
import {
  LayoutDashboard,
  Brain,
  MessageSquareQuote,
  FileSpreadsheet,
  Grid,
  X,
  Network,
  Crosshair,
  Compass,
  Trophy,
  GraduationCap,
  Award,
  ShieldCheck,
} from "lucide-react";
import { TabKey } from "./Sidebar";

interface MobileNavProps {
  currentTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onSelectTab }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const primaryMobileTabs: { key: TabKey; label: string; icon: any }[] = [
    { key: "dashboard", label: "Home", icon: LayoutDashboard },
    { key: "twin", label: "Twin", icon: Brain },
    { key: "tutor", label: "Tutor", icon: MessageSquareQuote },
    { key: "notes", label: "Notes", icon: FileSpreadsheet },
  ];

  const allTabs: { key: TabKey; label: string; icon: any; category: string }[] = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, category: "Core" },
    { key: "twin", label: "AI Learning Twin", icon: Brain, category: "Core" },
    { key: "tutor", label: "AI Smart Tutor", icon: MessageSquareQuote, category: "Learning" },
    { key: "notes", label: "Notes to Course", icon: FileSpreadsheet, category: "Learning" },
    { key: "concept", label: "Concept Map", icon: Network, category: "Learning" },
    { key: "mistakes", label: "Mistake Analyzer", icon: Crosshair, category: "Learning" },
    { key: "challenge", label: "90s Challenge Arena", icon: Trophy, category: "Engagement" },
    { key: "career", label: "Career Navigator", icon: Compass, category: "Growth" },
    { key: "teacher", label: "Teacher Dashboard", icon: GraduationCap, category: "Educator" },
    { key: "passport", label: "Skill Passport", icon: Award, category: "Growth" },
    { key: "trust", label: "Safety & Trust Center", icon: ShieldCheck, category: "System" },
  ];

  const handleSelect = (key: TabKey) => {
    onSelectTab(key);
    setIsDrawerOpen(false);
  };

  return (
    <>
      {/* Fixed Bottom Navigation Bar for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around safe-area-inset-bottom">
        {primaryMobileTabs.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.key;
          return (
            <button
              key={item.key}
              id={`mobile-tab-${item.key}`}
              onClick={() => handleSelect(item.key)}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] rounded-lg transition-colors cursor-pointer ${
                isActive
                  ? "text-blue-600 dark:text-blue-400 font-semibold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "scale-110" : ""}`} />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}

        {/* More/All Hubs trigger */}
        <button
          id="btn-mobile-more-menu"
          onClick={() => setIsDrawerOpen(true)}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] rounded-lg transition-colors cursor-pointer ${
            isDrawerOpen
              ? "text-blue-600 dark:text-blue-400 font-semibold"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">More</span>
        </button>
      </nav>

      {/* Drawer for all remaining views */}
      {isDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-xs">
          <div className="w-full bg-white dark:bg-slate-900 rounded-t-2xl border-t border-slate-200 dark:border-slate-800 max-h-[85vh] overflow-y-auto p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">EduSpark Modules</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Select any learning dimension to explore</p>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {allTabs.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => handleSelect(item.key)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl text-left border text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-blue-600/10 text-blue-600 dark:text-blue-400 border-blue-600/30 shadow-xs"
                        : "bg-slate-50 dark:bg-slate-950/60 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-blue-400"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
