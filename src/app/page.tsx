import { Suspense } from "react"
import { TickerApp } from "@/components/ticker-app"

function BoardFallback() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <div className="atmosphere" aria-hidden />
      <div className="relative z-10 px-5 pt-8 sm:px-8 sm:pt-10">
        <p className="font-display text-5xl tracking-[-0.04em] text-[var(--ink)] sm:text-6xl">
          TICKR
        </p>
        <p className="mt-3 text-[var(--ink-soft)]">Loading the tape…</p>
      </div>
      <div className="relative z-10 mt-8 flex h-12 items-center border-y border-[var(--line)] bg-[var(--tape)] px-4">
        <div className="h-3 w-40 animate-pulse rounded-sm bg-[var(--line)]" />
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<BoardFallback />}>
      <TickerApp />
    </Suspense>
  )
}
