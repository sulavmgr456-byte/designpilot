import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { idea } = await req.json();

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: "Bearer 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",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `
You are a UX expert.

Generate a detailed UX blueprint for this idea: ${idea}

Respond EXACTLY in this format:

Layout:
Write 2-3 clear sentences.

Navigation:
Write 2-3 clear sentences.

Design:
Write 2-3 clear sentences.

Monetization:
Write 2-3 clear sentences.

Growth:
Write 2-3 clear sentences.

IMPORTANT:
- Do NOT leave any section empty
- Do NOT skip any section
`,
        },
      ],
    }),
  });

  const data = await response.json();
  console.log(data);

  return NextResponse.json(data);
}

