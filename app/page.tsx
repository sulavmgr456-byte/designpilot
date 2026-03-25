import React from "react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-accent-cyan selection:text-black">
      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-6 py-6 border-b border-border-color/30">
        <div className="font-serif text-2xl tracking-wide text-text">
          DesignPilot AI
        </div>
        <div className="hidden md:flex items-center gap-8 font-mono text-sm">
          <a href="#how-it-works" className="text-muted-color hover:text-text relative group">
            How it works
            <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-accent-cyan origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
          </a>
          <a href="#examples" className="text-muted-color hover:text-text relative group">
            Examples
            <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-accent-cyan origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
          </a>
          <div className="px-3 py-1 border border-border-color text-accent-violet rounded-sm text-xs uppercase tracking-wider bg-surface/50">
            Free to use
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="w-full max-w-7xl mx-auto px-6 pt-24 pb-20 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-16 relative">
          {/* Subtle staggered heading */}
          <div className="lg:w-1/2 flex flex-col justify-center">
            <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl leading-[1.1] text-text mb-8">
              <div className="animate-fade-up-1">Your idea.</div>
              <div className="animate-fade-up-2 text-muted-color">A few smart questions.</div>
              <div className="animate-fade-up-3">A perfect UI prompt.</div>
            </h1>
            <p className="font-sans text-lg md:text-xl text-muted-color max-w-md animate-fade-up-3">
              Stop fighting with generic AI outputs. Get tailored, opinionated UI prompts meant for modern development tools.
            </p>
          </div>

          {/* Floating Terminal Card */}
          <div className="lg:w-1/2 w-full max-w-lg lg:max-w-none animate-float-subtle lg:mt-8">
            <div className="w-full bg-surface border border-border-color rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,229,255,0.05)] relative">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border-color bg-background/50">
                <div className="w-3 h-3 rounded-full bg-muted-color/40"></div>
                <div className="w-3 h-3 rounded-full bg-muted-color/40"></div>
                <div className="w-3 h-3 rounded-full bg-muted-color/40"></div>
                <div className="ml-2 font-mono text-[10px] text-muted-color uppercase tracking-wider">prompt-generator.sh</div>
              </div>
              <div className="p-6 h-[320px] overflow-y-auto font-mono text-sm text-text leading-relaxed">
                <span className="text-accent-cyan">&gt;</span> Generating UI prompt for: <span className="text-accent-violet">"Freelance Invoice Tracker"</span>
                <br /><br />
                <span className="text-muted-color"># Target: v0 / Next.js / Tailwind v4</span><br />
                Build a dark-mode first dashboard with a sidebar layout.<br />
                Use <span className="text-accent-cyan">JetBrains Mono</span> for numbers, lora for text.<br />
                Left sidebar content: Dashboard, Invoices, Clients, Settings.<br />
                Main content: <br />
                - Top row: 3 minimal metric cards (Total Billed, Outstanding, Paid).<br />
                - Below: A sleek data table with hover states and a subtle border-border color.<br />
                - Add a floating action button on the bottom right for "New Invoice".<br />
                <br />
                <span className="text-accent-cyan animate-pulse">_</span>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Bar */}
        <section className="w-full border-t border-b border-border-color py-4">
          <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center gap-6 font-mono text-sm text-muted-color">
            <span className="uppercase tracking-widest text-xs">Works with &rarr;</span>
            <div className="flex items-center gap-6 flex-wrap">
              <span className="px-3 py-1 rounded-full border border-border-color bg-surface">v0</span>
              <span className="px-3 py-1 rounded-full border border-border-color bg-surface">Bolt</span>
              <span className="px-3 py-1 rounded-full border border-border-color bg-surface">Cursor</span>
              <span className="px-3 py-1 rounded-full border border-border-color bg-surface">Lovable</span>
              <span className="px-3 py-1 rounded-full border border-border-color bg-surface">Replit</span>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="w-full max-w-7xl mx-auto px-6 py-24">
          <div className="flex flex-col md:flex-row items-stretch border-l border-t md:border-t-0 md:border-l-0 border-border-color">
            <div className="flex-1 p-8 md:p-10 border-b md:border-b-0 md:border-r border-border-color relative border-l md:border-l-0">
              <div className="font-serif text-6xl text-transparent bg-clip-text mb-6 inline-block" style={{ WebkitTextStroke: '1px var(--color-accent-cyan)' }}>01</div>
              <h3 className="font-mono text-xl text-text mb-4">Input Context</h3>
              <p className="font-sans text-muted-color leading-relaxed">
                Start with a rough idea. We&apos;ll ask you a few targeted questions about the vibe, target audience, and feature set.
              </p>
            </div>
            <div className="flex-1 p-8 md:p-10 border-b md:border-b-0 md:border-r border-border-color border-l md:border-l-0">
              <div className="font-serif text-6xl text-transparent bg-clip-text mb-6 inline-block" style={{ WebkitTextStroke: '1px var(--color-accent-cyan)' }}>02</div>
              <h3 className="font-mono text-xl text-text mb-4">Synthesize</h3>
              <p className="font-sans text-muted-color leading-relaxed">
                Our engine translates your non-technical vision into highly specific structural, typographic, and layout instructions.
              </p>
            </div>
            <div className="flex-1 p-8 md:p-10 border-b md:border-b-0 border-border-color border-l md:border-l-0">
              <div className="font-serif text-6xl text-transparent bg-clip-text mb-6 inline-block" style={{ WebkitTextStroke: '1px var(--color-accent-cyan)' }}>03</div>
              <h3 className="font-mono text-xl text-text mb-4">Ship Faster</h3>
              <p className="font-sans text-muted-color leading-relaxed">
                Take the generated prompt to Cursor, v0, or Bolt, and get pixel-perfect, cohesive UIs on the very first try.
              </p>
            </div>
          </div>
        </section>

        {/* Example Output Section */}
        <section id="examples" className="w-full px-6 py-16">
          <div className="max-w-7xl mx-auto bg-surface border border-border-color rounded-sm p-10 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 w-full space-y-4">
              <label className="font-mono text-sm text-text">Your rough idea</label>
              <textarea 
                readOnly
                className="w-full bg-background border border-border-color p-5 font-sans text-lg text-muted-color resize-none h-40 focus:outline-none rounded-sm"
                value="I want a dashboard for tracking freelance invoices."
              />
            </div>
            
            <div className="hidden md:flex flex-col items-center justify-center font-mono text-accent-violet">
              See what it generates<br/>
              &rarr;
            </div>

            <div className="md:hidden font-mono text-accent-violet text-center w-full">
              See what it generates<br/>
              &darr;
            </div>

            <div className="flex-1 w-full space-y-4">
              <label className="font-mono text-sm text-text">Generated Prompt</label>
              <div className="w-full bg-[#0A0A0F] border border-border-color p-5 h-40 overflow-y-auto rounded-sm">
                <code className="font-mono text-sm text-muted-color block">
                  <span className="text-accent-violet">Goal:</span> Build an invoice dashboard.<br/>
                  <span className="text-accent-cyan">Style:</span> Dark editorial, monolithic.<br/>
                  <span className="text-text">Structure:</span><br/>
                  - Sidebar: Logo, Navigation, Settings<br/>
                  - Main: 3 KPI Cards, Data grid with sortable columns<br/>
                  - Colors: Surface #13131A, Accent #7B2FFF
                </code>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full max-w-7xl mx-auto px-6 py-32 flex flex-col items-start text-left">
          <h2 className="font-serif text-5xl md:text-6xl text-text mb-6 max-w-2xl">
            Stop writing bad prompts.
          </h2>
          <p className="font-sans text-xl text-muted-color mb-10 max-w-xl">
            Turn your vague thoughts into strict architectural commands for your AI coding tools.
          </p>
          <button className="bg-accent-cyan text-background font-mono px-8 py-4 text-base font-bold transition-all hover:bg-white hover:shadow-[0_0_20px_var(--color-accent-cyan)] rounded-sm">
            Start for free &rarr;
          </button>
          <div className="mt-4 font-mono text-xs text-muted-color">
            No account needed. No credit card.
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border-color py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-start justify-between gap-10">
          <div className="flex flex-col gap-2">
            <div className="font-serif text-xl text-text">DesignPilot AI</div>
            <div className="font-mono text-sm text-muted-color">High-end design studio, shipped via prompt.</div>
            <div className="font-mono text-xs text-muted-color/50 mt-4">&copy; {new Date().getFullYear()} DesignPilot.</div>
          </div>
          <div className="flex flex-col gap-3 font-mono text-sm border-t border-border-color pt-6 md:border-none md:pt-0 w-full md:w-auto text-left md:text-right">
            <a href="#" className="text-muted-color hover:text-text transition-colors">Twitter/X</a>
            <a href="#" className="text-muted-color hover:text-text transition-colors">GitHub</a>
            <a href="#" className="text-muted-color hover:text-text transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
