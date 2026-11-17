"use client"

import { X } from "lucide-react"
import { cn } from "cn"
import { Sparkline } from "@/components/sparkline"
import { Button } from "@/components/ui/button"
import {
  formatChange,
  formatPercent,
  formatPrice,
  type Quote,
} from "@/lib/market-data"

type WatchlistProps = {
  quotes: Quote[]
  ready: boolean
  onRemove: (symbol: string) => void
}

export function Watchlist({ quotes, ready, onRemove }: WatchlistProps) {
  if (!ready) {
    return (
      <div className="space-y-3" aria-busy="true" aria-label="Loading quotes">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-[4.5rem] animate-pulse border border-[var(--line)] bg-white/40"
          />
        ))}
      </div>
    )
  }

  if (quotes.length === 0) {
    return (
      <div className="border border-dashed border-[var(--line)] bg-white/40 px-6 py-14 text-center">
        <p className="font-display text-2xl tracking-tight text-[var(--ink)]">
          Your tape is empty
        </p>
        <p className="mt-2 text-[var(--ink-soft)]">
          Search for a symbol on the right to start watching live simulated
          quotes.
        </p>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-[var(--line)] border border-[var(--line)] bg-white/60">
      {quotes.map((quote, index) => {
        const tone =
          quote.changePercent > 0
            ? "up"
            : quote.changePercent < 0
              ? "down"
              : "flat"

        return (
          <li
            key={quote.symbol}
            className={cn(
              "group grid grid-cols-[1fr_auto] items-center gap-4 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:gap-6",
              "animate-row-in",
              quote.lastTick === "up" && "animate-tick-flash-up",
              quote.lastTick === "down" && "animate-tick-flash-down"
            )}
            style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
          >
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-base font-semibold tracking-tight text-[var(--ink)]">
                  {quote.symbol}
                </span>
                <span className="truncate text-sm text-[var(--ink-soft)]">
                  {quote.name}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-sm">
                <span className="text-lg tabular-nums text-[var(--ink)]">
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
                  {formatChange(quote.change)} ({formatPercent(quote.changePercent)})
                </span>
              </div>
            </div>

            <div className="hidden sm:block">
              <Sparkline values={quote.history} tone={tone} />
            </div>

            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label={`Remove ${quote.symbol}`}
              onClick={() => onRemove(quote.symbol)}
              className="rounded-md text-[var(--ink-soft)] opacity-70 transition group-hover:opacity-100"
            >
              <X />
            </Button>
          </li>
        )
      })}
    </ul>
  )
}
