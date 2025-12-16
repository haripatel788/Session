import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

// Helper function to ensure user exists in database
async function ensureUserExists(userId: string) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      const clerkUser = await currentUser();
      const email = clerkUser?.emailAddresses[0]?.emailAddress;

      if (!email) {
        throw new Error("No email found for user");
      }

      await prisma.user.create({
        data: {
          id: userId,
          email: email,
        },
      });

      console.log(`✅ Auto-created user in database: ${email}`);
    }
  } catch (error) {
    console.error("Error ensuring user exists:", error);
    if (error instanceof Error && !error.message.includes("Unique constraint")) {
      throw error;
    }
  }
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Ensure user exists in database
    await ensureUserExists(userId);

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
      const subjectName = s.subject.name;
      perSubject[subjectName] =
        (perSubject[subjectName] || 0) + s.duration;
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