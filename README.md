# Pi Boost

> Smart companion for Pi Network miners. Track mining sessions, manage your security circle, and monitor Pi value.

## 🚀 Live App

Deployed at: _[add your URL after deploy]_

## ✨ Features

- ⚡ **Mining Dashboard** — Animated progress ring, real-time 24h session timer, one-tap mining
- 👥 **Security Circle** — Manage up to 5 members, referral link + QR code
- 📈 **Price Tracker** — Live Pi price (USD/BTC/EUR), Recharts chart, price alerts
- 💬 **Community** — Pi Network news feed, official community links, mainnet tracker
- 🔧 **Utilities** — Mining calculator, node setup checklist, wallet manager
- 🔐 **Auth** — Email + Google (Supabase) with offline/guest fallback
- 📱 **PWA** — Installable on iOS/Android, works offline

## 🛠 Tech Stack

| | |
|---|---|
| Framework | React 18 + Vite 5 + TypeScript |
| Styling | Tailwind CSS v3 (Pi theme) |
| Animations | Framer Motion |
| Charts | Recharts |
| State | Zustand (persisted localStorage) |
| Auth & DB | Supabase (optional — app works offline without it) |
| Deploy | Vercel / Docker + Cloud Run |

## 🏁 Getting Started

```bash
git clone <repo>
cd pi-boost
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## 🔑 Environment Variables

Copy `.env.example` → `.env`. All vars are **optional** — the app runs in guest mode without them.

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |

## 🗄 Supabase Setup (optional)

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase-schema.sql` in the SQL Editor
3. Enable Google OAuth in Authentication → Providers
4. Add your project URL and anon key to `.env`

## 🐳 Docker

```bash
docker build -t pi-boost .
docker run -p 8080:8080 pi-boost
```

## ▲ Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as Vercel environment variables.

## ⚠️ Disclaimer

Pi Boost is an independent third-party companion app. It is not affiliated with Pi Network or SocialChain, Inc. Mining data is simulated. Pi prices are illustrative only.
