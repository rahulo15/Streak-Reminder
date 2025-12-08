"use client";

import React, { useEffect, useState } from "react";
import Leetcode from "./components/leetcode";
import Codeforces from "./components/codeforces";

export default function Page() {
  const [leetcodeId, setLeetcodeId] = useState<string | null>(null);
  const [codeforcesId, setCodeforcesId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserHandles = async () => {
      try {
        const response = await fetch("/api/modify"); // Re-using the GET endpoint
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setLeetcodeId(data.leetcodeHandle);
            setCodeforcesId(data.codeforcesHandle);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user handles:", error);
        // It's okay if this fails, the user might not have settings yet.
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserHandles();
  }, []);

  return (
    <>
      <h1 className="flex items-center justify-center text-3xl md:py-12 md:text-5xl font-serif dark:text-gray-100">
        Streak-Reminder
      </h1>
      {isLoading ? (
        <div className="text-center dark:text-gray-400">Loading data...</div>
      ) : (
        <>
          {leetcodeId || codeforcesId ? (
            <div className="flex flex-col md:flex-row w-full items-start justify-center pb-8">
              {leetcodeId && (
                <div className="w-full">
                  <Leetcode userId={leetcodeId} />
                </div>
              )}
              {codeforcesId && (
                <div className="w-full">
                  <Codeforces userId={codeforcesId} />
                </div>
              )}
            </div>
          ) : (
            <p className="mt-8 text-center text-gray-500 dark:text-gray-400">
              You can add LeetCode and Codeforces IDs by clicking on the Modify
              button on the top.
            </p>
          )}
        </>
      )}
    </>
  );
}
