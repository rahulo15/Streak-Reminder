# Streak-Reminder 🚀

Streak-Reminder is a scalable **SaaS application** designed to help developers maintain their daily coding consistency. It tracks user submissions on **LeetCode** and **Codeforces** and sends smart reminders via **Telegram** if a problem hasn't been solved by the end of the day.

Unlike simple cron scripts, this app uses a **Manager-Worker architecture** powered by Vercel Cron and Upstash QStash to handle hundreds of users simultaneously without timeouts or API bans.

## ✨ Features

- **Multi-User Support**: Users can sign up via **Clerk Authentication** and manage their own profiles.
- **Smart Reminders**: Only sends alerts if the user *hasn't* solved a problem that day.
- **Dual Platform Tracking**: Supports both **LeetCode** and **Codeforces**.
- **Scalable Cron Architecture**: Uses a "Manager" to dispatch tasks and "Workers" to execute them, preventing Vercel function timeouts.
- **Queue & Rate Limiting**: Powered by **Upstash QStash** to spread API requests over time, avoiding rate limits from coding platforms.
- **Seamless Onboarding**: Easy Telegram bot connection flow.

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL (Supabase) + Prisma ORM
- **Authentication:** Clerk
- **Queue/Messaging:** Upstash QStash
- **Cron Jobs:** Vercel Cron
- **Notifications:** Telegram Bot API

## 🏗️ System Architecture

To ensure scalability and reliability, the application splits the "Check & Remind" process into two parts:

1.  **The Manager (Cron):** Runs once daily. It fetches all active users and dispatches "Job Requests" to the queue (QStash). It does **not** process data itself.
2.  **The Queue (QStash):** Receives the jobs and releases them gradually (e.g., over 10 minutes) to prevent hitting rate limits.
3.  **The Worker (API):** Receives a single user ID, checks their specific LeetCode/Codeforces data, and sends the Telegram alert if needed.

## 🚀 Installation & Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/streak-reminder.git

   ```

2. Navigate to the project directory:

   ```bash
   cd streak-reminder

   ```

3. Install dependencies

   ```bash
   npm install

   ```

4. Database Setup (Supabase)

   ```bash
   # Update your schema
   npx prisma db push
   
   # Generate the client
   npx prisma generate

   ```

## Configuration

1. **Set up environment variables**:

   - Create a `.env` file in the root of the project.
   - Define environment variables:
  
     Telegram Bot
     ```plaintext
     TELEGRAM_BOT_TOKEN=your_telegram_bot_token
     ```
     Authentication (Clerk)
     ```plaintext
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
     CLERK_SECRET_KEY=sk_test_...
     ```
     
     Database (Supabase)
     ```plaintext
     # Transaction Mode (Port 6543) - Required for Serverless
     DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true"
     # Direct Connection (Port 5432) - Required for Migrations
     DIRECT_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"
     ```
     
     Queue (Upstash QStash)
     ```plaintext
     QSTASH_URL=[https://qstash.upstash.io/v2/publish/](https://qstash.upstash.io/v2/publish/)
     QSTASH_TOKEN=ey...
     QSTASH_CURRENT_SIGNING_KEY=sig_...
     QSTASH_NEXT_SIGNING_KEY=sig_...
     ```
     
     Production URL (Required for Cron)
     ```plaintext
     # Your deployed domain (without https://)
     VERCEL_PROJECT_PRODUCTION_URL=your-app.vercel.app
     ```

2. **Modify the cron job (optional)**:

   - Open the `vercel.json` file.
   - Update the `crons` section to configure the cron jobs:

     ```json
      {
         "crons": [
            {
            "path": "/api/cron",
            "schedule": "0 18 * * *"
            }
         ]
      }
     ```

## ⚡ Usage

1. **Start the development server**:

   ```bash
   npm run dev

   ```

2. Open your browser and navigate to http://localhost:3000 to view the application.

3. Testing the Cron locally: You can manually trigger the cron route via your browser or Postman/cURL to test the logic: GET http://localhost:3000/api/cron (Ensure you have a valid authorization header if you secured the route).

## 🤝 Contributing

**Contributions are welcome! Please feel free to submit issues or pull requests to improve the logic or add support for more platforms (e.g., HackerRank, GeeksForGeeks).**
