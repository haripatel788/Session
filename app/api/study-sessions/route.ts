import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, subjectName, duration, difficulty, notes } = body;

    // Basic validation
    if (!userId || !subjectName || !duration || !difficulty) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. Find existing subject for this user
    let subject = await prisma.subject.findFirst({
      where: {
        userId,
        name: subjectName,
      },
    });

    // 2. Create subject if it doesn't exist
    if (!subject) {
      subject = await prisma.subject.create({
        data: {
          name: subjectName,
          userId,
        },
      });
    }

    // 3. Create the study session
    const session = await prisma.studySession.create({
      data: {
        userId,
        subjectId: subject.id,
        duration,
        difficulty,
        notes,
      },
    });

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error("CREATE STUDY SESSION ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create study session" },
      { status: 500 }
    );
  }
}
