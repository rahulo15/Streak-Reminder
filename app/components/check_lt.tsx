import { useState, useEffect } from "react";
import { lt } from "../types";

export default function Check_lt() {
  const [data, setData] = useState<lt | null>(null);

  const check = (time: number) => {
    const timestampInMilliseconds = time * 1000;
    const date = new Date(timestampInMilliseconds);

    const day = date.getDate();
    const today = new Date().getDate();
    return day == today;
  };

  useEffect(() => {
    fetch("https://leetcode-stats-api.herokuapp.com/rahul_o15")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  if (!data || data === null || data.status == "error")
    return <div className="p-3 text-center">Unable to fetch!</div>;
  const time = Number(Object.keys(data.submissionCalendar).pop());
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
      {check(time) ? "Streak maintained" : lastSubmittedString}
    </div>
  );
}
