<div align="center">
  <h1>🗣️ Spillit</h1>
  <p><strong>A modern, anonymous messaging platform powered by AI</strong></p>
</div>

<br />

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
</div>

<br />

## 🚀 Overview

Spillit is a full-stack, anonymous messaging application designed to let users receive honest, unfiltered feedback and messages from anyone. Share your unique public link, and anyone can send you an anonymous message!

To help spark conversations, Spillit integrates directly with Google's **Gemini AI** to auto-generate engaging, open-ended question suggestions for your friends to send you. 

## ✨ Key Features

- **Personalized Dashboards**: A dedicated private space to manage, read, and delete your anonymous messages.
- **AI-Powered Suggestions**: Integrated with Google Gemini 3.6 Flash to instantly generate unique, conversation-starting questions with a single click.
- **Secure Authentication**: Robust credential-based authentication built with `NextAuth.js` and `bcrypt`.
- **Email Verification**: Anti-spam email OTP verification flow powered by **Resend**.
- **Message Controls**: Ability to globally toggle accepting messages on or off directly from your dashboard.
- **Modern UI**: A sleek, fully responsive user interface built using **Tailwind CSS** and **shadcn/ui**.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: MongoDB & Mongoose
- **AI Integration**: Google Generative AI SDK (Gemini)
- **Emails**: Resend & React Email
- **Validation**: Zod & React Hook Form

## 📂 Project Structure

```text
├── src/
│   ├── app/                # Next.js App Router (Pages, Layouts, API Routes)
│   │   ├── api/            # Backend API routes (Auth, Messages)
│   │   ├── dashboard/      # Protected user dashboard
│   │   ├── sign-in/        # User authentication pages
│   │   ├── sign-up/        # User registration flow
│   │   └── u/[username]/   # Public profile message boards
│   ├── components/         # Reusable UI components (shadcn, Navbar, etc.)
│   ├── helpers/            # Utility functions (Sending emails, formatters)
│   ├── lib/                # Library configurations (MongoDB connection)
│   ├── model/              # Mongoose database schemas
│   ├── schemas/            # Zod validation schemas
│   └── types/              # TypeScript type definitions
├── emails/                 # React Email templates
├── public/                 # Static assets (images, fonts)
└── (config files)          # tailwind.config, next.config, package.json
```

## 💻 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [MongoDB](https://www.mongodb.com/) Database URI
- A [Resend](https://resend.com/) API Key
- A [Google Gemini](https://aistudio.google.com/) API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/Spillit.git
   cd Spillit
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add the following keys:
   ```env
   # Database
   MONGODB_URI="your_mongodb_connection_string"

   # Authentication
   NEXTAUTH_SECRET="your_secure_random_string"

   # Email Service
   RESEND_API_KEY="your_resend_api_key"

   # AI Integration
   GOOGLE_GENERATIVE_AI_API_KEY="your_gemini_api_key"
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License

This project is licensed under the MIT License.
