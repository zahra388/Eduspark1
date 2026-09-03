import React, { useState, useEffect } from "react";
import { Bell, X, Check, ShieldCheck, Flame, Zap, Clock, Send } from "lucide-react";
import { notificationService, PushPreferences } from "../services/notificationService";

interface PushNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PushNotificationModal: React.FC<PushNotificationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [prefs, setPrefs] = useState<PushPreferences>(notificationService.getPreferences());
  const [testSent, setTestSent] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPermission(notificationService.getPermissionStatus());
      setPrefs(notificationService.getPreferences());
    }
  }, [isOpen]);

  const handleRequestPermission = async () => {
    setIsRequesting(true);
    const granted = await notificationService.requestPermission();
    setPermission(granted ? "granted" : "denied");
    setIsRequesting(false);
  };

  const handleTogglePref = (key: keyof PushPreferences) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    notificationService.savePreferences(updated);
  };

  const handleSendTestPush = async () => {
    setTestSent(true);
    await notificationService.sendTestNotification();
    setTimeout(() => setTestSent(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Push Notifications</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Smart Study Alerts & Streak Guard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Permission Banner */}
        <div className={`p-4 rounded-xl border text-xs sm:text-sm ${
          permission === "granted"
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
            : "bg-slate-100 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
        }`}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold">
              {permission === "granted" ? "Push Permissions Active" : "Browser Permission Required"}
            </span>
            <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              {permission}
            </span>
          </div>
          <p className="text-xs opacity-90 leading-relaxed">
            {permission === "granted"
              ? "You will receive timely nudges to protect your smart streak and alert you to daily 90s challenges."
              : "Enable browser alerts to receive instant reminders before your daily streak expires."}
          </p>

          {permission !== "granted" && (
            <button
              onClick={handleRequestPermission}
              disabled={isRequesting}
              className="mt-3 w-full py-2.5 px-4 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] transition cursor-pointer"
            >
              {isRequesting ? "Requesting..." : "Enable Push Notifications"}
            </button>
          )}
        </div>

        {/* Preferences Switches */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Notification Triggers</span>

          <div className="space-y-2">
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors">
              <div className="flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-200">
                <Flame className="w-4 h-4 text-amber-500" />
                <div>
                  <span className="font-semibold block">Smart Streak Protector</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Alert 2 hours before daily goal cutoff</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={prefs.streakProtection}
                onChange={() => handleTogglePref("streakProtection")}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors">
              <div className="flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-200">
                <Zap className="w-4 h-4 text-blue-500" />
                <div>
                  <span className="font-semibold block">90-Second Daily Challenge</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Fresh daily speed challenge alerts</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={prefs.dailyChallenge}
                onChange={() => handleTogglePref("dailyChallenge")}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors">
              <div className="flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-200">
                <Clock className="w-4 h-4 text-emerald-500" />
                <div>
                  <span className="font-semibold block">7-Day Recovery Plan Checkpoints</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Daily targeted micro-action reminders</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={prefs.recoveryPlanAlerts}
                onChange={() => handleTogglePref("recoveryPlanAlerts")}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600"
              />
            </label>
          </div>
        </div>

        {/* Test Push Button */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
          >
            Close
          </button>
          <button
            id="btn-test-push-notification"
            onClick={handleSendTestPush}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)] transition cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{testSent ? "Alert Triggered!" : "Send Test Push"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
