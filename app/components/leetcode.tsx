import { useState, useEffect } from "react";
import Check_lt from "./check_lt";
import { lt } from "../types";

export default function Leetcode({ userId = "rahul_o15", showCheck = true }) {
  const [data, setData] = useState<lt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Reset states on new userId
      setLoading(true);
      setError(null);
      setData(null);

      try {
        const res = await fetch(
          `https://leetcode-stats-api.herokuapp.com/${userId}`
        );
        if (!res.ok) {
          throw new Error(`API request failed with status ${res.status}`);
        }
        const jsonData: lt = await res.json();
        if (jsonData.status.toLowerCase() === "error") {
          throw new Error(jsonData.message || `User '${userId}' not found.`);
        }
        setData(jsonData);
      } catch (e: any) {
        setError(e.message || "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const difficultyColors = {
    easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-4">
      {loading ? (
        // Skeleton Loader
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-lg mx-auto font-sans animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center mb-8">
            <div className="h-16 bg-gray-50 dark:bg-gray-700 rounded-md"></div>
            <div className="h-16 bg-gray-50 dark:bg-gray-700 rounded-md"></div>
            <div className="h-16 bg-gray-50 dark:bg-gray-700 rounded-md"></div>
          </div>
          <div className="flex justify-between gap-4">
            <div className="h-16 bg-gray-50 dark:bg-gray-700 rounded-md w-full"></div>
            <div className="h-16 bg-gray-50 dark:bg-gray-700 rounded-md w-full"></div>
            <div className="h-16 bg-gray-50 dark:bg-gray-700 rounded-md w-full"></div>
          </div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mt-4"></div>
        </div>
      ) : error ? (
        // Error Message
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-lg mx-auto font-sans min-h-80 flex flex-col justify-center items-center">
          <h2 className="text-xl font-bold text-red-500 mb-2">
            Failed to load data
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      ) : (
        // Data Card
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-lg mx-auto font-sans min-h-80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              LeetCode Stats
            </h2>
            <span className="font-mono text-sm text-gray-500 dark:text-gray-400">
              {userId}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center mb-8">
            <div>
              <p className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100">
                {data?.totalSolved}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Total Solved
              </p>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100">
                {data?.ranking?.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Ranking
              </p>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100">
                {data?.acceptanceRate}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Acceptance
              </p>
            </div>
          </div>

          <div className="flex justify-between text-center gap-4">
            <div className={`p-2 rounded-md w-full ${difficultyColors.easy}`}>
              <p className="text-lg md:text-xl font-semibold">
                {data?.easySolved}
              </p>
              <p className="text-xs font-medium">Easy</p>
            </div>
            <div className={`p-2 rounded-md w-full ${difficultyColors.medium}`}>
              <p className="text-lg md:text-xl font-semibold">
                {data?.mediumSolved}
              </p>
              <p className="text-xs font-medium">Medium</p>
            </div>
            <div className={`p-2 rounded-md w-full ${difficultyColors.hard}`}>
              <p className="text-lg md:text-xl font-semibold">
                {data?.hardSolved}
              </p>
              <p className="text-xs font-medium">Hard</p>
            </div>
          </div>

          {showCheck && (
            <div className="mt-4 text-center">
              <Check_lt />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
