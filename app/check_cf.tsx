import { useState, useEffect } from "react";
import { cf_check } from "./types";

const Check_cf = ({ user }: { user: string }) => {
  const [data, setData] = useState<cf_check | null>(null);

  const check = (time: number) => {
    const timestampInMilliseconds = time * 1000;
    const date = new Date(timestampInMilliseconds);

    const day = date.getDate();
    const today = new Date().getDate();
    return day == today;
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(
      `https://codeforces.com/api/user.status?handle=${user}&from=1&count=1`
    )
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

  if (!data || data === null)
    return <div className="p-3 text-center">Unable to fetch!</div>;
  const time = Number(data.result[0].creationTimeSeconds);

  return (
    <div className="p-3 text-center">
      {check(time) ? "Streak maintained" : "Submit before time runs out"}
    </div>
  );
}

export default Check_cf;
