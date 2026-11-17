"use client"

import { useMemo } from "react"
import { SymbolSearch } from "@/components/symbol-search"
import { TickerTape } from "@/components/ticker-tape"
import { Watchlist } from "@/components/watchlist"
import { useLiveQuotes } from "@/hooks/use-live-quotes"
import { useWatchlist } from "@/hooks/use-watchlist"
import { MARKET_CATALOG } from "@/lib/market-data"

export function TickerApp() {
  const [watchlist, setWatchlist] = useWatchlist()

  const tapeSymbols = useMemo(
    () =>
      Array.from(
        new Set([
          ...watchlist,
          ...MARKET_CATALOG.slice(0, 12).map((s) => s.symbol),
        ])
      ),
    [watchlist]
  )

  const { quotes: tapeQuotes, ready: tapeReady } = useLiveQuotes(tapeSymbols)
  const { quotes: watchQuotes, ready: watchReady } = useLiveQuotes(watchlist)

  function addSymbol(symbol: string) {
    setWatchlist((current) =>
      current.includes(symbol) ? current : [...current, symbol]
    )
  }

  function removeSymbol(symbol: string) {
    setWatchlist((current) => current.filter((item) => item !== symbol))
  }

  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <div className="atmosphere" aria-hidden />

      <header className="relative z-10 px-5 pt-8 sm:px-8 sm:pt-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-display text-5xl leading-none tracking-[-0.04em] text-[var(--ink)] sm:text-6xl md:text-7xl">
                TICKR
              </p>
              <p className="mt-3 max-w-md text-base text-[var(--ink-soft)] sm:text-lg">
                A live market tape for the symbols you care about. Quotes are
                simulated so the board always moves.
              </p>
            </div>
            <div className="font-mono text-xs tracking-[0.14em] text-[var(--ink-soft)] uppercase">
              <div className="flex items-center gap-2">
                <span className="inline-block size-2 animate-pulse bg-[var(--tick-up)]" />
                Live simulation
              </div>
              <div className="mt-1 tabular-nums">
                {watchlist.length} watched · {MARKET_CATALOG.length} searchable
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 mt-8">
        <TickerTape quotes={tapeQuotes} ready={tapeReady} />
      </div>

      <main className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.85fr)] lg:gap-12">
        <section aria-labelledby="watchlist-heading" className="min-w-0">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2
                id="watchlist-heading"
                className="font-display text-2xl tracking-tight text-[var(--ink)] sm:text-3xl"
              >
                Watchlist
              </h2>
              <p className="mt-1 text-sm text-[var(--ink-soft)]">
                Prices update every second. Remove anything you no longer need.
              </p>
            </div>
          </div>
          <Watchlist
            quotes={watchQuotes}
            ready={watchReady}
            onRemove={removeSymbol}
          />
        </section>

        <aside aria-label="Symbol search" className="lg:pt-12">
          <SymbolSearch watchlist={watchlist} onAdd={addSymbol} />
          <p className="mt-4 font-mono text-xs leading-relaxed text-[var(--ink-soft)]">
            Demo board uses mock ticks. Hook up a market data API later without
            changing the layout.
          </p>
        </aside>
      </main>

      <footer className="relative z-10 border-t border-[var(--line)] px-5 py-5 sm:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 font-mono text-xs text-[var(--ink-soft)] sm:flex-row sm:items-center sm:justify-between">
          <span>TICKR · simulated quotes for prototyping</span>
          <span>Watchlist saved in this browser</span>
        </div>
      </footer>
    </div>
  )
}
