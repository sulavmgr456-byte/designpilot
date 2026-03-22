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
Give a UX blueprint for this idea: ${idea}

Respond STRICTLY in this format:

Layout:
...

Navigation:
...

Design:
...

Monetization:
...

Growth:
...
`,
        },
      ],
    }),
  });

  const data = await response.json();

  return NextResponse.json(data);
}