import React, { useState } from "react";
import {
  GraduationCap,
  Users,
  AlertTriangle,
  TrendingUp,
  Send,
  Sparkles,
  CheckCircle2,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { initialClassStudents } from "../data/initialData";
import { ClassStudent } from "../types";

export const TeacherDashboardView: React.FC = () => {
  const [students, setStudents] = useState<ClassStudent[]>(initialClassStudents);
  const [interventionSent, setInterventionSent] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<ClassStudent>(initialClassStudents[0]);
  const [teacherNote, setTeacherNote] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);

  const atRiskCount = students.filter((s) => s.status === "at_risk").length;
  const avgMastery = Math.round(
    students.reduce((acc, curr) => acc + curr.overallMastery, 0) / students.length
  );

  const handleSendIntervention = () => {
    setInterventionSent(true);
    setTimeout(() => setInterventionSent(false), 3500);
  };

  const handleSaveNote = () => {
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-1">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Classroom Analytics & Intervention Cockpit</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Teacher / Mentor Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Monitoring Grade 11 STEM & Computational Thinking cohort (28 enrolled learners).
          </p>
        </div>

        <button
          id="btn-send-class-intervention"
          onClick={handleSendIntervention}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 active:scale-95 transition cursor-pointer self-start sm:self-auto"
        >
          <Send className="w-4 h-4" />
          <span>{interventionSent ? "Intervention Dispatched!" : "Dispatch Class Micro-Intervention"}</span>
        </button>
      </div>

      {/* Class Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Class Average Mastery</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {avgMastery}%
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            +6% post-concept map reviews
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>At-Risk Students</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400">
            {atRiskCount} Learners
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Probability & Recursion bottlenecks
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Active Study Streaks</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            86% Rate
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            24 students active in the last 24h
          </p>
        </div>
      </div>

      {/* Cohort Insights & Common Class Bottlenecks */}
      <div className="p-5 sm:p-6 rounded-3xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 space-y-3">
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs sm:text-sm">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Cohort AI Bottleneck Summary (Identified by EduSpark Twin Aggregator)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-amber-200 dark:border-amber-800/40 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">
              1. Conditional Marginal Likelihood
            </span>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              64% of cohort mistakes stem from confusing Prior P(A) with Marginal P(B).
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-amber-200 dark:border-amber-800/40 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">
              2. Recursion Base Condition Misses
            </span>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Infinite loops created due to boundary conditions evaluation flaws.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-amber-200 dark:border-amber-800/40 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">
              3. Cellular Photolysis Chemical Balance
            </span>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Students miss the oxygen byproduct release in electron cascade formulas.
            </p>
          </div>
        </div>
      </div>

      {/* Student Roster Table & Individual Diagnostic Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Student List Table */}
        <div className="lg:col-span-2 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Student Cohort Roster</h3>
            <span className="text-xs text-slate-400">Click learner to review twin</span>
          </div>

          <div className="space-y-2">
            {students.map((student) => {
              const isSelected = selectedStudent.id === student.id;
              return (
                <div
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/20"
                      : "bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                        {student.name}
                      </p>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                        Struggling: {student.strugglingConcept}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {student.overallMastery}%
                      </span>
                      <span
                        className={`text-[10px] uppercase font-bold block px-2 py-0.5 rounded-full ${
                          student.status === "at_risk"
                            ? "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300"
                            : student.status === "needs_challenge"
                            ? "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300"
                            : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                        }`}
                      >
                        {student.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Individual Student Inspector */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Student Twin Profile
            </span>
            <span className="text-xs font-bold text-indigo-600">{selectedStudent.streakDays} Day Streak</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-3">
              <img
                src={selectedStudent.avatar}
                alt={selectedStudent.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/20"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{selectedStudent.name}</h4>
                <p className="text-[11px] text-slate-500">{selectedStudent.email}</p>
                <span className="text-[10px] text-indigo-600 font-semibold">
                  Last active: {selectedStudent.lastActive}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                Targeted Intervention Area
              </span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {selectedStudent.strugglingConcept}
              </p>
            </div>

            {/* Teacher Feedback / Action Note */}
            <div className="space-y-1.5 pt-2">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">
                Teacher Encouragement / Direct Guidance
              </label>
              <textarea
                rows={3}
                value={teacherNote}
                onChange={(e) => setTeacherNote(e.target.value)}
                placeholder={`Write personal guidance for ${selectedStudent.name.split(" ")[0]}...`}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <button
                onClick={handleSaveNote}
                className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer"
              >
                {noteSaved ? "Guidance Sent to Student Twin!" : "Send Guidance to Learner"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
