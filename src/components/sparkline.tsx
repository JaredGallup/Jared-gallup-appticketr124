"use client"

import { cn } from "cn"

type SparklineProps = {
  values: number[]
  tone: "up" | "down" | "flat"
  className?: string
}

export function Sparkline({ values, tone, className }: SparklineProps) {
  if (values.length < 2) return null

  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const width = 120
  const height = 36
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width
      const y = height - ((value - min) / range) * (height - 4) - 2
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(" ")

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("h-9 w-[7.5rem] overflow-visible", className)}
      aria-hidden
    >
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        className={cn(
          tone === "up" && "text-[var(--tick-up)]",
          tone === "down" && "text-[var(--tick-down)]",
          tone === "flat" && "text-[var(--tick-flat)]"
        )}
      />
    </svg>
  )
}
