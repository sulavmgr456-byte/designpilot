"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sections: {
  key: string;
  label: string;
  icon: string;
  color: string;
  border: string;
  accent: string;
  split: [string, string | null];
}[] = [
    {
      key: "layout",
      label: "Layout",
      icon: "🖥️",
      color: "from-blue-500/10 to-transparent",
      border: "border-blue-500/20",
      accent: "text-blue-400",
      split: ["Layout:", "Navigation:"],
    },
    {
      key: "navigation",
      label: "Navigation",
      icon: "🧭",
      color: "from-emerald-500/10 to-transparent",
      border: "border-emerald-500/20",
      accent: "text-emerald-400",
      split: ["Navigation:", "Design:"],
    },
    {
      key: "design",
      label: "Design",
      icon: "✨",
      color: "from-purple-500/10 to-transparent",
      border: "border-purple-500/20",
      accent: "text-purple-400",
      split: ["Design:", "Monetization:"],
    },
    {
      key: "monetization",
      label: "Monetization",
      icon: "💎",
      color: "from-amber-500/10 to-transparent",
      border: "border-amber-500/20",
      accent: "text-amber-400",
      split: ["Monetization:", "Growth:"],
    },
    {
      key: "growth",
      label: "Growth",
      icon: "🚀",
      color: "from-rose-500/10 to-transparent",
      border: "border-rose-500/20",
      accent: "text-rose-400",
      split: ["Growth:", null],
    },
  ];

export default function Home() {
  const [idea, setIdea] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generateUX = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ idea }),
      });

      const data = await res.json();
      const text =
        data.choices?.[0]?.message?.content || "No response from AI";

      setResult(text);
      setHistory((prev) => [text, ...prev]);
    } catch (error) {
      setResult("Error connecting to AI");
    }

    setLoading(false);
  };

  const copyReport = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSectionContent = (splitStart: string, splitEnd: string | null) => {
    if (!result) return "";
    const after = result.split(splitStart)[1];
    if (!after) return "";
    if (splitEnd) return after.split(splitEnd)[0]?.trim() || "";
    return after.trim();
  };

  return (
    <main className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-indigo-500/30 font-sans selection:text-indigo-200">
      {/* Subtle Grid Background & Glows purely for ambiance */}
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 brightness-100 contrast-150 mix-blend-overlay" />
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-4 sm:px-6 py-12 md:py-20 max-w-4xl mx-auto min-h-screen">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center w-full max-w-2xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            DesignPilot AI
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Design smarter,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              ship faster.
            </span>
          </h1>

          <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            Transform your raw app ideas into premium, production-ready UX blueprints in seconds.
          </p>
        </motion.div>

        {/* Builder Input Card - Linear/Notion Style */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="w-full max-w-2xl mx-auto mb-16"
        >
          <div className="relative rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-2 shadow-2xl transition-all hover:border-slate-600/50">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
            <div className="relative flex flex-col sm:flex-row gap-2">
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                className="w-full bg-transparent p-4 text-slate-100 placeholder:text-slate-500 resize-none outline-none text-base md:text-lg min-h-[60px] max-h-[200px] leading-relaxed"
                rows={1}
                placeholder="Describe your app idea (e.g., minimalist habit tracker)..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    generateUX();
                  }
                }}
              />
              <div className="flex items-end justify-end p-2 sm:p-0">
                <button
                  onClick={generateUX}
                  disabled={!idea || loading}
                  className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap h-12 w-full sm:w-auto
                    ${idea && !loading
                      ? "bg-indigo-500 hover:bg-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] transform hover:-translate-y-0.5"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                    }
                  `}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-indigo-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating
                    </>
                  ) : (
                    <>
                      Generate
                      <span className="hidden sm:inline-block text-indigo-300/50 text-xs ml-1 font-normal">⌘↵</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Loading Skeleton */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full space-y-4 overflow-hidden"
            >
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="rounded-2xl bg-slate-800/20 border border-slate-800/50 p-6 w-full backdrop-blur-sm animate-pulse">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 bg-slate-700/50 rounded-xl" />
                    <div className="h-6 w-32 bg-slate-700/50 rounded-lg" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-slate-700/30 rounded-md" />
                    <div className="h-4 w-5/6 bg-slate-700/30 rounded-md" />
                    <div className="h-4 w-4/6 bg-slate-700/30 rounded-md" />
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result Container */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full"
            >
              <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1.5 rounded-full bg-indigo-500" />
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Flow Blueprint
                  </h2>
                </div>
                <button
                  onClick={copyReport}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${copied
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 shadow-sm hover:shadow-md"
                    }`}
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy Report
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-6">
                {sections.map((section, index) => {
                  const content = getSectionContent(
                    section.split[0],
                    section.split[1]
                  );
                  if (!content) return null;

                  return (
                    <motion.div
                      key={section.key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="group relative bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 overflow-hidden hover:bg-slate-800/60 transition-colors duration-300"
                    >
                      {/* Subtle left gradient accent */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${section.color} opacity-40 group-hover:opacity-100 transition-opacity`} />

                      <div className="p-6 md:p-8">
                        <div className="flex items-center gap-4 mb-5 transform transition-transform group-hover:translate-x-1">
                          <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 border ${section.border} shadow-inner`}>
                            <span className="text-xl">{section.icon}</span>
                          </div>
                          <h3 className={`text-xl font-bold tracking-wide ${section.accent}`}>
                            {section.label}
                          </h3>
                        </div>
                        <div className="text-slate-300 text-base leading-relaxed whitespace-pre-wrap pl-0 md:pl-16">
                          {content.split('\n').map((line, i) => {
                            if (!line.trim()) return <br key={i} />;
                            return (
                              <p key={i} className={`mb-2 ${line.trim().startsWith('-') ? 'flex items-start gap-3' : ''}`}>
                                {line.trim().startsWith('-') ? (
                                  <>
                                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" />
                                    <span>{line.substring(1).trim()}</span>
                                  </>
                                ) : (
                                  line
                                )}
                              </p>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History Section */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full mt-24"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/80">
              <h3 className="text-sm font-semibold tracking-widest text-slate-500 uppercase">
                Recent Generations
              </h3>
              <span className="text-xs font-medium bg-slate-800 text-slate-400 py-1.5 px-3 rounded-full border border-slate-700/50">
                {history.length} Saved
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    setResult(item);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className="p-5 bg-slate-900/40 rounded-2xl border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-800/60 cursor-pointer transition-all duration-300 group"
                >
                  <p className="text-sm text-slate-400 group-hover:text-slate-300 line-clamp-3 leading-relaxed">
                    {item.substring(0, 150)}...
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-indigo-400/60 group-hover:text-indigo-400 text-xs font-medium transition-colors">
                    <span>View Blueprint</span>
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
