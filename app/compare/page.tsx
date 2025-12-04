"use client";

import React, { useState } from "react";
import Compare from "../components/comparetab";

function Page() {
  const [selectedPlatform, setSelectedPlatform] = useState("leetcode");
  const [id1, setId1] = useState("");
  const [id2, setId2] = useState("");
  const [submittedIds, setSubmittedIds] = useState<{
    id1: string;
    id2: string;
  } | null>(null);

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform);
    setId1("");
    setId2("");
    setSubmittedIds(null); // Clear comparison results when platform changes
  };

  const handleCompare = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault(); // Prevent form from reloading the page
    if (submittedIds?.id1 === id1 && submittedIds?.id2 === id2) {
      return; // Don't re-submit if the IDs are the same
    }
    setSubmittedIds({ id1, id2 });
  };

  return (
    <div className="w-full min-h-full">
      <h1 className="text-center text-2xl md:text-4xl pt-4 font-serif dark:text-gray-100 opacity-40">
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

      <form onSubmit={handleCompare}>
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
                  type="button"
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
                  type="button"
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
              type="submit"
              className={`px-8 py-2 text-base font-semibold text-white rounded-lg transition-colors shadow-lg ${
                id1 && id2 && id1 !== id2
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!id1 || !id2 || id1 === id2}
            >
              Compare both
            </button>
          </div>
        </div>
      </form>
      {submittedIds && (
        <Compare
          id1={submittedIds.id1}
          id2={submittedIds.id2}
          selectedPlatform={selectedPlatform}
        />
      )}
    </div>
  );
}

export default Page;
