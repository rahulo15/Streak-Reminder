import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "../../lib/db";
import { NextResponse } from "next/server";

// GET: Fetch the user's current settings
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userProfile = await prisma.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    // If user doesn't exist in our DB yet, return null (frontend can show empty form)
    // or you could return a 404 if you prefer strict handling
    return NextResponse.json(userProfile || null);
  } catch (error) {
    console.error("[USER_GET_API_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// POST: Save or Update settings (Your previous code)
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { leetcodeId, codeforcesId, remindersEnabled } = body;

    const savedSettings = await prisma.user.upsert({
      where: {
        clerkUserId: userId,
      },
      update: {
        leetcodeHandle: leetcodeId,
        codeforcesHandle: codeforcesId,
        email: user.emailAddresses[0].emailAddress,
        remindersEnabled: remindersEnabled,
      },
      create: {
        clerkUserId: userId,
        email: user.emailAddresses[0].emailAddress,
        leetcodeHandle: leetcodeId,
        codeforcesHandle: codeforcesId,
        remindersEnabled: remindersEnabled,
      },
    });

    return NextResponse.json(savedSettings);
  } catch (error) {
    console.error("[USER_POST_API_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
