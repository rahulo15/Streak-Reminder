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

  return (
    <div className="p-3 text-center">
      {check(time) ? "Streak maintained" : "Submit before time runs out"}
    </div>
  );
}
