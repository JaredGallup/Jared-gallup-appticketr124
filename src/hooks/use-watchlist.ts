"use client"

import { useCallback, useSyncExternalStore } from "react"
import {
  DEFAULT_WATCHLIST,
  loadWatchlist,
  saveWatchlist,
} from "@/lib/market-data"

let memoryWatchlist: string[] | null = null
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot() {
  if (memoryWatchlist === null) {
    memoryWatchlist = loadWatchlist()
  }
  return memoryWatchlist
}

function getServerSnapshot() {
  return DEFAULT_WATCHLIST
}

export function useWatchlist() {
  const watchlist = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )

  const setWatchlist = useCallback(
    (updater: string[] | ((current: string[]) => string[])) => {
      const current = getSnapshot()
      const next = typeof updater === "function" ? updater(current) : updater
      memoryWatchlist = next
      saveWatchlist(next)
      emit()
    },
    []
  )

  return [watchlist, setWatchlist] as const
}
