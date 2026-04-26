# Deploy EzFind (Free Tier)

This setup uses:
- API: your deployed backend (Render is the best fit for this repo)
- UI: Vercel
- DB: MongoDB Atlas (M0 free tier)
- Images: Cloudinary

## 1) Deploy the API (`ezfind-api`) to your backend host

1. Push `ezfind-api` to GitHub.
2. Deploy it to your chosen host.
   - Render is the simplest option for this Express API.
3. Add environment variables from [`ezfind-api/.env.example`](/Users/deepenmhrj/Documents/dev/ezfind/ezfind-api/.env.example):
   - `MONGODB_URI`
   - `AUTH_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - Optional for Google login:
     - `GOOGLE_CLIENT_ID` (or `GOOGLE_CLIENT_IDS`)
4. Deploy and copy your public API base URL, e.g.:
   - `https://your-api.onrender.com`

## 2) Configure MongoDB Atlas

1. Create a free M0 cluster.
2. Create DB user credentials.
3. Network access allowlist:
   - Add `0.0.0.0/0` for now (or restrict later).
4. Put the Atlas URI into your backend host `MONGODB_URI`.

## 3) Configure Vercel environment variables

Set these in your Vercel project:

- `EZFIND_API_URL=https://your-api.onrender.com`
- Optional: `EZFIND_GOOGLE_CLIENT_ID=<your-google-oauth-client-id>`

## 4) Deploy the UI (`ezfind-mfe`) to Vercel

1. Push `ezfind-mfe` to GitHub.
2. Import repo in Vercel and set the project root to `ezfind-mfe` if needed.
3. Add the environment variables above.
4. Deploy.

## 5) Google OAuth setup (if using Google login)

1. In Google Cloud Console, create OAuth Client (Web).
2. Add authorized JavaScript origins:
   - `http://localhost:4200`
   - Your Vercel domain (e.g. `https://your-app.vercel.app`)
3. Use the same client ID:
   - Frontend: `EZFIND_GOOGLE_CLIENT_ID` in Vercel
   - Backend: `GOOGLE_CLIENT_ID` in your backend host

## Notes

- Free tiers can impose monthly limits and cold starts.
- With Cloudinary configured, uploaded item photos are stored outside the API host and remain available across restarts and redeploys.
- If Cloudinary env vars are not set, the API falls back to local `uploads/` storage for local development.
