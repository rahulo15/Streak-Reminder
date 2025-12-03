"use client";

import React from "react";
import Leetcode from "./components/leetcode";
import Codeforces from "./components/codeforces";

export default function Page() {
  return (
    <>
      <h1 className="flex items-center justify-center text-3xl md:py-12 md:text-5xl font-serif dark:text-gray-100">
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
    </>
  );
}
