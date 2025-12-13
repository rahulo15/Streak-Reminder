"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="w-full min-h-screen bg-gradient-to-b from-blue-600 to-blue-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white drop-shadow-md">
            Something went wrong!
          </h2>
          <p className="mb-8 text-lg text-blue-50 dark:text-gray-300">
            An unexpected error has occurred. Please try again.
          </p>
          <button
            onClick={() => reset()}
            className="rounded-full bg-white px-8 py-3 text-lg font-bold text-blue-600 shadow-xl transition-all hover:bg-blue-50 hover:scale-105 hover:shadow-2xl dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
