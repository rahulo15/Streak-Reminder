import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { Client } from "@upstash/qstash";

// Initialize QStash Client
const qstash = new Client({ token: process.env.QSTASH_TOKEN! });

export async function GET(req: Request) {
  console.log("Cron Dispatch: Route hit");
  // Check for Vercel Cron Authentication
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.log("Cron Dispatch: Unauthorized attempt");
    return new NextResponse("Unauthorized", { status: 401 });
  }
  console.log("Cron Dispatch: Authorized");

  // 1. Get all active users
  const users = await prisma.user.findMany({
    where: { telegramChatId: { not: null } }, // Only users with Telegram connected
    select: { id: true },
  });
  console.log(
    `Cron Dispatch: Found ${users.length} users with Telegram connected`
  );

  // 2. Push to QStash
  // Note: VERCEL_PROJECT_PRODUCTION_URL is a default var, or use your domain
  const appUrl = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  console.log(`Cron Dispatch: Dispatching jobs to ${appUrl}`);

  const jobs = users.map((user) => {
    return qstash.publishJSON({
      url: `${appUrl}/api/cron/check-user`,
      body: { userId: user.id },
      // Spread requests over 10 minutes (600 seconds) to avoid rate limits
      delay: Math.floor(Math.random() * 600),
    });
  });

  await Promise.all(jobs);
  console.log(`Cron Dispatch: Successfully dispatched ${jobs.length} jobs`);

  return NextResponse.json({ dispatched: users.length });
}
