import { useState, useEffect } from "react";
import { lt } from "../types";

export default function Check_lt({ userId }: { userId: string }) {
  const [data, setData] = useState<lt | null>(null);
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
          `https://leetcode-stats-api.herokuapp.com/${userId}`
        );
        if (!res.ok) {
          throw new Error(`API failed with status: ${res.status}`);
        }
        const jsonData: lt = await res.json();
        if (jsonData.status.toLowerCase() === "error") {
          throw new Error(jsonData.message || "User not found.");
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

  if (!data || !data.submissionCalendar) return null;

  const timeKey = Object.keys(data.submissionCalendar).pop();
  if (!timeKey) {
    return <div className="p-3 text-center">No submissions found.</div>;
  }

  const time = Number(timeKey);
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
