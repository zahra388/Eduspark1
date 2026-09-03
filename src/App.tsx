import React, { useState, useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Sidebar, type TabKey } from "./components/Sidebar";
import { MobileNav } from "./components/MobileNav";
import { FixMyLearningModal } from "./components/FixMyLearningModal";
import { PushNotificationModal } from "./components/PushNotificationModal";
import { AuthModal } from "./components/AuthModal";
import { PathQuestionnaireModal } from "./components/PathQuestionnaireModal";

// Views
import { StartingPageView } from "./views/StartingPageView";
import { AuthView } from "./views/AuthView";
import { DashboardView } from "./views/DashboardView";
import { LearningTwinView } from "./views/LearningTwinView";
import { AiTutorView } from "./views/AiTutorView";
import { NotesToCourseView } from "./views/NotesToCourseView";
import { ConceptMapView } from "./views/ConceptMapView";
import { MistakeAnalyzerView } from "./views/MistakeAnalyzerView";
import { CareerNavigatorView } from "./views/CareerNavigatorView";
import { ChallengeArenaView } from "./views/ChallengeArenaView";
import { TeacherDashboardView } from "./views/TeacherDashboardView";
import { SkillPassportView } from "./views/SkillPassportView";
import { TrustCenterView } from "./views/TrustCenterView";

import { initialLearnerTwin, initialRecoveryPlan } from "./data/initialData";
import { PATH_TRACK_PRESETS, generateCustomPath } from "./data/pathPresets";
import type { LearningTwin, RecoveryPlan, UserLearningPath } from "./types";
import {
  loadLearnerTwinFromFirestore,
  saveLearnerTwinToFirestore,
  loadActiveRecoveryPlanFromFirestore,
  saveRecoveryPlanToFirestore,
  loadUserLearningPathFromFirestore,
  saveUserLearningPathToFirestore,
} from "./services/firebase";
import { Database, Sparkles, ArrowRight, LayoutDashboard } from "lucide-react";

const MainAppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading, enterGuestDemo } = useAuth();
  const [pageStage, setPageStage] = useState<"starting" | "auth" | "portal">("starting");
  const [authInitialMode, setAuthInitialMode] = useState<"signin" | "signup">("signin");
  const [currentTab, setCurrentTab] = useState<TabKey>("dashboard");
  const [isFixLearningOpen, setIsFixLearningOpen] = useState(false);
  const [isPushModalOpen, setIsPushModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedTutorTopic, setSelectedTutorTopic] = useState<string | null>(null);

  // User Custom Learning Path State
  const [isPathModalOpen, setIsPathModalOpen] = useState(false);
  const [userLearningPath, setUserLearningPath] = useState<UserLearningPath | null>(null);

  // Learner Twin state
  const [learnerProfile, setLearnerProfile] = useState<LearningTwin>(() => ({
    ...initialLearnerTwin,
    studentName: user?.name || "Student",
  }));

  // Recovery Plan state
  const [activePlan, setActivePlan] = useState<RecoveryPlan | null>(initialRecoveryPlan);

  // If user signs in while on auth page, automatically switch to portal
  useEffect(() => {
    if (isAuthenticated && user && pageStage === "auth") {
      setPageStage("portal");
    }
  }, [isAuthenticated, user, pageStage]);

  // Sync with Firestore & localStorage when real user logs in
  useEffect(() => {
    if (!user?.id) return;

    let isMounted = true;

    // 1. Load custom learning path
    const localKey = `eduspark_path_${user.id}`;
    const localSavedPath = localStorage.getItem(localKey);
    if (localSavedPath) {
      try {
        const parsed = JSON.parse(localSavedPath) as UserLearningPath;
        if (isMounted) setUserLearningPath(parsed);
      } catch (e) {
        // ignore parse error
      }
    }

    loadUserLearningPathFromFirestore(user.id).then((savedPath) => {
      if (!isMounted) return;
      if (savedPath) {
        setUserLearningPath(savedPath);
        localStorage.setItem(localKey, JSON.stringify(savedPath));
      } else if (!localSavedPath) {
        // New user after login has no path yet -> ask questions to make their path!
        setIsPathModalOpen(true);
      }
    });

    // 2. Load learner twin from Firestore
    loadLearnerTwinFromFirestore(user.id).then((savedTwin) => {
      if (!isMounted) return;
      if (savedTwin) {
        setLearnerProfile(savedTwin);
      } else {
        // Initialize with real user's name
        const initTwin: LearningTwin = {
          ...initialLearnerTwin,
          studentName: user.name,
        };
        setLearnerProfile(initTwin);
        saveLearnerTwinToFirestore(user.id, initTwin);
      }
    });

    // 3. Load active recovery plan from Firestore
    loadActiveRecoveryPlanFromFirestore(user.id).then((savedPlan) => {
      if (!isMounted) return;
      if (savedPlan) {
        setActivePlan(savedPlan);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [user?.id, user?.name]);

  // Persist twin updates to Firestore
  const updateAndSaveLearnerProfile = (updater: (prev: LearningTwin) => LearningTwin) => {
    setLearnerProfile((prev) => {
      const next = updater(prev);
      if (user?.id) {
        saveLearnerTwinToFirestore(user.id, next);
      }
      return next;
    });
  };

  // Handler for saving and applying the generated custom learning path
  const handleSaveLearningPath = (path: UserLearningPath) => {
    setUserLearningPath(path);
    if (user?.id) {
      localStorage.setItem(`eduspark_path_${user.id}`, JSON.stringify(path));
      saveUserLearningPathToFirestore(user.id, path);
    } else {
      localStorage.setItem("eduspark_path_guest", JSON.stringify(path));
    }

    // Calibrate Learning Twin to reflect chosen path & answers
    updateAndSaveLearnerProfile((prev) => {
      const preset = PATH_TRACK_PRESETS.find((p) => p.id === path.trackId);
      const newKnowledgeMap =
        preset?.knowledgeNodes && preset.knowledgeNodes.length > 0
          ? preset.knowledgeNodes
          : prev.knowledgeMap;

      const avgMastery =
        newKnowledgeMap.length > 0
          ? Math.round(newKnowledgeMap.reduce((acc, n) => acc + n.mastery, 0) / newKnowledgeMap.length)
          : prev.overallMastery;

      return {
        ...prev,
        targetRole: path.roleTitle,
        learningStyle: path.learningStyle,
        overallMastery: avgMastery,
        strengths: path.keyStrengths && path.keyStrengths.length > 0 ? path.keyStrengths : prev.strengths,
        weaknesses: path.focusGaps && path.focusGaps.length > 0 ? path.focusGaps : prev.weaknesses,
        knowledgeMap: newKnowledgeMap,
      };
    });

    // Reset previous plan so dashboard immediately displays the newly selected path's tailored daily focus
    updateAndSavePlan(null);
  };

  // Persist recovery plan updates to Firestore
  const updateAndSavePlan = (plan: RecoveryPlan | null) => {
    setActivePlan(plan);
    if (user?.id && plan) {
      saveRecoveryPlanToFirestore(user.id, plan);
    }
  };

  // Handler for accepting 7-day recovery plan
  const handleAcceptPlan = (plan: RecoveryPlan) => {
    updateAndSavePlan(plan);
    updateAndSaveLearnerProfile((prev) => ({
      ...prev,
      overallMastery: Math.min(100, prev.overallMastery + 3),
      xp: prev.xp + 100,
    }));
  };

  // Handler for completing a recovery plan micro-task
  const handleCompleteTask = (dayNum: number, _taskIdx: number) => {
    if (!activePlan) return;
    const updatedDays = activePlan.days.map((d) => {
      if (d.day === dayNum) {
        return { ...d, completed: true };
      }
      return d;
    });
    const updatedPlan: RecoveryPlan = { ...activePlan, days: updatedDays };
    updateAndSavePlan(updatedPlan);

    updateAndSaveLearnerProfile((prev) => ({
      ...prev,
      xp: prev.xp + 40,
      overallMastery: Math.min(100, prev.overallMastery + 1),
    }));
  };

  // Handler when selecting a topic from Learning Twin to jump into AI Tutor
  const handleSelectTopicForTutor = (topic: string) => {
    setSelectedTutorTopic(topic);
    setCurrentTab("tutor");
  };

  // Handler when earning XP from Arena
  const handleEarnXp = (amount: number) => {
    updateAndSaveLearnerProfile((prev) => {
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(newXp / 1000) + 1;
      return {
        ...prev,
        xp: newXp,
        level: Math.max(prev.level, newLevel),
      };
    });
  };

  // Handler when quiz completes
  const handleCompleteQuiz = (score: number, total: number) => {
    const gainedXp = score * 30;
    updateAndSaveLearnerProfile((prev) => ({
      ...prev,
      xp: prev.xp + gainedXp,
      overallMastery: Math.min(100, prev.overallMastery + (score > total / 2 ? 2 : 0)),
    }));
  };

  // Handlers for Landing Page navigation
  const handleGoToSignIn = () => {
    setAuthInitialMode("signin");
    setPageStage("auth");
  };

  const handleGoToSignUp = () => {
    setAuthInitialMode("signup");
    setPageStage("auth");
  };

  const handleEnterGuestDemo = () => {
    enterGuestDemo("student");
    setPageStage("portal");
  };

  // 1. Loading State (checking real Firebase Auth session)
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white space-y-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center animate-pulse">
            <Sparkles className="w-7 h-7 text-blue-400" />
          </div>
          <div className="absolute -inset-1 rounded-2xl bg-blue-500/20 blur-sm -z-10" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-semibold tracking-wide text-slate-200">
            Connecting to EduSpark Cloud Database...
          </p>
          <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400">
            <Database className="w-3.5 h-3.5" />
            <span>Firebase Firestore</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Starting Page: comprehensive details of the app + dark/light mode + clickable buttons
  if (pageStage === "starting") {
    return (
      <div className="relative">
        {/* Floating Quick Return to Portal banner if user is already authenticated */}
        {isAuthenticated && user && (
          <div className="sticky top-0 z-50 bg-blue-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md">
            <span>You are logged in as {user.name} ({user.role === "teacher" ? "Educator" : "Student"})</span>
            <button
              type="button"
              onClick={() => setPageStage("portal")}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white text-blue-600 hover:bg-blue-50 font-bold transition cursor-pointer"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Return to Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <StartingPageView
          onGoToSignIn={handleGoToSignIn}
          onGoToSignUp={handleGoToSignUp}
          onEnterGuestDemo={handleEnterGuestDemo}
        />
      </div>
    );
  }

  // 3. Dedicated Sign In / Sign Up View
  if (pageStage === "auth" || (!isAuthenticated && pageStage === "portal")) {
    return (
      <AuthView
        initialMode={authInitialMode}
        onBackToLanding={() => setPageStage("starting")}
        onEnterGuestDemo={handleEnterGuestDemo}
      />
    );
  }

  // 4. Authenticated Real User Portal Experience
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Header Navbar with real user profile & sign out & overview toggle */}
      <Navbar
        onOpenFixLearning={() => setIsFixLearningOpen(true)}
        onOpenNotifications={() => setIsPushModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onViewOverview={() => setPageStage("starting")}
        activePathTitle={userLearningPath?.roleTitle || learnerProfile.targetRole}
        onOpenPathQuestionnaire={() => setIsPathModalOpen(true)}
      />

      {/* Main Body with Desktop Sidebar + Main Content Area */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
          {currentTab === "dashboard" && (
            <DashboardView
              learnerProfile={learnerProfile}
              activePlan={activePlan}
              userLearningPath={userLearningPath}
              onOpenFixLearning={() => setIsFixLearningOpen(true)}
              onOpenPathQuestionnaire={() => setIsPathModalOpen(true)}
              onNavigate={setCurrentTab}
              onCompleteTask={handleCompleteTask}
              onSelectTopicForTutor={handleSelectTopicForTutor}
            />
          )}

          {currentTab === "twin" && (
            <LearningTwinView
              learnerProfile={learnerProfile}
              onOpenFixLearning={() => setIsFixLearningOpen(true)}
              onSelectTopicForTutor={handleSelectTopicForTutor}
            />
          )}

          {currentTab === "tutor" && (
            <AiTutorView
              learnerProfile={learnerProfile}
              initialTopic={selectedTutorTopic}
            />
          )}

          {currentTab === "notes" && (
            <NotesToCourseView onCompleteQuiz={handleCompleteQuiz} />
          )}

          {currentTab === "concept" && <ConceptMapView />}

          {currentTab === "mistakes" && <MistakeAnalyzerView />}

          {currentTab === "career" && (
            <CareerNavigatorView
              userLearningPath={userLearningPath}
              onOpenPathQuestionnaire={() => setIsPathModalOpen(true)}
              onAdoptTrack={(trackTitle) => {
                const matched = PATH_TRACK_PRESETS.find(
                  (p) =>
                    p.roleTitle.toLowerCase().includes(trackTitle.toLowerCase()) ||
                    trackTitle.toLowerCase().includes(p.roleTitle.toLowerCase())
                );
                if (matched) {
                  const generated = generateCustomPath(
                    {
                      trackId: matched.id,
                      level: userLearningPath?.level || "intermediate",
                      learningStyle: learnerProfile.learningStyle,
                      dailyCommitmentMinutes: userLearningPath?.dailyCommitmentMinutes || 30,
                      primaryPriority: userLearningPath?.primaryPriority || "Accelerate target readiness",
                    },
                    learnerProfile.studentName,
                    user?.id || "demo"
                  );
                  handleSaveLearningPath(generated);
                }
              }}
            />
          )}

          {currentTab === "challenge" && (
            <ChallengeArenaView onEarnXp={handleEarnXp} />
          )}

          {currentTab === "teacher" && <TeacherDashboardView />}

          {currentTab === "passport" && <SkillPassportView />}

          {currentTab === "trust" && (
            <TrustCenterView learnerProfile={learnerProfile} />
          )}
        </main>
      </div>

      {/* Mobile Navigation Drawer & Bottom Bar */}
      <MobileNav currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Global Action Modals */}
      <PathQuestionnaireModal
        isOpen={isPathModalOpen}
        onClose={() => setIsPathModalOpen(false)}
        onSavePath={handleSaveLearningPath}
        studentName={learnerProfile.studentName}
        userId={user?.id || "demo"}
        initialPath={userLearningPath}
      />

      <FixMyLearningModal
        isOpen={isFixLearningOpen}
        onClose={() => setIsFixLearningOpen(false)}
        learnerProfile={learnerProfile}
        onAcceptPlan={handleAcceptPlan}
      />

      <PushNotificationModal
        isOpen={isPushModalOpen}
        onClose={() => setIsPushModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
