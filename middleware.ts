import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define Public Routes (The "Safe List")
// We do NOT include "/home" here, so it becomes protected by default.
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/telegram(.*)", // Keep your bots public
  "/api/cron(.*)", // Keep your cron public
]);

export default clerkMiddleware(async (auth, req) => {
  // If the user tries to go to /home (or any non-public route)
  // and is NOT logged in, this line kicks them to the Sign In page.
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
