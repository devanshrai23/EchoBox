# 🗺️ Spillit - Architecture & Data Flow

This document outlines the core architecture, routing structure, and data flow of the Spillit application. It serves as a guide for developers and AI coding assistants to understand how the application functions, how data is managed, and where specific features live.

---

## 🏗️ Data & Architecture Summary

- **Database:** MongoDB (via Mongoose). There is a single `User` schema. Messages are not their own collection; they are stored as an array of sub-documents *inside* the `User` document.
- **Authentication:** NextAuth.js (Session-based, securely storing HTTP-only cookies).
- **Mailing:** Resend API & React Email templates.
- **AI Integration:** Google Generative AI SDK (using `gemini-3.6-flash`).
- **UI/Styling:** Tailwind CSS + shadcn/ui.

---

## 📍 Route Structure & Functionality Breakdown

### 1. Landing Page (`/`)
- **Functionality:** Static marketing page explaining the app's value proposition.
- **Dynamics:** None. Purely informational with a Call-to-Action to sign up or log in.

### 2. Sign Up Page (`/sign-up`)
- **Functionality:** User registration.
- **Dynamics:** Uses React Hook Form + Zod for validation. It checks the database in real-time to ensure the chosen username is unique.
- **Data Flow:** Submitting the form creates an *unverified* user in MongoDB, generates a 6-digit OTP code, and triggers an email via **Resend** to verify the user's identity.

### 3. OTP Verification Page (`/verify/[username]`)
- **Functionality:** Verifies the user's email address.
- **Dynamics:** Contains a form to input the 6-digit OTP code sent via email. 
- **Data Flow:** Cross-references the OTP with the database. If correct and not expired, updates the user's document to `isVerified: true`.

### 4. Sign In Page (`/sign-in`)
- **Functionality:** User login.
- **Dynamics:** Authenticates the user using the **NextAuth.js** Credentials provider.
- **Data Flow:** Checks if the user exists, is verified, and compares the password using `bcrypt`. If successful, sets a secure HTTP-only session cookie.

### 5. Private Dashboard (`/dashboard`)
- **Functionality:** The control center for a logged-in user. **Strictly Auth-Gated** (protected by Next.js middleware and session checks).
- **Dynamics:** 
  - Displays the user's unique public URL.
  - Contains a live toggle switch to turn "Accepting Messages" on or off globally.
  - Renders a live feed of all anonymous messages the user has received.
  - Allows users to permanently delete individual messages.
- **Data Flow:** Fetches messages directly from the MongoDB database (`/api/get-messages`). The toggle switch hits `/api/accept-messages` to update the database state.

### 6. Public Message Board (`/u/[username]`)
- **Functionality:** The public-facing page where anyone (strangers/friends) can send an anonymous message to the user. **Not auth-gated.**
- **Dynamics:** 
  - Contains a message submission form.
  - Features an **AI "Suggest Messages" Button**. Clicking this uses the Google Gemini AI SDK to instantly generate 3 engaging, open-ended question prompts for the sender to use.
- **Data Flow:** Submits the typed message to `/api/send-message`, which finds the specific user in the database and pushes the new message into their `messages` array.
