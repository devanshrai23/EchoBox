# EchoBox — UI Redesign Documentation

**Purpose:** This document is meant to be handed to an AI coding assistant (Claude Code, Cursor, etc.), one section at a time, to restyle EchoBox's pages without breaking any existing functionality. It contains a ready-to-paste **design prompt** per page, a **"do not touch"** list of functional elements, and **manual test checkpoints** to verify after each page is rebuilt.

**Stack context (for the AI to know):** Next.js 14 App Router, TypeScript, Tailwind CSS + shadcn/ui, MongoDB/Mongoose (messages live as a sub-array on the `User` document, not their own collection), NextAuth.js (Credentials provider, HTTP-only session cookies), Resend + React Email for OTP mail, Zod + React Hook Form for validation, Google Gemini SDK for the "Suggest Messages" feature.

---

## 0. Global Ground Rules (apply to every page)

Paste this block before **every** individual page prompt, or once at the top of your AI session if it supports persistent context:

> You are restyling the visual design (colors, typography, spacing, layout, component styling) of an existing Next.js + shadcn/ui page. You must **not** change:
> - Any function names, component names, file names, or import paths.
> - Any API calls, fetch URLs, or the payload/response shape sent to them (`/api/get-messages`, `/api/accept-messages`, `/api/send-message`, `/api/verify-code`, `/api/sign-up`, `/api/check-username-unique`, or equivalents).
> - Any `useSession`, middleware, or auth-gating logic.
> - Any Zod schema, React Hook Form `register`/`control` wiring, or validation error logic.
> - Any conditional rendering that depends on state (loading, error, empty, success, verified/unverified, accepting-messages on/off).
> - Route structure or dynamic segments (`[username]`).
>
> You may freely change: className values, Tailwind tokens, CSS variables in `globals.css`, component visual structure (as long as the same form fields/buttons/interactive elements still exist and fire the same handlers), icons, copy/microcopy (labels, button text, empty states) as long as meaning is preserved, and layout/spacing.
>
> If you are unsure whether something is styling or logic, leave it unchanged and flag it instead of guessing.

**General rule of thumb for you (the developer):** never let an AI touch `src/app/api/`, `src/model/`, `src/lib/`, `src/schemas/`, or `middleware.ts` during a "redesign" pass. Scope every prompt to a single page/component file plus shared UI components.

---

## 1. Landing Page (`/`)

### Functionality snapshot
Static marketing page. No data fetching, no auth check. Only interactive elements are nav links/buttons to `/sign-up` and `/sign-in`.

### Design prompt
```
Redesign the EchoBox landing page (src/app/page.tsx). This is a static
marketing page — there is no dynamic data and no forms to preserve, so you
have full creative freedom on layout and content structure.

Goals:
- Hero section that immediately communicates: "send and receive honest,
  anonymous messages, with AI-suggested conversation starters."
- A clear primary CTA button linking to /sign-up and a secondary link to
  /sign-in — keep these as real <Link> elements to those exact routes.
- Briefly showcase the three core features: anonymous message board,
  AI-suggested prompts, and the accept/reject messages toggle.
- Fully responsive, dark-mode aware if the app already supports next-themes
  (check globals.css / ThemeProvider before assuming).

Use the palette and typography defined in [INSERT YOUR CHOSEN PALETTE HERE].
Do not introduce new npm dependencies for icons/animation beyond what's
already in package.json (check first) unless you explicitly ask me.
```

### Do-not-touch
- The two navigation targets (`/sign-up`, `/sign-in`) must remain intact as real links, not just visual buttons.

### Test checkpoints
- [ ] Page loads at `/` with no console errors.
- [ ] "Sign Up" CTA navigates to `/sign-up`.
- [ ] "Sign In" link navigates to `/sign-in`.
- [ ] Page is usable at 375px (mobile), 768px (tablet), 1440px (desktop) widths.
- [ ] Dark mode (if applicable) doesn't clip text or lose contrast.

---

## 2. Sign Up Page (`/sign-up`)

### Functionality snapshot
Form with username/email/password fields, React Hook Form + Zod validation, **real-time username-uniqueness check against the DB as the user types**, and on submit: creates an unverified user + sends OTP email via Resend.

### Design prompt
```
Redesign the visual styling of the sign-up page (src/app/sign-up/page.tsx)
without touching its logic.

Preserve exactly as-is:
- The React Hook Form setup (register/control/handleSubmit) and the Zod
  resolver.
- The debounced real-time username-availability check and however it
  displays its state (checking / available / taken). You may restyle the
  indicator (e.g. spinner, checkmark, red X) but the underlying state
  values and the effect/query that produces them must not change.
- The onSubmit handler and its POST request/route.
- Field-level error message rendering tied to the Zod schema.

You may:
- Restyle the form into a card, redesign spacing/typography, add a
  password-strength visual bar (purely visual, non-blocking), and improve
  the loading state on the submit button.

Use the palette/typography from [INSERT YOUR CHOSEN PALETTE HERE].
```

### Do-not-touch
- Username-uniqueness debounce/query logic.
- Zod schema + RHF wiring.
- The submit handler and its request target.

### Test checkpoints
- [ ] Typing an already-taken username still shows "taken" (check state, don't just eyeball styling).
- [ ] Typing an available username still shows "available."
- [ ] Submitting with a weak/invalid password still blocks submission and shows the Zod error.
- [ ] Successful submit still redirects to `/verify/[username]` (or wherever it currently redirects) — confirm this hasn't silently changed.
- [ ] A real OTP email still arrives (check Resend dashboard/logs or your inbox) after signing up with a real email.
- [ ] New unverified user actually appears in MongoDB with `isVerified: false`.

---

## 3. OTP Verification Page (`/verify/[username]`)

### Functionality snapshot
Dynamic route keyed by username. 6-digit OTP input, cross-references against the DB, checks expiry, flips `isVerified` to `true` on success.

### Design prompt
```
Redesign src/app/verify/[username]/page.tsx visually only.

Preserve exactly as-is:
- The dynamic route param usage (params.username or useParams()).
- The OTP input handling and its submit-to-verify-code-API logic.
- Expired-code and incorrect-code error states — these must still render
  based on the actual API response, not be hardcoded.
- Any redirect-on-success behavior (likely to /sign-in or /dashboard).

You may:
- Replace a plain text input with a segmented 6-box OTP input component
  (shadcn has patterns for this, or build with individual inputs) as long
  as the final concatenated value still gets submitted identically to
  before.
- Add a "resend code" affordance ONLY if that functionality already
  exists somewhere in the codebase — do not invent a new resend endpoint.
  If it doesn't exist, leave it out and tell me instead of stubbing a fake
  button.

Use the palette/typography from [INSERT YOUR CHOSEN PALETTE HERE].
```

### Do-not-touch
- Route param handling.
- Expiry/incorrect-code logic (must come from the real API response, never hardcoded/mocked).

### Test checkpoints
- [ ] Navigating directly to `/verify/testuser` (an unverified user) loads correctly.
- [ ] Entering the correct OTP flips verification and redirects as before.
- [ ] Entering an incorrect OTP shows a real error, not a static placeholder.
- [ ] Waiting past expiry (or manually expiring in DB) shows the expired-code state.
- [ ] Confirm in MongoDB that `isVerified` actually became `true` after a correct code — not just that the UI looked happy.

---

## 4. Sign In Page (`/sign-in`)

### Functionality snapshot
NextAuth.js Credentials provider. Checks existence, verification status, and bcrypt-compares password. Sets HTTP-only session cookie on success.

### Design prompt
```
Redesign src/app/sign-in/page.tsx visually only.

Preserve exactly as-is:
- The `signIn("credentials", {...})` call from next-auth/react (or however
  it's currently invoked) — same provider id, same field keys.
- Error handling for: wrong password, unverified account, and
  non-existent user. These are likely three distinct error states — do
  not collapse them into one generic "invalid" message unless they
  already are.
- Redirect-on-success target (likely /dashboard).

You may:
- Restyle into a card/split-screen/etc., add a show/hide password toggle
  (pure UI state, doesn't touch auth logic), improve the loading state on
  the submit button.

Use the palette/typography from [INSERT YOUR CHOSEN PALETTE HERE].
```

### Do-not-touch
- The `signIn()` call signature and provider config.
- Distinct error-state handling (wrong password vs unverified vs no account).

### Test checkpoints
- [ ] Correct credentials for a verified user logs in and lands on `/dashboard`.
- [ ] Wrong password shows an error and does NOT log in.
- [ ] Correct credentials for an *unverified* user is blocked with the appropriate message (not silently logged in).
- [ ] Session cookie is set (check dev tools → Application → Cookies) after successful login.
- [ ] Refreshing `/dashboard` after login keeps you logged in (session persists).

---

## 5. Private Dashboard (`/dashboard`) — highest-risk page

### Functionality snapshot
The most functionally dense page. Auth-gated by middleware + session. Shows the user's public URL, a global accept-messages toggle, a live message feed pulled from MongoDB, and per-message delete.

### Design prompt
```
Redesign src/app/dashboard/page.tsx (and its child components, e.g. a
MessageCard component) visually only. This is the highest-risk page for
functionality regressions — be conservative.

Preserve exactly as-is:
- The auth gate: if middleware/session logic redirects unauthenticated
  users, do not remove or relocate the check.
- The "copy public URL" functionality if it exists (likely
  `navigator.clipboard.writeText`) — you may restyle the button/toast but
  not the copy logic itself.
- The accept-messages toggle: it must still call /api/accept-messages
  (or equivalent) on change, and its visual on/off state must stay bound
  to the actual returned/stored value — never hardcode it to "on" for
  design purposes.
- The message feed: must still fetch from /api/get-messages and render
  the REAL returned array, preserving whatever loading/empty/error states
  already exist. Do not replace live data with static placeholder
  messages in the final code (placeholders are fine to *look at* while
  designing, but the shipped component must render real data).
- Per-message delete: must still call its existing delete endpoint/action
  and remove that exact message from state on success — not just fade it
  out visually while leaving it in the array.

You may:
- Redesign the message feed as a masonry grid, stacked cards, or timeline.
- Add a distinct empty state ("No messages yet — share your link!") if one
  doesn't already exist, styled to match the rest of the app.
- Restyle the toggle as a switch/pill/segmented control.
- Add a confirmation step before delete (e.g. an AlertDialog) as long as
  the underlying delete call is unchanged once confirmed.

Use the palette/typography from [INSERT YOUR CHOSEN PALETTE HERE].
```

### Do-not-touch
- Middleware/session auth gate.
- `/api/get-messages`, `/api/accept-messages`, and the delete endpoint — calls, payloads, and state updates on response.
- Binding between toggle UI state and actual DB-backed value.
- Rendering real fetched messages (never hardcode sample data into the shipped component).

### Test checkpoints
- [ ] Visiting `/dashboard` while logged out redirects you away (auth gate still works).
- [ ] Your public URL is displayed correctly and the copy button actually copies it (paste somewhere to confirm).
- [ ] Toggling "Accepting Messages" off, then refreshing the page — the toggle should still show OFF (confirms it's persisted to DB, not just local state).
- [ ] With the toggle OFF, visiting your own `/u/[username]` in an incognito window should reflect that you're not accepting messages (per whatever the existing behavior is).
- [ ] Sending yourself a test message from `/u/[username]` in another tab, then refreshing `/dashboard`, shows the new message in the feed.
- [ ] Deleting a message removes it from the UI **and** confirm it's actually gone from MongoDB (not just hidden client-side) — refresh the page to be sure.
- [ ] Feed shows a sensible empty state with zero messages, and doesn't break/crash.

---

## 6. Public Message Board (`/u/[username]`)

### Functionality snapshot
Not auth-gated — public. Message submission form, plus the standout **AI "Suggest Messages" button** that calls Gemini to generate 3 prompts.

### Design prompt
```
Redesign src/app/u/[username]/page.tsx visually only.

Preserve exactly as-is:
- The dynamic username param and however the page confirms the target
  user exists / is accepting messages (loading/not-found/not-accepting
  states must still be driven by real data, not hardcoded).
- The message textarea + submit button and its POST to /api/send-message
  (or equivalent), including character limits/validation if present.
- The "Suggest Messages" button's call to the Gemini endpoint and however
  the 3 suggestions are returned and inserted into the textarea when
  clicked (e.g. clicking a suggestion chip should still populate the
  textarea exactly as it does now).
- Any rate-limiting or loading-disabled state on the AI button (don't
  remove the disabled-while-loading behavior, it likely exists to prevent
  spamming the Gemini API).

You may:
- Restyle the AI suggestions as chips/cards instead of a plain list.
- Add a subtle loading animation while Gemini generates suggestions
  (visual only, doesn't change the actual async logic).
- Restyle the "message sent" confirmation state (success toast/screen).
- Add a not-accepting-messages illustration/empty state if the underlying
  boolean check already exists in the code.

Use the palette/typography from [INSERT YOUR CHOSEN PALETTE HERE].
```

### Do-not-touch
- User-exists / accepting-messages checks and their real data source.
- The Gemini suggest-messages call and click-to-populate-textarea behavior.
- Any existing rate-limit/disabled-while-loading guard on the AI button.
- `/api/send-message` call and payload shape.

### Test checkpoints
- [ ] Visiting `/u/an-existing-username` loads the form correctly.
- [ ] Visiting `/u/a-nonexistent-username` shows a proper not-found state, doesn't crash.
- [ ] Visiting a real user's page while their toggle is OFF shows the "not accepting messages" state, and the form is actually disabled/hidden (not just styled to look disabled).
- [ ] Clicking "Suggest Messages" actually calls Gemini and returns 3 real (non-hardcoded) suggestions — try it twice and confirm they differ.
- [ ] Clicking a suggestion populates the textarea with that exact text.
- [ ] Submitting a message with no auth/session (as an anonymous visitor) succeeds and the message actually appears in the recipient's `/dashboard` feed afterward.
- [ ] Rapidly clicking "Suggest Messages" multiple times doesn't fire uncontrolled duplicate API calls (button should disable while loading, if that was true before your redesign).

---

## Full end-to-end regression pass (run once after all pages are redesigned)

1. Sign up as a brand-new test user → confirm OTP email arrives → verify with correct code.
2. Sign in as that user → land on dashboard.
3. Copy your public link, open it in an incognito window.
4. In incognito, click "Suggest Messages," pick one, send it.
5. Back in your dashboard tab, refresh → confirm the message appears.
6. Toggle "Accepting Messages" off → refresh incognito `/u/[username]` → confirm it now blocks submissions.
7. Delete the test message from the dashboard → refresh → confirm it's gone.
8. Sign out → confirm `/dashboard` redirects you to sign-in when visited directly.

If all 8 steps pass after a full visual redesign, functionality is intact.

---

## Notes on filling in `[INSERT YOUR CHOSEN PALETTE HERE]`

Drop in your chosen design direction once per prompt before sending it to your AI tool, e.g.:

```
Palette: background #0D0B1E, card #F4E9D8, accent #7C6BA8, highlight #E4B363.
Typography: Fraunces for headings, Inter for body text.
Overall direction: confessional / night-sky, minimal, generous whitespace.
```

Keeping this consistent across all six prompts is what makes the redesign feel like one coherent app rather than six independently-styled pages.
