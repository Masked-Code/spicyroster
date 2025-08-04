# 🔥 SPICY ROSTER 📃

A small Nuxt 3 app for recording daily muster information for a roster of sailors and viewing the status in a clean UI. Deployed and hosted on Vercel with a daily email summary sent at 07:00 via a cron-triggered API.

## ✨ Features
- Muster input — Select sailor, location, and time

- Status table — Contains today's muster data for all sailors

- Daily email — Automated & composed summary emails

## 📚 Tech Stack
Nuxt 3 + Nitro server

Nuxt UI + Tailwind CSS

Nitro useStorage() for server-side storage

Resend for transactional email

Vercel for hosting

## 🚀 Developer Getting Starded
1. Clone the repository:
   ```bash
   git clone https://github.com/Masked-Code/spicyroster.git
   ```
2. Navigate to the project directory:
   ```bash
    cd spicyroster
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Create a `.env` file in the root directory and add your Resend API key
    - Refer to vercel's active environment variables documentation: [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
    - For local development, you can create a `.env` file in the root directory and add your variables
5. Start the development server:
    ```bash
    npm run dev
    ```
6. Open your browser and go to `http://localhost:3000`
