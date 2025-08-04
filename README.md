<h1 align="center" style="font-size: 3rem;">🔥 SPICY ROSTER 📃</h1>

<p align="center">
  <a href="https://nuxt.com"><img alt="Nuxt 3" src="https://img.shields.io/badge/Nuxt-3-00DC82?logo=nuxt.js&logoColor=white"></a>
  <a href="https://vuejs.org/"><img alt="Vue 3" src="https://img.shields.io/badge/Vue-3-42b883?logo=vue.js&logoColor=white"></a>
  <a href="https://www.typescriptlang.org/"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white"></a>
  <a href="https://ui.nuxt.com/"><img alt="Nuxt UI" src="https://img.shields.io/badge/Nuxt%20UI-%20-0EA5E9?logo=tailwindcss&logoColor=white"></a>
  <a href="https://vercel.com/"><img alt="Vercel" src="https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white"></a>
  <a href="https://resend.com/"><img alt="Resend" src="https://img.shields.io/badge/Email-Resend-FF4A4A?logo=resend&logoColor=white"></a>
</p>

<p align="center">
  <a href="https://github.com/Masked-Code/spicyroster/issues">
    <img alt="Issues" src="https://img.shields.io/github/issues/Masked-Code/spicyroster">
  </a>
  <a href="https://github.com/Masked-Code/spicyroster/pulls">
    <img alt="PRs" src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg">
  </a>
  <a href="https://github.com/Masked-Code/spicyroster/commits/main">
    <img alt="Last commit" src="https://img.shields.io/github/last-commit/Masked-Code/spicyroster">
  </a>
</p>

<p align="center">
  <a href="https://spicyroster.vercel.app/">
    <img alt="Preview" src="https://img.shields.io/badge/Preview-Live-000000?logo=vercel&logoColor=white">
  </a>
</p>

---

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
