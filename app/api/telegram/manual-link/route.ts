import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "../../../lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress || "";
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { refCode } = await req.json(); // The code we showed the user (e.g., "user-123")

  const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

  // 1. Fetch recent updates from Telegram (Polling)
  const telegramRes = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_TOKEN}/getUpdates`
  );
  const telegramData = await telegramRes.json();

  if (!telegramData.ok) {
    return NextResponse.json({ success: false, error: "Telegram API Error" });
  }

  // 2. Loop through messages to find the one with our RefCode
  // We look for text like: "/start user-123"
  const updates = telegramData.result;
  let foundChatId = null;

  for (const update of updates) {
    if (update.message && update.message.text) {
      const text = update.message.text;

      // Check if message contains our specific code
      if (text.includes(refCode)) {
        foundChatId = update.message.chat.id.toString();
        break; // Found it!
      }
    }
  }

  // 3. If found, save to DB
  if (foundChatId) {
    await prisma.user.upsert({
      where: { clerkUserId: userId },
      // If user exists: Just update the chat ID
      update: {
        telegramChatId: foundChatId,
      },
      // If user is MISSING: Create them from scratch
      create: {
        clerkUserId: userId,
        email: email,
        telegramChatId: foundChatId,
        // Initialize other fields as empty/null if needed
        leetcodeHandle: null,
        codeforcesHandle: null,
      },
    });

    // Optional: Send a confirmation "Hello" to the user
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: foundChatId,
        text: "✅ Connected successfully!",
      }),
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({
    success: false,
    message: "Message not found yet. Try again.",
  });
}
