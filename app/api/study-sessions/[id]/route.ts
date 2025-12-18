import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const session = await prisma.studySession.findUnique({
      where: { id },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    if (session.userId !== userId) {
      return NextResponse.json(
        { error: "You don't have permission to delete this session" },
        { status: 403 }
      );
    }

    await prisma.studySession.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE STUDY SESSION ERROR:", error);
    return NextResponse.json(
      { error: "Failed to delete study session" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { subjectName, duration, difficulty, notes } = body;

    const session = await prisma.studySession.findUnique({
      where: { id },
      include: { subject: true },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    if (session.userId !== userId) {
      return NextResponse.json(
        { error: "You don't have permission to edit this session" },
        { status: 403 }
      );
    }

    let subjectId = session.subjectId;

    if (subjectName && subjectName !== session.subject.name) {
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

      subjectId = subject.id;
    }

    const updatedSession = await prisma.studySession.update({
      where: { id },
      data: {
        subjectId,
        duration: duration ?? session.duration,
        difficulty: difficulty ?? session.difficulty,
        notes: notes ?? session.notes,
      },
      include: {
        subject: true,
      },
    });

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error("UPDATE STUDY SESSION ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update study session" },
      { status: 500 }
    );
  }
}