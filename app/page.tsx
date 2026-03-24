"use client";
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ───────── Types & Constants ───────── */
type Step = "landing" | "idea" | "questions" | "generating" | "result";

const audienceOptions = ["Students & Schools", "Businesses & Enterprises", "General Public", "Creators & Artists", "Developers", "E-Commerce Shoppers"];
const platformOptions = ["Web App", "Mobile App", "Both (Responsive)", "Desktop App"];
const styleOptions = ["Minimal & Clean", "Bold & Vibrant", "Corporate & Professional", "Playful & Fun", "Dark & Sleek", "Glassmorphism & Modern"];
const featureOptions = ["Authentication / Login", "Dashboard / Analytics", "Payments / Checkout", "Blog / Content", "Chat / Messaging", "File Upload", "Search & Filters", "Notifications", "Admin Panel", "User Profiles", "Maps / Location", "Social Features"];
const colorMoodOptions = ["Dark Mode", "Light Mode", "Vibrant & Colorful", "Pastel & Soft", "Monochrome", "Earth Tones"];

/* ───────── Main Component ───────── */
export default function Home() {
  const [step, setStep] = useState<Step>("landing");
  const [idea, setIdea] = useState("");
  const [audience, setAudience] = useState("");
  const [platform, setPlatform] = useState("");
  const [style, setStyle] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [colorMood, setColorMood] = useState("");
  const [result, setResult] = useState<{ text: string; prompt: string; brief: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [history, setHistory] = useState<{ idea: string; prompt: string; brief: string }[]>([]);

  const toggleFeature = (f: string) => {
    setFeatures((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]);
  };

  const generateUX = useCallback(async () => {
    setStep("generating");
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, audience, platform, style, features, colorMood }),
      });
      const data = await res.json();

      const resultData = {
        text: data.text || "No response from AI",
        prompt: data.prompt || data.text || "",
        brief: data.brief || "",
      };
      setResult(resultData);
      setHistory((prev) => [{ idea, prompt: resultData.prompt, brief: resultData.brief }, ...prev]);
      setStep("result");
    } catch {
      setResult({ text: "Error connecting to AI", prompt: "", brief: "" });
      setStep("result");
    }
    setLoading(false);
  }, [idea, audience, platform, style, features, colorMood]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2500);
  };

  const formatForV0 = (prompt: string) => `Build this with Next.js, Tailwind CSS, and shadcn/ui components:\n\n${prompt}`;
  const formatForBolt = (prompt: string) => `Create this as a full-stack web application:\n\n${prompt}`;
  const formatForCursor = (prompt: string) => `Implement the following UI/UX design as a React application with TypeScript and Tailwind CSS:\n\n${prompt}`;

  const resetAll = () => {
    setStep("idea");
    setIdea("");
    setAudience("");
    setPlatform("");
    setStyle("");
    setFeatures([]);
    setColorMood("");
    setResult(null);
  };

  const progressSteps = ["Idea", "Details", "Generate"];
  const currentProgress = step === "idea" ? 0 : step === "questions" ? 1 : 2;

  /* ───────── Animations ───────── */
  const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.45, ease: "easeOut" } };

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background ambiance */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-30%] left-[-15%] w-[60%] h-[60%] rounded-full bg-indigo-600/8 blur-[150px]" />
        <div className="absolute bottom-[-30%] right-[-15%] w-[60%] h-[60%] rounded-full bg-purple-600/8 blur-[150px]" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-cyan-500/5 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-4 sm:px-6 py-8 md:py-16 max-w-5xl mx-auto min-h-screen">

        {/* ── Persistent Nav Bar ── */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex items-center justify-between mb-8 md:mb-12"
        >
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setStep("landing")}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.764m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">DesignPilot<span className="text-indigo-400">AI</span></span>
          </div>

          {step !== "landing" && (
            <button onClick={resetAll} className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-800/50">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              New Project
            </button>
          )}
        </motion.nav>

        <AnimatePresence mode="wait">

          {/* ═══════ LANDING ═══════ */}
          {step === "landing" && (
            <motion.div key="landing" {...fadeUp} className="flex flex-col items-center text-center w-full flex-1 justify-center -mt-8 md:-mt-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-widest uppercase mb-8 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
                </span>
                AI-Powered UX Design
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
                Your idea to a{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
                  production-ready
                </span>
                <br />UI design prompt.
              </h1>

              <p className="text-slate-400 text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
                Describe your app, answer a few smart questions, and get a <strong className="text-slate-200">copy-paste-ready prompt</strong> optimized for <span className="text-indigo-300">v0</span>, <span className="text-purple-300">Bolt</span>, <span className="text-cyan-300">Cursor</span>, and more.
              </p>

              <button
                onClick={() => setStep("idea")}
                className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-base md:text-lg shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_50px_rgba(99,102,241,0.5)] transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3"
              >
                Start Designing
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              {/* Feature badges */}
              <div className="flex flex-wrap justify-center gap-3 mt-12 max-w-lg">
                {["Smart Questionnaire", "v0 Ready", "Bolt Ready", "Cursor Ready", "Free to Use"].map((badge) => (
                  <span key={badge} className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-800/60 border border-slate-700/50 text-slate-400">
                    {badge}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* ═══════ STEP 1: IDEA ═══════ */}
          {step === "idea" && (
            <motion.div key="idea" {...fadeUp} className="w-full max-w-2xl mx-auto flex-1">
              {/* Progress */}
              <div className="flex items-center justify-center gap-2 mb-10">
                {progressSteps.map((s, i) => (
                  <React.Fragment key={s}>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${i <= currentProgress ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30" : "bg-slate-800/40 text-slate-500 border border-slate-700/30"}`}>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${i <= currentProgress ? "bg-indigo-500 text-white" : "bg-slate-700 text-slate-400"}`}>{i + 1}</span>
                      <span className="hidden sm:inline">{s}</span>
                    </div>
                    {i < progressSteps.length - 1 && <div className={`w-8 h-0.5 rounded-full ${i < currentProgress ? "bg-indigo-500/50" : "bg-slate-700/50"}`} />}
                  </React.Fragment>
                ))}
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">What do you want to build?</h2>
              <p className="text-slate-400 text-center mb-8">Describe your app idea in a sentence or two.</p>

              <div className="rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-2 shadow-2xl transition-all hover:border-slate-600/50 mb-6">
                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  className="w-full bg-transparent p-4 text-slate-100 placeholder:text-slate-500 resize-none outline-none text-base md:text-lg min-h-[100px] max-h-[200px] leading-relaxed"
                  rows={3}
                  placeholder="e.g., A school management portal for parents and teachers to track student progress..."
                  autoFocus
                />
              </div>

              {/* Quick idea chips */}
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="text-xs text-slate-500 self-center mr-1">Try:</span>
                {["School website", "E-commerce store", "Portfolio site", "SaaS dashboard", "Blog platform"].map((chip) => (
                  <button key={chip} onClick={() => setIdea(chip)} className="px-3 py-1.5 rounded-full text-xs bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-white hover:border-indigo-500/40 hover:bg-indigo-500/10 transition-all">
                    {chip}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep("questions")}
                disabled={!idea.trim()}
                className={`w-full py-4 rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 ${idea.trim() ? "bg-indigo-500 hover:bg-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transform hover:-translate-y-0.5" : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"}`}
              >
                Continue
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </motion.div>
          )}

          {/* ═══════ STEP 2: QUESTIONS ═══════ */}
          {step === "questions" && (
            <motion.div key="questions" {...fadeUp} className="w-full max-w-2xl mx-auto flex-1">
              {/* Progress */}
              <div className="flex items-center justify-center gap-2 mb-10">
                {progressSteps.map((s, i) => (
                  <React.Fragment key={s}>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${i <= currentProgress ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30" : "bg-slate-800/40 text-slate-500 border border-slate-700/30"}`}>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${i <= currentProgress ? "bg-indigo-500 text-white" : "bg-slate-700 text-slate-400"}`}>{i + 1}</span>
                      <span className="hidden sm:inline">{s}</span>
                    </div>
                    {i < progressSteps.length - 1 && <div className={`w-8 h-0.5 rounded-full ${i < currentProgress ? "bg-indigo-500/50" : "bg-slate-700/50"}`} />}
                  </React.Fragment>
                ))}
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">A few quick details</h2>
              <p className="text-slate-400 text-center mb-8">Help us craft the perfect design prompt for <span className="text-indigo-300 font-medium">&ldquo;{idea}&rdquo;</span></p>

              <div className="space-y-8">

                {/* Audience */}
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-3 block tracking-wide">👥 Target Audience</label>
                  <div className="flex flex-wrap gap-2">
                    {audienceOptions.map((opt) => (
                      <button key={opt} onClick={() => setAudience(opt)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${audience === opt ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-[0_0_10px_rgba(99,102,241,0.15)]" : "bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600 hover:text-slate-300"}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Platform */}
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-3 block tracking-wide">📱 Platform</label>
                  <div className="flex flex-wrap gap-2">
                    {platformOptions.map((opt) => (
                      <button key={opt} onClick={() => setPlatform(opt)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${platform === opt ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-[0_0_10px_rgba(99,102,241,0.15)]" : "bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600 hover:text-slate-300"}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style */}
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-3 block tracking-wide">✨ Design Style</label>
                  <div className="flex flex-wrap gap-2">
                    {styleOptions.map((opt) => (
                      <button key={opt} onClick={() => setStyle(opt)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${style === opt ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.15)]" : "bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600 hover:text-slate-300"}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Mood */}
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-3 block tracking-wide">🎨 Color Mood</label>
                  <div className="flex flex-wrap gap-2">
                    {colorMoodOptions.map((opt) => (
                      <button key={opt} onClick={() => setColorMood(opt)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${colorMood === opt ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.15)]" : "bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600 hover:text-slate-300"}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-3 block tracking-wide">🧩 Key Features <span className="text-slate-500 font-normal">(select all that apply)</span></label>
                  <div className="flex flex-wrap gap-2">
                    {featureOptions.map((opt) => (
                      <button key={opt} onClick={() => toggleFeature(opt)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${features.includes(opt) ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.15)]" : "bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600 hover:text-slate-300"}`}>
                        {features.includes(opt) && <span className="mr-1.5">✓</span>}{opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-10">
                <button onClick={() => setStep("idea")} className="px-6 py-4 rounded-xl font-semibold text-sm bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700/50 hover:border-slate-600 transition-all">
                  Back
                </button>
                <button
                  onClick={generateUX}
                  className="flex-1 py-4 rounded-xl font-semibold text-base bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_35px_rgba(99,102,241,0.5)] transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>
                  Generate Design Prompt
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══════ GENERATING ═══════ */}
          {step === "generating" && (
            <motion.div key="generating" {...fadeUp} className="w-full max-w-2xl mx-auto flex-1 flex flex-col items-center justify-center -mt-8 md:-mt-16">
              <div className="relative mb-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center">
                  <svg className="animate-spin h-8 w-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
                <div className="absolute -inset-4 bg-indigo-500/10 rounded-3xl blur-xl animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Crafting your design prompt...</h3>
              <p className="text-slate-400 text-sm">DesignPilot AI is analyzing your requirements</p>

              <div className="mt-8 space-y-3 w-full max-w-sm">
                {["Analyzing project scope", "Designing component architecture", "Creating color system", "Generating vibe-coding prompt"].map((text, i) => (
                  <motion.div
                    key={text}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 1.2, duration: 0.4 }}
                    className="flex items-center gap-3 text-sm text-slate-400"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 1.2 + 0.8 }}
                      className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center"
                    >
                      <motion.svg initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 1.2 + 1 }} className="w-3 h-3 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </motion.svg>
                    </motion.div>
                    {text}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ═══════ RESULT ═══════ */}
          {step === "result" && result && (
            <motion.div key="result" {...fadeUp} className="w-full max-w-3xl mx-auto flex-1">
              {/* Header */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide mb-4">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Generation Complete
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Your Design Prompt is Ready</h2>
                <p className="text-slate-400">Copy and paste into your favorite AI code generator</p>
              </div>

              {/* Export Buttons Grid */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 mb-8">
                {[
                  { label: "Copy for v0", format: formatForV0, color: "indigo", icon: "⚡" },
                  { label: "Copy for Bolt", format: formatForBolt, color: "purple", icon: "🔩" },
                  { label: "Copy for Cursor", format: formatForCursor, color: "cyan", icon: "🖱️" },
                  { label: "Copy Raw", format: (p: string) => p, color: "slate", icon: "📋" },
                ].map((btn) => (
                  <button
                    key={btn.label}
                    onClick={() => copyToClipboard(btn.format(result.prompt), btn.label)}
                    className={`group relative px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 border flex flex-col items-center gap-2 ${
                      copied === btn.label
                        ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                        : btn.color === "indigo" ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/25 hover:bg-indigo-500/20 hover:border-indigo-500/40"
                        : btn.color === "purple" ? "bg-purple-500/10 text-purple-300 border-purple-500/25 hover:bg-purple-500/20 hover:border-purple-500/40"
                        : btn.color === "cyan" ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/25 hover:bg-cyan-500/20 hover:border-cyan-500/40"
                        : "bg-slate-800/50 text-slate-300 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600"
                    }`}
                  >
                    <span className="text-lg">{copied === btn.label ? "✓" : btn.icon}</span>
                    <span className="text-xs">{copied === btn.label ? "Copied!" : btn.label}</span>
                  </button>
                ))}
              </div>

              {/* Design Brief */}
              {result.brief && (
                <div className="rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-6 md:p-8 mb-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-8 w-1.5 rounded-full bg-indigo-500" />
                    <h3 className="text-lg font-bold text-white">Design Brief</h3>
                  </div>
                  <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {result.brief.split("\n").map((line, i) => {
                      if (!line.trim()) return <br key={i} />;
                      const colonIndex = line.indexOf(":");
                      if (colonIndex > 0 && colonIndex < 20) {
                        return (
                          <p key={i} className="mb-3">
                            <span className="font-semibold text-indigo-300">{line.substring(0, colonIndex + 1)}</span>
                            <span>{line.substring(colonIndex + 1)}</span>
                          </p>
                        );
                      }
                      return <p key={i} className="mb-2">{line}</p>;
                    })}
                  </div>
                </div>
              )}

              {/* Full Prompt (Collapsible) */}
              <details className="group rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 overflow-hidden mb-8">
                <summary className="p-4 sm:p-6 cursor-pointer flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-1.5 rounded-full bg-purple-500" />
                    <h3 className="text-lg font-bold text-white">Full Generated Prompt</h3>
                  </div>
                  <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div className="px-4 pb-4 sm:px-6 sm:pb-6">
                  <div className="rounded-xl bg-slate-950/80 border border-slate-800/80 p-3 sm:p-5 max-h-[400px] overflow-y-auto overflow-x-auto">
                    <pre className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-mono break-words">{result.prompt}</pre>
                  </div>
                </div>
              </details>

              {/* Start Over */}
              <div className="text-center">
                <button
                  onClick={resetAll}
                  className="px-6 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:text-white bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/40 hover:bg-indigo-500/10 transition-all duration-300 inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  Generate Another
                </button>
              </div>

              {/* History */}
              {history.length > 1 && (
                <div className="mt-16">
                  <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-800/80">
                    <h3 className="text-xs sm:text-sm font-semibold tracking-widest text-slate-500 uppercase">Previous Generations</h3>
                    <span className="text-xs font-medium bg-slate-800 text-slate-400 py-1 px-2 sm:py-1.5 sm:px-3 rounded-full border border-slate-700/50">{history.length} Saved</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {history.slice(1).map((item, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.01 }}
                        onClick={() => {
                          setResult({ text: "", prompt: item.prompt, brief: item.brief });
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="p-5 bg-slate-900/40 rounded-2xl border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-800/60 cursor-pointer transition-all duration-300 group"
                      >
                        <p className="text-xs text-indigo-400/70 font-medium mb-2">{item.idea}</p>
                        <p className="text-sm text-slate-400 group-hover:text-slate-300 line-clamp-2 leading-relaxed">{item.prompt.substring(0, 120)}...</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  );
}
