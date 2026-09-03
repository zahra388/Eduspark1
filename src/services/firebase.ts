import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
  type Firestore,
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";
import type { User, Role, LearningTwin, RecoveryPlan, GeneratedCourse, UserLearningPath } from "../types";

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth(app);

// Initialize Firestore with configured Database ID
export const db: Firestore = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

/* -------------------------------------------------------------------------- */
/*                        REAL USER PROFILE FIRESTORE OPS                     */
/* -------------------------------------------------------------------------- */

/**
 * Creates or updates a real user document in Firestore `/users/{uid}`
 */
export async function syncUserProfileToFirestore(
  user: User,
  additionalData: Partial<User> = {}
): Promise<void> {
  if (!user || !user.id) return;
  const userRef = doc(db, "users", user.id);
  const data = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`,
    createdAt: user.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    ...additionalData,
  };

  await setDoc(userRef, data, { merge: true });
}

/**
 * Loads a real user profile from Firestore `/users/{uid}`
 */
export async function loadUserProfileFromFirestore(uid: string): Promise<User | null> {
  if (!uid) return null;
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as User;
    }
    return null;
  } catch (err) {
    console.warn("Could not load user profile from Firestore:", err);
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/*                      LEARNER TWIN & PROGRESS FIRESTORE OPS                 */
/* -------------------------------------------------------------------------- */

/**
 * Persist learner twin knowledge map and stats in Firestore
 */
export async function saveLearnerTwinToFirestore(uid: string, twin: LearningTwin): Promise<void> {
  if (!uid) return;
  try {
    const ref = doc(db, "users", uid, "learning_profile", "twin");
    await setDoc(ref, {
      ...twin,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.warn("Failed to persist Learner Twin in Firestore:", err);
  }
}

export async function loadLearnerTwinFromFirestore(uid: string): Promise<LearningTwin | null> {
  if (!uid) return null;
  try {
    const ref = doc(db, "users", uid, "learning_profile", "twin");
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return snap.data() as LearningTwin;
    }
  } catch (err) {
    console.warn("Failed to load Learner Twin from Firestore:", err);
  }
  return null;
}

/* -------------------------------------------------------------------------- */
/*                      RECOVERY PLAN FIRESTORE PERSISTENCE                  */
/* -------------------------------------------------------------------------- */

export async function saveRecoveryPlanToFirestore(uid: string, plan: RecoveryPlan): Promise<void> {
  if (!uid || !plan) return;
  try {
    const ref = doc(db, "recovery_plans", plan.id || `rec_${Date.now()}`);
    await setDoc(ref, {
      ...plan,
      userId: uid,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.warn("Failed to save recovery plan to Firestore:", err);
  }
}

export async function loadActiveRecoveryPlanFromFirestore(uid: string): Promise<RecoveryPlan | null> {
  if (!uid) return null;
  try {
    const q = query(
      collection(db, "recovery_plans"),
      where("userId", "==", uid)
    );
    const snaps = await getDocs(q);
    if (!snaps.empty) {
      // Pick the most recent
      const plans = snaps.docs.map(d => d.data() as RecoveryPlan);
      plans.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return plans[0];
    }
  } catch (err) {
    console.warn("Failed to load recovery plan from Firestore:", err);
  }
  return null;
}

/* -------------------------------------------------------------------------- */
/*                      COURSES & NOTES FIRESTORE PERSISTENCE                 */
/* -------------------------------------------------------------------------- */

export async function saveCourseToFirestore(uid: string, course: GeneratedCourse): Promise<void> {
  if (!uid || !course) return;
  try {
    const courseRef = doc(db, "courses", course.id);
    await setDoc(courseRef, {
      ...course,
      userId: uid,
      createdAt: course.generatedAt || new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.warn("Failed to save course to Firestore:", err);
  }
}

export async function loadCoursesFromFirestore(uid: string): Promise<GeneratedCourse[]> {
  if (!uid) return [];
  try {
    const q = query(collection(db, "courses"), where("userId", "==", uid));
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => d.data() as GeneratedCourse);
  } catch (err) {
    console.warn("Failed to load courses from Firestore:", err);
    return [];
  }
}

/* -------------------------------------------------------------------------- */
/*                     USER CUSTOM LEARNING PATH PERSISTENCE                  */
/* -------------------------------------------------------------------------- */

export async function saveUserLearningPathToFirestore(
  uid: string,
  path: UserLearningPath
): Promise<void> {
  if (!uid || !path) return;
  try {
    const ref = doc(db, "users", uid, "learning_profile", "custom_path");
    await setDoc(ref, {
      ...path,
      userId: uid,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.warn("Failed to save learning path to Firestore:", err);
  }
}

export async function loadUserLearningPathFromFirestore(
  uid: string
): Promise<UserLearningPath | null> {
  if (!uid) return null;
  try {
    const ref = doc(db, "users", uid, "learning_profile", "custom_path");
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return snap.data() as UserLearningPath;
    }
  } catch (err) {
    console.warn("Failed to load learning path from Firestore:", err);
  }
  return null;
}
