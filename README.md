# TICKR

A live market tape and personal watchlist. Quotes are simulated so the board always moves without an API key.

## Features

- Scrolling ticker tape across major stocks, ETFs, and crypto
- Personal watchlist with add / remove
- Live-updating prices, day change, and sparklines
- Watchlist persisted in the browser (`localStorage`)

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3847](http://localhost:3847).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js dev server on port 3847 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build on port 3847 |
| `npm run lint` | Run ESLint |

## Notes

Prices are mock ticks for prototyping. Swap the simulation in `src/lib/market-data.ts` and `src/hooks/use-live-quotes.ts` for a real market data provider when you are ready.
