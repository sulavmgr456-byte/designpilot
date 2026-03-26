import { NextResponse } from "next/server";

async function fetchWithRetry(url: string, options: RequestInit, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(url, options);
    if (response.status === 429) {
      const waitTime = 5000 * Math.pow(2, i);
      console.log(`Rate limited. Retrying in ${waitTime / 1000}s... (attempt ${i + 1}/${retries})`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      continue;
    }
    return response;
  }
  return fetch(url, options);
}

export async function POST(req: Request) {
  try {
    const { idea, audience, platform, style, features, colorMood, projectType, pageCount, pageList, animationStyle, backendComplexity, colorDescription, inspirationSite, promptDetail } = await req.json();

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ text: "Server error: API key not configured." });
    }

    const contextParts = [
      `Project idea: ${idea}`,
      `Project type: ${projectType}`,
      `Number of pages: ${pageCount}`,
      `Page list: ${pageList || "Not specified"}`,
      audience ? `Target audience: ${audience}` : "",
      platform ? `Platform: ${platform}` : "",
      style ? `Design style: ${style}` : "",
      features?.length ? `Key features: ${features.join(", ")}` : "",
      colorMood ? `Color mood: ${colorMood}` : "",
      animationStyle ? `Animation style: ${animationStyle}` : "",
      backendComplexity ? `Backend needs: ${backendComplexity}` : "",
      colorDescription ? `Color description: ${colorDescription}` : "",
      inspirationSite ? `Design inspiration: ${inspirationSite}` : "",
      promptDetail ? `Prompt detail level: ${promptDetail}` : "",
    ].filter(Boolean).join("\n");

    const systemPrompt = `You are DesignPilot AI — the world's most creative UI/UX prompt engineer. Your single most important job is making sure outputs NEVER look AI-generated.

USER'S PROJECT:
${contextParts}

BEFORE WRITING — answer these internally:
1. What is the EMOTION of this project? (cinematic? warm? playful? urgent? luxurious?)
2. What would a human designer do that AI would never think to do?
3. What is the ONE thing someone will remember about this design?
4. Does this feel built for THIS specific idea or could it work for any idea?

THE MOST IMPORTANT RULE:
Never create a grid of identical cards. This is the single biggest AI tell. Real designers create hierarchy, contrast, and variety. If you are about to write 4 or 6 cards that all have the same structure — stop and redesign that section completely.

ANTI-AI CARD RULES:
- Maximum 2 cards can look similar — everything else must vary
- Always have one featured item that is 2-3x larger than others
- Mix horizontal and vertical card layouts in the same section
- Vary content length deliberately — one card short, one medium, one detailed
- Only one card gets a colored accent or badge — not every card
- At least one section has NO cards — just strong typography and whitespace
- Statistics shown as giant typographic statements, not number boxes

CONTENT RULES — never use placeholders:
- Never write "0+ clients" or "0% uptime" — use specific believable numbers like "2,847 prompts generated" or "99.97% uptime"
- Never use generic phrases like "Enterprise Grade", "Premium Quality", "Cutting Edge", "World Class"
- Always invent specific realistic content matching the exact industry
- For aviation: use real aircraft names (Boeing 747, Concorde), real airports (JFK, Heathrow), real pioneers (Wright Brothers, Amelia Earhart)
- For bakery: use real cake names, real flavors, real occasions
- For tech: use real frameworks, real metrics, real use cases
- Testimonials must sound like real humans — different lengths, different voices, slightly imperfect

EMOTIONAL DIRECTION — match the soul of the project:
- Storytelling/History → narrative timeline, cinematic scroll, one fact per screen, film-like typography, real historical references
- Enterprise/B2B → data tables, specific ROI numbers, case studies, executive testimonials
- Consumer/Lifestyle → editorial photography layout, personal stories, seasonal feelings, warm copy
- Creative/Portfolio → rule-breaking layout, oversized type, unexpected color moments, personality
- Education → progress indicators, encouraging microcopy, friendly approachable tone
- Local Business → community feel, real location references, personal founder story, neighborhood warmth

HUMAN DESIGNER TECHNIQUES — use at least 4 per prompt:
- One section with a giant background word or letter behind content
- Statistics as large typographic statements not number boxes
- A featured item that is 3x larger than surrounding items
- Navigation that transforms completely on scroll
- A color that appears only once as a surprise accent
- Aggressive whitespace in one section for breathing room
- One image bleeding off screen edge intentionally
- Overlapping elements between sections
- A section with pure black or pure white background and dramatic type only
- Timeline flowing horizontally or diagonally instead of vertically

LAYOUT RULES:
- Hero must be asymmetric — never centered text with button below
- At least one full-bleed section breaking the container
- Footer must have 3 different content types not just link columns
- Mobile behavior must be specifically described for each major section

ANIMATION based on user choice:
- Cinematic: slow parallax, text reveals line by line, 0.8s ease, camera-like zoom
- 3D: Three.js background, perspective tilt on hover, rotating elements, depth layers
- Smooth & Minimal: 0.2s ease on all interactions, subtle translateY on hover
- Bold & Dramatic: snap scroll, instant color switches, fast 0.15s transitions
- No animations: explicitly state fully static, no transitions whatsoever

FORMAT EXACTLY LIKE THIS:

PROMPT_START
[Write the complete prompt starting with "Build a..." Describe the FEELING first then the structure. For every section that could become identical cards, describe specifically how each one differs. Include exact hex colors, exact font names, exact animation timing. Make this so specific it could only ever produce one possible design.]
PROMPT_END

DESIGN_BRIEF_START
Layout: [Specific layout with the one unexpected element named]
Navigation: [Specific nav with standout element described]
Design: [Exact colors and fonts with emotional rationale]
Components: [Each major component described individually — never "grid of cards"]
Responsive: [Specific mobile behavior per major section]
Stack: [Technical stack based on backend choice]
DESIGN_BRIEF_END`;

    const freeModels = [
      "nvidia/nemotron-nano-9b-v2:free",
      "meta-llama/llama-3.1-8b-instruct:free",
      "google/gemma-2-9b-it:free",
    ];

    let data = null;
    let response = null;

    for (const model of freeModels) {
      console.log(`Trying model: ${model}`);
      response = await fetchWithRetry(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://designpilot-taupe.vercel.app",
            "X-Title": "DesignPilot AI",
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: contextParts },
            ],
          }),
        }
      );

      data = await response.json();
      console.log(`API RESPONSE STATUS for ${model}:`, response.status);

      if (response.status === 429 || data.error) {
        console.log(`Model ${model} failed, trying next...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        continue;
      }

      break; // success
    }

    if (!data || !response) {
      return NextResponse.json({ text: "All models failed. Please try again in 60 seconds." });
    }

    if (response.status === 429) {
      return NextResponse.json({
        text: "Rate limited by OpenRouter. Please wait 60 seconds and try again.",
      });
    }

    if (data.error) {
      return NextResponse.json({
        text: `API Error: ${data.error.message || "Unknown error from OpenRouter"}`,
      });
    }

    const fullText = data?.choices?.[0]?.message?.content || "";

    // Parse the structured output
    const promptMatch = fullText.match(/PROMPT_START\s*([\s\S]*?)\s*PROMPT_END/);
    const briefMatch = fullText.match(/DESIGN_BRIEF_START\s*([\s\S]*?)\s*DESIGN_BRIEF_END/);

    const prompt = promptMatch ? promptMatch[1].trim() : fullText;
    const brief = briefMatch ? briefMatch[1].trim() : "";

    return NextResponse.json({
      text: fullText,
      prompt,
      brief,
    });

  } catch (error) {
    console.error("FETCH ERROR:", error);
    return NextResponse.json({ text: "Error generating response" });
  }
}