"use client"

import { useDeferredValue, useMemo, useState } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { searchSymbols } from "@/lib/market-data"

type SymbolSearchProps = {
  watchlist: string[]
  onAdd: (symbol: string) => void
}

export function SymbolSearch({ watchlist, onAdd }: SymbolSearchProps) {
  const [query, setQuery] = useState("")
  const deferredQuery = useDeferredValue(query)
  const results = useMemo(
    () => searchSymbols(deferredQuery, 6),
    [deferredQuery]
  )

  return (
    <div className="space-y-3">
      <label className="block font-display text-sm tracking-[0.08em] text-[var(--ink-soft)] uppercase">
        Add to watchlist
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--ink-soft)]" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search AAPL, NVIDIA, Bitcoin…"
          className="h-11 border-[var(--line)] bg-white/70 pl-10 font-mono shadow-none"
          aria-label="Search symbols"
        />
      </div>
      <ul className="divide-y divide-[var(--line)] border border-[var(--line)] bg-white/55">
        {results.length === 0 ? (
          <li className="px-4 py-5 font-mono text-sm text-[var(--ink-soft)]">
            No symbols match “{query}”.
          </li>
        ) : (
          results.map((item) => {
            const added = watchlist.includes(item.symbol)
            return (
              <li
                key={item.symbol}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="font-mono text-sm font-semibold tracking-tight text-[var(--ink)]">
                    {item.symbol}
                  </div>
                  <div className="truncate text-sm text-[var(--ink-soft)]">
                    {item.name}
                  </div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant={added ? "secondary" : "default"}
                  disabled={added}
                  onClick={() => {
                    onAdd(item.symbol)
                    setQuery("")
                  }}
                  className="rounded-md"
                >
                  {added ? (
                    "Added"
                  ) : (
                    <>
                      <Plus data-icon="inline-start" />
                      Add
                    </>
                  )}
                </Button>
              </li>
            )
          })
        )}
      </ul>
    </div>
  )
}
