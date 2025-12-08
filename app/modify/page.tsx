"use client";

import React, { useState, useEffect } from "react";

function ModifyPage() {
  const [leetcodeId, setLeetcodeId] = useState("");
  const [codeforcesId, setCodeforcesId] = useState("");
  const [telegramChatId, setTelegramChatId] = useState("");
  const [telegramBotToken, setTelegramBotToken] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Start true for initial fetch
  const [showToken, setShowToken] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch existing user data when the component loads
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/modify");
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setLeetcodeId(data.leetcodeHandle || "");
            setCodeforcesId(data.codeforcesHandle || "");
            setTelegramChatId(data.telegramChatId || "");
            setTelegramBotToken(data.telegramBotToken || "");
          }
        }
      } catch (err) {
        // It's okay if this fails, the user might not have settings yet.
        console.error("Failed to fetch user settings:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    //have to encrypt chatid and bottoken
    try {
      const response = await fetch("/api/modify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leetcodeId,
          codeforcesId,
          telegramChatId,
          telegramBotToken,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to save settings. Please try again."
        );
      }

      setSuccess("Your settings have been saved successfully!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-full">
      <h1 className="text-center text-2xl md:text-4xl pt-4 font-serif dark:text-gray-100 opacity-40">
        Modify User Handles
      </h1>

      {/* Initial Loading Skeleton */}
      {isLoading && !success && !error && (
        <div className="mt-8 w-full max-w-md mx-auto px-4 animate-pulse">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 font-sans">
            <div className="space-y-6">
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      )}

      {!isLoading && (
        <div className="mt-8 w-full max-w-md mx-auto px-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 font-sans"
          >
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="leetcodeId"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  LeetCode Handle
                </label>
                <input
                  id="leetcodeId"
                  type="text"
                  placeholder="Enter your LeetCode ID"
                  value={leetcodeId}
                  onChange={(e) => setLeetcodeId(e.target.value)}
                  className="w-full px-4 py-2 text-gray-900 dark:text-white bg-white/80 dark:bg-gray-700/80 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="codeforcesId"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Codeforces Handle
                </label>
                <input
                  id="codeforcesId"
                  type="text"
                  placeholder="Enter your Codeforces ID"
                  value={codeforcesId}
                  onChange={(e) => setCodeforcesId(e.target.value)}
                  className="w-full px-4 py-2 text-gray-900 dark:text-white bg-white/80 dark:bg-gray-700/80 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="telegramChatId"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Telegram Chat ID
                </label>
                <input
                  id="telegramChatId"
                  type="text"
                  placeholder="Enter your Telegram Chat ID"
                  value={telegramChatId}
                  onChange={(e) => setTelegramChatId(e.target.value)}
                  className="w-full px-4 py-2 text-gray-900 dark:text-white bg-white/80 dark:bg-gray-700/80 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="telegramBotToken"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Telegram Bot Token
                </label>
                <div className="relative">
                  <input
                    id="telegramBotToken"
                    type={showToken ? "text" : "password"}
                    placeholder="Enter your Telegram Bot Token"
                    value={telegramBotToken}
                    onChange={(e) => setTelegramBotToken(e.target.value)}
                    className="w-full pl-4 pr-10 py-2 text-gray-900 dark:text-white bg-white/80 dark:bg-gray-700/80 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    aria-label={showToken ? "Hide token" : "Show token"}
                  >
                    {showToken ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <p className="mt-4 text-center text-sm text-red-500">{error}</p>
            )}
            {success && (
              <p className="mt-4 text-center text-sm text-green-500">
                {success}
              </p>
            )}

            <div className="mt-8 flex justify-center">
              <button
                type="submit"
                className="px-8 py-2 text-base font-semibold text-white rounded-lg transition-colors shadow-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={
                  // `isLoading` is now only for submission state after initial load
                  isLoading ||
                  (!leetcodeId &&
                    !codeforcesId &&
                    !telegramChatId &&
                    !telegramBotToken)
                }
              >
                {isLoading && (success || error) ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 010-.639l4.43-4.43a1.012 1.012 0 011.428 0l4.43 4.43a1.012 1.012 0 010 .639l-4.43 4.43a1.012 1.012 0 01-1.428 0l-4.43-4.43z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const EyeOffIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243l-4.243-4.243"
    />
  </svg>
);

export default ModifyPage;
