"use client";

import { SignOutButton, UserButton } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <header className="flex flex-col items-center justify-between gap-4 p-2 md:flex-row md:p-4">
      <div className="flex w-full items-center justify-center gap-2 md:w-auto md:justify-start">
        <button
          onClick={() => router.back()}
          className="w-full rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80 dark:bg-gray-800 md:w-auto"
        >
          Back
        </button>
        {(pathname === "/compare" || pathname === "/modify") && (
          <button
            onClick={() => router.push("/")}
            className="w-full rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80 dark:bg-gray-800 md:w-auto"
          >
            Home
          </button>
        )}
        {pathname !== "/compare" && (
          <button
            onClick={() => router.push("/compare")}
            className="w-full rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80 dark:bg-gray-800 md:w-auto"
          >
            Compare
          </button>
        )}
        {pathname !== "/modify" && (
          <button
            onClick={() => router.push("/modify")}
            className="w-full rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80 dark:bg-gray-800 md:w-auto"
          >
            Modify
          </button>
        )}
      </div>
      <div className="flex items-center justify-center gap-2">
        <ThemeToggle />
        <SignOutButton>
          <button className="whitespace-nowrap rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/90">
            Sign Out
          </button>
        </SignOutButton>
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}
