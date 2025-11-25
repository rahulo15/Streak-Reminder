"use client";

import React from "react";
import Leetcode from "./components/leetcode";
import Codeforces from "./components/leetcode";

export default function Page() {
  const [dark, setDark] = React.useState(false);
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
    <div className="w-screen h-screen bg-gradient-to-b from-blue-600 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="absolute top-4 right-4">
        <button
          className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow"
          onClick={toggleDark}
        >
          {dark ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
      <h1 className="flex items-center justify-center text-3xl md:text-5xl h-1/6 font-serif dark:text-gray-100">
        Streak-Reminder
      </h1>
      <div className="flex-row md:flex h-auto md:h-5/6 w-full">
        <div className="h-full w-full">
          <Leetcode />
        </div>
        <div className="h-full w-full">
          <Codeforces />
        </div>
      </div>
    </div>
  );
}
