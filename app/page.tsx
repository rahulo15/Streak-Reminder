import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignInButton } from "@clerk/nextjs";
import Image from "next/image";

export default async function LandingPage() {
  const { userId } = await auth();

  // 1. If user is already logged in, send them to the Dashboard
  if (userId) {
    redirect("/home");
  }

  // 2. If not logged in, show the Landing Page (Moved from layout.tsx)
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="mb-6 relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:mb-8">
        <Image
          src="/icon.svg"
          alt="Streak Reminder Logo"
          fill
          className="object-contain drop-shadow-2xl"
          priority
        />
      </div>
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white drop-shadow-md">
        Streak-Reminder
      </h1>
      <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-blue-50 dark:text-gray-300 max-w-xs sm:max-w-2xl drop-shadow-sm px-2">
        Stay consistent and build your DSA/CP streak.
      </p>
      <div className="mt-8 sm:mt-10">
        <SignInButton mode="modal">
          <button className="rounded-full bg-white px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold text-blue-600 shadow-xl transition-all hover:bg-blue-50 hover:scale-105 hover:shadow-2xl dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500">
            Sign In to Get Started
          </button>
        </SignInButton>
      </div>
    </div>
  );
}
