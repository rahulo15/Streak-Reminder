import { useState, useEffect } from "react";
import Check_cf from "./check_cf";
import { cf } from "../types";

export default function Codeforces() {
  const [data, setData] = useState<cf | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      "https://codeforces.com/api/user.info?handles=rahul_o15&checkHistoricHandles=false"
    )
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  const getRankColor = (rank: string | undefined) => {
    if (!rank) return "text-gray-500";
    if (rank.includes("Grandmaster")) return "text-red-500";
    if (rank.includes("Master")) return "text-yellow-500";
    return "text-gray-500"; // Default color
  };

  const user: any = data?.result[0];
  const rankColor = getRankColor(user?.rank);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-4">
      {isLoading ? (
        // Skeleton Loader
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-lg mx-auto font-sans animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          </div>
          <div className="text-center bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-8">
            <div className="h-10 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mx-auto"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-1/3 mx-auto mt-2"></div>
          </div>
          <div className="h-20 bg-gray-50 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mt-4"></div>
        </div>
      ) : (
        // Data Card
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-lg mx-auto font-sans min-h-80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              Codeforces Stats
            </h2>
            <span className="font-mono text-sm text-gray-500 dark:text-gray-400">
              {user?.handle}
            </span>
          </div>

          <div className="text-center bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-8">
            <p className={`text-3xl md:text-4xl font-bold ${rankColor}`}>
              {user?.rating}
            </p>
            <p className={`text-base md:text-lg font-semibold ${rankColor}`}>
              {user?.rank}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Peak Performance
            </h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100">
                  {user?.maxRating}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Max Rating
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {user?.maxRank}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Max Rank
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <Check_cf />
          </div>
        </div>
      )}
    </div>
  );
}
