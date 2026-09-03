import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquareQuote,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  BookOpen,
  HelpCircle,
  Award,
  Lightbulb,
  Globe,
  User,
  Bot,
  RotateCcw,
} from "lucide-react";
import { LearningTwin } from "../types";

interface Message {
  id: string;
  sender: "user" | "tutor";
  text: string;
  timestamp: string;
  mode?: string;
}

interface AiTutorViewProps {
  learnerProfile: LearningTwin;
  initialTopic?: string | null;
}

export const AiTutorView: React.FC<AiTutorViewProps> = ({ learnerProfile, initialTopic }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg_init",
      sender: "tutor",
      text: `Hello ${learnerProfile.studentName.split(" ")[0]}! I'm your EduSpark Adaptive Tutor. I see you're working toward **${learnerProfile.targetRole}**. How can we level up your knowledge today?`,
      timestamp: "Just now",
      mode: "Explain",
    },
  ]);
  const [input, setInput] = useState(initialTopic ? `Can you help me understand ${initialTopic}?` : "");
  const [mode, setMode] = useState<"Explain" | "Socratic" | "Exam" | "Hint" | "Practice">("Explain");
  const [language, setLanguage] = useState<"English" | "Roman Urdu" | "Urdu">("English");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Web Speech API: Speech-to-Text
  const handleToggleMic = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. You can type your question directly.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === "Urdu" ? "ur-PK" : "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Text-to-Speech
  const handleSpeak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[#*`_]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === "Urdu" ? "ur-PK" : "en-US";
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: "usr_" + Date.now(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          mode,
          language,
          history: messages.slice(-4),
          studentContext: {
            strengths: learnerProfile.strengths,
            weaknesses: learnerProfile.weaknesses,
            targetRole: learnerProfile.targetRole,
          },
        }),
      });
      const data = await res.json();
      const tutorMsg: Message = {
        id: "tut_" + Date.now(),
        sender: "tutor",
        text: data.text || "Let's explore this step-by-step!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        mode,
      };
      setMessages((prev) => [...prev, tutorMsg]);
    } catch {
      const tutorMsg: Message = {
        id: "tut_" + Date.now(),
        sender: "tutor",
        text: `### 💡 Quick Concept Check\n\nWhen evaluating **"${textToSend}"**, break it into its core inputs and desired outputs. What does step 1 look like to you?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        mode,
      };
      setMessages((prev) => [...prev, tutorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    { label: "Explain Bayes' Theorem simply", prompt: "Explain Bayes' Theorem without heavy mathematics. Use a medical diagnosis analogy." },
    { label: "Socratic: Recursion base case", prompt: "Why do I keep getting maximum call stack size exceeded in recursion? Guide me with questions." },
    { label: "Exam question: Bias-Variance", prompt: "Test my knowledge with an intermediate exam scenario on Overfitting and Regularization." },
    { label: "Roman Urdu: Photolysis", prompt: "Photosynthesis mein photolysis of water aasan Roman Urdu mein samjhao." },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-5xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Tutor Header Controls: Mode Selector & Language */}
      <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-800/40">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
            <MessageSquareQuote className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>EduSpark AI Tutor</span>
              <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                {mode}
              </span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Continuous adaptation based on your mistake patterns
            </p>
          </div>
        </div>

        {/* Modes Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {(["Explain", "Socratic", "Exam", "Hint", "Practice"] as const).map((m) => (
            <button
              key={m}
              id={`tutor-mode-${m.toLowerCase()}`}
              onClick={() => setMode(m)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                mode === m
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-1">
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 cursor-pointer"
          >
            <option value="English">English</option>
            <option value="Roman Urdu">Roman Urdu</option>
            <option value="Urdu">Urdu (اردو)</option>
          </select>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 sm:gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isUser
                    ? "bg-indigo-600 text-white"
                    : "bg-gradient-to-tr from-amber-500 to-indigo-600 text-white shadow-xs"
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[85%] sm:max-w-xl space-y-1 ${isUser ? "items-end text-right" : "items-start"}`}>
                <div
                  className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? "bg-indigo-600 text-white rounded-tr-xs"
                      : "bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 rounded-tl-xs border border-slate-200/80 dark:border-slate-700/60"
                  }`}
                >
                  {msg.text}
                </div>

                <div className="flex items-center gap-2 px-1 text-[10px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleSpeak(msg.text)}
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Speak</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin text-indigo-500" />
              <span>EduSpark is reasoning through your learner profile...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/60 overflow-x-auto flex items-center gap-2">
        <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Quick Ask:</span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp.prompt)}
            className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-700 dark:text-slate-300 whitespace-nowrap transition cursor-pointer"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Input Composer & Voice Mic */}
      <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
        <button
          id="btn-voice-mic"
          onClick={handleToggleMic}
          title="Speak to EduSpark AI Tutor"
          className={`p-2.5 rounded-xl border transition-colors cursor-pointer shrink-0 ${
            isListening
              ? "bg-rose-500 text-white border-rose-500 animate-pulse"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:text-indigo-600"
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          id="input-tutor-message"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={
            language === "Roman Urdu"
              ? "Apna sawaal likhein ya bolen (e.g., 'Photosynthesis aasan urdu mein samjhao')..."
              : "Ask anything, ask for a hint, or request a Socratic problem..."
          }
          className="flex-1 px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30"
        />

        <button
          id="btn-send-tutor"
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-xs disabled:opacity-50 cursor-pointer shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
