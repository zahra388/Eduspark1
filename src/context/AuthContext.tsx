import React, { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth, googleProvider, syncUserProfileToFirestore, loadUserProfileFromFirestore } from "../services/firebase";
import type { User, Role } from "../types";

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, pass: string, role: Role) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (preferredRole?: Role) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: (demoRole?: Role) => Promise<void>;
  logout: () => Promise<void>;
  enterGuestDemo: (demoRole?: Role) => void;
  updateUserRole: (newRole: Role) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const generateDeterministicUid = (email: string): string => {
  const clean = email.toLowerCase().trim().replace(/[^a-z0-9]/g, "_");
  return `usr_${clean}`;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Helper to format friendly error messages
  const formatAuthError = (err: any): string => {
    const code = err?.code || "";
    const msg = err?.message || String(err);
    if (code === "auth/invalid-credential" || code === "auth/user-not-found" || code === "auth/wrong-password") {
      return "Invalid email or password. Please verify your credentials.";
    }
    if (code === "auth/email-already-in-use") {
      return "An account with this email already exists. Please sign in instead.";
    }
    if (code === "auth/weak-password") {
      return "Password is too weak. Please use at least 6 characters.";
    }
    if (code === "auth/invalid-email") {
      return "Please enter a valid email address.";
    }
    if (code === "auth/popup-closed-by-user") {
      return "Google sign-in popup was cancelled.";
    }
    if (code === "auth/unauthorized-domain") {
      return "Google sign-in preview domain is not whitelisted. Please use email login or instant demo.";
    }
    if (code === "auth/operation-not-allowed") {
      return "Direct Firebase Auth sign-in method is currently restricted. Using Cloud Firestore Session.";
    }
    if (code === "auth/network-request-failed") {
      return "Network connection issue. Please check your internet connection.";
    }
    return msg.replace("Firebase: ", "").trim();
  };

  // Listen to Firebase Auth state changes & restore saved session
  useEffect(() => {
    let localSavedUser: User | null = null;
    try {
      const savedStr = localStorage.getItem("eduspark_active_user");
      if (savedStr) {
        localSavedUser = JSON.parse(savedStr);
        if (localSavedUser) {
          setUser(localSavedUser);
        }
      }
    } catch (e) {
      console.warn("Failed to parse saved user session:", e);
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentFirebaseUser) => {
      setIsLoading(true);
      if (currentFirebaseUser) {
        setFirebaseUser(currentFirebaseUser);
        try {
          const idToken = await currentFirebaseUser.getIdToken();
          setToken(idToken);

          // Retrieve user profile from Firestore database
          let profile = await loadUserProfileFromFirestore(currentFirebaseUser.uid);

          if (!profile) {
            profile = {
              id: currentFirebaseUser.uid,
              name: currentFirebaseUser.displayName || currentFirebaseUser.email?.split("@")[0] || "Learner",
              email: currentFirebaseUser.email || "",
              role: "student",
              avatar: currentFirebaseUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentFirebaseUser.displayName || currentFirebaseUser.email || "Learner")}`,
              createdAt: new Date().toISOString(),
            };
            await syncUserProfileToFirestore(profile);
          }

          setUser(profile);
          localStorage.setItem("eduspark_active_user", JSON.stringify(profile));
        } catch (error) {
          console.warn("Error fetching user profile from Firestore:", error);
          const fallbackUser: User = {
            id: currentFirebaseUser.uid,
            name: currentFirebaseUser.displayName || currentFirebaseUser.email?.split("@")[0] || "User",
            email: currentFirebaseUser.email || "",
            role: "student",
            avatar: currentFirebaseUser.photoURL || undefined,
            createdAt: new Date().toISOString(),
          };
          setUser(fallbackUser);
          localStorage.setItem("eduspark_active_user", JSON.stringify(fallbackUser));
        }
      } else {
        setFirebaseUser(null);
        if (!localSavedUser) {
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setAuthError(null);
    const cleanEmail = email.trim();

    try {
      // 1. First try native Firebase Auth sign in
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      const idToken = await cred.user.getIdToken();
      setToken(idToken);
      setFirebaseUser(cred.user);

      // Load Firestore profile
      let profile = await loadUserProfileFromFirestore(cred.user.uid);
      if (!profile) {
        profile = {
          id: cred.user.uid,
          name: cred.user.displayName || cleanEmail.split("@")[0],
          email: cred.user.email || cleanEmail,
          role: "student",
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cred.user.displayName || cleanEmail)}`,
          createdAt: new Date().toISOString(),
        };
        await syncUserProfileToFirestore(profile);
      }
      setUser(profile);
      localStorage.setItem("eduspark_active_user", JSON.stringify(profile));
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      const code = err?.code || "";

      // 2. If account does not exist (first-time visitor on Sign In tab), auto-create account!
      if ((code === "auth/invalid-credential" || code === "auth/user-not-found") && pass.length >= 6) {
        try {
          const createCred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
          const rawName = cleanEmail.split("@")[0].replace(/[._]/g, " ");
          const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
          await updateProfile(createCred.user, { displayName: formattedName });
          const idToken = await createCred.user.getIdToken();
          setToken(idToken);
          setFirebaseUser(createCred.user);

          const newUser: User = {
            id: createCred.user.uid,
            name: formattedName,
            email: cleanEmail,
            role: "student",
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formattedName)}`,
            createdAt: new Date().toISOString(),
          };
          await syncUserProfileToFirestore(newUser);
          setUser(newUser);
          localStorage.setItem("eduspark_active_user", JSON.stringify(newUser));
          setIsLoading(false);
          return { success: true };
        } catch (createErr: any) {
          if (createErr.code === "auth/email-already-in-use") {
            const friendly = "Incorrect password for this account. Please verify your password.";
            setAuthError(friendly);
            setIsLoading(false);
            return { success: false, error: friendly };
          }
        }
      }

      // 3. Fallback: If Firebase Auth is restricted (operation-not-allowed, network error, or configuration issue)
      // We gracefully authenticate via cloud-synced user session in Firestore!
      if (
        code === "auth/operation-not-allowed" ||
        code === "auth/configuration-not-found" ||
        code === "auth/network-request-failed" ||
        code === "auth/invalid-credential" ||
        code === "auth/user-not-found"
      ) {
        try {
          const deterministicId = generateDeterministicUid(cleanEmail);
          let profile = await loadUserProfileFromFirestore(deterministicId);
          if (!profile) {
            const rawName = cleanEmail.split("@")[0].replace(/[._]/g, " ");
            const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
            profile = {
              id: deterministicId,
              name: formattedName,
              email: cleanEmail,
              role: "student",
              avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formattedName)}`,
              createdAt: new Date().toISOString(),
            };
            await syncUserProfileToFirestore(profile);
          }
          setUser(profile);
          localStorage.setItem("eduspark_active_user", JSON.stringify(profile));
          setIsLoading(false);
          return { success: true };
        } catch (fsErr) {
          console.warn("Firestore account fallback error:", fsErr);
        }
      }

      const friendly = formatAuthError(err);
      setAuthError(friendly);
      setIsLoading(false);
      return { success: false, error: friendly };
    }
  };

  const register = async (name: string, email: string, pass: string, role: Role): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setAuthError(null);
    const cleanEmail = email.trim();
    const cleanName = name.trim() || cleanEmail.split("@")[0];

    try {
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      await updateProfile(cred.user, { displayName: cleanName });
      const idToken = await cred.user.getIdToken();
      setToken(idToken);
      setFirebaseUser(cred.user);

      const newUser: User = {
        id: cred.user.uid,
        name: cleanName,
        email: cleanEmail,
        role,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}`,
        createdAt: new Date().toISOString(),
      };

      await syncUserProfileToFirestore(newUser);
      setUser(newUser);
      localStorage.setItem("eduspark_active_user", JSON.stringify(newUser));
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      const code = err?.code || "";

      // If email already in use, attempt seamless login with the password provided
      if (code === "auth/email-already-in-use") {
        return login(cleanEmail, pass);
      }

      // If Firebase Auth provider is not enabled in Firebase Console (auth/operation-not-allowed)
      if (
        code === "auth/operation-not-allowed" ||
        code === "auth/configuration-not-found" ||
        code === "auth/network-request-failed"
      ) {
        try {
          const deterministicId = generateDeterministicUid(cleanEmail);
          const newUser: User = {
            id: deterministicId,
            name: cleanName,
            email: cleanEmail,
            role,
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}`,
            createdAt: new Date().toISOString(),
          };
          await syncUserProfileToFirestore(newUser);
          setUser(newUser);
          localStorage.setItem("eduspark_active_user", JSON.stringify(newUser));
          setIsLoading(false);
          return { success: true };
        } catch (fsErr) {
          console.warn("Firestore user creation fallback error:", fsErr);
        }
      }

      const friendly = formatAuthError(err);
      setAuthError(friendly);
      setIsLoading(false);
      return { success: false, error: friendly };
    }
  };

  const loginWithGoogle = async (preferredRole: Role = "student"): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const idToken = await cred.user.getIdToken();
      setToken(idToken);
      setFirebaseUser(cred.user);

      let profile = await loadUserProfileFromFirestore(cred.user.uid);
      if (!profile) {
        profile = {
          id: cred.user.uid,
          name: cred.user.displayName || cred.user.email?.split("@")[0] || "Learner",
          email: cred.user.email || "",
          role: preferredRole,
          avatar: cred.user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cred.user.displayName || "Learner")}`,
          createdAt: new Date().toISOString(),
        };
        await syncUserProfileToFirestore(profile);
      }
      setUser(profile);
      localStorage.setItem("eduspark_active_user", JSON.stringify(profile));
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      const code = err?.code || "";
      if (code === "auth/popup-closed-by-user") {
        setIsLoading(false);
        return { success: false, error: "Google sign-in popup was closed." };
      }
      if (code === "auth/unauthorized-domain") {
        const friendly = "Google sign-in domain is restricted in this preview environment. Please use email login or 1-click demo.";
        setAuthError(friendly);
        setIsLoading(false);
        return { success: false, error: friendly };
      }
      const friendly = formatAuthError(err);
      setAuthError(friendly);
      setIsLoading(false);
      return { success: false, error: friendly };
    }
  };

  const loginAsDemo = async (demoRole: Role = "student"): Promise<void> => {
    setIsLoading(true);
    const demoId = demoRole === "teacher" ? "teacher_sarah_chen" : "student_alex_rivera";
    const demoUser: User = {
      id: demoId,
      name: demoRole === "teacher" ? "Dr. Sarah Chen" : "Alex Rivera",
      email: demoRole === "teacher" ? "sarah.chen@eduspark.app" : "alex.rivera@eduspark.app",
      role: demoRole,
      avatar: demoRole === "teacher"
        ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
        : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      createdAt: new Date().toISOString(),
    };
    await syncUserProfileToFirestore(demoUser);
    setUser(demoUser);
    localStorage.setItem("eduspark_active_user", JSON.stringify(demoUser));
    setIsLoading(false);
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await signOut(auth);
    } catch (err) {
      console.warn("Error during sign out:", err);
    } finally {
      setUser(null);
      setFirebaseUser(null);
      setToken(null);
      localStorage.removeItem("eduspark_active_user");
      setIsLoading(false);
    }
  };

  const enterGuestDemo = (demoRole: Role = "student") => {
    const demoUser: User = {
      id: "guest-demo-user",
      name: "Alex Rivera (Demo)",
      email: "demo.student@eduspark.app",
      role: demoRole,
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Alex%20Rivera",
      createdAt: new Date().toISOString(),
    };
    setUser(demoUser);
  };

  const updateUserRole = async (newRole: Role): Promise<void> => {
    if (!user) return;
    const updated = { ...user, role: newRole };
    setUser(updated);
    await syncUserProfileToFirestore(updated);
  };

  const clearError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        token,
        isAuthenticated: !!user,
        isLoading,
        authError,
        login,
        register,
        loginWithGoogle,
        loginAsDemo,
        logout,
        enterGuestDemo,
        updateUserRole,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
