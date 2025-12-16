import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

// Helper function to ensure user exists in database
async function ensureUserExists(userId: string) {
  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      // Get user email from Clerk
      const clerkUser = await currentUser();
      const email = clerkUser?.emailAddresses[0]?.emailAddress;

      if (!email) {
        throw new Error("No email found for user");
      }

      // Create user in database
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
    // If it's just a unique constraint error, user already exists - that's fine
    if (error instanceof Error && !error.message.includes("Unique constraint")) {
      throw error;
    }
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure user exists in database
    await ensureUserExists(userId);

    const body = await request.json();
    const { subjectName, duration, difficulty, notes } = body;

    if (!subjectName || !duration || !difficulty) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let subject = await prisma.subject.findFirst({
      where: {
        userId,
        name: subjectName,
      },
    });

    if (!subject) {
      subject = await prisma.subject.create({
        data: {
          name: subjectName,
          userId,
        },
      });
    }

    const session = await prisma.studySession.create({
      data: {
        userId,
        subjectId: subject.id,
        duration,
        difficulty,
        notes,
      },
      include: {
        subject: true,
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

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure user exists in database
    await ensureUserExists(userId);

    const sessions = await prisma.studySession.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { subject: true },
    });

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("GET STUDY SESSIONS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch study sessions" },
      { status: 500 }
    );
  }
}