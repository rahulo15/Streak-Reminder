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

  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <h2 className="text-xl md:text-4xl h-1/6 w-3/4 bg-white bg-opacity-25 dark:bg-gray-800 dark:bg-opacity-60 flex items-center justify-center rounded-md font-mono dark:text-gray-100">
        Codeforces
      </h2>
      <div className="h-5/6">
        {!isLoading ? (
          <>
            <div className="flex gap-5 justify-center w-full p-3 dark:text-gray-100">
              <div>ID :</div>
              <div>rahul_o15</div>
            </div>
            <div className="flex gap-5 justify-center w-full p-3 dark:text-gray-100">
              <div>Max-Rating :</div>
              <div>{data?.result[0].maxRating.toString()}</div>
            </div>
            <div className="flex gap-5 justify-center w-full p-3 dark:text-gray-100">
              <div>Max-Rank :</div>
              <div>{data?.result[0].maxRank}</div>
            </div>
            <div className="flex gap-5 justify-center w-full p-3 dark:text-gray-100">
              <div>Rating :</div>
              <div>{data?.result[0].rating.toString()}</div>
            </div>
            <div className="flex gap-5 justify-center w-full p-3 dark:text-gray-100">
              <div>Rank :</div>
              <div>{data?.result[0].rank}</div>
            </div>
            <Check_cf />
          </>
        ) : (
          <div className="flex items-center justify-center p-5 dark:text-gray-100">
            Loading..
          </div>
        )}
      </div>
    </div>
  );
}
