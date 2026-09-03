export type Role = 'student' | 'teacher';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface KnowledgeNode {
  id: string;
  topic: string;
  category: string;
  mastery: number; // 0 - 100
  status: 'mastered' | 'learning' | 'struggling' | 'unexplored';
  prerequisites: string[];
  description: string;
  keyFormulas?: string[];
  summary?: string;
}

export interface LearningTwin {
  studentName: string;
  targetRole: string; // e.g. "AI Engineer", "Data Scientist"
  strengths: string[];
  weaknesses: string[];
  frequentlyMisunderstood: string[];
  learningStyle: 'Visual-Interactive' | 'Socratic-Inquiry' | 'Text-Structured' | 'Auditory-Verbal';
  overallMastery: number;
  studyStreakDays: number;
  streakProtected: boolean;
  xp: number;
  level: number;
  levelTitle: string;
  knowledgeMap: KnowledgeNode[];
}

export interface RecoveryDay {
  day: number;
  title: string;
  focus: string;
  completed: boolean;
  tasks: string[];
}

export interface RecoveryPlan {
  id: string;
  title: string;
  subject: string;
  identifiedIssues: string[];
  confidenceScore: number;
  days: RecoveryDay[];
  createdAt: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category?: string;
  mastered?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
  misconceptionType?: 'Conceptual' | 'Formula Recall' | 'Careless Error' | 'Interpretation';
}

export interface GeneratedCourse {
  id: string;
  title: string;
  subject: string;
  summary: string;
  conceptMap: {
    nodes: { id: string; label: string; details: string; mastery?: number }[];
    edges: { from: string; to: string; relation: string }[];
  };
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  generatedAt: string;
}

export interface MistakeRecord {
  id: string;
  question: string;
  studentAnswer: string;
  correctAnswer: string;
  topic: string;
  errorType: string;
  whyItHappened: string;
  correctThinking: string;
  timestamp: string;
  reviewed: boolean;
  followUpPractice?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface CareerTrack {
  id: string;
  roleTitle: string;
  description: string;
  currentMatchPercent: number;
  skillsAcquired: string[];
  skillsMissing: string[];
  targetSkills: string[];
  roadmap: {
    step: number;
    title: string;
    focus: string;
    status: 'completed' | 'in_progress' | 'upcoming';
  }[];
}

export interface ClassStudent {
  id: string;
  name: string;
  email: string;
  avatar: string;
  overallMastery: number;
  streakDays: number;
  strugglingConcept: string;
  status: 'at_risk' | 'on_track' | 'needs_challenge';
  lastActive: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  improvementPercentage: number;
  streak: number;
  isCurrentUser?: boolean;
}

export interface SkillBadge {
  id: string;
  title: string;
  category: string;
  stars: number; // 1 to 5
  status: 'verified' | 'in-progress' | 'locked';
  verifiedDate?: string;
  verificationEvidence: string;
  score: number;
}

export interface SyncItem {
  id: string;
  type: 'quiz_result' | 'xp_gain' | 'flashcard_review' | 'study_session' | 'custom_note' | 'challenge_completed';
  payload: any;
  timestamp: number;
  synced: boolean;
}

export interface RoadmapPhase {
  phase: number;
  title: string;
  duration: string;
  focus: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  recommendedActions: string[];
}

export interface UserLearningPath {
  id: string;
  userId: string;
  trackId: string; // e.g. "ai_engineer", "fullstack_developer", "data_scientist", "stem_academic", "custom"
  roleTitle: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  learningStyle: 'Visual-Interactive' | 'Socratic-Inquiry' | 'Text-Structured' | 'Auditory-Verbal';
  dailyCommitmentMinutes: number; // 15, 30, 60
  primaryPriority: string;
  customGoal?: string;
  targetSkills: string[];
  keyStrengths: string[];
  focusGaps: string[];
  roadmap: RoadmapPhase[];
  startingMilestone: string;
  completionEstimateWeeks: number;
  createdAt: string;
  updatedAt: string;
}

export interface PathQuestionnaireAnswers {
  trackId: string;
  customGoal?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  learningStyle: 'Visual-Interactive' | 'Socratic-Inquiry' | 'Text-Structured' | 'Auditory-Verbal';
  dailyCommitmentMinutes: number;
  primaryPriority: string;
  specificTopics?: string[];
}
