import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  const { poly, level, studentAttempt } = (await req.json()) as {
    poly?: string;
    level?: string;
    studentAttempt?: string;
  };

  if (!poly) {
    return NextResponse.json({ hint: "Missing problem to give a hint for." }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      hint: "The AI tutor isn't connected yet — set OPENAI_API_KEY to enable it. Try a built-in hint in the meantime.",
    });
  }

  try {
    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a patient, encouraging 10th-grade algebra tutor. The student is factoring a quadratic expression. " +
            "Give ONE short, specific hint (2-3 sentences max) that nudges them toward the next step without revealing the full answer. " +
            "Never just state the final factored form.",
        },
        {
          role: "user",
          content: `Level: ${level ?? "unknown"}\nExpression to factor: ${poly}\nStudent's current attempt: ${
            studentAttempt || "(nothing entered yet)"
          }\nGive a hint for their next step.`,
        },
      ],
      max_tokens: 150,
      temperature: 0.6,
    });
    const hint = completion.choices[0]?.message?.content?.trim() || "Try breaking the expression into factor pairs.";
    return NextResponse.json({ hint });
  } catch {
    return NextResponse.json({ hint: "The AI tutor hit an error — try a built-in hint instead." }, { status: 502 });
  }
}
