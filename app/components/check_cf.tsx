import { useState, useEffect } from "react";
import { cf_check } from "../types";

export default function Check_cf() {
  const [data, setData] = useState<cf_check | null>(null);

  const check = (time: number) => {
    const timestampInMilliseconds = time * 1000;
    const date = new Date(timestampInMilliseconds);

    const day = date.getDate();
    const today = new Date().getDate();
    return day == today;
  };

  useEffect(() => {
    fetch(
      "https://codeforces.com/api/user.status?handle=rahul_o15&from=1&count=1"
    )
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  if (!data || data === null)
    return <div className="p-3 text-center">Unable to fetch!</div>;
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
      {check(time) ? "Streak maintained" : lastSubmittedString}
    </div>
  );
}
