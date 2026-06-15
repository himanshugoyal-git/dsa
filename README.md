# AlgoTrail POC

A dependency-free, Duolingo-inspired DSA learning prototype. The first path teaches graph foundations through short concepts and interactive questions, while the roadmap covers the major graph algorithms.

## Run locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

Progress, XP, hearts, and completed lessons are stored in the browser with `localStorage`.

## Deploy to Cloudflare Workers

The app is configured as a Worker with static assets. It will deploy to a URL similar to:

```text
https://algotrail-dsa.<your-workers-subdomain>.workers.dev
```

Wrangler currently requires a supported modern Node.js version. This project includes an `.nvmrc` for Node 22.

```bash
nvm install
nvm use
npm install
npx wrangler login
npm run deploy
```

`wrangler login` opens Cloudflare's authorization page. After deployment, Wrangler prints the public `workers.dev` URL.

To preview using Cloudflare's local runtime:

```bash
npm run dev
```

The Worker name comes from `wrangler.jsonc`. Change `name` before deploying if `algotrail-dsa` is already taken in your Cloudflare account.
