"use client";

import { SignOutButton, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const router = useRouter();

  return (
    <header className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="dark:bg-gray-800 rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
        >
          Back
        </button>
        <button
          onClick={() => router.push("/compare")}
          className="dark:bg-gray-800 rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
        >
          Compare
        </button>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <SignOutButton>
          <button className="rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/90">
            Sign Out
          </button>
        </SignOutButton>
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}
