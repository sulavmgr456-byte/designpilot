"use client";
import React, { useState, useCallback, useEffect, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ───────── Types & Constants ───────── */
type Step = "landing" | "idea" | "questions" | "generating" | "result";

const audienceOptions = ["Students & Schools", "Businesses & Enterprises", "General Public", "Creators & Artists", "Developers", "E-Commerce Shoppers"];
const platformOptions = ["Web App", "Mobile App", "Both (Responsive)", "Desktop App"];
const styleOptions = ["Minimal & Clean", "Bold & Vibrant", "Corporate & Professional", "Playful & Fun", "Dark & Sleek", "Glassmorphism & Modern"];
const featureOptions = ["Authentication / Login", "Dashboard / Analytics", "Payments / Checkout", "Blog / Content", "Chat / Messaging", "File Upload", "Search & Filters", "Notifications", "Admin Panel", "User Profiles", "Maps / Location", "Social Features"];
const colorMoodOptions = ["Dark Mode", "Light Mode", "Vibrant & Colorful", "Pastel & Soft", "Monochrome", "Earth Tones"];

/* ───────── Typing Effect Hook ───────── */
function useTypingEffect(text: string, speed: number = 12, enabled: boolean = true) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!enabled || !text) { setDisplayed(text); setDone(true); return; }
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(interval); setDone(true); }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, enabled]);

  return { displayed, done };
}

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
  const resultRef = useRef<HTMLDivElement>(null);

  /* ── Feedback form state ── */
  const [fbName, setFbName] = useState("");
  const [fbEmail, setFbEmail] = useState("");
  const [fbRating, setFbRating] = useState(0);
  const [fbHoverRating, setFbHoverRating] = useState(0);
  const [fbMessage, setFbMessage] = useState("");
  const [fbSending, setFbSending] = useState(false);
  const [fbStatus, setFbStatus] = useState<"idle" | "success" | "error">("idle");

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
    setFbStatus("idle");
  };

  const submitFeedback = async (e: FormEvent) => {
    e.preventDefault();
    if (!fbMessage.trim()) return;
    setFbSending(true);
    setFbStatus("idle");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fbName, email: fbEmail, rating: fbRating, message: fbMessage }),
      });
      const data = await res.json();
      if (data.success) {
        setFbStatus("success");
        setFbName(""); setFbEmail(""); setFbRating(0); setFbMessage("");
      } else {
        setFbStatus("error");
      }
    } catch {
      setFbStatus("error");
    }
    setFbSending(false);
  };

  const progressSteps = ["Idea", "Details", "Generate"];
  const currentProgress = step === "idea" ? 0 : step === "questions" ? 1 : 2;

  /* ── Typing effect for brief ── */
  const typingBrief = useTypingEffect(result?.brief || "", 8, step === "result" && !!result?.brief);

  /* ───────── Animations ───────── */
  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
    transition: { duration: 0.5, ease: "easeOut" as const },
  };

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.08 } },
  };

  const staggerItem = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  };

  return (
    <main className="min-h-screen bg-[#060a14] text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">

      {/* ═══════ Cinematic Background ═══════ */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Primary orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[160px] animate-drift" />
        <div className="absolute bottom-[-25%] right-[-10%] w-[55%] h-[55%] rounded-full bg-purple-600/8 blur-[180px] animate-drift" style={{ animationDelay: '-5s' }} />
        <div className="absolute top-[35%] left-[55%] w-[35%] h-[35%] rounded-full bg-cyan-500/5 blur-[140px] animate-drift" style={{ animationDelay: '-10s' }} />

        {/* Accent orbs */}
        <div className="absolute top-[10%] right-[20%] w-[20%] h-[20%] rounded-full bg-violet-500/6 blur-[120px] animate-drift" style={{ animationDelay: '-15s' }} />
        <div className="absolute bottom-[20%] left-[30%] w-[15%] h-[15%] rounded-full bg-blue-500/5 blur-[100px] animate-drift" style={{ animationDelay: '-8s' }} />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        {/* Top gradient fade */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#060a14] to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-4 sm:px-6 py-6 md:py-12 max-w-5xl mx-auto min-h-screen">

        {/* ── Persistent Nav Bar ── */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
          className="w-full flex items-center justify-between mb-8 md:mb-14"
        >
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => setStep("landing")}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow duration-300">
              <svg className="w-[18px] h-[18px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.764m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">DesignPilot<span className="text-indigo-400">AI</span></span>
          </div>

          {step !== "landing" && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={resetAll}
              className="text-sm text-slate-400 hover:text-white transition-all duration-300 flex items-center gap-1.5 px-4 py-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-slate-700/50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              New Project
            </motion.button>
          )}
        </motion.nav>

        <AnimatePresence mode="wait">

          {/* ═══════ LANDING ═══════ */}
          {step === "landing" && (
            <motion.div key="landing" {...fadeUp} className="flex flex-col items-center text-center w-full flex-1 justify-center -mt-6 md:-mt-14">

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" as const }}
                className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-indigo-500/8 border border-indigo-500/15 text-indigo-300 text-xs font-semibold tracking-[0.15em] uppercase mb-8 glow-indigo"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400" />
                </span>
                AI-Powered UX Design
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" as const }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.08] text-glow-white"
              >
                Your idea to a{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 animate-gradient">
                  production-ready
                </span>
                <br />UI design prompt.
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.6, ease: "easeOut" as const }}
                className="text-slate-400 text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto mb-12"
              >
                Describe your app, answer a few smart questions, and get a <strong className="text-slate-200">copy-paste-ready prompt</strong> optimized for <span className="text-indigo-300">v0</span>, <span className="text-purple-300">Bolt</span>, <span className="text-cyan-300">Cursor</span>, and more.
              </motion.p>

              {/* CTA */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5, ease: "easeOut" as const }}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep("idea")}
                className="btn-primary group px-10 py-4.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-500 to-purple-600 text-white font-semibold text-base md:text-lg shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:shadow-[0_0_60px_rgba(99,102,241,0.45)] transition-all duration-500 flex items-center gap-3"
              >
                Start Designing
                <svg className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </motion.button>

              {/* Feature badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="flex flex-wrap justify-center gap-3 mt-14 max-w-lg"
              >
                {["Smart Questionnaire", "v0 Ready", "Bolt Ready", "Cursor Ready", "Free to Use"].map((badge, i) => (
                  <motion.span
                    key={badge}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.75 + i * 0.08 }}
                    className="px-4 py-1.5 rounded-full text-xs font-medium bg-white/[0.03] border border-white/[0.06] text-slate-500 hover:text-slate-300 hover:border-indigo-500/20 transition-all duration-300"
                  >
                    {badge}
                  </motion.span>
                ))}
              </motion.div>

              {/* ═══════ BLOG / STARTUP ANNOUNCEMENT ═══════ */}
              <motion.section
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.7, ease: "easeOut" as const }}
                className="w-full max-w-3xl mt-24 mb-10"
              >
                <div className="flex items-center gap-3 mb-8 justify-center">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
                  <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-indigo-400/70">Latest Update</h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
                </div>

                <motion.article
                  whileHover={{ y: -4 }}
                  className="glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden group"
                >
                  {/* Decorative gradient corner */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-indigo-500/10 via-purple-500/5 to-transparent rounded-bl-full pointer-events-none" />

                  <div className="relative z-10">
                    {/* Date badge */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/8 border border-indigo-500/15 text-indigo-300 text-xs font-semibold tracking-wider uppercase mb-5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      March 25, 2026
                    </div>

                    <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-4 leading-tight">
                      🚀 We&apos;re a Startup — And This Is Day One!
                    </h3>

                    <div className="space-y-4 text-slate-400 text-sm md:text-base leading-relaxed">
                      <p>
                        Today marks the <strong className="text-white">official first release</strong> of <span className="text-indigo-300 font-semibold">DesignPilot AI</span> — a tool born from a simple idea: <em className="text-slate-300">what if turning your app idea into a beautiful, production-ready UI design prompt was as easy as answering a few questions?</em>
                      </p>
                      <p>
                        We&apos;re a small startup with a big mission: to <strong className="text-white">democratize UI/UX design</strong> and make professional-grade design accessible to everyone — indie hackers, students, small businesses, and creators worldwide.
                      </p>
                      <p>
                        DesignPilot AI generates <strong className="text-white">copy-paste-ready prompts</strong> optimized for the tools you already love — <span className="text-indigo-300">v0</span>, <span className="text-purple-300">Bolt</span>, <span className="text-cyan-300">Cursor</span>, and more. No design experience required.
                      </p>
                      <p>
                        This is just the beginning. We&apos;re building in public, listening to your feedback, and shipping fast. <strong className="text-emerald-300">Welcome aboard! 🎉</strong>
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/[0.06]">
                      {["#startup", "#launch", "#buildinpublic", "#uxdesign", "#ai"].map((tag) => (
                        <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-white/[0.03] border border-white/[0.06] text-slate-500">{tag}</span>
                      ))}
                    </div>
                  </div>
                </motion.article>
              </motion.section>

            </motion.div>
          )}

          {/* ═══════ STEP 1: IDEA ═══════ */}
          {step === "idea" && (
            <motion.div key="idea" {...fadeUp} className="w-full max-w-2xl mx-auto flex-1">
              {/* Progress */}
              <div className="flex items-center justify-center gap-2 mb-10">
                {progressSteps.map((s, i) => (
                  <React.Fragment key={s}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${i <= currentProgress ? "bg-indigo-500/12 text-indigo-300 border border-indigo-500/25 glow-indigo" : "bg-white/[0.03] text-slate-500 border border-white/[0.06]"}`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${i <= currentProgress ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30" : "bg-slate-700/80 text-slate-400"}`}>{i + 1}</span>
                      <span className="hidden sm:inline">{s}</span>
                    </motion.div>
                    {i < progressSteps.length - 1 && <div className={`w-8 h-0.5 rounded-full transition-all duration-500 ${i < currentProgress ? "bg-indigo-500/50" : "bg-slate-700/30"}`} />}
                  </React.Fragment>
                ))}
              </div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-2xl md:text-3xl font-bold text-white mb-2 text-center text-glow-white"
              >
                What do you want to build?
              </motion.h2>
              <p className="text-slate-400 text-center mb-8">Describe your app idea in a sentence or two.</p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card rounded-2xl p-1.5 mb-6"
              >
                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  className="w-full bg-transparent p-5 text-slate-100 placeholder:text-slate-600 resize-none outline-none text-base md:text-lg min-h-[120px] max-h-[200px] leading-relaxed"
                  rows={3}
                  placeholder="e.g., A school management portal for parents and teachers to track student progress..."
                  autoFocus
                />
              </motion.div>

              {/* Quick idea chips */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-2 mb-8"
              >
                <span className="text-xs text-slate-600 self-center mr-1">Try:</span>
                {["School website", "E-commerce store", "Portfolio site", "SaaS dashboard", "Blog platform"].map((chip) => (
                  <button key={chip} onClick={() => setIdea(chip)} className="px-3.5 py-1.5 rounded-full text-xs bg-white/[0.03] border border-white/[0.06] text-slate-500 hover:text-indigo-300 hover:border-indigo-500/30 hover:bg-indigo-500/8 transition-all duration-300">
                    {chip}
                  </button>
                ))}
              </motion.div>

              <motion.button
                whileHover={idea.trim() ? { y: -2 } : {}}
                whileTap={idea.trim() ? { scale: 0.98 } : {}}
                onClick={() => setStep("questions")}
                disabled={!idea.trim()}
                className={`w-full py-4 rounded-xl font-semibold text-base transition-all duration-400 flex items-center justify-center gap-2 ${idea.trim() ? "btn-primary bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[0_0_30px_rgba(99,102,241,0.25)] hover:shadow-[0_0_45px_rgba(99,102,241,0.4)]" : "bg-white/[0.03] text-slate-600 cursor-not-allowed border border-white/[0.06]"}`}
              >
                Continue
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </motion.button>
            </motion.div>
          )}

          {/* ═══════ STEP 2: QUESTIONS ═══════ */}
          {step === "questions" && (
            <motion.div key="questions" {...fadeUp} className="w-full max-w-2xl mx-auto flex-1">
              {/* Progress */}
              <div className="flex items-center justify-center gap-2 mb-10">
                {progressSteps.map((s, i) => (
                  <React.Fragment key={s}>
                    <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${i <= currentProgress ? "bg-indigo-500/12 text-indigo-300 border border-indigo-500/25 glow-indigo" : "bg-white/[0.03] text-slate-500 border border-white/[0.06]"}`}>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${i <= currentProgress ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30" : "bg-slate-700/80 text-slate-400"}`}>{i + 1}</span>
                      <span className="hidden sm:inline">{s}</span>
                    </div>
                    {i < progressSteps.length - 1 && <div className={`w-8 h-0.5 rounded-full transition-all duration-500 ${i < currentProgress ? "bg-indigo-500/50" : "bg-slate-700/30"}`} />}
                  </React.Fragment>
                ))}
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center text-glow-white">A few quick details</h2>
              <p className="text-slate-400 text-center mb-8">Help us craft the perfect design prompt for <span className="text-indigo-300 font-medium">&ldquo;{idea}&rdquo;</span></p>

              <motion.div className="space-y-8" variants={staggerContainer} initial="initial" animate="animate">

                {/* Audience */}
                <motion.div variants={staggerItem}>
                  <label className="text-sm font-semibold text-slate-300 mb-3 block tracking-wide">👥 Target Audience</label>
                  <div className="flex flex-wrap gap-2">
                    {audienceOptions.map((opt) => (
                      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} key={opt} onClick={() => setAudience(opt)} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${audience === opt ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/35 glow-indigo" : "bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:border-slate-600/50 hover:text-slate-300 hover:bg-white/[0.05]"}`}>
                        {opt}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Platform */}
                <motion.div variants={staggerItem}>
                  <label className="text-sm font-semibold text-slate-300 mb-3 block tracking-wide">📱 Platform</label>
                  <div className="flex flex-wrap gap-2">
                    {platformOptions.map((opt) => (
                      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} key={opt} onClick={() => setPlatform(opt)} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${platform === opt ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/35 glow-indigo" : "bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:border-slate-600/50 hover:text-slate-300 hover:bg-white/[0.05]"}`}>
                        {opt}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Style */}
                <motion.div variants={staggerItem}>
                  <label className="text-sm font-semibold text-slate-300 mb-3 block tracking-wide">✨ Design Style</label>
                  <div className="flex flex-wrap gap-2">
                    {styleOptions.map((opt) => (
                      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} key={opt} onClick={() => setStyle(opt)} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${style === opt ? "bg-purple-500/15 text-purple-300 border border-purple-500/35 glow-purple" : "bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:border-slate-600/50 hover:text-slate-300 hover:bg-white/[0.05]"}`}>
                        {opt}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Color Mood */}
                <motion.div variants={staggerItem}>
                  <label className="text-sm font-semibold text-slate-300 mb-3 block tracking-wide">🎨 Color Mood</label>
                  <div className="flex flex-wrap gap-2">
                    {colorMoodOptions.map((opt) => (
                      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} key={opt} onClick={() => setColorMood(opt)} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${colorMood === opt ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/35" : "bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:border-slate-600/50 hover:text-slate-300 hover:bg-white/[0.05]"}`}>
                        {opt}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Features */}
                <motion.div variants={staggerItem}>
                  <label className="text-sm font-semibold text-slate-300 mb-3 block tracking-wide">🧩 Key Features <span className="text-slate-600 font-normal">(select all that apply)</span></label>
                  <div className="flex flex-wrap gap-2">
                    {featureOptions.map((opt) => (
                      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} key={opt} onClick={() => toggleFeature(opt)} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${features.includes(opt) ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/35 glow-emerald" : "bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:border-slate-600/50 hover:text-slate-300 hover:bg-white/[0.05]"}`}>
                        {features.includes(opt) && <span className="mr-1.5">✓</span>}{opt}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>

              <div className="flex gap-3 mt-10">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setStep("idea")} className="px-6 py-4 rounded-xl font-semibold text-sm bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06] hover:border-slate-600/50 transition-all duration-300">
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={generateUX}
                  className="btn-primary flex-1 py-4 rounded-xl font-semibold text-base bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[0_0_30px_rgba(99,102,241,0.25)] hover:shadow-[0_0_50px_rgba(99,102,241,0.4)] transition-all duration-500 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>
                  Generate Design Prompt
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ═══════ GENERATING — AI THINKING ═══════ */}
          {step === "generating" && (
            <motion.div key="generating" {...fadeUp} className="w-full max-w-2xl mx-auto flex-1 flex flex-col items-center justify-center -mt-6 md:-mt-14">

              {/* Central orb */}
              <div className="relative mb-10">
                <motion.div
                  animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -inset-8 bg-indigo-500/10 rounded-full blur-2xl"
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center glow-indigo-strong"
                >
                  <svg className="h-8 w-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </motion.div>
              </div>

              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold text-white mb-2 text-glow-white"
              >
                Crafting your design prompt...
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-slate-500 text-sm mb-10"
              >
                DesignPilot AI is analyzing your requirements
              </motion.p>

              <div className="space-y-4 w-full max-w-sm">
                {["Analyzing project scope", "Designing component architecture", "Creating color system", "Generating vibe-coding prompt"].map((text, i) => (
                  <motion.div
                    key={text}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 1.2, duration: 0.5, ease: "easeOut" as const }}
                    className="flex items-center gap-4 text-sm"
                  >
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 1.2 + 0.8, type: "spring", stiffness: 200 }}
                      className="w-6 h-6 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center flex-shrink-0"
                    >
                      <motion.svg initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 1.2 + 1 }} className="w-3 h-3 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </motion.svg>
                    </motion.div>
                    <span className="text-slate-400">{text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ═══════ RESULT ═══════ */}
          {step === "result" && result && (
            <motion.div key="result" ref={resultRef} {...fadeUp} className="w-full max-w-3xl mx-auto flex-1">
              {/* Header */}
              <div className="text-center mb-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide mb-5 glow-emerald"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Generation Complete
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-2xl md:text-3xl font-bold text-white mb-2 text-glow-white"
                >
                  Your Design Prompt is Ready
                </motion.h2>
                <p className="text-slate-500">Copy and paste into your favorite AI code generator</p>
              </div>

              {/* Export Buttons Grid */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 mb-8"
              >
                {[
                  { label: "Copy for v0", format: formatForV0, color: "indigo", icon: "⚡" },
                  { label: "Copy for Bolt", format: formatForBolt, color: "purple", icon: "🔩" },
                  { label: "Copy for Cursor", format: formatForCursor, color: "cyan", icon: "🖱️" },
                  { label: "Copy Raw", format: (p: string) => p, color: "slate", icon: "📋" },
                ].map((btn) => (
                  <motion.button
                    key={btn.label}
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => copyToClipboard(btn.format(result.prompt), btn.label)}
                    className={`group relative px-4 py-4 rounded-xl text-sm font-semibold transition-all duration-400 border flex flex-col items-center gap-2.5 ${copied === btn.label
                        ? "bg-emerald-500/12 text-emerald-300 border-emerald-500/25 glow-emerald"
                        : btn.color === "indigo" ? "bg-indigo-500/8 text-indigo-300 border-indigo-500/15 hover:bg-indigo-500/15 hover:border-indigo-500/30 hover:glow-indigo"
                          : btn.color === "purple" ? "bg-purple-500/8 text-purple-300 border-purple-500/15 hover:bg-purple-500/15 hover:border-purple-500/30"
                            : btn.color === "cyan" ? "bg-cyan-500/8 text-cyan-300 border-cyan-500/15 hover:bg-cyan-500/15 hover:border-cyan-500/30"
                              : "bg-white/[0.03] text-slate-300 border-white/[0.06] hover:bg-white/[0.06] hover:border-slate-600/50"
                      }`}
                  >
                    <span className="text-xl">{copied === btn.label ? "✓" : btn.icon}</span>
                    <span className="text-xs">{copied === btn.label ? "Copied!" : btn.label}</span>
                  </motion.button>
                ))}
              </motion.div>

              {/* Design Brief — with typing effect */}
              {result.brief && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-card rounded-2xl p-6 md:p-8 mb-6"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500" />
                    <h3 className="text-lg font-bold text-white">Design Brief</h3>
                  </div>
                  <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {typingBrief.displayed.split("\n").map((line, i) => {
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
                    {!typingBrief.done && <span className="typing-cursor" />}
                  </div>
                </motion.div>
              )}

              {/* Full Prompt (Collapsible) */}
              <motion.details
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="group glass-card rounded-2xl overflow-hidden mb-8"
              >
                <summary className="p-4 sm:p-6 cursor-pointer flex items-center justify-between hover:bg-white/[0.02] transition-colors duration-300">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-purple-500 to-pink-500" />
                    <h3 className="text-lg font-bold text-white">Full Generated Prompt</h3>
                  </div>
                  <svg className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div className="px-4 pb-4 sm:px-6 sm:pb-6">
                  <div className="rounded-xl bg-black/40 border border-white/[0.04] p-3 sm:p-5 max-h-[400px] overflow-y-auto overflow-x-auto">
                    <pre className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-mono break-words">{result.prompt}</pre>
                  </div>
                </div>
              </motion.details>

              {/* Start Over */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetAll}
                  className="px-6 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:text-white bg-white/[0.03] border border-white/[0.06] hover:border-indigo-500/25 hover:bg-indigo-500/8 transition-all duration-300 inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  Generate Another
                </motion.button>
              </motion.div>

              {/* ═══════ FEEDBACK FORM ═══════ */}
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-16"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
                  <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-purple-400/70">Share Your Feedback</h3>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
                </div>

                <motion.div className="glass-card rounded-2xl p-6 md:p-8">
                  {fbStatus === "success" ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">Thank You! 🎉</h4>
                      <p className="text-slate-400 text-sm">Your feedback has been sent. We truly appreciate it!</p>
                      <button
                        onClick={() => setFbStatus("idle")}
                        className="mt-6 px-5 py-2 rounded-xl text-xs font-semibold text-indigo-300 bg-indigo-500/8 border border-indigo-500/20 hover:bg-indigo-500/15 transition-all duration-300"
                      >
                        Send Another
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={submitFeedback} className="space-y-5">
                      <p className="text-slate-400 text-sm leading-relaxed">
                        Love it? Have suggestions? Let us know — your feedback helps us build a better product. 💬
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Name <span className="text-slate-600">(optional)</span></label>
                          <input
                            type="text"
                            value={fbName}
                            onChange={(e) => setFbName(e.target.value)}
                            placeholder="Your name"
                            className="w-full bg-black/30 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 outline-none focus:border-indigo-500/30 transition-colors duration-300"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Email <span className="text-slate-600">(optional)</span></label>
                          <input
                            type="email"
                            value={fbEmail}
                            onChange={(e) => setFbEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="w-full bg-black/30 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 outline-none focus:border-indigo-500/30 transition-colors duration-300"
                          />
                        </div>
                      </div>

                      {/* Star Rating */}
                      <div>
                        <label className="text-xs font-semibold text-slate-500 mb-2 block">Rating</label>
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setFbRating(star)}
                              onMouseEnter={() => setFbHoverRating(star)}
                              onMouseLeave={() => setFbHoverRating(0)}
                              className="star-btn group"
                            >
                              <svg
                                className={`w-8 h-8 transition-all duration-200 ${
                                  star <= (fbHoverRating || fbRating)
                                    ? "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)] scale-110"
                                    : "text-slate-600 group-hover:text-slate-500"
                                }`}
                                fill={star <= (fbHoverRating || fbRating) ? "currentColor" : "none"}
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                              </svg>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Message <span className="text-rose-400">*</span></label>
                        <textarea
                          value={fbMessage}
                          onChange={(e) => setFbMessage(e.target.value)}
                          required
                          rows={4}
                          placeholder="What do you think of DesignPilot AI? Any suggestions?"
                          className="w-full bg-black/30 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 outline-none focus:border-indigo-500/30 transition-colors duration-300 resize-none"
                        />
                      </div>

                      {fbStatus === "error" && (
                        <p className="text-rose-400 text-xs font-medium">⚠️ Something went wrong. Please try again.</p>
                      )}

                      <motion.button
                        type="submit"
                        disabled={fbSending || !fbMessage.trim()}
                        whileHover={fbMessage.trim() ? { y: -2 } : {}}
                        whileTap={fbMessage.trim() ? { scale: 0.98 } : {}}
                        className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-400 flex items-center justify-center gap-2 ${
                          fbMessage.trim()
                            ? "btn-primary bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-[0_0_25px_rgba(168,85,247,0.2)] hover:shadow-[0_0_40px_rgba(168,85,247,0.35)]"
                            : "bg-white/[0.03] text-slate-600 cursor-not-allowed border border-white/[0.06]"
                        }`}
                      >
                        {fbSending ? (
                          <>
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                            Send Feedback
                          </>
                        )}
                      </motion.button>
                    </form>
                  )}
                </motion.div>
              </motion.section>

              {/* History */}
              {history.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="mt-16"
                >
                  <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-white/[0.06]">
                    <h3 className="text-xs sm:text-sm font-semibold tracking-widest text-slate-600 uppercase">Previous Generations</h3>
                    <span className="text-xs font-medium bg-white/[0.03] text-slate-500 py-1 px-2.5 sm:py-1.5 sm:px-3 rounded-full border border-white/[0.06]">{history.length} Saved</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {history.slice(1).map((item, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.01, y: -2 }}
                        onClick={() => {
                          setResult({ text: "", prompt: item.prompt, brief: item.brief });
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="glass-card p-5 rounded-2xl cursor-pointer group"
                      >
                        <p className="text-xs text-indigo-400/60 font-medium mb-2">{item.idea}</p>
                        <p className="text-sm text-slate-500 group-hover:text-slate-300 line-clamp-2 leading-relaxed transition-colors duration-300">{item.prompt.substring(0, 120)}...</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="relative z-10 border-t border-white/[0.04] mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.764m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-slate-400">DesignPilot<span className="text-indigo-400">AI</span></span>
            </div>

            <p className="text-xs text-slate-600 text-center">
              © 2026 DesignPilot AI — A startup building the future of UI/UX design.
            </p>

            <div className="flex items-center gap-4">
              <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/8 border border-emerald-500/15 text-emerald-400/70 tracking-wider uppercase">v1.0 — First Release</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
