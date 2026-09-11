# BailMeOut: 24/7 Cloud Deployment Guide

Deploy BailMeOut to a cloud worker so it runs 24/7—even when your laptop is closed, sleeping, or out of battery.

---

## Option 1: Deploy to Railway (Recommended - Fastest, ~2 Minutes)

1. **Push your repository to GitHub:**
   ```bash
   git add .
   git commit -m "Add cloud deployment configuration"
   git push origin main
   ```

2. **Deploy on Railway:**
   - Go to [railway.app](https://railway.app) and sign in with GitHub.
   - Click **New Project** -> **Deploy from GitHub repo**.
   - Select your repository.
   - Click **Add Variables** and paste these environment variables from your `.env`:
     - `SPECTRUM_PROJECT_ID`
     - `SPECTRUM_PROJECT_SECRET`
     - `ELEVENLABS_API_KEY`
     - `TWILIO_ACCOUNT_SID`
     - `TWILIO_AUTH_TOKEN`
     - `TWILIO_PHONE_NUMBER`
     - `TARGET_PHONE_NUMBER`
     - `SAFE_WORD` (`code red`)
     - `OTEL_SDK_DISABLED` (`true`)
   - Railway will automatically detect the `Dockerfile`, build the container, and start your agent.

---

## Option 2: Deploy to Render (Free Background Worker)

1. Go to [dashboard.render.com](https://dashboard.render.com) and log in.
2. Click **New +** -> **Background Worker**.
3. Connect your GitHub repository.
4. Render will read [`render.yaml`](render.yaml) automatically, or configure:
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node --experimental-strip-types src/index.ts`
5. In the **Environment Variables** section, add your credentials.
6. Click **Create Background Worker**.

---

## Verification

Once deployed on either platform:
1. Open your cloud logs. You should see:
   ```text
   [BailMeOut] Starting BailMeOut Emergency Alibi Agent...
   [BailMeOut] Connected to Photon Spectrum Cloud gateway!
   [BailMeOut] Listening for incoming messages, safe words, and tapbacks...
   ```
2. Turn off your laptop WiFi or close the lid.
3. On your iPhone, send `code red` or double-tap any message with a Heart reaction.
4. Your iPhone will immediately receive the urgent alert, audio memo, and phone call while your laptop remains completely shut down.
