import axios from "axios";
import { lt, cf_check } from "../../types";
import { NextResponse } from "next/server";

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
const user = process.env.USER;

const check = (time: number) => {
  const timestampInMilliseconds = time * 1000;
  const date = new Date(timestampInMilliseconds);

  const day = date.getDate();
  const today = new Date().getDate();
  return day == today;
};

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const leetcode_data: lt = await fetch(
    `https://leetcode-stats-api.herokuapp.com/${user}`,
    { cache: "no-store" }
  ).then((res) => res.json());

  const codeforces_data: cf_check = await fetch(
    `https://codeforces.com/api/user.status?handle=${user}&from=1&count=1`,
    { cache: "no-store" }
  ).then((res) => res.json());

  const leetcode_time = Number(
    Object.keys(leetcode_data.submissionCalendar).pop()
  );

  const codeforces_time = Number(codeforces_data.result[0].creationTimeSeconds);

  let bool1: boolean = check(leetcode_time);
  let bool2: boolean = check(codeforces_time);

  if (bool1 && bool2)
    return NextResponse.json({ body: "streak has already been maintained" });

  console.log("cron job running");

  const messageText: string = `Hello, submit quickly to maintain your streak on ${
    !bool1 ? "leetcode" : ""
  }${!bool1 && !bool2 ? " && " : ""}${!bool2 ? "codeforces" : ""}`;

  try {
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
    console.log("Failed to send message:", error);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
