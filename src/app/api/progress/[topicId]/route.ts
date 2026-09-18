import { NextResponse } from "next/server";
import { getProgress, saveProgress, type TopicProgressRow } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = await params;
  try {
    const progress = await getProgress(topicId);
    return NextResponse.json(progress);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = await params;
  try {
    const body = (await req.json()) as TopicProgressRow;
    await saveProgress(topicId, body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
