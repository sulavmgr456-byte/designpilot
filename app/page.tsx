"use client";
import React, { useState, useCallback, useEffect } from "react";

type Step = "landing" | "idea" | "questions" | "generating" | "result";

const audienceOptions = ["Students & Schools", "Businesses & Enterprises", "General Public", "Creators & Artists", "Developers", "E-Commerce Shoppers"];
const platformOptions = ["Web App", "Mobile App", "Both (Responsive)", "Desktop App"];
const styleOptions = ["Minimal & Clean", "Bold & Vibrant", "Corporate & Professional", "Playful & Fun", "Dark & Sleek", "Glassmorphism & Modern"];
const featureOptions = ["Authentication / Login", "Dashboard / Analytics", "Payments / Checkout", "Blog / Content", "Chat / Messaging", "File Upload", "Search & Filters", "Notifications", "Admin Panel", "User Profiles", "Maps / Location", "Social Features"];
const colorMoodOptions = ["Dark Mode", "Light Mode", "Vibrant & Colorful", "Pastel & Soft", "Monochrome", "Earth Tones"];

// NEW Question Options
const projectTypeOptions = ["Website", "Web App", "Mobile App", "Dashboard", "E-Commerce", "Portfolio", "SaaS Tool", "Other"];
const pageCountOptions = ["1 page", "2-3 pages", "4-5 pages", "6-10 pages", "10+ pages"];
const animationStyleOptions = ["Cinematic & Filmic", "3D & Immersive", "Smooth & Minimal", "Bold & Dramatic", "No Animations"];
const backendComplexityOptions = ["Just the UI (Frontend only)", "With a REST API", "Full Stack + Database", "With User Authentication", "All of the above"];

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
  
  // NEW State
  const [qStep, setQStep] = useState(2);
  const [projectType, setProjectType] = useState("");
  const [pageCount, setPageCount] = useState("");
  const [pageList, setPageList] = useState("");
  const [animationStyle, setAnimationStyle] = useState("");
  const [backendComplexity, setBackendComplexity] = useState("");
  const [colorPalette, setColorPalette] = useState("");
  const [customColors, setCustomColors] = useState("");
  const [colorLoading, setColorLoading] = useState(false);
  const [colorLoaded, setColorLoaded] = useState(false);
  const [inspirationSite, setInspirationSite] = useState("");
  const [promptDetail, setPromptDetail] = useState("");
  
  const [hasPreferences, setHasPreferences] = useState(false);

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

  // Load preferences
  useEffect(() => {
    try {
      const saved = localStorage.getItem("designpilot_prefs");
      if (saved) {
        const prefs = JSON.parse(saved);
        if (prefs.platform) setPlatform(prefs.platform);
        if (prefs.style) setStyle(prefs.style);
        if (prefs.animationStyle) setAnimationStyle(prefs.animationStyle);
        if (prefs.backendComplexity) setBackendComplexity(prefs.backendComplexity);
        if (prefs.promptDetail) setPromptDetail(prefs.promptDetail);
        setHasPreferences(true);
      }
    } catch(e) {}
  }, []);

  // Simulate color analyzing
  useEffect(() => {
    if (step === 'questions' && qStep === 7 && !colorLoaded) {
      setColorLoading(true);
      const timer = setTimeout(() => {
        setColorLoading(false);
        setColorLoaded(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [step, qStep, colorLoaded]);

  // Color generator based on projectType
  const getPalettes = () => {
    if (['Website', 'Portfolio'].includes(projectType) || !projectType) {
      return [
        { name: "Midnight Professional", colors: ["#0B0C10", "#1F2833", "#C5C6C7", "#66FCF1", "#45A29E"], desc: "Deep navy with electric blue accents — trustworthy and modern" },
        { name: "Elegant Editorial", colors: ["#F9F8F6", "#2D2D2A", "#E5DCC5", "#8C8C88", "#4A4A48"], desc: "High contrast monochrome with warm gray undertones" },
        { name: "Creative Minimal", colors: ["#FFFFFF", "#F0F0F0", "#111111", "#FF3366", "#222222"], desc: "Stark white and deep black with a bold neon punch" }
      ];
    }
    if (['E-Commerce'].includes(projectType)) {
      return [
        { name: "Trust & Conversion", colors: ["#FFFFFF", "#F4F7F6", "#2E4057", "#048A81", "#E6E6EA"], desc: "Clean white with teal accents for high trust" },
        { name: "Luxury Dark", colors: ["#121212", "#1E1E1E", "#D4AF37", "#FFFFFF", "#333333"], desc: "Deep charcoal with elegant gold accents" },
        { name: "Fresh Retail", colors: ["#FAFAFA", "#EAEAEA", "#2B2B2B", "#FF6B6B", "#4ECDC4"], desc: "Light, energetic colors to highlight products" }
      ];
    }
    if (['SaaS Tool', 'Dashboard'].includes(projectType)) {
      return [
        { name: "Data Professional", colors: ["#0F172A", "#1E293B", "#334155", "#38BDF8", "#F8FAFC"], desc: "Cool slates with bright sky blue accents" },
        { name: "Clean Interface", colors: ["#FFFFFF", "#F9FAFB", "#E5E7EB", "#4F46E5", "#111827"], desc: "Maximum readability with purposeful indigo highlights" },
        { name: "Modern Metrics", colors: ["#18181B", "#27272A", "#3F3F46", "#10B981", "#FAFAFA"], desc: "Dark zinc shades with positive emerald data points" }
      ];
    }
    return [
      { name: "Vibrant App", colors: ["#FFFFFF", "#F1F5F9", "#8B5CF6", "#EC4899", "#0F172A"], desc: "High-energy gradients waiting to happen" },
      { name: "Thumb-Friendly Dark", colors: ["#000000", "#1C1C1E", "#3A3A3C", "#0A84FF", "#FFFFFF"], desc: "Native iOS dark mode feel with electric blue" },
      { name: "Soft Social", colors: ["#FFFCF9", "#F2E8CF", "#386641", "#BC4749", "#000000"], desc: "Warm, inviting earth tones for community apps" }
    ];
  };

  const getAnimationDesc = (val: string) => {
    if (val.includes("Cinematic")) return "Smooth camera-like transitions, staggered reveals, filmic feel";
    if (val.includes("3D")) return "Three.js elements, depth, perspective transforms, floating objects";
    if (val.includes("Smooth")) return "Subtle fades, gentle hovers, clean micro-interactions";
    if (val.includes("Bold")) return "Fast snappy transitions, strong hover effects, energetic feel";
    if (val.includes("No Animations")) return "Fully static, no motion, maximum performance";
    return "";
  };

  const isCurrentStepValid = () => {
    if (qStep === 2) return !!projectType;
    if (qStep === 3) return !!pageCount;
    if (qStep === 4) return !!audience;
    if (qStep === 5) return !!animationStyle;
    if (qStep === 6) return !!backendComplexity;
    if (qStep === 7) return !!colorPalette || (customColors !== '' && customColors !== 'show');
    if (qStep === 8) return true; // optional
    if (qStep === 9) return !!promptDetail;
    return true;
  };

  const handleNextStep = () => {
    setQStep(prev => Math.min(prev + 1, 9));
  };
  
  const handlePrevStep = () => {
    if (qStep === 2) {
      setStep("idea");
    } else {
      setQStep(prev => Math.max(prev - 1, 2));
    }
  };

  const generateUX = useCallback(async () => {
    // Save preferences
    localStorage.setItem("designpilot_prefs", JSON.stringify({
      platform, style, animationStyle, backendComplexity, promptDetail
    }));

    setStep("generating");
    setLoading(true);
    setResult(null);

    const actualColorDescription = colorPalette ? colorPalette : (customColors === 'show' ? '' : customColors);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          idea, audience, platform, style, features, colorMood,
          projectType, pageCount, pageList, animationStyle, backendComplexity, 
          colorDescription: actualColorDescription, inspirationSite, promptDetail
        }),
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
  }, [idea, audience, platform, style, features, colorMood, projectType, pageCount, pageList, animationStyle, backendComplexity, colorPalette, customColors, inspirationSite, promptDetail]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2500);
  };

  const resetAll = () => {
    setStep("idea");
    setQStep(2);
    setIdea("");
    setProjectType("");
    setPageCount("");
    setPageList("");
    setAudience("");
    setPlatform("");
    setStyle("");
    setFeatures([]);
    setColorMood("");
    setAnimationStyle("");
    setBackendComplexity("");
    setColorPalette("");
    setCustomColors("");
    setColorLoaded(false);
    setInspirationSite("");
    setPromptDetail("");
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

  const renderWizardStep = () => {
    switch(qStep) {
      case 2:
        return (
          <div className="animate-fade-up">
            <h2 className="font-serif text-4xl text-[var(--text)] mb-3">Refine the architecture</h2>
            <p className="text-[var(--muted)] mb-10 text-lg">Select the defining characteristics to narrow down the prompt logic.</p>
            <label className="font-mono text-sm uppercase tracking-wider text-[var(--muted)] mb-4 block">What type of project?</label>
            <div className="flex flex-wrap gap-3">
              {projectTypeOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setProjectType(opt)}
                  className={`px-5 py-2.5 font-mono text-xs transition-all border rounded-full duration-300 ${projectType === opt ? 'bg-[rgba(42,255,214,0.1)] border-[var(--accent-aqua)] text-[var(--accent-aqua)] shadow-[0_0_15px_rgba(42,255,214,0.15)]' : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] hover:border-[var(--muted)] hover:text-white'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="animate-fade-up">
            <h2 className="font-serif text-4xl text-[var(--text)] mb-3">Scope your project</h2>
            <p className="text-[var(--muted)] mb-10 text-lg">Define the total surface area we need to design.</p>
            <label className="font-mono text-sm uppercase tracking-wider text-[var(--muted)] mb-4 block">How many pages do you need?</label>
            <div className="flex flex-wrap gap-3 mb-6">
              {pageCountOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setPageCount(opt)}
                  className={`px-5 py-2.5 font-mono text-xs transition-all border rounded-full duration-300 ${pageCount === opt ? 'bg-[rgba(42,255,214,0.1)] border-[var(--accent-aqua)] text-[var(--accent-aqua)] shadow-[0_0_15px_rgba(42,255,214,0.15)]' : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] hover:border-[var(--muted)] hover:text-white'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <input 
              type="text" 
              value={pageList} 
              onChange={e => setPageList(e.target.value)}
              placeholder="List your pages (optional) e.g. Home, About, Contact"
              className="w-full bg-[var(--surface-2)] border border-[var(--border)] p-4 rounded-xl text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent-aqua)] transition-colors font-sans"
            />
          </div>
        );
      case 4:
        return (
          <div className="animate-fade-up">
            <h2 className="font-serif text-4xl text-[var(--text)] mb-3">Target demographics</h2>
            <p className="text-[var(--muted)] mb-10 text-lg">Who is going to use this interface?</p>
            <label className="font-mono text-sm uppercase tracking-wider text-[var(--muted)] mb-4 block">For whom?</label>
            <div className="flex flex-wrap gap-3">
              {audienceOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setAudience(opt)}
                  className={`px-5 py-2.5 font-mono text-xs transition-all border rounded-full duration-300 ${audience === opt ? 'bg-[rgba(42,255,214,0.1)] border-[var(--accent-aqua)] text-[var(--accent-aqua)] shadow-[0_0_15px_rgba(42,255,214,0.15)]' : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] hover:border-[var(--muted)] hover:text-white'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="animate-fade-up">
            <h2 className="font-serif text-4xl text-[var(--text)] mb-3">Motion & interaction</h2>
            <p className="text-[var(--muted)] mb-10 text-lg">Control the kinetic feel of your application.</p>
            <label className="font-mono text-sm uppercase tracking-wider text-[var(--muted)] mb-4 block">What kind of animations do you want?</label>
            <div className="flex flex-wrap gap-3 mb-4">
              {animationStyleOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setAnimationStyle(opt)}
                  className={`px-5 py-2.5 font-mono text-xs transition-all border rounded-full duration-300 ${animationStyle === opt ? 'bg-[rgba(42,255,214,0.1)] border-[var(--accent-aqua)] text-[var(--accent-aqua)] shadow-[0_0_15px_rgba(42,255,214,0.15)]' : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] hover:border-[var(--muted)] hover:text-white'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <p className="text-sm text-[var(--muted)] min-h-[20px] font-sans">
              {animationStyle ? getAnimationDesc(animationStyle) : ""}
            </p>
          </div>
        );
      case 6:
        return (
          <div className="animate-fade-up">
            <h2 className="font-serif text-4xl text-[var(--text)] mb-3">Technical constraints</h2>
            <p className="text-[var(--muted)] mb-10 text-lg">Define the depth of the generated logic.</p>
            <label className="font-mono text-sm uppercase tracking-wider text-[var(--muted)] mb-4 block">What does your app need to do?</label>
            <div className="flex flex-wrap gap-3 mb-4">
              {backendComplexityOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setBackendComplexity(opt)}
                  className={`px-5 py-2.5 font-mono text-xs transition-all border rounded-full duration-300 ${backendComplexity === opt ? 'bg-[rgba(42,255,214,0.1)] border-[var(--accent-aqua)] text-[var(--accent-aqua)] shadow-[0_0_15px_rgba(42,255,214,0.15)]' : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] hover:border-[var(--muted)] hover:text-white'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <p className="text-sm text-[var(--muted)] font-sans">This helps us include the right technical stack in your prompt</p>
          </div>
        );
      case 7:
        if (!colorLoaded) {
          return (
            <div className="animate-fade-up py-16 text-center">
              <div className="w-10 h-10 border-2 border-[var(--accent-aqua)] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <h3 className="font-serif text-2xl text-[var(--text)] mb-2">Analyzing your project for the perfect palette...</h3>
            </div>
          );
        }
        return (
          <div className="animate-fade-up">
            <h2 className="font-serif text-4xl text-[var(--text)] mb-3">Visual aesthetics</h2>
            <p className="text-[var(--muted)] mb-10 text-lg">AI color recommendation system based on your choices.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {getPalettes().map(p => (
                <div key={p.name} onClick={() => { setColorPalette(p.name); setCustomColors(''); }} className={`p-5 rounded-2xl cursor-pointer border transition-all ${colorPalette === p.name ? 'border-[var(--accent-aqua)] bg-[rgba(42,255,214,0.05)] shadow-[0_0_15px_rgba(42,255,214,0.15)]' : 'border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--muted)] hover:-translate-y-1'}`}>
                  <div className="font-mono text-sm mb-3 text-[var(--text)]">{p.name}</div>
                  <div className="flex gap-2 mb-4">
                    {p.colors.map(c => (
                      <div key={c} className="w-6 h-6 rounded-full shadow-sm" style={{ backgroundColor: c }}></div>
                    ))}
                  </div>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <button 
                onClick={() => { setCustomColors(prev => prev ? '' : 'show'); setColorPalette(''); }} 
                className="text-sm text-[var(--accent-aqua)] hover:underline font-mono"
              >
                None of these feel right?
              </button>
              {customColors !== '' && (
                <div className="mt-4 animate-fade-up">
                  <textarea 
                    className="w-full bg-[var(--surface-2)] border border-[var(--border)] p-4 rounded-xl text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent-aqua)] font-sans resize-none h-24" 
                    placeholder="Describe your perfect colors... e.g. 'sunset orange meets dark academia' or 'minimal like Apple but warmer'"
                    value={customColors === 'show' ? '' : customColors}
                    onChange={e => { setCustomColors(e.target.value); setColorPalette(""); }}
                  />
                </div>
              )}
            </div>
          </div>
        );
      case 8:
        return (
          <div className="animate-fade-up">
            <h2 className="font-serif text-4xl text-[var(--text)] mb-3">Design reference</h2>
            <p className="text-[var(--muted)] mb-10 text-lg">Point us towards your ideal visual language.</p>
            <label className="font-mono text-sm uppercase tracking-wider text-[var(--muted)] mb-4 block">Any website whose design you admire? (optional)</label>
            <input 
              type="text" 
              value={inspirationSite} 
              onChange={e => setInspirationSite(e.target.value)}
              placeholder="e.g. stripe.com, linear.app, vercel.com"
              className="w-full bg-[var(--surface-2)] border border-[var(--border)] p-4 rounded-xl text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent-aqua)] transition-colors font-sans mb-8"
            />
            <button onClick={handleNextStep} className="text-sm text-[var(--muted)] hover:text-[var(--text)] font-mono flex items-center gap-2 transition-colors">
              Skip this step &rarr;
            </button>
          </div>
        );
      case 9:
        const detailCards = [
          { val: "Quick", title: "Quick", desc: "Short and sharp. ~150 words. Paste and go." },
          { val: "Detailed", title: "Detailed", desc: "Comprehensive. ~400 words. Every section described.", recommended: true },
          { val: "Expert", title: "Expert", desc: "Obsessively specific. 600+ words. Exact values, animations, interactions." }
        ];
        return (
          <div className="animate-fade-up">
            <h2 className="font-serif text-4xl text-[var(--text)] mb-3">Finalize detail</h2>
            <p className="text-[var(--muted)] mb-10 text-lg">Set the density of the generated instructions.</p>
            <label className="font-mono text-sm uppercase tracking-wider text-[var(--muted)] mb-4 block">How detailed should your prompt be?</label>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {detailCards.map(c => (
                <div 
                  key={c.val} 
                  onClick={() => setPromptDetail(c.val)}
                  className={`relative p-6 rounded-2xl cursor-pointer border transition-all ${promptDetail === c.val ? 'border-[var(--accent-aqua)] bg-[rgba(42,255,214,0.05)] shadow-[0_0_15px_rgba(42,255,214,0.15)]' : 'border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--muted)] hover:-translate-y-1'}`}
                >
                  {c.recommended && (
                    <div className="absolute top-0 right-4 -translate-y-1/2 bg-[var(--accent-aqua)] text-[#06060a] text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow-[0_0_10px_rgba(42,255,214,0.3)]">
                      Recommended
                    </div>
                  )}
                  <h3 className="font-serif text-2xl text-[var(--text)] mb-2">{c.title}</h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const totalSteps = 9;
  const currentStepNum = step === 'idea' ? 1 : qStep;

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

      {/* Why builders choose DesignPilot AI */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-b border-[var(--border)]">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl text-[var(--text)] mb-4">Why builders choose DesignPilot AI</h2>
          <p className="font-mono text-sm text-[var(--muted)] uppercase tracking-wider">Not just another prompt tool</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Built for Real Tools", desc: "Every prompt is optimized specifically for v0, Bolt, Cursor, and Lovable — not generic AI input", dur: "6s" },
            { title: "Human-Looking Output", desc: "Our prompts are so specific that the UI you build won't look AI-generated. It looks designed.", dur: "7s" },
            { title: "You Describe, We Translate", desc: "No design knowledge needed. Tell us your idea in plain words and we handle the design thinking.", dur: "8s" },
            { title: "Color Intelligence", desc: "We recommend palettes based on your project before you even ask. Or describe your vibe and we'll match it.", dur: "9s" },
            { title: "Any Stack, Any Scale", desc: "From a simple landing page to a full stack app with auth — we generate prompts for every complexity level.", dur: "10s" },
            { title: "Built by a 17-year-old from Nepal", desc: "Not a big company. Just a young builder who wanted a better tool and built it. Fast, honest, and improving every day.", dur: "11s" }
          ].map((card, i) => (
            <div key={i} style={{ animation: `floatBob ${card.dur} ease-in-out infinite alternate` }}>
              <div className="p-8 group bg-[var(--surface)] border border-[var(--border)] rounded-2xl hover:-translate-y-1 hover:border-[var(--accent-aqua)] hover:shadow-[0_0_20px_rgba(42,255,214,0.1)] transition-all duration-300 h-full">
                <div className="w-10 h-10 rounded-full bg-[rgba(42,255,214,0.1)] flex items-center justify-center mb-6 border border-[rgba(42,255,214,0.2)]">
                  <div className="w-2 h-2 rounded-full bg-[var(--accent-aqua)] shadow-[0_0_10px_var(--accent-aqua)]" />
                </div>
                <h3 className="font-serif text-2xl text-[var(--text)] mb-3">{card.title}</h3>
                <p className="font-sans text-[var(--muted)] leading-relaxed">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Multi-step prompt generator section */}
      <section id="generator" className="relative z-10 max-w-4xl mx-auto px-6 py-32">
        <div className="animate-float-subtle bg-[var(--surface)] border border-[var(--border)] rounded-[20px] shadow-2xl p-8 md:p-12 relative overflow-hidden min-h-[500px]">
          {/* Subtle top glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-aqua)] to-transparent opacity-20"></div>

          {/* Generator UI Content depending on Step */}
          {step === 'landing' || step === 'idea' || step === 'questions' ? (
            <div className="flex items-center gap-4 mb-10">
              <div className="flex-1 h-[2px] bg-[var(--surface-2)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--accent-aqua)] transition-all duration-700 rounded-full shadow-[0_0_10px_rgba(42,255,214,0.5)]" style={{ width: `${(currentStepNum / totalSteps) * 100}%` }}></div>
              </div>
              <div className="font-mono text-xs text-[var(--muted)]">Step {currentStepNum} of {totalSteps}</div>
            </div>
          ) : null}

          {step === 'landing' || step === 'idea' ? (
            <div className="animate-fade-up">
              <h2 className="font-serif text-4xl text-[var(--text)] mb-3">What are we building?</h2>
              <div className="flex items-center gap-4 mb-8">
                <p className="text-[var(--muted)] text-lg">Describe your app idea in a sentence or two.</p>
                {hasPreferences && (
                  <span className="text-[var(--accent-violet)] text-sm font-mono opacity-80 animate-pulse bg-[rgba(139,92,246,0.1)] px-3 py-1 rounded-full border border-[rgba(139,92,246,0.2)]">
                    Preferences loaded &rarr;
                  </span>
                )}
              </div>
              
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
              {hasPreferences && (
                <p className="text-center mt-6 text-sm text-[var(--muted)] font-mono">
                  We remembered your preferences from last time.
                </p>
              )}
            </div>
          ) : step === 'questions' ? (
            <div className="flex flex-col h-full min-h-[350px]">
              <div className="flex-1">
                {renderWizardStep()}
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-center mt-12 gap-4 border-t border-[var(--border)] pt-8">
                <button onClick={handlePrevStep} className="text-[var(--text)] font-mono text-sm border border-[var(--border)] px-8 py-4 rounded-xl hover:bg-[var(--surface-2)] transition-colors w-full sm:w-auto">
                  &larr; Back
                </button>
                {qStep < 9 ? (
                  <button 
                    onClick={handleNextStep} 
                    disabled={!isCurrentStepValid()} 
                    className="bg-[var(--surface-2)] text-[var(--accent-aqua)] font-mono text-sm border border-[var(--accent-aqua)] px-8 py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[rgba(42,255,214,0.1)] hover:shadow-[0_0_15px_rgba(42,255,214,0.15)] transition-all w-full sm:w-auto"
                  >
                    Next Step &rarr;
                  </button>
                ) : (
                  <button 
                    onClick={generateUX} 
                    disabled={!isCurrentStepValid()} 
                    className="bg-[var(--accent-orange)] text-white font-semibold font-sans px-10 py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(255,107,53,0.3)] transition-all w-full sm:w-auto text-lg"
                  >
                    Generate Prompt &rarr;
                  </button>
                )}
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
