import os
import re

css_file = r'c:\Users\Acer\designpilot\app\globals.css'
with open(css_file, 'r', encoding='utf-8') as f:
    css_content = f.read()

# Replace fonts
css_content = css_content.replace(
    '@import url("https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=cabinet-grotesk@400,500,700&display=swap");',
    '@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap");'
)
css_content = css_content.replace(
    '@import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap");\n',
    ''
)

css_content = css_content.replace(
    ':root {\n  --bg: #0D0D14;',
    ":root {\n  --font-display: 'Cormorant Garamond', Georgia, serif;\n  --font-body: 'DM Sans', system-ui, sans-serif;\n  --font-mono: 'JetBrains Mono', monospace;\n  --bg: #0D0D14;"
)

if '@theme inline {' in css_content:
    css_content = css_content.replace(
        "  --font-serif: 'Clash Display', 'DM Serif Display', serif;",
        "  --font-serif: var(--font-display);"
    )
    css_content = css_content.replace(
        "  --font-sans: 'Cabinet Grotesk', 'Inter', sans-serif;",
        "  --font-sans: var(--font-body);"
    )

new_styles = """
/* Fix 2: Standardized Buttons */
.btn-primary {
  background: #FF6B35;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-primary:hover {
  background: #e55a25;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 107, 53, 0.3);
}
.btn-secondary {
  background: transparent;
  color: #E8F4F0;
  border: 1px solid #252538;
  border-radius: 8px;
  padding: 12px 24px;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-secondary:hover {
  border-color: #2AFFD6;
  color: #2AFFD6;
  transform: translateY(-2px);
}
.btn-pill {
  background: rgba(42, 255, 214, 0.08);
  color: #2AFFD6;
  border: 1px solid rgba(42, 255, 214, 0.2);
  border-radius: 999px;
  padding: 4px 12px;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
}

/* Fix 3: Standardized Cards */
.card {
  background: #1A1A26;
  border: 1px solid #252538;
  border-radius: 16px;
  padding: 24px;
  transition: border-color 0.2s ease, transform 0.2s ease;
}
.card:hover {
  border-color: rgba(42, 255, 214, 0.3);
  transform: translateY(-2px);
}

/* Global Font Assignments */
h1, h2, h3, h4, h5, h6 { font-family: var(--font-display); }
p, body { font-family: var(--font-body); }
label, .tag, .badge, code { font-family: var(--font-mono); }
"""

if "btn-primary" not in css_content:
    css_content += new_styles

with open(css_file, 'w', encoding='utf-8') as f:
    f.write(css_content)
print("Updated globals.css")

tsx_file = r'c:\Users\Acer\designpilot\app\page.tsx'
with open(tsx_file, 'r', encoding='utf-8') as f:
    tsx = f.read()

# BUTTONS REPLACEMENTS

# projectTypeOptions, pageCountOptions, audienceOptions, animationStyleOptions, backendComplexityOptions map buttons
for opt_var in ['projectType', 'pageCount', 'audience', 'animationStyle', 'backendComplexity']:
    pattern = r"className={`px-5 py-2\.5 font-mono text-xs transition-all border rounded-full duration-300 \$\{" + opt_var + r" === opt \? '[^']+' : '[^']+'\}`}"
    repl = f"className={{`btn-secondary ${{{opt_var} === opt ? '!border-[#2AFFD6] !text-[#2AFFD6]' : ''}}`}}"
    tsx = re.sub(pattern, repl, tsx)

# Start Building link (a tag acting as button)
tsx = re.sub(
    r'<a href="#generator" className="inline-block bg-\[var\(--surface-2\)\] border border-\[var\(--border\)\] text-\[var\(--text\)\] font-mono px-6 py-3 rounded-xl hover:-translate-y-1 hover:border-\[var\(--accent-aqua\)\] transition-all">',
    r'<a href="#generator" className="btn-primary inline-flex items-center justify-center">',
    tsx
)

# Let's build this
tsx = re.sub(
    r'className="bg-\[var\(--accent-orange\)\] text-white font-semibold font-sans px-8 py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 hover:shadow-\[0_8px_24px_rgba\(255,107,53,0\.3\)\] transition-all flex items-center gap-2 text-lg"',
    r'className="btn-primary disabled:opacity-50"',
    tsx
)

# Back
tsx = re.sub(
    r'className="text-\[var\(--text\)\] font-mono text-sm border border-\[var\(--border\)\] px-8 py-4 rounded-xl hover:bg-\[var\(--surface-2\)\] transition-colors w-full sm:w-auto"',
    r'className="btn-secondary w-full sm:w-auto"',
    tsx
)

# Next Step
tsx = re.sub(
    r'className="bg-\[var\(--surface-2\)\] text-\[var\(--accent-aqua\)\] font-mono text-sm border border-\[var\(--accent-aqua\)\] px-8 py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-\[rgba\(42,255,214,0\.1\)\] hover:shadow-\[0_0_15px_rgba\(42,255,214,0\.15\)\] transition-all w-full sm:w-auto"',
    r'className="btn-primary disabled:opacity-50 w-full sm:w-auto"',
    tsx
)

# Generate Prompt 
tsx = re.sub(
    r'className="bg-\[var\(--accent-orange\)\] text-white font-semibold font-sans px-10 py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 hover:shadow-\[0_8px_24px_rgba\(255,107,53,0\.3\)\] transition-all w-full sm:w-auto text-lg"',
    r'className="btn-primary disabled:opacity-50 w-full sm:w-auto"',
    tsx
)

# Start Over
tsx = re.sub(
    r'className="w-full sm:w-auto text-\[var\(--text\)\] border border-\[var\(--border\)\] px-8 py-4 rounded-xl hover:bg-\[var\(--surface-2\)\] transition-colors font-mono text-sm"',
    r'className="btn-secondary w-full sm:w-auto"',
    tsx
)

# Copy Prompt ->
tsx = re.sub(
    r'className="w-full sm:w-auto bg-\[var\(--accent-aqua\)\] text-\[\#06060a\] font-bold px-10 py-4 rounded-xl hover:-translate-y-1 hover:shadow-\[0_8px_24px_rgba\(42,255,214,0\.3\)\] transition-all font-mono text-sm uppercase tracking-wide"',
    r'className="btn-primary w-full sm:w-auto"',
    tsx
)

# Send Feedback
tsx = re.sub(
    r'className="w-full bg-\[var\(--accent-orange\)\] text-white font-semibold font-sans px-6 py-3\.5 rounded-xl hover:-translate-y-1 hover:shadow-\[0_8px_24px_rgba\(255,107,53,0\.3\)\] transition-all text-base"',
    r'className="btn-primary w-full"',
    tsx
)

# Skip this step
tsx = re.sub(
    r'className="text-sm text-\[var\(--muted\)\] hover:text-\[var\(--text\)\] font-mono flex items-center gap-2 transition-colors"',
    r'className="btn-secondary"',
    tsx
)

# None of these feel right?
tsx = re.sub(
    r'className="text-sm text-\[var\(--accent-aqua\)\] hover:underline font-mono"',
    r'className="btn-secondary"',
    tsx
)

# Feedback Thumbs Up / Down
pattern_feedback = r"className={`px-6 py-3 rounded-full border bg-\[var\(--surface-2\)\] transition-all \$\{feedbackReaction === '[^']+' \? 'border-\[var\(--accent-aqua\)\] shadow-\[0_0_10px_rgba\(42,255,214,0\.15\)\]' : 'border-\[var\(--border\)\] hover:border-\[var\(--accent-aqua\)\]'\}`}"
repl_up = r"className={`btn-secondary ${feedbackReaction === '👍' ? '!border-[#2AFFD6] !text-[#2AFFD6]' : ''}`}"
repl_down = r"className={`btn-secondary ${feedbackReaction === '👎' ? '!border-[#2AFFD6] !text-[#2AFFD6]' : ''}`}"
tsx = re.sub(pattern_feedback.replace("[^']+", '👍'), repl_up, tsx)
tsx = re.sub(pattern_feedback.replace("[^']+", '👎'), repl_down, tsx)

# Tags (Pill) "Works with -> v0..."
tsx = re.sub(
    r'className="px-5 py-2 rounded-full border border-\[var\(--border\)\] bg-\[var\(--surface\)\] text-\[var\(--text\)\]"', # This one was different slightly but checking page.tsx:
    r'className="btn-pill"',
    tsx
)
# Ah it was 'className="px-5 py-2 rounded-full border border-[var(--border)] bg-[var(--surface)] hover:-translate-y-1 transition-transform cursor-default text-[var(--text)]"'
tsx = re.sub(
    r'className="px-5 py-2 rounded-full border border-\[var\(--border\)\] bg-\[var\(--surface\)\] hover:-translate-y-1 transition-transform cursor-default text-\[var\(--text\)\]"',
    r'className="btn-pill"',
    tsx
)

# CARD REPLACEMENTS

# 1. Floating Terminal Card
tsx = re.sub(
    r'className="bg-\[var\(--surface\)\] border border-\[var\(--border\)\] rounded-2xl overflow-hidden shadow-\[0_0_40px_rgba\(42,255,214,0\.08\)\]"',
    r'className="card"',
    tsx
)

# 2. Why builders choose DesignPilot AI cards
tsx = re.sub(
    r'className="p-8 group bg-\[var\(--surface\)\] border border-\[var\(--border\)\] rounded-2xl hover:-translate-y-1 hover:border-\[var\(--accent-aqua\)\] hover:shadow-\[0_0_20px_rgba\(42,255,214,0\.1\)\] transition-all duration-300 h-full"',
    r'className="card group h-full"',
    tsx
)

# 3. Color Palette Cards
tsx = re.sub(
    r'className={`p-5 rounded-2xl cursor-pointer border transition-all \$\{colorPalette === p\.name \? \'border-\[var\(--accent-aqua\)\] bg-\[rgba\(42,255,214,0\.05\)\] shadow-\[0_0_15px_rgba\(42,255,214,0\.15\)\]\' : \'border-\[var\(--border\)\] bg-\[var\(--surface-2\)\] hover:border-\[var\(--muted\)\] hover:-translate-y-1\'\}`}',
    r'className="card cursor-pointer" style={colorPalette === p.name ? { borderLeft: "2px solid #2AFFD6" } : {}}',
    tsx
)

# 4. Prompt Detail Cards
tsx = re.sub(
    r'className={`relative p-6 rounded-2xl cursor-pointer border transition-all \$\{promptDetail === c\.val \? \'border-\[var\(--accent-aqua\)\] bg-\[rgba\(42,255,214,0\.05\)\] shadow-\[0_0_15px_rgba\(42,255,214,0\.15\)\]\' : \'border-\[var\(--border\)\] bg-\[var\(--surface-2\)\] hover:border-\[var\(--muted\)\] hover:-translate-y-1\'\}`}',
    r'className="card cursor-pointer relative" style={promptDetail === c.val ? { borderLeft: "2px solid #2AFFD6" } : {}}',
    tsx
)

# 5. How it works cards
tsx = re.sub(
    r'className={`flex-1 p-10 bg-\[var\(--surface\)\] border border-\[var\(--border\)\] rounded-2xl flex flex-col relative overflow-hidden group hover:border-\[var\(--border\)\] transition-colors \$\{step\.dur\}`}',
    r'className={`card flex-1 flex flex-col relative overflow-hidden group ${step.dur}`}',
    tsx
)

# 6. Generator big container (optional, but it fits definition of "every single card")
tsx = re.sub(
    r'className="animate-float-subtle bg-\[var\(--surface\)\] border border-\[var\(--border\)\] rounded-\[20px\] shadow-2xl p-8 md:p-12 relative overflow-hidden min-h-\[500px\]"',
    r'className="animate-float-subtle card shadow-2xl relative overflow-hidden min-h-[500px]"',
    tsx
)

# 7. Loading ("glass-card")
tsx = re.sub(
    r'className="glass-card rounded-2xl p-8 md:p-12 text-center border border-\[var\(--border\)\] bg-\[\#12121a\] relative overflow-hidden"',
    r'className="card text-center relative overflow-hidden"',
    tsx
)


with open(tsx_file, 'w', encoding='utf-8') as f:
    f.write(tsx)
print("Updated page.tsx")
