"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Leetcode from "./components/leetcode";
import Codeforces from "./components/codeforces";

export default function Page() {
  //keeping default mode - dark
  const [dark, setDark] = React.useState(true);
  const router = useRouter();
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const theme = localStorage.getItem("theme");
      setDark(
        theme === "dark" ||
          (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
  }, []);

  const toggleDark = () => {
    setDark((prev) => {
      const newTheme = !prev ? "dark" : "light";
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", newTheme);
        if (newTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
      return !prev;
    });
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-600 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="absolute top-4 right-4 flex items-center gap-4">
        <button
          onClick={() => router.push("/compare")}
          className="px-2 md:px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow"
        >
          <span className="md:hidden">🆚</span>
          <span className="hidden md:inline">Compare</span>
        </button>
        <div>
          <button
            className="px-2 md:px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow"
            onClick={toggleDark}
          >
            <span className="md:hidden">{dark ? "🌙" : "☀️"}</span>
            <span className="hidden md:inline">
              {dark ? "🌙 Dark" : "☀️ Light"}
            </span>
          </button>
        </div>
      </div>
      <h1 className="flex items-center justify-center text-3xl pt-20 md:py-12 md:text-5xl font-serif dark:text-gray-100">
        Streak-Reminder
      </h1>
      <div className="flex flex-col md:flex-row w-full items-center justify-center pb-8">
        <div className="w-full">
          <Leetcode />
        </div>
        <div className="w-full">
          <Codeforces />
        </div>
      </div>
    </div>
  );
}
