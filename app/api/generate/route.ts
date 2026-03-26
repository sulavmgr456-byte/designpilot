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

    const systemPrompt = `You are DesignPilot AI — the world's most opinionated UI/UX prompt engineer. You generate prompts so specific and design-forward that the output looks built by a senior designer — not an AI.

USER'S PROJECT:
${contextParts}

STRICT RULES:
- Never use generic terms like "modern" or "clean" — be specific
- Always provide exact hex color codes — never say just "blue"
- Every component needs exact styles, hover states, and behavior
- Typography must include font name, weight, and size
- Animations must include exact timing and easing values
- If user chose Cinematic animations: include staggered reveals, smooth page transitions, filmic scroll behavior with exact cubic-bezier values
- If user chose 3D animations: include Three.js floating elements, perspective transforms, depth layers, parallax
- If user chose Frontend only: include only HTML/CSS/JS or React components
- If user chose Full Stack: include database schema suggestion, API routes, auth flow
- If user chose With Authentication: include login/signup UI, protected routes, session handling
- Number of pages requested: generate layout description for EACH page separately
- If inspiration site provided: reference its design language, spacing philosophy, and component style
- Match prompt detail level exactly: Quick=150 words, Detailed=400 words, Expert=600+ words
- The prompt must feel handcrafted for this exact project — not templated

FORMAT EXACTLY LIKE THIS:

PROMPT_START
[Complete ready-to-paste prompt. Start with "Build a..." Include: exact color palette with hex codes, typography system, layout structure, navigation, hero section, all requested pages, components with hover states, animations with timing, responsive breakpoints, technical stack based on backend choice]
PROMPT_END

DESIGN_BRIEF_START
Layout: [Specific layout for this project]
Navigation: [Nav recommendation for this audience]
Design: [Color and typography rationale]
Components: [3-4 most important components for this project]
Responsive: [Responsive strategy for their platform]
Stack: [Technical stack recommendation based on backend choice]
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