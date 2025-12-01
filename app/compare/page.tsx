"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function Page() {
  const [selectedPlatform, setSelectedPlatform] = useState("leetcode");
  const [id1, setId1] = useState("");
  const [id2, setId2] = useState("");
  const [dark, setDark] = useState(true);
  const router = useRouter();

  useEffect(() => {
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

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform);
    setId1("");
    setId2("");
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-600 to-blue-100 dark:from-gray-900 dark:to-gray-800 pt-12">
      <div className="absolute top-4 left-4">
        <button
          onClick={() => router.back()}
          className="px-2 md:px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow"
        >
          &larr; Back
        </button>
      </div>
      <div className="absolute top-4 right-4">
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

      <h1 className="text-center text-2xl md:text-4xl font-serif dark:text-gray-100 opacity-40">
        Streak-Reminder
      </h1>

      <div className="mt-8 flex justify-center items-center gap-4">
        <button
          onClick={() => handlePlatformChange("leetcode")}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
            selectedPlatform === "leetcode"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg"
              : "bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-400"
          }`}
        >
          LeetCode
        </button>
        <button
          onClick={() => handlePlatformChange("codeforces")}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
            selectedPlatform === "codeforces"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg"
              : "bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-400"
          }`}
        >
          Codeforces
        </button>
      </div>

      <div className="mt-6 w-full max-w-md mx-auto px-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="id1"
              value={id1}
              onChange={(e) => setId1(e.target.value)}
              className="w-full px-4 pr-10 py-2 text-gray-900 dark:text-white bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
            {id1 && (
              <button
                onClick={() => setId1("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              >
                &#x2715;
              </button>
            )}
          </div>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="id2"
              value={id2}
              onChange={(e) => setId2(e.target.value)}
              className="w-full px-4 pr-10 py-2 text-gray-900 dark:text-white bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
            {id2 && (
              <button
                onClick={() => setId2("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              >
                &#x2715;
              </button>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <button
            className={`px-8 py-2 text-base font-semibold text-white rounded-lg transition-colors shadow-lg ${
              id1 && id2
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!id1 || !id2}
          >
            Compare both
          </button>
        </div>
      </div>
    </div>
  );
}

export default Page;
