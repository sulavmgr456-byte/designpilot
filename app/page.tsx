"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    } catch (error) {
      setResult("Error connecting to AI");
    }

    setLoading(false);
  };

  const copyReport = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    alert("Copied!");
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <h1 className="text-5xl font-extrabold mt-10 mb-2 text-center">
        🚀 DesignPilot AI
      </h1>

      <p className="text-gray-400 mb-6 text-center max-w-xl">
        Instantly generate professional UX blueprints for your app ideas using AI.
      </p>

      <textarea
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        className="w-full max-w-xl p-4 bg-gray-800 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-blue-500"
        rows={5}
        placeholder="Describe your app idea..."
      />

      <button
        onClick={generateUX}
        className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-lg font-semibold w-full max-w-xl"
      >
        Generate My UX Blueprint ⚡
      </button>

      {loading && (
        <motion.p
          className="mt-6 text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          🤖 AI is thinking...
        </motion.p>
      )}

      {result && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6 max-w-xl bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-700 space-y-4"
        >
          <div>
            <h2 className="text-blue-400 font-bold">📊 Layout</h2>
            <p>{result.split("Navigation:")[0]}</p>
          </div>

          <div>
            <h2 className="text-green-400 font-bold">🧭 Navigation</h2>
            <p>{result.split("Navigation:")[1]?.split("Design:")[0]}</p>
          </div>

          <div>
            <h2 className="text-purple-400 font-bold">🎨 Design</h2>
            <p>{result.split("Design:")[1]?.split("Monetization:")[0]}</p>
          </div>

          <div>
            <h2 className="text-yellow-400 font-bold">💰 Monetization</h2>
            <p>{result.split("Monetization:")[1]?.split("Growth:")[0]}</p>
          </div>

          <div>
            <h2 className="text-pink-400 font-bold">🚀 Growth</h2>
            <p>{result.split("Growth:")[1]}</p>
          </div>

          <button
            onClick={copyReport}
            className="mt-4 bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
          >
            Copy Blueprint
          </button>
        </motion.div>
      )}
    </main>
  );
}