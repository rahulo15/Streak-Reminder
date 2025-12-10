import axios from "axios";
import { lt, cf_check } from "../../types";
import { NextResponse } from "next/server";

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

if (!botToken || !chatId) {
  console.error(
    "Missing environment variables: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID"
  );
}

const check = (time: number) => {
  const timestampInMilliseconds = time * 1000;
  const date = new Date(timestampInMilliseconds);

  const day = date.getDate();
  const today = new Date().getDate();
  return day == today;
};

export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    const leetcode_res = await fetch(
      "https://leetcode-stats-api.herokuapp.com/rahul_o15",
      { cache: "no-store" }
    );
    if (!leetcode_res.ok) {
      throw new Error(
        `LeetCode API failed with status: ${leetcode_res.status}`
      );
    }
    const leetcode_data: lt = await leetcode_res.json();

    const codeforces_res = await fetch(
      "https://codeforces.com/api/user.status?handle=rahul_o15&from=1&count=1",
      { cache: "no-store" }
    );
    if (!codeforces_res.ok) {
      throw new Error(
        `Codeforces API failed with status: ${codeforces_res.status}`
      );
    }
    const codeforces_data: cf_check = await codeforces_res.json();

    const leetcode_time_key = Object.keys(
      leetcode_data.submissionCalendar || {}
    ).pop();
    if (!leetcode_time_key) {
      throw new Error("Could not find last LeetCode submission time.");
    }
    const leetcode_time = Number(leetcode_time_key);

    if (
      !codeforces_data.result ||
      Object.keys(codeforces_data.result[0]).length === 0
    ) {
      throw new Error("Could not find last Codeforces submission.");
    }
    const codeforces_time = Number(
      codeforces_data.result[0].creationTimeSeconds
    );

    let bool1: boolean = check(leetcode_time);
    let bool2: boolean = check(codeforces_time);

    if (bool1 && bool2) {
      return NextResponse.json({ body: "streak has already been maintained" });
    }

    console.log("cron job running to send reminder");

    const messageText: string = `Hello, submit quickly to maintain your streak on ${
      !bool1 ? "leetcode" : ""
    }${!bool1 && !bool2 ? " && " : ""}${!bool2 ? "codeforces" : ""}`;

    if (!botToken || !chatId) {
      throw new Error("Telegram bot token or chat ID is not configured.");
    }

    const response = await axios.post(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        chat_id: chatId,
        text: messageText,
      }
    );

    console.log("Message sent successfully");
    return NextResponse.json(
      { success: true, body: response.data },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Cron job failed:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
