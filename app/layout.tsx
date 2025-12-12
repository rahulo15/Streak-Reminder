import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import { ThemeProvider } from "./components/theme-provider";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { Header } from "./components/Header";
import AutoLogout from "./components/AutoLogout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Streak-Reminder",
  description: "Helps maintain DSA-CP streak",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          suppressHydrationWarning
          className={`${inter.className} w-full min-h-screen bg-gradient-to-b from-blue-600 to-blue-100 dark:from-gray-900 dark:to-gray-800`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            <AutoLogout />
            <SignedOut>
              <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
                <div className="mb-6 relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:mb-8">
                  <Image
                    src="/icon.svg"
                    alt="Streak Reminder Logo"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white drop-shadow-md">
                  Streak-Reminder
                </h1>
                <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-blue-50 dark:text-gray-300 max-w-xs sm:max-w-2xl drop-shadow-sm px-2">
                  Stay consistent and build your DSA/CP streak.
                </p>
                <div className="mt-8 sm:mt-10">
                  <SignInButton mode="modal">
                    <button className="rounded-full bg-white px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold text-blue-600 shadow-xl transition-all hover:bg-blue-50 hover:scale-105 hover:shadow-2xl dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500">
                      Sign In to Get Started
                    </button>
                  </SignInButton>
                </div>
              </div>
            </SignedOut>
            <SignedIn>
              <Header />
              <main>{children}</main>
            </SignedIn>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
