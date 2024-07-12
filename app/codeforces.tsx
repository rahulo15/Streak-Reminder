import { useState, useEffect } from "react";
import Check_cf from "./check_cf";
import { cf } from "./types";

export default function Codeforces() {
  const [data, setData] = useState<cf | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [inputUsername, setInputUsername] = useState<string>("");

  useEffect(() => {
    if (username) {
      setLoading(true);
      fetch(
        `https://codeforces.com/api/user.info?handles=${username}&checkHistoricHandles=false`
      )
        .then((res) => res.json())
        .then((data) => {
          setData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
    }
  }, [username]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputUsername(e.target.value);
  };

  const handleSubmit = () => {
    setUsername(inputUsername);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <h2 className="text-xl md:text-4xl h-1/6 w-3/4 bg-white bg-opacity-25 flex items-center justify-center rounded-md font-mono">
        Codeforces
      </h2>
      <div className="h-5/6">
        {username ? (
          isLoading ? (
            <div className="flex items-center justify-center p-5">Loading...</div>
          ) : (
            <>
              <div className="flex gap-5 justify-center w-full p-3">
                <div>ID :</div>
                <div>{username}</div>
              </div>
              <div className="flex gap-5 justify-center w-full p-3">
                <div>Max-Rating :</div>
                <div>{data?.result[0].maxRating.toString()}</div>
              </div>
              <div className="flex gap-5 justify-center w-full p-3">
                <div>Max-Rank :</div>
                <div>{data?.result[0].maxRank}</div>
              </div>
              <div className="flex gap-5 justify-center w-full p-3">
                <div>Rating :</div>
                <div>{data?.result[0].rating.toString()}</div>
              </div>
              <div className="flex gap-5 justify-center w-full p-3">
                <div>Rank :</div>
                <div>{data?.result[0].rank}</div>
              </div>
              <Check_cf user={username} />
            </>
          )
        ) : (
          <>
            <div className="flex items-center justify-center p-5">Enter Username:</div>
            <input
              type="text"
              className="p-3"
              value={inputUsername}
              onChange={handleInputChange}
            />
            <button className="p-3" onClick={handleSubmit}>
              Submit
            </button>
          </>
        )}
      </div>
    </div>
  );
}
