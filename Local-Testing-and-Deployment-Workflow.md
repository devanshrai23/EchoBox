# Spillit: Local Testing and Deployment Workflow

To ensure a smooth, bug-free experience for users on `spillit.in`, all updates to the website must go through a structured testing and deployment process. This guarantees that no broken code makes it to the live website.

Please follow these 3 phases for any new features, bug fixes, or redesigns.

---

## Phase 0: Local Development & Testing (The Local Server)

Since the project is live, you must ALWAYS verify your changes locally before pushing anything to the internet.

1. **Start the Local Development Server**:
   Open your terminal in the project folder and run:
   ```bash
   npm run dev
   ```
2. **Test in Your Browser**:
   Open your web browser and go to `http://localhost:3000`. Interact with the website exactly as a user would. 
   - Click buttons, fill out forms, check responsive design (mobile/desktop).
   - Verify that your specific changes work as expected.
3. **Check for Errors**:
   - Keep an eye on your terminal for any build errors or warnings.
   - Open your browser's Developer Tools (Right Click > Inspect > Console) to ensure there are no JavaScript errors.
4. **Run a Local Production Build (Optional but Recommended)**:
   To ensure your code will successfully build on Vercel, you can run:
   ```bash
   npm run build
   ```
   If this passes without errors, your code is structurally sound and ready for GitHub.

---

## Phase 1: Verify Your Changes (The Preview Deployment)

To test new code without affecting the live `spillit.in` website, we use branches and Pull Requests.

1. **Create a New Branch**:
   Instead of making changes directly on your main code branch (`main`), create a new branch for your update.
   ```bash
   git checkout -b my-new-feature
   ```
   *(Make your code changes, and test them locally using Phase 0)*
2. **Commit and Push**:
   Once you are happy with the local tests, commit the changes and push that specific branch up to GitHub.
   ```bash
   git add .
   git commit -m "Description of my new feature"
   git push origin my-new-feature
   ```
3. **Open a Pull Request (PR)**:
   Go to your repository on GitHub.com and open a Pull Request to merge your new branch into your `main` branch.
4. **Check the Vercel Bot**:
   Within seconds of opening the PR, a "Vercel Bot" will automatically leave a comment on your Pull Request in GitHub. This comment will contain a unique Preview URL (e.g., `spillit-...vercel.app`).
5. **Verify the Preview URL**:
   Click that Preview URL. This is an exact, live replica of your site with the new changes applied. You can test it on your phone, send the link to friends for feedback, and ensure nothing is broken before it goes to production.

---

## Phase 2: Make Changes Permanent (The Production Deployment)

Once you have tested the Preview URL and are 100% happy with how the new changes look and function, pushing them to your custom domain is incredibly simple.

1. **Merge the Pull Request**:
   On your GitHub Pull Request page, simply click the big green **Merge pull request** button.
2. **Let Vercel Do the Rest**:
   The moment that code merges into your `main` branch, GitHub sends a signal to Vercel. Vercel will immediately start a Production Build.
3. **Go Live**:
   Within a minute or two, Vercel will finish building and automatically update `spillit.in` and `www.spillit.in` with your new features.

---

### Emergency Rollbacks
If you ever push an update to production and realize there is a bug you missed, do not panic:
1. Go to your **Vercel dashboard**.
2. Click on the **Deployments** tab.
3. Find a previous, working deployment version.
4. Click **Promote to Production** (or the ellipsis `...` > **Assign Custom Domains**) to instantly roll your website back to the working state.
