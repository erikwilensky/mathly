import { NextResponse } from "next/server";
import { getDailyStreak, recordDailyVisit } from "@/lib/db";

export async function GET() {
  try {
    const streak = await getDailyStreak();
    return NextResponse.json(streak);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const streak = await recordDailyVisit();
    return NextResponse.json(streak);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
