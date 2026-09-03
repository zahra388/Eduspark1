import React, { useState, useEffect } from "react";
import { Trophy, Timer, Zap, Flame, CheckCircle2, RotateCcw, Award, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import { dailyChallengeQuestions } from "../data/initialData";
import { syncService } from "../services/syncService";

interface ChallengeArenaViewProps {
  onEarnXp: (xp: number) => void;
}

export const ChallengeArenaView: React.FC<ChallengeArenaViewProps> = ({ onEarnXp }) => {
  const [gameState, setGameState] = useState<"idle" | "playing" | "completed">("idle");
  const [timeLeft, setTimeLeft] = useState(90);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  // Timer loop
  useEffect(() => {
    if (gameState !== "playing") return;
    if (timeLeft <= 0) {
      handleFinishGame();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const handleStartGame = () => {
    setGameState("playing");
    setTimeLeft(90);
    setCurrentIdx(0);
    setScore(0);
    setStreak(0);
    setSelectedAnswer(null);
  };

  const handleSelectOption = (optIdx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optIdx);

    const isCorrect = optIdx === dailyChallengeQuestions[currentIdx].correctIndex;
    if (isCorrect) {
      setScore((s) => s + 1);
      setStreak((st) => st + 1);
    } else {
      setStreak(0);
    }

    // Auto advance after 600ms
    setTimeout(() => {
      if (currentIdx + 1 < dailyChallengeQuestions.length) {
        setCurrentIdx((idx) => idx + 1);
        setSelectedAnswer(null);
      } else {
        handleFinishGame();
      }
    }, 600);
  };

  const handleFinishGame = () => {
    setGameState("completed");
    const earnedXp = score * 50 + (timeLeft > 0 ? 30 : 0);
    onEarnXp(earnedXp);

    syncService.queueItem("challenge_completed", {
      score,
      total: dailyChallengeQuestions.length,
      timeLeft,
      earnedXp,
      timestamp: Date.now(),
    });

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const currentQ = dailyChallengeQuestions[currentIdx];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-semibold mb-1">
            <Trophy className="w-3.5 h-3.5" />
            <span>High-Stakes Speed Recall</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            90-Second Daily Challenge Arena
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            5 rapid-fire questions under strict exam pressure to build automatic cognitive recall.
          </p>
        </div>

        {gameState === "playing" && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-mono font-bold text-sm">
            <Timer className="w-4 h-4 animate-spin -duration-1000" />
            <span>{timeLeft}s remaining</span>
          </div>
        )}
      </div>

      {/* Main Game Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm min-h-[380px] flex flex-col justify-between">
        {gameState === "idle" && (
          <div className="py-8 text-center space-y-6 max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Zap className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Today&apos;s High-Yield Sprint
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Test your instincts on Calculus, Probability, and Algorithms. +250 XP for a perfect run!
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white block">5</span>
                <span className="text-[11px] text-slate-400">Questions</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white block">90s</span>
                <span className="text-[11px] text-slate-400">Time Limit</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-amber-600 dark:text-amber-400 block">+250</span>
                <span className="text-[11px] text-slate-400">Bonus XP</span>
              </div>
            </div>

            <button
              id="btn-start-90s-challenge"
              onClick={handleStartGame}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 active:scale-98 transition cursor-pointer"
            >
              Start 90s Challenge
            </button>
          </div>
        )}

        {gameState === "playing" && currentQ && (
          <div className="space-y-6">
            {/* Top Bar: Progress & Combo */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-500 dark:text-slate-400">
                Question {currentIdx + 1} of {dailyChallengeQuestions.length}
              </span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold">
                  {currentQ.topic}
                </span>
                {streak > 1 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-500" />
                    <span>{streak}x Combo!</span>
                  </span>
                )}
              </div>
            </div>

            {/* Timer Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-rose-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(timeLeft / 90) * 100}%` }}
              />
            </div>

            {/* Question Text */}
            <div className="py-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {currentQ.question}
              </h3>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === currentQ.correctIndex;
                let btnStyle = "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-400";

                if (selectedAnswer !== null) {
                  if (isCorrect) {
                    btnStyle = "bg-emerald-100 dark:bg-emerald-950 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold";
                  } else if (isSelected) {
                    btnStyle = "bg-rose-100 dark:bg-rose-950 border-rose-500 text-rose-900 dark:text-rose-200";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={selectedAnswer !== null}
                    className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition cursor-pointer ${btnStyle}`}
                  >
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {gameState === "completed" && (
          <div className="py-8 text-center space-y-6 max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                Challenge Complete!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                You correctly answered {score} out of {dailyChallengeQuestions.length} questions.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-indigo-900 dark:text-indigo-200 font-bold text-sm">
              +{score * 50 + (timeLeft > 0 ? 30 : 0)} XP Credited to your Profile!
            </div>

            <button
              onClick={handleStartGame}
              className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
