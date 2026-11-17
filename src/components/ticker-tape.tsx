"use client"

import { cn } from "cn"
import {
  formatChange,
  formatPercent,
  formatPrice,
  type Quote,
} from "@/lib/market-data"

type TickerTapeProps = {
  quotes: Quote[]
  ready: boolean
}

function TapeItem({ quote }: { quote: Quote }) {
  const tone =
    quote.changePercent > 0 ? "up" : quote.changePercent < 0 ? "down" : "flat"

  return (
    <div
      className={cn(
        "flex shrink-0 items-baseline gap-3 px-5 font-mono text-sm tracking-tight",
        quote.lastTick === "up" && "animate-tick-flash-up",
        quote.lastTick === "down" && "animate-tick-flash-down"
      )}
    >
      <span className="font-semibold text-[var(--ink)]">{quote.symbol}</span>
      <span className="tabular-nums text-[var(--ink-soft)]">
        {formatPrice(quote.price)}
      </span>
      <span
        className={cn(
          "tabular-nums",
          tone === "up" && "text-[var(--tick-up)]",
          tone === "down" && "text-[var(--tick-down)]",
          tone === "flat" && "text-[var(--tick-flat)]"
        )}
      >
        {formatChange(quote.change)} · {formatPercent(quote.changePercent)}
      </span>
    </div>
  )
}

export function TickerTape({ quotes, ready }: TickerTapeProps) {
  if (!ready) {
    return (
      <div className="flex h-12 items-center border-y border-[var(--line)] bg-[var(--tape)] px-4">
        <div className="h-3 w-40 animate-pulse rounded-sm bg-[var(--line)]" />
        <div className="ml-6 h-3 w-28 animate-pulse rounded-sm bg-[var(--line)]" />
        <div className="ml-6 h-3 w-36 animate-pulse rounded-sm bg-[var(--line)]" />
      </div>
    )
  }

  if (quotes.length === 0) {
    return (
      <div className="flex h-12 items-center border-y border-[var(--line)] bg-[var(--tape)] px-5 font-mono text-sm text-[var(--ink-soft)]">
        Add symbols to your watchlist to start the tape.
      </div>
    )
  }

  const loop = [...quotes, ...quotes]

  return (
    <div className="relative overflow-hidden border-y border-[var(--line)] bg-[var(--tape)]">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[var(--tape)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[var(--tape)] to-transparent" />
      <div className="ticker-track flex h-12 w-max items-center">
        {loop.map((quote, index) => (
          <TapeItem key={`${quote.symbol}-${index}`} quote={quote} />
        ))}
      </div>
    </div>
  )
}
