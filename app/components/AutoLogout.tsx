"use client";

import { useClerk, useAuth } from "@clerk/nextjs";
import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";

const INACTIVITY_LIMIT = 10 * 60 * 1000; // 10 minutes in milliseconds (total inactivity time before logout)
const WARNING_DURATION = 30 * 1000; // 30 seconds before actual logout to show warning

export default function AutoLogout() {
  const { signOut } = useClerk();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [showWarningPopup, setShowWarningPopup] = useState(false);
  const [countdown, setCountdown] = useState(WARNING_DURATION / 1000); // in seconds

  const handleLogout = useCallback(() => {
    signOut(() => router.push("/"));
  }, [signOut, router]);

  useEffect(() => {
    if (!isSignedIn) return;

    let warningTimer: NodeJS.Timeout;
    let logoutTimer: NodeJS.Timeout;
    let countdownInterval: NodeJS.Timeout;

    const startCountdown = () => {
      setCountdown(WARNING_DURATION / 1000);
      countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };

    // Function to reset all timers and hide popup
    const resetTimers = () => {
      clearTimeout(warningTimer);
      clearTimeout(logoutTimer);
      clearInterval(countdownInterval);
      setShowWarningPopup(false);
      setCountdown(WARNING_DURATION / 1000); // Reset countdown for next cycle

      // Set timer to show warning popup
      warningTimer = setTimeout(() => {
        setShowWarningPopup(true);
        startCountdown();
        // Set timer for actual logout after the warning duration
        logoutTimer = setTimeout(() => {
          console.log("Auto-logging out due to inactivity..."); // Original console log
          handleLogout();
        }, WARNING_DURATION);
      }, INACTIVITY_LIMIT - WARNING_DURATION);
    };

    // Events that count as "activity" to reset the timers
    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "click", // Added click for broader interaction
    ];

    // Set initial timers when component mounts
    resetTimers();

    // Attach listeners
    events.forEach((event) => {
      window.addEventListener(event, resetTimers);
    });

    // Cleanup listeners on unmount
    return () => {
      clearTimeout(warningTimer);
      clearTimeout(logoutTimer);
      clearInterval(countdownInterval);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimers);
      });
    };
  }, [handleLogout, isSignedIn]); // handleLogout is a dependency because it's used inside useEffect.

  return isSignedIn && showWarningPopup ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl text-center">
        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Auto-logging out due to inactivity in {countdown} seconds.
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Move your mouse or press a key to stay logged in.
        </p>
      </div>
    </div>
  ) : null;
}
