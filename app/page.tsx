"use client";
import { useState } from "react";
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
    icon: "📊",
    color: "from-blue-500/20 to-blue-600/5",
    border: "border-blue-500/30",
    accent: "text-blue-400",
    split: ["Layout:", "Navigation:"],
  },
  {
    key: "navigation",
    label: "Navigation",
    icon: "🧭",
    color: "from-emerald-500/20 to-emerald-600/5",
    border: "border-emerald-500/30",
    accent: "text-emerald-400",
    split: ["Navigation:", "Design:"],
  },
  {
    key: "design",
    label: "Design",
    icon: "🎨",
    color: "from-violet-500/20 to-violet-600/5",
    border: "border-violet-500/30",
    accent: "text-violet-400",
    split: ["Design:", "Monetization:"],
  },
  {
    key: "monetization",
    label: "Monetization",
    icon: "💰",
    color: "from-amber-500/20 to-amber-600/5",
    border: "border-amber-500/30",
    accent: "text-amber-400",
    split: ["Monetization:", "Growth:"],
  },
  {
    key: "growth",
    label: "Growth",
    icon: "🚀",
    color: "from-rose-500/20 to-rose-600/5",
    border: "border-rose-500/30",
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
    <main className="min-h-screen bg-[#09090b] text-white relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] rounded-full bg-blue-600/[0.07] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] rounded-full bg-violet-600/[0.05] blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-4 sm:px-6 py-8 max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 mt-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium tracking-wide mb-5 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            AI-Powered UX Design
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent">
            DesignPilot AI
          </h1>

          <p className="text-gray-500 mt-3 text-base max-w-md mx-auto leading-relaxed">
            Instantly generate professional UX blueprints for your app ideas using AI.
          </p>
        </motion.div>

        {/* Input section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="w-full"
        >
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-blue-600/20 rounded-xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              className="relative w-full p-4 bg-[#111113] rounded-xl border border-white/[0.08] text-white placeholder:text-gray-600 outline-none focus:border-blue-500/40 transition-all duration-300 resize-none text-sm leading-relaxed"
              rows={4}
              placeholder="Describe your app idea... e.g. a fitness tracking app with social features"
            />
          </div>

          <button
            onClick={generateUX}
            disabled={!idea || loading}
            className={`mt-3 w-full py-3 px-6 rounded-xl font-medium text-sm tracking-wide transition-all duration-300 ${
              idea && !loading
                ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 active:scale-[0.98]"
                : "bg-white/[0.04] text-gray-600 cursor-not-allowed border border-white/[0.06]"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating Blueprint...
              </span>
            ) : (
              "Generate UX Blueprint"
            )}
          </button>
        </motion.div>

        {/* Loading pulse */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-10 flex flex-col items-center gap-3"
            >
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-blue-500"
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </div>
              <p className="text-gray-500 text-sm">AI is crafting your blueprint...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mt-10 w-full space-y-3"
            >
              {/* Results header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white/90">
                  Your UX Blueprint
                </h2>
                <button
                  onClick={copyReport}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    copied
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : "bg-white/[0.05] text-gray-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.08]"
                  }`}
                >
                  {copied ? (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>

              {/* Section cards */}
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
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    className={`relative rounded-xl border ${section.border} bg-gradient-to-br ${section.color} backdrop-blur-sm overflow-hidden`}
                  >
                    <div className="p-5">
                      <div className="flex items-center gap-2.5 mb-3">
                        <span className="text-base">{section.icon}</span>
                        <h3
                          className={`text-sm font-semibold tracking-wide uppercase ${section.accent}`}
                        >
                          {section.label}
                        </h3>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {content}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* History */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-14 w-full"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-4 rounded-full bg-gradient-to-b from-blue-500 to-violet-500" />
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                History
              </h2>
              <span className="ml-auto text-xs text-gray-600">
                {history.length} blueprint{history.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="space-y-2">
              {history.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => setResult(item)}
                  className="group p-3.5 bg-white/[0.02] rounded-lg cursor-pointer border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-200"
                >
                  <p className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors truncate leading-relaxed">
                    {item.substring(0, 120)}...
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <div className="mt-16 mb-6 text-center">
          <p className="text-gray-700 text-xs">
            Built with AI · DesignPilot
          </p>
        </div>
      </div>
    </main>
  );
}
