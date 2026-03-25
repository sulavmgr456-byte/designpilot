"use client";
import React, { useState, useCallback, useEffect } from "react";

type Step = "landing" | "idea" | "questions" | "generating" | "result";

const audienceOptions = ["Students & Schools", "Businesses & Enterprises", "General Public", "Creators & Artists", "Developers", "E-Commerce Shoppers"];
const platformOptions = ["Web App", "Mobile App", "Both (Responsive)", "Desktop App"];
const styleOptions = ["Minimal & Clean", "Bold & Vibrant", "Corporate & Professional", "Playful & Fun", "Dark & Sleek", "Glassmorphism & Modern"];
const featureOptions = ["Authentication / Login", "Dashboard / Analytics", "Payments / Checkout", "Blog / Content", "Chat / Messaging", "File Upload", "Search & Filters", "Notifications", "Admin Panel", "User Profiles", "Maps / Location", "Social Features"];
const colorMoodOptions = ["Dark Mode", "Light Mode", "Vibrant & Colorful", "Pastel & Soft", "Monochrome", "Earth Tones"];

const MorphingText = () => {
  const words = ["prompt", "design", "vision", "product", "future"];
  const [index, setIndex] = useState(0);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimatingOut(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length);
        setIsAnimatingOut(false);
      }, 400);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const currentWord = words[index];

  return (
    <span className="inline-block text-[var(--accent-aqua)] ml-3">
      {currentWord.split("").map((char, i) => (
        <span
          key={`${index}-${i}`}
          className={`inline-block whitespace-pre ${isAnimatingOut ? 'animate-letter-out' : 'animate-letter-in'}`}
          style={{ animationDelay: `${i * 0.04}s`, animationFillMode: 'forwards' }}
        >
          {char}
        </span>
      ))}
    </span>
  );
};

export default function AntiGravityLanding() {
  const [step, setStep] = useState<Step>("idea");
  const [idea, setIdea] = useState("");
  const [audience, setAudience] = useState("");
  const [platform, setPlatform] = useState("");
  const [style, setStyle] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [colorMood, setColorMood] = useState("");
  const [result, setResult] = useState<{ text: string; prompt: string; brief: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  
  const [scrolled, setScrolled] = useState(false);

  // Feedback State
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackReaction, setFeedbackReaction] = useState<'👍' | '👎' | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const resetAll = () => {
    setStep("idea");
    setIdea("");
    setAudience("");
    setPlatform("");
    setStyle("");
    setFeatures([]);
    setColorMood("");
    setResult(null);
    setFeedbackSent(false);
    setFeedbackReaction(null);
    setFeedbackMsg("");
  };

  const handleSendFeedback = () => {
    if (!feedbackReaction) return;
    const subject = encodeURIComponent("DesignPilot AI Feedback");
    const bodyText = encodeURIComponent(`Reaction: ${feedbackReaction}\n\nMessage: ${feedbackMsg}\n\nIdea: ${idea}`);
    window.open(`mailto:sulavmgr456@gmail.com?subject=${subject}&body=${bodyText}`);
    setFeedbackSent(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[var(--bg)] text-[var(--text)] font-sans">
      
      {/* Floating particles background (CSS only) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-[var(--accent-aqua)] opacity-5 blur-[100px] particle-1"></div>
        <div className="absolute top-[40%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-[var(--accent-violet)] opacity-5 blur-[120px] particle-2"></div>
        <div className="absolute bottom-[10%] left-[30%] w-[50vw] h-[50vw] rounded-full bg-[var(--accent-aqua)] opacity-5 blur-[150px] particle-3"></div>
        <div className="absolute top-[60%] right-[40%] w-[25vw] h-[25vw] rounded-full bg-[var(--accent-violet)] opacity-5 blur-[80px] particle-4"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-[var(--accent-aqua)] opacity-5 blur-[100px] particle-5"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[var(--accent-violet)] opacity-5 blur-[150px] particle-6"></div>
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-[rgba(13,13,20,0.7)] backdrop-blur-[12px] border-[var(--border)]' : 'bg-transparent border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="font-serif font-bold text-2xl tracking-wide text-[var(--text)]">DesignPilot</div>
          <div className="hidden md:flex items-center gap-6 font-mono text-sm">
            <a href="#how-it-works" className="text-[var(--muted)] hover:text-[var(--text)] transition-colors">How it works</a>
            <div className="px-3 py-1.5 rounded-full border border-[var(--accent-aqua)] bg-[rgba(42,255,214,0.05)] text-[var(--accent-aqua)] text-xs uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-aqua)] animate-pulse"></span>
              Free to use
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-44 pb-24 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 min-h-[90vh]">
        <div className="flex-1 w-full">
          <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight mb-8">
            <div className="animate-fade-up">Your idea.</div>
            <div className="animate-fade-up-1 text-[var(--muted)]">A few smart questions.</div>
            <div className="animate-fade-up-2 text-[var(--accent-aqua)] flex flex-wrap">A perfect UI <MorphingText />.</div>
          </h1>
          <p className="animate-fade-up-3 text-[var(--muted)] text-lg md:text-xl font-sans max-w-lg mb-10 leading-relaxed">
            Stop fighting with generic AI outputs. Get tailored, opinionated UI prompts meant for modern development tools.
          </p>
          <div className="animate-fade-up-3">
             <a href="#generator" className="inline-block bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] font-mono px-6 py-3 rounded-xl hover:-translate-y-1 hover:border-[var(--accent-aqua)] transition-all">
               Start Building &darr;
             </a>
          </div>
        </div>

        {/* Floating Terminal Card */}
        <div className="flex-1 w-full max-w-lg animate-float-bob lg:mr-10">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(42,255,214,0.08)]">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] bg-[#101018]">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              <div className="ml-2 font-mono text-[10px] text-[var(--muted)] uppercase tracking-wider">prompt-generator.sh</div>
            </div>
            <div className="p-6 h-[300px] font-mono text-sm leading-relaxed overflow-y-auto">
              <span className="text-[var(--accent-aqua)]">&gt;</span> Generating UI prompt for: <span className="text-[var(--accent-violet)]">"Freelance Invoice Tracker"</span>
              <br /><br />
              <span className="text-[var(--muted)]"># Target: v0 / Next.js / Tailwind v4</span><br />
              Build a dark-mode first dashboard with a sidebar layout.<br />
              Use <span className="text-[var(--accent-aqua)]">JetBrains Mono</span> for numbers, Cabinet Grotesk for body.<br />
              Left sidebar content: Dashboard, Invoices, Clients, Settings.<br />
              Main content: <br />
              - Top row: 3 minimal metric cards (Total Billed, Outstanding, Paid).<br />
              - Below: A sleek data table with hover states and a subtle border.<br />
              - Add a floating action button on the bottom right for "New Invoice".<br />
              <br />
              <span className="text-[var(--accent-aqua)] animate-pulse inline-block w-2 h-4 bg-[var(--accent-aqua)] align-middle"></span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="relative z-10 w-full py-8 border-y border-[var(--border)] bg-[#11111a]">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center lg:justify-start gap-8 font-mono text-sm text-[var(--muted)]">
          <span className="uppercase tracking-widest text-xs">Works with &rarr;</span>
          {['v0', 'Bolt', 'Cursor', 'Lovable', 'Replit'].map(tool => (
            <div key={tool} className="px-5 py-2 rounded-full border border-[var(--border)] bg-[var(--surface)] hover:-translate-y-1 transition-transform cursor-default text-[var(--text)]">
              {tool}
            </div>
          ))}
        </div>
      </section>

      {/* Multi-step prompt generator section */}
      <section id="generator" className="relative z-10 max-w-4xl mx-auto px-6 py-32">
        <div className="animate-float-subtle bg-[var(--surface)] border border-[var(--border)] rounded-[20px] shadow-2xl p-8 md:p-12 relative overflow-hidden">
          {/* Subtle top glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-aqua)] to-transparent opacity-20"></div>

          {/* Generator UI Content depending on Step */}
          {step === 'landing' || step === 'idea' ? (
            <div className="animate-fade-up">
              <div className="flex items-center gap-4 mb-10">
                <div className="flex-1 h-[2px] bg-[var(--surface-2)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--accent-aqua)] w-1/3 transition-all duration-700 rounded-full shadow-[0_0_10px_rgba(42,255,214,0.5)]"></div>
                </div>
                <div className="font-mono text-xs text-[var(--muted)]">Step 1 of 3</div>
              </div>
              
              <h2 className="font-serif text-4xl text-[var(--text)] mb-3">What are we building?</h2>
              <p className="text-[var(--muted)] mb-8 text-lg">Describe your app idea in a sentence or two.</p>
              
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] p-6 rounded-xl text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent-aqua)] focus:shadow-[0_0_20px_rgba(42,255,214,0.1)] transition-all resize-none min-h-[140px] font-sans text-lg mb-8"
                placeholder="e.g., A minimalist habit tracker with a deep space dark mode aesthetic..."
              />
              
              <div className="flex justify-end">
                <button 
                  disabled={!idea.trim()}
                  onClick={() => setStep('questions')}
                  className="bg-[var(--accent-orange)] text-white font-semibold font-sans px-8 py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(255,107,53,0.3)] transition-all flex items-center gap-2 text-lg"
                >
                  Let's build this &rarr;
                </button>
              </div>
            </div>
          ) : step === 'questions' ? (
            <div className="animate-fade-up">
              <div className="flex items-center gap-4 mb-10">
                <div className="flex-1 h-[2px] bg-[var(--surface-2)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--accent-aqua)] w-2/3 transition-all duration-700 rounded-full shadow-[0_0_10px_rgba(42,255,214,0.5)]"></div>
                </div>
                <div className="font-mono text-xs text-[var(--muted)]">Step 2 of 3</div>
              </div>

              <h2 className="font-serif text-4xl text-[var(--text)] mb-3">Refine the architecture</h2>
              <p className="text-[var(--muted)] mb-10 text-lg">Select the defining characteristics to narrow down the prompt logic.</p>

              <div className="space-y-10">
                {/* Reusable selection component inline */}
                {[
                  { title: "Target Audience", options: audienceOptions, selected: audience, action: setAudience, multi: false },
                  { title: "Platform Required", options: platformOptions, selected: platform, action: setPlatform, multi: false },
                  { title: "Visual Style", options: styleOptions, selected: style, action: setStyle, multi: false },
                  { title: "Color Mood", options: colorMoodOptions, selected: colorMood, action: setColorMood, multi: false },
                ].map((group, idx) => (
                  <div key={idx} className="animate-fade-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <label className="font-mono text-sm uppercase tracking-wider text-[var(--muted)] mb-4 block">{group.title}</label>
                    <div className="flex flex-wrap gap-3">
                      {group.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => group.action(opt)}
                          // @ts-ignore
                          className={`px-5 py-2.5 font-mono text-xs transition-all border rounded-full duration-300 animate-fade-up ${group.selected === opt ? 'bg-[rgba(42,255,214,0.1)] border-[var(--accent-aqua)] text-[var(--accent-aqua)] shadow-[0_0_15px_rgba(42,255,214,0.15)]' : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] hover:border-[var(--muted)] hover:text-white'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="animate-fade-up" style={{ animationDelay: '0.4s' }}>
                  <label className="font-mono text-sm uppercase tracking-wider text-[var(--muted)] mb-4 block">Core Features</label>
                  <div className="flex flex-wrap gap-3">
                    {featureOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => toggleFeature(opt)}
                        className={`px-5 py-2.5 font-mono text-xs transition-all border rounded-full duration-300 animate-fade-up ${features.includes(opt) ? 'bg-[rgba(42,255,214,0.1)] border-[var(--accent-aqua)] text-[var(--accent-aqua)] shadow-[0_0_15px_rgba(42,255,214,0.15)]' : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] hover:border-[var(--muted)] hover:text-white'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center mt-12 gap-4">
                <button onClick={() => setStep('idea')} className="text-[var(--text)] font-mono text-sm border border-[var(--border)] px-8 py-4 rounded-xl hover:bg-[var(--surface-2)] transition-colors w-full sm:w-auto">
                  &larr; Back
                </button>
                <button onClick={generateUX} className="bg-[var(--accent-orange)] text-white font-semibold font-sans px-10 py-4 rounded-xl hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(255,107,53,0.3)] transition-all w-full sm:w-auto text-lg">
                  Generate Prompt &rarr;
                </button>
              </div>
            </div>
          ) : step === 'generating' ? (
            <div className="animate-fade-up flex flex-col items-center justify-center py-28 text-center border border-[var(--border)] rounded-xl bg-[#12121a]">
              <div className="w-16 h-16 border-2 border-[var(--accent-aqua)] border-t-transparent rounded-full animate-spin mb-8 shadow-[0_0_20px_rgba(42,255,214,0.3)]"></div>
              <h3 className="font-serif text-3xl text-[var(--text)] mb-3">Synthesizing rules...</h3>
              <p className="text-[var(--muted)] font-mono text-sm uppercase tracking-wider">Translating context into rigid UI instructions</p>
            </div>
          ) : (
            <div className="animate-fade-up">
              <div className="flex items-center gap-4 mb-10">
                <div className="flex-1 h-[2px] bg-[var(--surface-2)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--accent-aqua)] w-full transition-all duration-700 rounded-full shadow-[0_0_10px_rgba(42,255,214,0.5)]"></div>
                </div>
                <div className="font-mono text-xs text-[var(--accent-aqua)]">Generation Complete</div>
              </div>

              <h2 className="font-serif text-4xl text-[var(--text)] mb-8">Your UI Prompt is Ready</h2>
              
              {result?.brief && (
                <div className="mb-8 p-6 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl relative overflow-hidden">
                  <div className="absolute left-0 top-0 w-1 h-full bg-[var(--accent-violet)]"></div>
                  <h4 className="font-mono text-xs uppercase tracking-widest text-[var(--accent-violet)] mb-4">Design Brief</h4>
                  <p className="text-[var(--text)] text-sm md:text-base leading-relaxed whitespace-pre-wrap">{result.brief}</p>
                </div>
              )}
              
              <div className="relative mb-10">
                <h4 className="font-mono text-xs uppercase tracking-widest text-[var(--accent-aqua)] mb-4">Engineered Prompt Payload</h4>
                <textarea 
                  readOnly 
                  className="w-full h-72 bg-[#0c0c13] border border-[var(--border)] rounded-xl p-6 text-[var(--text)] font-mono text-sm leading-relaxed resize-none focus:outline-none focus:border-[var(--accent-aqua)] transition-colors"
                  value={result?.prompt}
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <button onClick={resetAll} className="w-full sm:w-auto text-[var(--text)] border border-[var(--border)] px-8 py-4 rounded-xl hover:bg-[var(--surface-2)] transition-colors font-mono text-sm">
                  Start Over
                </button>
                <button 
                  onClick={() => copyToClipboard(result?.prompt || '', 'Prompt')}
                  className="w-full sm:w-auto bg-[var(--accent-aqua)] text-[#06060a] font-bold px-10 py-4 rounded-xl hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(42,255,214,0.3)] transition-all font-mono text-sm uppercase tracking-wide"
                >
                  {copied ? "Copied to clipboard!" : "Copy Prompt ->"}
                </button>
              </div>

              {/* Feedback Section */}
              <div className="mt-10 animate-fade-up bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 transition-all duration-400">
                {feedbackSent ? (
                  <div className="text-center font-mono text-[var(--accent-aqua)] py-4 text-sm font-bold">
                    Thanks for your feedback! ✓
                  </div>
                ) : (
                  <>
                    <h5 className="font-mono text-xs uppercase tracking-widest text-[var(--muted)] mb-5 text-center">Was this prompt helpful?</h5>
                    <div className="flex justify-center gap-4 mb-4">
                      <button 
                        onClick={() => setFeedbackReaction('👍')} 
                        className={`px-6 py-3 rounded-full border bg-[var(--surface-2)] transition-all ${feedbackReaction === '👍' ? 'border-[var(--accent-aqua)] shadow-[0_0_10px_rgba(42,255,214,0.15)]' : 'border-[var(--border)] hover:border-[var(--accent-aqua)]'}`}
                      >
                        👍 Yes
                      </button>
                      <button 
                        onClick={() => setFeedbackReaction('👎')} 
                        className={`px-6 py-3 rounded-full border bg-[var(--surface-2)] transition-all ${feedbackReaction === '👎' ? 'border-[var(--accent-aqua)] shadow-[0_0_10px_rgba(42,255,214,0.15)]' : 'border-[var(--border)] hover:border-[var(--accent-aqua)]'}`}
                      >
                        👎 Needs work
                      </button>
                    </div>
                    {feedbackReaction && (
                      <div className="animate-fade-up mt-6">
                        <textarea
                          value={feedbackMsg}
                          onChange={(e) => setFeedbackMsg(e.target.value)}
                          className="w-full bg-[var(--surface-2)] border border-[var(--border)] p-4 rounded-xl text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent-aqua)] focus:shadow-[0_0_15px_rgba(42,255,214,0.1)] transition-all resize-none min-h-[100px] font-sans text-sm mb-4"
                          placeholder="Tell us how we can improve... (optional)"
                        />
                        <button 
                          onClick={handleSendFeedback}
                          className="w-full bg-[var(--accent-orange)] text-white font-semibold font-sans px-6 py-3.5 rounded-xl hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(255,107,53,0.3)] transition-all text-base"
                        >
                          Send Feedback &rarr;
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* "How it works" section */}
      <section id="how-it-works" className="relative z-10 max-w-7xl mx-auto px-6 py-24 mb-16">
        <h2 className="font-serif text-4xl md:text-5xl mb-16 text-center text-[var(--text)]">How it works</h2>
        <div className="flex flex-col md:flex-row gap-8 items-stretch justify-center">
          {[
            { num: '01', title: 'Input Context', desc: 'Describe your vision. We ignore the noise and extract the core architectural intention.', dur: 'animate-float' },
            { num: '02', title: 'Smart Synthesis', desc: 'Our engine applies strict design principles to structure the prompt perfectly.', dur: 'animate-float-bob' },
            { num: '03', title: 'Ship Immediately', desc: 'Paste into Cursor, Bolt, or v0 and get a pixel-perfect layout on the first run.', dur: 'animate-float-subtle' },
          ].map((step, i) => (
            <div key={i} className={`flex-1 p-10 bg-[var(--surface)] border border-[var(--border)] rounded-2xl flex flex-col relative overflow-hidden group hover:border-[var(--border)] transition-colors ${step.dur}`}>
              <div className="absolute top-0 right-0 p-8 font-serif text-8xl text-stroke-aqua opacity-20 group-hover:opacity-40 transition-opacity">
                {step.num}
              </div>
              <div className="font-serif text-5xl text-stroke-aqua font-bold mb-8 relative z-10">{step.num}</div>
              <h3 className="font-mono text-xl text-[var(--text)] mb-4 relative z-10">{step.title}</h3>
              <p className="text-[var(--muted)] leading-relaxed font-sans relative z-10">{step.desc}</p>
              
              {/* Divider between steps for large screens */}
              {i < 2 && <div className="hidden md:block absolute right-[-2px] top-[20%] w-[1px] h-[60%] bg-[var(--border)]"></div>}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-[var(--border)] py-12 bg-[#101018] font-mono">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-[var(--muted)]">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <div className="font-serif text-xl text-[var(--text)]">DesignPilot</div>
            <div className="text-xs uppercase tracking-wider">Unanchored Design System Prompts &copy; {new Date().getFullYear()}</div>
          </div>
          <div className="flex items-center gap-8">
            <a href="#" className="hover:text-[var(--accent-aqua)] transition-colors">Twitter (X)</a>
            <a href="#" className="hover:text-[var(--accent-aqua)] transition-colors">GitHub</a>
            <a href="#" className="hover:text-[var(--accent-aqua)] transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
