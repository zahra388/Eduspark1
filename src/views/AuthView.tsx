import React, { useState } from "react";
import {
  Lock,
  Mail,
  User,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Database,
  ShieldCheck,
  BookOpen,
  Sun,
  Moon,
  Zap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import type { Role } from "../types";

interface AuthViewProps {
  onBackToLanding?: () => void;
  initialMode?: "signin" | "signup";
  onEnterGuestDemo?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  onBackToLanding,
  initialMode = "signin",
  onEnterGuestDemo,
}) => {
  const { login, register, loginWithGoogle, loginAsDemo, authError, clearError, isLoading } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<"student" | "teacher" | null>(null);

  const handleDemoSignIn = async (demoRole: Role) => {
    setLocalError(null);
    clearError();
    setDemoLoading(demoRole);
    try {
      await loginAsDemo(demoRole);
    } catch (err: any) {
      setLocalError("Could not sign in as demo user.");
    } finally {
      setDemoLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email || !password) {
      setLocalError("Please fill in both email and password.");
      return;
    }

    if (mode === "signup") {
      if (!name.trim()) {
        setLocalError("Please provide your full name.");
        return;
      }
      if (password.length < 6) {
        setLocalError("Password must be at least 6 characters long.");
        return;
      }
      const res = await register(name, email, password, role);
      if (!res.success) {
        setLocalError(res.error || "Registration could not be completed.");
      }
    } else {
      const res = await login(email, password);
      if (!res.success) {
        setLocalError(res.error || "Invalid email or password.");
      }
    }
  };

  const handleGoogleAuth = async () => {
    setLocalError(null);
    clearError();
    setGoogleLoading(true);
    const res = await loginWithGoogle(role);
    setGoogleLoading(false);
    if (!res.success) {
      setLocalError(res.error || "Google authentication was cancelled or failed.");
    }
  };

  const displayedError = localError || authError;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 px-4 py-6 sm:py-10 relative overflow-hidden transition-colors">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Header with Back to Details & Theme Toggle */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between pb-4">
        {onBackToLanding ? (
          <button
            id="btn-auth-back-landing"
            type="button"
            onClick={onBackToLanding}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>App Overview & Details</span>
          </button>
        ) : (
          <div />
        )}

        {/* Theme Toggle Button */}
        <button
          id="btn-auth-theme-toggle"
          type="button"
          onClick={toggleTheme}
          title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
          className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-xs transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-blue-500" />
              <span className="hidden sm:inline">Dark</span>
            </>
          )}
        </button>
      </div>

      <div className="w-full max-w-md mx-auto z-10 space-y-6 my-auto">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 shadow-[0_0_25px_rgba(37,99,235,0.4)] mb-1 text-white">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {mode === "signin" ? "Sign In to EduSpark" : "Create Real Account"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
            {mode === "signin"
              ? "Access your personal AI learning twin, persistent courses, and recovery plans."
              : "Register to calibrate your knowledge graph and save your progress to Firebase Firestore."}
          </p>
          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Database className="w-3 h-3 text-emerald-500" />
              <span>Firebase Cloud Firestore Database Connected</span>
            </span>
          </div>
        </div>

        {/* Auth Form Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
            <button
              id="tab-signin"
              type="button"
              onClick={() => {
                setMode("signin");
                setLocalError(null);
                clearError();
              }}
              className={`py-2.5 rounded-xl transition cursor-pointer ${
                mode === "signin"
                  ? "bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)] font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              id="tab-signup"
              type="button"
              onClick={() => {
                setMode("signup");
                setLocalError(null);
                clearError();
              }}
              className={`py-2.5 rounded-xl transition cursor-pointer ${
                mode === "signup"
                  ? "bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)] font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Banner */}
          {displayedError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-xs flex flex-col gap-1.5">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span>{displayedError}</span>
              </div>
              {mode === "signin" && (
                <div className="pl-3.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signup");
                      setLocalError(null);
                      clearError();
                    }}
                    className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Create a new account with this email instead</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Quick Instant Test Logins */}
          <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>1-Click Test Sign-In</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400">Instant Access</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-quick-student"
                type="button"
                onClick={() => handleDemoSignIn("student")}
                disabled={isLoading || demoLoading !== null}
                className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {demoLoading === "student" ? (
                  <div className="w-3.5 h-3.5 border-2 border-blue-500/30 border-t-blue-600 rounded-full animate-spin" />
                ) : (
                  <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                )}
                <span>Student Demo</span>
              </button>
              <button
                id="btn-quick-teacher"
                type="button"
                onClick={() => handleDemoSignIn("teacher")}
                disabled={isLoading || demoLoading !== null}
                className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-indigo-500 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {demoLoading === "teacher" ? (
                  <div className="w-3.5 h-3.5 border-2 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin" />
                ) : (
                  <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                )}
                <span>Educator Demo</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    id="input-name"
                    type="text"
                    required
                    placeholder="e.g. Alex Rivera or Zahra Jaffary"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  id="input-email"
                  type="email"
                  required
                  placeholder="your.name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  id="input-password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder={mode === "signup" ? "At least 6 characters" : "Enter your password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Role Selection (on Signup) */}
            {mode === "signup" && (
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select Your Account Role
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRole("student")}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition cursor-pointer ${
                      role === "student"
                        ? "bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-700 dark:text-blue-300 shadow-xs"
                        : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">Student / Learner</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                        Personal AI tutor, flashcards, arena quizzes
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("teacher")}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition cursor-pointer ${
                      role === "teacher"
                        ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-xs"
                        : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">Educator / Teacher</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                        Classroom cohort analytics & diagnostics
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              id="btn-submit-auth"
              type="submit"
              disabled={isLoading || googleLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === "signin" ? "Sign In to EduSpark" : "Create My Account"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="shrink-0 mx-4 text-slate-400 text-[11px] uppercase tracking-wider">
              Or continue with
            </span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          {/* Google Sign In */}
          <button
            id="btn-google-auth"
            type="button"
            onClick={handleGoogleAuth}
            disabled={isLoading || googleLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
          >
            {googleLoading ? (
              <div className="w-4 h-4 border-2 border-slate-400/30 border-t-blue-500 rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Google Account</span>
              </>
            )}
          </button>

          {/* Quick Demo Access Button */}
          {onEnterGuestDemo && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
              <button
                id="btn-auth-guest-demo"
                type="button"
                onClick={onEnterGuestDemo}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Or Explore Live Portal Directly (Interactive Demo)</span>
              </button>
            </div>
          )}
        </div>

        {/* Cloud Security Note */}
        <div className="flex items-center justify-center gap-2 text-center text-xs text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Real-time persistence backed by Firebase Firestore</span>
        </div>
      </div>

      <div className="text-center text-[11px] text-slate-400 pt-4">
        <span>EduSpark Learning Ecosystem • Secure Multi-Tenant Cloud Architecture</span>
      </div>
    </div>
  );
};
