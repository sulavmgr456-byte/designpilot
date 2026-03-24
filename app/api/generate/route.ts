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
    const { idea, audience, platform, style, features, colorMood } = await req.json();

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ text: "Server error: API key not configured." });
    }

    const contextParts = [
      `Project idea: ${idea}`,
      audience ? `Target audience: ${audience}` : "",
      platform ? `Platform: ${platform}` : "",
      style ? `Design style: ${style}` : "",
      features?.length ? `Key features: ${features.join(", ")}` : "",
      colorMood ? `Color mood: ${colorMood}` : "",
    ].filter(Boolean).join("\n");

    const systemPrompt = `You are DesignPilot AI — a world-class UI/UX design consultant. Your job is to analyze a user's app idea and generate a COMPLETE, DETAILED, production-ready UI/UX design prompt that the user can directly paste into AI code generators like v0, Bolt.new, Lovable, or Cursor to build their app.

Your output must be a SINGLE, COMPREHENSIVE PROMPT that describes:
1. Full page layout and structure (header, hero, sections, footer)
2. Navigation system (type, items, mobile behavior)
3. Visual design system (colors with exact hex codes, typography, spacing, border radius)
4. Component details (cards, buttons, forms, modals — with specific styles)
5. Responsive behavior (mobile, tablet, desktop breakpoints)
6. Micro-animations and hover effects
7. Dark/light mode considerations

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

PROMPT_START
[Write the complete, ready-to-paste prompt here. It should be detailed enough that an AI code generator can build the entire UI from it. Include specific colors, fonts, spacing values, component descriptions, and layout instructions. Write it as a direct instruction to an AI, starting with "Build a..." or "Create a..."]
PROMPT_END

DESIGN_BRIEF_START
Layout: [2-3 sentence summary of the layout approach]
Navigation: [2-3 sentence summary of the navigation]
Design: [2-3 sentence summary of the visual design]
Components: [2-3 sentence summary of key components]
Responsive: [2-3 sentence summary of responsive strategy]
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
            "HTTP-Referer": "http://localhost:3000",
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