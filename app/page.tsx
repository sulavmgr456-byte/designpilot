"use client";
import { useState } from "react";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generateUX = () => {
    setLoading(true);
    setResult(null);

    setTimeout(() => {
      const lowerIdea = idea.toLowerCase();

      let blueprint = {
        layout: "",
        navigation: "",
        design: "",
        monetization: "",
        growth: "",
        score: 0,
      };
      const copyReport = () => {
  if (!result) return;

  const text = `
UX Blueprint Report

Layout Strategy:
${result.layout}

Navigation:
${result.navigation}

Design System:
${result.design}

Monetization:
${result.monetization}

Growth Strategy:
${result.growth}

AI Confidence Score: ${result.score}%
`;

  navigator.clipboard.writeText(text);
  alert("Blueprint copied to clipboard!");
};

      if (lowerIdea.includes("fintech") || lowerIdea.includes("bank")) {
        blueprint = {
          layout: "Dashboard-first layout with financial summary cards.",
          navigation: "Bottom navigation: Home, Transactions, Cards, Profile.",
          design: "Minimal UI using blue/green trust-focused colors.",
          monetization: "Transaction fees + premium subscription tiers.",
          growth: "Referral rewards + smart financial insights.",
          score: 92,
        };
      } else if (lowerIdea.includes("social")) {
        blueprint = {
          layout: "Feed-based infinite scrolling content layout.",
          navigation: "Bottom nav with central floating action button.",
          design: "High-contrast modern visuals with bold typography.",
          monetization: "Ad-based + creator subscription model.",
          growth: "Gamification + user streak systems.",
          score: 88,
        };
      } else if (
        lowerIdea.includes("ecommerce") ||
        lowerIdea.includes("shop") ||
        lowerIdea.includes("store")
      ) {
        blueprint = {
          layout: "Product grid with featured categories on top.",
          navigation: "Top search bar + category filters.",
          design: "Clean product cards with bold call-to-action buttons.",
          monetization: "Direct sales + upselling bundles.",
          growth: "Discount campaigns + email remarketing.",
          score: 90,
        };
      } else {
        blueprint = {
          layout: "Hero section with feature highlights below.",
          navigation: "Simple top navigation with CTA button.",
          design: "Modern minimal layout with spacious design.",
          monetization: "Freemium model with premium upgrade.",
          growth: "Onboarding emails + feature nudges.",
          score: 75,
        };
      }

      setResult(blueprint);
      setLoading(false);
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white flex flex-col items-center p-6">
      <h1 className="text-5xl font-bold mt-16 mb-4 text-center">
        DesignPilot AI
      </h1>

      <p className="text-gray-400 mb-8 text-center max-w-xl">
        AI-powered UX Blueprint Generator for founders and developers.
      </p>

      <div className="w-full max-w-2xl bg-gray-900 p-6 rounded-2xl shadow-lg">
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          className="w-full p-4 rounded-lg bg-gray-800 text-white mb-4 outline-none focus:ring-2 focus:ring-blue-500"
          rows={5}
          placeholder="Describe your app idea..."
        />

        <button
          onClick={generateUX}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 px-6 py-3 rounded-lg font-semibold"
        >
          Generate UX Blueprint
        </button>

        {loading && (
          <div className="mt-6 bg-gray-800 p-6 rounded-lg text-gray-400 animate-pulse">
            AI is analyzing your idea...
          </div>
        )}

        {result && !loading && (
          <div className="mt-6 bg-gray-800 p-6 rounded-lg space-y-4 text-gray-300">
            <div>
              <h2 className="text-xl font-semibold text-white">
                📊 Layout Strategy
              </h2>
              <p>{result.layout}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                🧭 Navigation
              </h2>
              <p>{result.navigation}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                🎨 Design System
              </h2>
              <p>{result.design}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                💰 Monetization
              </h2>
              <p>{result.monetization}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                🚀 Growth Strategy
              </h2>
              <p>{result.growth}</p>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <h2 className="text-xl font-semibold text-white">
                ⭐ AI Confidence Score
              </h2>
              <p className="text-2xl font-bold text-blue-400">
                {result.score}%
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}