"use client";

import React, { useState, useEffect } from "react";
import { lt, cf } from "../types";
import Leetcode from "./leetcode";
import Codeforces from "./codeforces";

const ComparisonRow = ({
  stat,
  val1,
  val2,
}: {
  stat: string;
  val1: number | string;
  val2: number | string;
}) => {
  const num1 = Number(val1) || 0;
  const num2 = Number(val2) || 0;
  const val1Color = num1 > num2 ? "text-green-500" : "text-inherit";
  const val2Color = num2 > num1 ? "text-green-500" : "text-inherit";

  return (
    <>
      <div className="text-left text-gray-600 dark:text-gray-400">{stat}</div>
      <div
        className={`font-semibold ${stat == "Ranking" ? val2Color : val1Color}`}
      >
        {val1}
      </div>
      <div
        className={`font-semibold ${stat == "Ranking" ? val1Color : val2Color}`}
      >
        {val2}
      </div>
    </>
  );
};

export default function CompareTab({
  id1,
  id2,
  selectedPlatform,
}: {
  id1: string;
  id2: string;
  selectedPlatform: string;
}) {
  const [data1, setData1] = useState<lt | cf | null>(null);
  const [data2, setData2] = useState<lt | cf | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setData1(null);
      setData2(null);
      let urls: [string, string];
      if (selectedPlatform === "leetcode") {
        urls = [
          `https://leetcode-stats-api.herokuapp.com/${id1}`,
          `https://leetcode-stats-api.herokuapp.com/${id2}`,
        ];
      } else {
        urls = [
          `https://codeforces.com/api/user.info?handles=${id1}&checkHistoricHandles=false`,
          `https://codeforces.com/api/user.info?handles=${id2}&checkHistoricHandles=false`,
        ];
      }

      try {
        const [res1, res2] = await Promise.all(urls.map((url) => fetch(url)));

        if (!res1.ok || !res2.ok) {
          throw new Error("One or both API requests failed.");
        }

        const [d1, d2] = await Promise.all([res1.json(), res2.json()]);

        if (selectedPlatform === "leetcode") {
          if ((d1 as lt).status === "error" || (d2 as lt).status === "error")
            throw new Error("Something went wrong!");
        } else {
          if (
            (d1 as cf).status.toLowerCase() === "failed" ||
            (d2 as cf).status.toLowerCase() === "failed"
          )
            throw new Error("Something went wrong!");
        }

        setData1(d1);
        setData2(d2);
      } catch (e: any) {
        console.error("Failed to fetch comparison data:", e);
        setError(e.message || "Could not fetch comparison data.");
        setData1(null);
        setData2(null);
      } finally {
        setLoading(false);
      }
    };

    if (id1 && id2) {
      fetchData();
    }
  }, [id1, id2, selectedPlatform]);

  if (loading)
    return (
      <div className="flex space-x-2 justify-center items-center pt-20">
        <div className="h-5 w-5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
        <div className="h-5 w-5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-5 w-5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
        <div className="h-5 w-5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.1s]"></div>
        <div className="h-5 w-5 bg-blue-400 rounded-full animate-bounce"></div>
      </div>
    );

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
          <h3 className="text-xl font-bold text-red-500 mb-2">
            Comparison Failed
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  const renderLeetCodeComparison = () => {
    const user1 = data1 as lt;
    const user2 = data2 as lt;
    if (
      user1.status.toLowerCase() === "error" ||
      user2.status.toLowerCase() === "error"
    )
      return null;
    return (
      <>
        <ComparisonRow
          stat="Ranking"
          val1={user1.ranking}
          val2={user2.ranking}
        />
        <ComparisonRow
          stat="Total Solved"
          val1={user1.totalSolved}
          val2={user2.totalSolved}
        />
        <ComparisonRow
          stat="Easy Solved"
          val1={user1.easySolved}
          val2={user2.easySolved}
        />
        <ComparisonRow
          stat="Medium Solved"
          val1={user1.mediumSolved}
          val2={user2.mediumSolved}
        />
        <ComparisonRow
          stat="Hard Solved"
          val1={user1.hardSolved}
          val2={user2.hardSolved}
        />
        <ComparisonRow
          stat="Acceptance Rate"
          val1={`${user1.acceptanceRate}%`}
          val2={`${user2.acceptanceRate}%`}
        />
      </>
    );
  };

  const renderCodeforcesComparison = () => {
    const user1 = (data1 as cf).result?.[0];
    const user2 = (data2 as cf).result?.[0];
    if (!user1 || !user2) return <p>One or both users not found.</p>;
    return (
      <>
        <ComparisonRow stat="Rating" val1={user1.rating} val2={user2.rating} />
        <ComparisonRow
          stat="Max Rating"
          val1={user1.maxRating}
          val2={user2.maxRating}
        />
      </>
    );
  };

  return (
    // The check for `data1` and `data2` ensures this only renders on success
    data1 &&
    data2 && (
      <>
        <div className="flex flex-col md:flex-row w-full items-start justify-center gap-8 pt-8 pb-8">
          <div className="w-full">
            {selectedPlatform === "leetcode" ? (
              <Leetcode userId={id1} showCheck={false} />
            ) : (
              <Codeforces userId={id1} showCheck={false} />
            )}
          </div>
          <div className="w-full">
            {selectedPlatform === "leetcode" ? (
              <Leetcode userId={id2} showCheck={false} />
            ) : (
              <Codeforces userId={id2} showCheck={false} />
            )}
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto px-4 pb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 font-sans">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
              Comparison Summary
            </h3>
            <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-center">
              <div className="font-semibold text-gray-500 dark:text-gray-400 text-left border-b pb-2 dark:border-gray-600">
                Stat
              </div>
              <div className="font-semibold text-gray-900 dark:text-white border-b pb-2 dark:border-gray-600">
                {id1}
              </div>
              <div className="font-semibold text-gray-900 dark:text-white border-b pb-2 dark:border-gray-600">
                {id2}
              </div>

              {selectedPlatform === "leetcode"
                ? renderLeetCodeComparison()
                : renderCodeforcesComparison()}
            </div>
          </div>
        </div>
      </>
    )
  );
}
