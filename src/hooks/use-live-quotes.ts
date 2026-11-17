"use client"

import { useEffect, useMemo, useState } from "react"
import {
  MARKET_CATALOG,
  createQuote,
  tickQuote,
  type Quote,
} from "@/lib/market-data"

const catalogBySymbol = Object.fromEntries(
  MARKET_CATALOG.map((item) => [item.symbol, item])
)

function buildQuotes(symbols: string[], seed = 1) {
  const next: Record<string, Quote> = {}
  for (const symbol of symbols) {
    const meta = catalogBySymbol[symbol]
    if (meta) next[symbol] = createQuote(meta, seed)
  }
  return next
}

export function useLiveQuotes(symbols: string[]) {
  const uniqueSymbols = useMemo(
    () => Array.from(new Set(symbols.map((s) => s.toUpperCase()))),
    [symbols]
  )
  const symbolsKey = uniqueSymbols.join(",")

  const [quotes, setQuotes] = useState(() => buildQuotes(uniqueSymbols))
  const [trackedKey, setTrackedKey] = useState(symbolsKey)

  if (trackedKey !== symbolsKey) {
    setTrackedKey(symbolsKey)
    setQuotes(buildQuotes(uniqueSymbols))
  }

  useEffect(() => {
    if (uniqueSymbols.length === 0) return

    const id = window.setInterval(() => {
      setQuotes((current) => {
        const next = { ...current }
        let changed = false
        for (const symbol of uniqueSymbols) {
          const meta = catalogBySymbol[symbol]
          const quote = next[symbol]
          if (!meta || !quote) continue
          if (Math.random() > 0.66) continue
          next[symbol] = tickQuote(quote, meta)
          changed = true
        }
        return changed ? next : current
      })
    }, 900)

    return () => window.clearInterval(id)
  }, [symbolsKey, uniqueSymbols])

  const ordered = useMemo(
    () =>
      uniqueSymbols
        .map((symbol) => quotes[symbol])
        .filter((quote): quote is Quote => Boolean(quote)),
    [quotes, uniqueSymbols]
  )

  return {
    quotes: ordered,
    bySymbol: quotes,
    ready: uniqueSymbols.length === 0 || ordered.length > 0,
  }
}
