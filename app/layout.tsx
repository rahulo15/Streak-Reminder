import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { Header } from "./components/Header";

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
          className={`${inter.className} w-full min-h-screen bg-gradient-to-b from-blue-600 to-blue-100 dark:from-gray-900 dark:to-gray-800`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            <SignedOut>
              <div className="flex h-screen flex-col items-center justify-center bg-background text-center">
                <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
                  Streak-Reminder
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                  Stay consistent and build your DSA/CP streak.
                </p>
                <div className="mt-8">
                  <SignInButton mode="modal">
                    <button className="rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                      Sign In to Get Started
                    </button>
                  </SignInButton>
                </div>
              </div>
            </SignedOut>
            <SignedIn>
              <Header />
              <main className="p-4">{children}</main>
            </SignedIn>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
