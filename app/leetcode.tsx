import { useState, useEffect } from "react";
import Check_lt from "./check_lt";
import { lt } from "./types";

export default function Leetcode() {
  const [data, setData] = useState<lt | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [inputUsername, setInputUsername] = useState<string>("");

  useEffect(() => {
    if (username) {
      setLoading(true);
      fetch(`https://leetcode-stats-api.herokuapp.com/${username}`)
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
        Leetcode
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
                <div>Total-Solved :</div>
                <div>{data?.totalSolved.toString()}</div>
              </div>
              <div className="flex gap-5 justify-center w-full p-3">
                <div>Easy-Solved :</div>
                <div>{data?.easySolved.toString()}</div>
              </div>
              <div className="flex gap-5 justify-center w-full p-3">
                <div>Medium-Solved :</div>
                <div>{data?.mediumSolved.toString()}</div>
              </div>
              <div className="flex gap-5 justify-center w-full p-3">
                <div>Hard-Solved :</div>
                <div>{data?.hardSolved.toString()}</div>
              </div>
              <Check_lt user={username} />
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
