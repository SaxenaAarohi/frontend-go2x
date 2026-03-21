<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/7a4522dd-d219-428a-846a-1f921a0310c0

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy Backend On Render (Frontend Already On Vercel)

Use this when your friend has already deployed the React frontend to Vercel and you only want to host API endpoints on Render.

1. Push this repository to GitHub.
2. In Render, click **New** -> **Web Service** and connect the repository.
3. Configure service:
   - Runtime: **Node**
   - Build Command: `npm install`
   - Start Command: `npm run start:api`
4. Add environment variables in Render:
   - `NODE_ENV=production`
   - `SERVE_FRONTEND=false`
   - `CORS_ORIGINS=https://your-frontend.vercel.app`
   - `GEMINI_API_KEY=...` (only if you use Gemini features)
5. Deploy. After deployment, verify API by opening:
   - `https://<your-render-service>.onrender.com/api/courses`

### Connect Vercel Frontend To Render API

Recommended: add a rewrite in Vercel so existing frontend calls to `/api/...` continue to work without code changes.

In Vercel Project Settings -> Rewrites, add:

- Source: `/api/(.*)`
- Destination: `https://<your-render-service>.onrender.com/api/$1`

Then redeploy Vercel.
