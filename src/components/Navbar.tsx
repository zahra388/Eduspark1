import React, { useState, useEffect } from "react";
import { Sparkles, Moon, Sun, Bell, Wifi, WifiOff, RefreshCw, UserCheck, LogIn, LogOut, Compass } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { syncService } from "../services/syncService";

interface NavbarProps {
  onOpenFixLearning: () => void;
  onOpenNotifications: () => void;
  onOpenAuth: () => void;
  onViewOverview?: () => void;
  activePathTitle?: string;
  onOpenPathQuestionnaire?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenFixLearning,
  onOpenNotifications,
  onOpenAuth,
  onViewOverview,
  activePathTitle,
  onOpenPathQuestionnaire,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const unsub = syncService.subscribe((online, count) => {
      setIsOnline(online);
      setPendingCount(count);
    });
    return unsub;
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    await syncService.syncNow();
    setTimeout(() => setIsSyncing(false), 600);
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <div 
          onClick={onViewOverview}
          className={`flex items-center gap-3 ${onViewOverview ? 'cursor-pointer group' : ''}`}
          title={onViewOverview ? "View App Details & Overview" : undefined}
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)] text-white shrink-0 group-hover:scale-105 transition-transform">
            <div className="w-3.5 h-3.5 border-2 border-white rounded-full flex items-center justify-center">
              <div className="w-1 h-1 bg-white rounded-full" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">EduSpark</span>
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold rounded-full border border-emerald-500/20">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_6px_rgba(16,185,129,0.8)]"></span>
                <span>SECURED</span>
              </div>
            </div>
            <p className="hidden md:block text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5">
              Adaptive Intelligence Ecosystem
            </p>
          </div>
        </div>

        {/* Center/Hero Action: Path Badge + "FIX MY LEARNING" + App Overview */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {activePathTitle && onOpenPathQuestionnaire && (
            <button
              id="btn-nav-custom-path"
              type="button"
              onClick={onOpenPathQuestionnaire}
              title="Click to recalibrate your personalized learning path"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 transition cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-blue-500" />
              <span className="max-w-[150px] truncate">{activePathTitle}</span>
              <span className="text-[10px] uppercase font-bold opacity-75">Edit</span>
            </button>
          )}

          {onViewOverview && (
            <button
              id="btn-nav-overview"
              type="button"
              onClick={onViewOverview}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              App Overview & Details
            </button>
          )}

          <button
            id="btn-fix-my-learning"
            onClick={onOpenFixLearning}
            className="group relative inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_20px_rgba(37,99,235,0.6)] transition-all active:scale-95 cursor-pointer border border-blue-400/30"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-200 group-hover:rotate-12 transition-transform" />
            <span className="tracking-wider uppercase text-[11px] sm:text-xs">Fix My Learning</span>
          </button>
        </div>

        {/* Right Tools: Sync Status, Notification, Theme, Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Offline Sync Indicator */}
          <button
            id="btn-sync-status"
            onClick={handleManualSync}
            title={isOnline ? (pendingCount > 0 ? `${pendingCount} changes pending sync` : "All changes synchronized") : "Offline mode: actions stored locally"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
              !isOnline
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                : pendingCount > 0
                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
                : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
            }`}
          >
            {!isOnline ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Offline</span>
                {pendingCount > 0 && <span className="px-1 py-0.2 bg-amber-500/20 text-amber-500 rounded text-[10px] font-mono">{pendingCount}</span>}
              </>
            ) : (
              <>
                {isSyncing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                )}
                <span className="hidden sm:inline font-mono text-[11px]">{pendingCount > 0 ? `Sync (${pendingCount})` : "Sync 98.2%"}</span>
              </>
            )}
          </button>

          {/* Notifications Trigger */}
          <button
            id="btn-notifications"
            onClick={onOpenNotifications}
            title="Push Notifications & System Logs"
            aria-label="Push Notifications"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-[10px] flex items-center justify-center rounded-full text-white font-bold border-2 border-white dark:border-slate-950">
              3
            </span>
          </button>

          {/* Theme Pill Toggle */}
          <button
            id="btn-theme-toggle"
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            aria-label="Toggle theme"
            className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-3 py-1.5 cursor-pointer text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
            <span className="text-xs font-medium hidden sm:inline">{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
          </button>

          {/* Auth & Real User Status */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-1.5 pl-1 border-l border-slate-200 dark:border-slate-800">
              <button
                id="btn-user-profile"
                onClick={onOpenAuth}
                title={`Logged in as ${user.email}`}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition cursor-pointer"
              >
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-blue-500/30"
                />
                <div className="hidden lg:block text-left text-xs leading-tight">
                  <span className="font-semibold block text-slate-900 dark:text-white truncate max-w-[90px]">{user.name.split(" ")[0]}</span>
                  <span className="text-[10px] text-blue-500 font-medium capitalize">{user.role === "teacher" ? "Educator" : "Student"}</span>
                </div>
              </button>

              <button
                id="btn-sign-out"
                onClick={() => logout()}
                title="Sign out of account"
                aria-label="Sign out"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              id="btn-sign-in"
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)] transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
