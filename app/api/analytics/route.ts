import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const sessions = await prisma.studySession.findMany({
      where: { userId },
      include: { subject: true },
    });

    const totalMinutes = sessions.reduce(
      (sum, s) => sum + s.duration,
      0
    );

    const avgDifficulty =
      sessions.length === 0
        ? 0
        : sessions.reduce((sum, s) => sum + s.difficulty, 0) /
          sessions.length;

    const perSubject: Record<string, number> = {};

    for (const s of sessions) {
      const name = s.subject.name;
      perSubject[name] = (perSubject[name] || 0) + s.duration;
    }

    return NextResponse.json({
      totalMinutes,
      avgDifficulty: Number(avgDifficulty.toFixed(2)),
      perSubject,
    });
  } catch (error) {
    console.error("ANALYTICS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to compute analytics" },
      { status: 500 }
    );
  }
}
