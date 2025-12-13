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
            <SignedIn>
              <Header />
            </SignedIn>
            <main>{children}</main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
