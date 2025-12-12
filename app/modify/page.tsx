"use client";

import React, { useState, useEffect, useReducer } from "react";
import { useUser } from "@clerk/nextjs";

type State = {
  status: "idle" | "loading" | "submitting" | "connecting" | "verifying";
  error: string | null;
  success: string | null;
  showTelegramVerify: boolean;
};

type Action =
  | { type: "START_SUBMIT" | "START_CONNECT" | "START_VERIFY" }
  | { type: "FETCH_COMPLETE" }
  | { type: "SUCCESS"; payload: string }
  | { type: "ERROR"; payload: string }
  | { type: "SHOW_VERIFY"; payload: string }
  | { type: "VERIFY_SUCCESS"; payload: string };

const initialState: State = {
  status: "loading", // Start in loading state for initial fetch
  error: null,
  success: null,
  showTelegramVerify: false,
};

function uiReducer(state: State, action: Action): State {
  switch (action.type) {
    case "START_SUBMIT":
      return { ...state, status: "submitting", error: null, success: null };
    case "START_CONNECT":
      return { ...state, status: "connecting", error: null, success: null };
    case "START_VERIFY":
      return { ...state, status: "verifying", error: null, success: null };
    case "FETCH_COMPLETE":
      return { ...state, status: "idle" };
    case "SUCCESS":
      return { ...state, status: "idle", success: action.payload };
    case "ERROR":
      return { ...state, status: "idle", error: action.payload };
    case "SHOW_VERIFY":
      return {
        ...state,
        status: "idle",
        showTelegramVerify: true,
        success: action.payload,
      };
    case "VERIFY_SUCCESS":
      return {
        ...state,
        status: "idle",
        showTelegramVerify: false,
        success: action.payload,
      };
    default:
      return state;
  }
}

function ModifyPage() {
  const { user } = useUser();
  const [leetcodeId, setLeetcodeId] = useState("");
  const [codeforcesId, setCodeforcesId] = useState("");
  const [savedHandles, setSavedHandles] = useState({
    leetcode: "",
    codeforces: "",
  });
  const [telegramChatId, setTelegramChatId] = useState<string | null>(null);
  const [uiState, dispatch] = useReducer(uiReducer, initialState);

  const refCode = user ? `CONNECT-${user.id.slice(-5)}` : "";

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
            setSavedHandles({
              leetcode: data.leetcodeHandle || "",
              codeforces: data.codeforcesHandle || "",
            });
            setTelegramChatId(data.telegramChatId || null);
          }
        }
      } catch (err) {
        // It's okay if this fails, the user might not have settings yet.
        console.error("Failed to fetch user settings:", err);
      } finally {
        dispatch({ type: "FETCH_COMPLETE" });
      }
    };
    fetchUserData();
  }, []); // Empty dependency array ensures this runs only on mount and unmount

  const handleOpenBot = async () => {
    dispatch({ type: "START_CONNECT" });
    try {
      // 1. Open the bot in a new tab.
      window.open(
        `https://t.me/streak_reminder_o15_bot?start=${refCode}`,
        "_blank"
      );

      // 2. Show the verification input and guide the user.
      dispatch({
        type: "SHOW_VERIFY",
        payload:
          "Bot opened in a new tab. Now click 'Verify Connection' below.",
      });
    } catch (err) {
      dispatch({
        type: "ERROR",
        payload:
          "Could not open the Telegram bot. Please check for pop-up blockers.",
      });
    }
  };

  const handleVerify = async () => {
    dispatch({ type: "START_VERIFY" });
    try {
      const res = await fetch("/api/telegram/manual-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refCode }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.error ||
            "We couldn't find your message yet. Please start the bot and click Verify again."
        );
      }

      dispatch({
        type: "VERIFY_SUCCESS",
        payload: "Telegram successfully verified!",
      });
      // Assume verification was successful and update the state to reflect connection.
      // A more robust solution might refetch user data or get the ID from the response.
      // For now, a non-null placeholder will work to update the button text.
      setTelegramChatId("connected");
    } catch (err: any) {
      dispatch({ type: "ERROR", payload: err.message });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: "START_SUBMIT" });

    //have to encrypt chatid and bottoken
    try {
      const response = await fetch("/api/modify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leetcodeId,
          codeforcesId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to save settings. Please try again."
        );
      }

      dispatch({
        type: "SUCCESS",
        payload: "Your settings have been saved successfully!",
      });
      setSavedHandles({
        leetcode: leetcodeId,
        codeforces: codeforcesId,
      });
    } catch (err: any) {
      dispatch({ type: "ERROR", payload: err.message });
    }
  };

  const isDirty =
    leetcodeId !== savedHandles.leetcode ||
    codeforcesId !== savedHandles.codeforces;

  return (
    <div className="w-full min-h-full">
      <h1 className="text-center text-2xl md:text-4xl pt-4 font-serif dark:text-gray-100 opacity-40">
        Modify User Handles
      </h1>

      {/* Initial Loading Skeleton */}
      {uiState.status === "loading" && (
        <div className="mt-8 w-full max-w-md mx-auto px-4 animate-pulse">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 font-sans">
            <div className="space-y-6">
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      )}

      {uiState.status !== "loading" && (
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
            </div>

            {uiState.error && (
              <p className="mt-4 text-center text-sm text-red-500">
                {uiState.error}
              </p>
            )}
            {uiState.success && (
              <p className="mt-4 text-center text-sm text-green-500">
                {uiState.success}
              </p>
            )}

            <div className="mt-8 flex flex-col justify-center gap-4">
              <button
                type="submit"
                className="px-8 py-2 text-base font-semibold text-white rounded-lg transition-colors shadow-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!isDirty || uiState.status === "submitting"}
              >
                {uiState.status === "submitting" ? "Saving..." : "Save Changes"}
              </button>

              {uiState.showTelegramVerify ? (
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={uiState.status === "verifying"}
                  className="px-8 py-2 text-base font-semibold text-white rounded-lg transition-colors shadow-lg bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {uiState.status === "verifying"
                    ? "Verifying..."
                    : "Verify Connection"}
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleOpenBot}
                    disabled={
                      uiState.status === "connecting" ||
                      (!savedHandles.leetcode && !savedHandles.codeforces)
                    }
                    className="px-8 py-2 text-base font-semibold text-white rounded-lg transition-colors shadow-lg bg-sky-500 hover:bg-sky-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {uiState.status === "connecting"
                      ? "Connecting..."
                      : telegramChatId
                      ? "Reconnect Telegram"
                      : "Connect Telegram"}
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center px-2">
                    Clicking this opens the bot in a new tab. Send the
                    pre-filled{" "}
                    <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">
                      /start
                    </code>{" "}
                    command, then return here and click &apos;Verify
                    Connection&apos; to link your account.
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ModifyPage;
