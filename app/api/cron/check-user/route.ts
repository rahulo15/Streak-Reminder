import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import axios from "axios";

// Helper: Check if a timestamp is from Today (Local Server Time)
const isSubmittedToday = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const today = new Date();

  // Compare full date string (e.g., "Fri Dec 13 2025") to avoid month-boundary bugs
  return date.toDateString() === today.toDateString();
};

async function handler(req: Request) {
  console.log("Cron Job: check-user route hit");
  try {
    // 1. Parse the incoming Job from QStash
    const body = await req.json();
    const { userId } = body;
    console.log(`Cron Job: Processing userId: ${userId}`);

    if (!userId) {
      console.log("Cron Job: Missing userId in request body");
      return new NextResponse("Missing userId", { status: 400 });
    }

    // 2. Fetch User Data from Database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // Check if user exists and has connected Telegram
    if (!user || !user.telegramChatId) {
      console.log(
        `Cron Job: User ${userId} not found or missing Telegram Chat ID`
      );
      return new NextResponse("User not configured or missing Telegram", {
        status: 200,
      });
    }
    console.log(`Cron Job: User found: ${user.id}, checking handles...`);

    // 3. Check LeetCode (if handle exists)
    let lcSolved = false;
    if (user.leetcodeHandle) {
      console.log(`Cron Job: Checking LeetCode for ${user.leetcodeHandle}`);
      try {
        const res = await fetch(
          `https://leetcode-stats-api.herokuapp.com/${user.leetcodeHandle}`,
          { cache: "no-store" }
        );

        if (res.ok) {
          const data = await res.json();
          const lastSubmissionKey = Object.keys(
            data.submissionCalendar || {}
          ).pop();

          if (lastSubmissionKey) {
            lcSolved = isSubmittedToday(Number(lastSubmissionKey));
          }
          console.log(`Cron Job: LeetCode solved today? ${lcSolved}`);
        } else {
          console.log(
            `Cron Job: LeetCode API failed for ${user.leetcodeHandle} with status ${res.status}`
          );
        }
      } catch (e) {
        console.error(`LeetCode check failed for ${user.leetcodeHandle}`, e);
      }
    } else {
      console.log("Cron Job: No LeetCode handle configured");
    }

    // 4. Check Codeforces (if handle exists)
    let cfSolved = false;
    if (user.codeforcesHandle) {
      console.log(`Cron Job: Checking Codeforces for ${user.codeforcesHandle}`);
      try {
        const res = await fetch(
          `https://codeforces.com/api/user.status?handle=${user.codeforcesHandle}&from=1&count=1`,
          { cache: "no-store" }
        );

        if (res.ok) {
          const data = await res.json();
          if (data.result && data.result.length > 0) {
            const lastSubmissionTime = data.result[0].creationTimeSeconds;
            cfSolved = isSubmittedToday(lastSubmissionTime);
          }
          console.log(`Cron Job: Codeforces solved today? ${cfSolved}`);
        } else {
          console.log(
            `Cron Job: Codeforces API failed for ${user.codeforcesHandle} with status ${res.status}`
          );
        }
      } catch (e) {
        console.error(
          `Codeforces check failed for ${user.codeforcesHandle}`,
          e
        );
      }
    } else {
      console.log("Cron Job: No Codeforces handle configured");
    }

    // 5. Logic: Should we send a reminder?
    // If they solved NEITHER, we nag them.
    // If they solved ONE, we encourage them to finish the other?
    // (Your original logic implied needing both, but here I'll alert if *either* is missing)

    const missedLeetCode = user.leetcodeHandle && !lcSolved;
    const missedCodeforces = user.codeforcesHandle && !cfSolved;

    console.log(
      `Cron Job: Status - Missed LC: ${missedLeetCode}, Missed CF: ${missedCodeforces}`
    );

    // If both are done (or not configured), we are good
    if (!missedLeetCode && !missedCodeforces) {
      console.log(`Cron Job: Streak maintained for user ${user.id}`);
      return NextResponse.json({ status: "Streak maintained" });
    }

    // Construct the message based on what is missing
    const missingPlatforms = [];
    if (missedLeetCode) missingPlatforms.push("LeetCode");
    if (missedCodeforces) missingPlatforms.push("Codeforces");

    const messageText = `Hello! 🚨 You haven't solved your questions yet on: ${missingPlatforms.join(
      " & "
    )}. Submit quickly to maintain your streak!`;

    // 6. Send Telegram Message
    // Note: We use the User's specific ChatID from DB, but your App's Bot Token
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    console.log(
      `Cron Job: Sending Telegram reminder to chat ${user.telegramChatId}`
    );

    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: user.telegramChatId,
      text: messageText,
    });

    console.log(`Reminder sent to user ${user.id}`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Worker failed:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 7. Security: Verify request comes from QStash
export const POST = verifySignatureAppRouter(handler);
