# Mutual Fund Evaluator

A premium, customer-facing mutual fund evaluation application built with React + Vite.

## Features

- 10-question wizard with smooth step-by-step flow
- 1,164 AMFI-registered Indian mutual funds (embedded, no API needed)
- Live suitability scoring engine across 7 weighted dimensions
- Investor profile classification (5 tiers)
- Buy / Hold / Avoid recommendation engine
- SIP corpus projection
- Tax bracket-specific notes
- Premium dark UI with gold accents

---

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000

---

## Deploy to Railway (Recommended — matches your existing setup)

### Option A: GitHub → Railway (Automatic deploys)

1. Push this folder to a new GitHub repo:
   ```bash
   cd mf-evaluator
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/mf-evaluator.git
   git push -u origin main
   ```

2. Go to https://railway.app → **New Project** → **Deploy from GitHub repo**
3. Select your repo
4. Railway auto-detects the `railway.toml` — no config needed
5. Click **Deploy** → your app is live in ~2 minutes
6. Go to **Settings → Domains** → Generate a public URL

### Option B: Railway CLI (Direct deploy)

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

---

## Deploy to Netlify (Easiest for static hosting)

### Option A: Drag & Drop (No account setup needed)

```bash
npm run build
```
Then drag the `dist/` folder to https://app.netlify.com/drop

### Option B: Netlify CLI

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

---

## Project Structure

```
mf-evaluator/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx          ← Main application (all logic + UI)
│   └── main.jsx         ← React entry point
├── index.html           ← HTML shell with loading splash
├── vite.config.js       ← Vite configuration
├── package.json
├── railway.toml         ← Railway deployment config
└── netlify.toml         ← Netlify deployment config
```

---

## Customisation

- **Add more funds**: Edit the `ALL_FUNDS` array in `src/App.jsx`
- **Adjust scoring weights**: Edit the `weights` object in `scoreAnswers()`
- **Change branding**: Update colours in CSS variables (`--gold`, `--ink`, etc.)
- **Add more questions**: Extend the `QUESTIONS` array

---

## Tech Stack

- React 18
- Vite 5
- Pure CSS (no UI library dependencies)
- Zero external API calls — fully self-contained
