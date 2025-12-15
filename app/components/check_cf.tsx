import { useState, useEffect } from "react";
import { cf_check } from "../types";

export default function Check_cf({ userId }: { userId: string }) {
  const [data, setData] = useState<cf_check | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isToday = (time: number) => {
    const timestampInMilliseconds = time * 1000;
    const date = new Date(timestampInMilliseconds);

    const day = date.getDate();
    const today = new Date().getDate();
    return day == today;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://codeforces.com/api/user.status?handle=${userId}&from=1&count=1`
        );
        if (!res.ok) {
          throw new Error(`API failed with status: ${res.status}`);
        }
        const jsonData: cf_check = await res.json();
        if (
          jsonData.status.toLowerCase() !== "ok" ||
          !jsonData.result?.length
        ) {
          throw new Error("User not found or no submissions.");
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

  if (loading) {
    return <div className="p-3 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-3 text-center text-red-500">Error: {error}</div>;
  }

  if (!data) return null; // Should not happen if loading and error are handled

  const time = Number(data.result[0].creationTimeSeconds);
  const lastSubmissionDate = new Date(time * 1000);
  const day = String(lastSubmissionDate.getDate()).padStart(2, "0");
  const month = String(lastSubmissionDate.getMonth() + 1).padStart(2, "0");
  const year = lastSubmissionDate.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  const lastSubmittedString = `Last submitted on ${formattedDate} at ${lastSubmissionDate.toLocaleTimeString(
    [],
    { hour: "2-digit", minute: "2-digit" }
  )}`;

  return (
    <div className="p-3 text-center">
      {isToday(time) ? "Streak maintained" : lastSubmittedString}
    </div>
  );
}
