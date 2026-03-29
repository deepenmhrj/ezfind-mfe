# Deploy EzFind (Free Tier)

This setup uses:
- API: Railway
- UI: Vercel
- DB: MongoDB Atlas (M0 free tier)

## 1) Deploy the API (`ezfind-api`) to Railway

1. Push `ezfind-api` to GitHub.
2. In Railway, create a new project from that repo.
3. Railway will use `railway.json` and run `npm start`.
4. Add environment variables from [`ezfind-api/.env.example`](/Users/deepenmhrj/Documents/dev/ezfind/ezfind-api/.env.example):
   - `MONGODB_URI`
   - `AUTH_SECRET`
   - Optional for Google login:
     - `GOOGLE_CLIENT_ID` (or `GOOGLE_CLIENT_IDS`)
5. Deploy and copy your public Railway domain, e.g.:
   - `your-api.up.railway.app`

## 2) Configure MongoDB Atlas

1. Create a free M0 cluster.
2. Create DB user credentials.
3. Network access allowlist:
   - Add `0.0.0.0/0` for now (or restrict later).
4. Put the Atlas URI into Railway `MONGODB_URI`.

## 3) Configure frontend production values

1. Keep [`environment.prod.ts`](/Users/deepenmhrj/Documents/dev/ezfind/ezfind-mfe/src/environments/environment.prod.ts) as:
   - `apiUrl: ''` (so UI calls `/api/...` on same origin)
2. If you want Google login button visible in production, set:
   - `googleClientId: '<your-google-oauth-client-id>'`

## 4) Deploy the UI (`ezfind-mfe`) to Vercel

1. Push `ezfind-mfe` to GitHub.
2. In [`vercel.json`](/Users/deepenmhrj/Documents/dev/ezfind/ezfind-mfe/vercel.json), replace:
   - `https://YOUR-RAILWAY-API-DOMAIN`
   - with your Railway URL, e.g. `https://your-api.up.railway.app`
3. Import repo in Vercel and deploy.

## 5) Google OAuth setup (if using Google login)

1. In Google Cloud Console, create OAuth Client (Web).
2. Add authorized JavaScript origins:
   - `http://localhost:4200`
   - Your Vercel domain (e.g. `https://your-app.vercel.app`)
3. Use the same client ID:
   - Frontend: `googleClientId` in `environment.prod.ts`
   - Backend: `GOOGLE_CLIENT_ID` in Railway env vars

## Notes

- Free tiers can impose monthly limits and cold starts.
- File uploads in this API are stored on local disk (`uploads/`), which is ephemeral on Railway. Files can disappear after redeploy/restart.
