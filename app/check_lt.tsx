import { useState, useEffect } from "react";
import { lt } from "./types";

const Check_lt = ({ user }: { user: string }) => {
  const [data, setData] = useState<lt | null>(null);

  const check = (time: number) => {
    const timestampInMilliseconds = time * 1000;
    const date = new Date(timestampInMilliseconds);

    const day = date.getDate();
    const today = new Date().getDate();
    return day === today;
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${user}`);

        if (!res.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await res.json();
        setData(data);
      } catch (error) {
        console.log("Error:", error);
      }
    };

    fetchDetails();
  }, [user]);

  if (!data || data === null || data.status === "error") {
    return <div className="p-3 text-center">Unable to fetch!</div>;
  }

  const time = Number(Object.keys(data.submissionCalendar).pop());

  return (
    <div className="p-3 text-center">
      {check(time) ? "Streak maintained" : "Submit before time runs out"}
    </div>
  );
}

export default Check_lt;
