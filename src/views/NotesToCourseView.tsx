import React, { useState } from "react";
import {
  FileSpreadsheet,
  Sparkles,
  UploadCloud,
  FileText,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Layers,
  BookOpen,
} from "lucide-react";
import confetti from "canvas-confetti";
import { GeneratedCourse, Flashcard, QuizQuestion } from "../types";
import { sampleNotesPreset } from "../data/initialData";
import { syncService } from "../services/syncService";

interface NotesToCourseViewProps {
  onCompleteQuiz: (score: number, total: number) => void;
}

export const NotesToCourseView: React.FC<NotesToCourseViewProps> = ({ onCompleteQuiz }) => {
  const [inputText, setInputText] = useState(sampleNotesPreset[0].content);
  const [subject, setSubject] = useState(sampleNotesPreset[0].subject);
  const [isGenerating, setIsGenerating] = useState(false);
  const [course, setCourse] = useState<GeneratedCourse | null>(null);

  // Flashcards state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleSelectPreset = (preset: (typeof sampleNotesPreset)[0]) => {
    setInputText(preset.content);
    setSubject(preset.subject);
  };

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    setIsGenerating(true);
    setCourse(null);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setCurrentCardIndex(0);

    try {
      const res = await fetch("/api/ai/notes-to-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notesText: inputText, subject }),
      });
      const data = await res.json();
      setCourse(data);
    } catch {
      // Offline / error fallback
      setCourse({
        id: "crs_fallback",
        title: `${subject || "Science"}: Mastery Module`,
        subject: subject || "STEM",
        summary: "Synthesized core conceptual building blocks from your lecture text.",
        conceptMap: {
          nodes: [
            { id: "1", label: "Core Axiom", details: "Foundational postulate.", mastery: 85 },
            { id: "2", label: "Transformation", details: "State transition mechanism.", mastery: 65 },
            { id: "3", label: "Outcome", details: "Final equilibrium state.", mastery: 50 },
          ],
          edges: [{ from: "1", to: "2", relation: "Powers" }, { from: "2", to: "3", relation: "Yields" }],
        },
        flashcards: [
          { id: "fc_1", question: "What is the primary governing factor in this system?", answer: "Equilibrium balance and conservation laws.", category: "Core" },
          { id: "fc_2", question: "How is potential energy transformed?", answer: "Via enzymatic electrochemical cascades.", category: "Energetics" },
        ],
        quiz: [
          {
            id: "q_1",
            question: "Which mechanism drives the core reaction rate?",
            options: ["Concentration gradient", "Ambient pressure", "Total inertia", "Static friction"],
            correctIndex: 0,
            explanation: "Concentration gradients directly dictate diffusion rates according to Fick's first law.",
            category: "Core",
            misconceptionType: "Conceptual",
          },
        ],
        generatedAt: new Date().toISOString(),
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOptionSelect = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmitQuiz = () => {
    if (!course || quizSubmitted) return;
    setQuizSubmitted(true);

    let correctCount = 0;
    course.quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });

    onCompleteQuiz(correctCount, course.quiz.length);
    syncService.queueItem("quiz_result", {
      courseTitle: course.title,
      score: correctCount,
      total: course.quiz.length,
      timestamp: Date.now(),
    });

    if (correctCount >= course.quiz.length * 0.75) {
      confetti({ particleCount: 70, spread: 60 });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-1">
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Turn My Notes Into a Course</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Notes-to-Curriculum Generator
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Upload or paste any notes to synthesize an interactive Concept Map, Summary, Flashcards, and Adaptive Quiz.
        </p>
      </div>

      {/* Input Section */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Lecture Notes / Syllabus Text
          </label>
          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-[11px] text-slate-400">Try sample:</span>
            {sampleNotesPreset.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(preset)}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition cursor-pointer whitespace-nowrap"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <textarea
          id="notes-input-area"
          rows={6}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste raw lecture notes, slide transcripts, or textbook chapters..."
          className="w-full p-4 rounded-2xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30"
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject or Topic Name (e.g. Cellular Biology)"
            className="w-full sm:w-80 px-3.5 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          />

          <button
            id="btn-generate-course"
            onClick={handleGenerate}
            disabled={isGenerating || !inputText.trim()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 active:scale-95 disabled:opacity-50 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? "Analyzing Notes..." : "Generate Interactive Course"}</span>
          </button>
        </div>
      </div>

      {/* Generated Course Results */}
      {course && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Executive Summary & Concept Flow */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
                <BookOpen className="w-4 h-4" />
                <span>Executive Summary</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{course.title}</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {course.summary}
            </p>

            {/* Concept Nodes Progression */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Concept Synthesis Flow
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {course.conceptMap.nodes.map((node, idx) => (
                  <div
                    key={node.id}
                    className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-bold text-indigo-950 dark:text-indigo-200">
                      <span>Step {idx + 1}: {node.label}</span>
                      {node.mastery && <span className="text-[10px] text-indigo-600">{node.mastery}%</span>}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{node.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Flashcards & Quiz Split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Interactive Flashcards */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Adaptive Flashcards ({currentCardIndex + 1}/{course.flashcards.length})
                  </h3>
                </div>
                <span className="text-xs text-slate-400">Click card to flip</span>
              </div>

              {course.flashcards.length > 0 && (
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="min-h-52 p-6 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-purple-50/30 dark:from-indigo-950/30 dark:to-slate-900 border border-indigo-100 dark:border-indigo-900/40 flex flex-col items-center justify-center text-center cursor-pointer select-none transition-all hover:border-indigo-400"
                >
                  <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                    {isFlipped ? "💡 Answer" : "❓ Question / Concept"}
                  </span>
                  <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white max-w-sm leading-relaxed">
                    {isFlipped
                      ? course.flashcards[currentCardIndex].answer
                      : course.flashcards[currentCardIndex].question}
                  </p>
                  <span className="text-[11px] text-slate-400 mt-4">
                    {isFlipped ? "Tap to see question" : "Tap to reveal answer"}
                  </span>
                </div>
              )}

              {/* Card Navigation */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setCurrentCardIndex((prev) => Math.max(0, prev - 1));
                  }}
                  disabled={currentCardIndex === 0}
                  className="px-3 py-1.5 rounded-lg border text-xs font-semibold disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-xs text-slate-500 font-medium">
                  {currentCardIndex + 1} of {course.flashcards.length}
                </span>
                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setCurrentCardIndex((prev) => Math.min(course.flashcards.length - 1, prev + 1));
                  }}
                  disabled={currentCardIndex === course.flashcards.length - 1}
                  className="px-3 py-1.5 rounded-lg border text-xs font-semibold disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>

            {/* Generated Quiz */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Concept Mastery Check ({course.quiz.length} Questions)
                </h3>
                {quizSubmitted && (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Completed
                  </span>
                )}
              </div>

              <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                {course.quiz.map((q, qIdx) => {
                  const userAns = selectedAnswers[qIdx];
                  const isCorrect = userAns === q.correctIndex;
                  return (
                    <div
                      key={q.id}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                    >
                      <p className="font-bold text-slate-900 dark:text-white">
                        {qIdx + 1}. {q.question}
                      </p>

                      <div className="space-y-1.5">
                        {q.options.map((opt, optIdx) => {
                          const isOptionSelected = userAns === optIdx;
                          let optStyle =
                            "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300";

                          if (quizSubmitted) {
                            if (optIdx === q.correctIndex) {
                              optStyle = "bg-emerald-100 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold";
                            } else if (isOptionSelected && !isCorrect) {
                              optStyle = "bg-rose-100 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200";
                            }
                          } else if (isOptionSelected) {
                            optStyle = "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-900 dark:text-indigo-200 font-bold";
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleOptionSelect(qIdx, optIdx)}
                              className={`w-full p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${optStyle}`}
                            >
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-[11px] leading-relaxed">
                          <span className="font-bold block text-slate-900 dark:text-white">Explanation:</span>
                          <span className="text-slate-600 dark:text-slate-300">{q.explanation}</span>
                          {q.misconceptionType && (
                            <span className="inline-block mt-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                              Cognitive category: {q.misconceptionType}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!quizSubmitted ? (
                <button
                  id="btn-submit-notes-quiz"
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(selectedAnswers).length === 0}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs disabled:opacity-50 transition cursor-pointer"
                >
                  Submit Answers & Evaluate
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold text-center">
                  Quiz evaluated and synced with your Learning Twin Knowledge Map!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
