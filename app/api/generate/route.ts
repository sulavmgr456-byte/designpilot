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
      model: "model: mistralai/mistral-7b-instruct",
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

