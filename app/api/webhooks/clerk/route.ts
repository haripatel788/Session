import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add CLERK_WEBHOOK_SECRET to .env");
  }

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing svix headers", { status: 400 });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create new Svix instance with secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify webhook
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification failed", { status: 400 });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses } = evt.data;
    const email = email_addresses[0]?.email_address;

    if (!email) {
      return new Response("Error: No email found", { status: 400 });
    }

    try {
      await prisma.user.create({
        data: {
          id: id,
          email: email,
        },
      });

      console.log(`✅ User created in database: ${email}`);
    } catch (error) {
      console.error("Error creating user:", error);
      // If user already exists, that's okay
      if (error instanceof Error && error.message.includes("Unique constraint")) {
        console.log("User already exists, skipping");
      } else {
        return new Response("Error: Failed to create user", { status: 500 });
      }
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;

    try {
      // Delete all user data
      await prisma.studySession.deleteMany({
        where: { userId: id || "" },
      });

      await prisma.subject.deleteMany({
        where: { userId: id || "" },
      });

      await prisma.user.delete({
        where: { id: id || "" },
      });

      console.log(`✅ User deleted from database: ${id}`);
    } catch (error) {
      console.error("Error deleting user:", error);
      return new Response("Error: Failed to delete user", { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}