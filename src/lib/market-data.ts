export type Quote = {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  history: number[]
  lastTick: "up" | "down" | "flat"
}

export type SymbolMeta = {
  symbol: string
  name: string
  basePrice: number
  volatility: number
}

export const MARKET_CATALOG: SymbolMeta[] = [
  { symbol: "AAPL", name: "Apple", basePrice: 214.32, volatility: 0.004 },
  { symbol: "MSFT", name: "Microsoft", basePrice: 428.11, volatility: 0.0035 },
  { symbol: "NVDA", name: "NVIDIA", basePrice: 131.45, volatility: 0.008 },
  { symbol: "GOOGL", name: "Alphabet", basePrice: 176.88, volatility: 0.004 },
  { symbol: "AMZN", name: "Amazon", basePrice: 198.64, volatility: 0.0045 },
  { symbol: "META", name: "Meta", basePrice: 582.07, volatility: 0.005 },
  { symbol: "TSLA", name: "Tesla", basePrice: 248.91, volatility: 0.01 },
  { symbol: "JPM", name: "JPMorgan", basePrice: 246.33, volatility: 0.003 },
  { symbol: "V", name: "Visa", basePrice: 312.4, volatility: 0.0025 },
  { symbol: "MA", name: "Mastercard", basePrice: 521.18, volatility: 0.0028 },
  { symbol: "XOM", name: "Exxon Mobil", basePrice: 112.76, volatility: 0.004 },
  { symbol: "UNH", name: "UnitedHealth", basePrice: 548.22, volatility: 0.0035 },
  { symbol: "LLY", name: "Eli Lilly", basePrice: 812.55, volatility: 0.006 },
  { symbol: "AVGO", name: "Broadcom", basePrice: 178.33, volatility: 0.007 },
  { symbol: "COST", name: "Costco", basePrice: 912.08, volatility: 0.0025 },
  { symbol: "NFLX", name: "Netflix", basePrice: 764.21, volatility: 0.0055 },
  { symbol: "AMD", name: "AMD", basePrice: 124.67, volatility: 0.009 },
  { symbol: "CRM", name: "Salesforce", basePrice: 289.44, volatility: 0.0045 },
  { symbol: "ORCL", name: "Oracle", basePrice: 168.92, volatility: 0.004 },
  { symbol: "INTC", name: "Intel", basePrice: 24.18, volatility: 0.008 },
  { symbol: "DIS", name: "Disney", basePrice: 98.55, volatility: 0.004 },
  { symbol: "BA", name: "Boeing", basePrice: 176.4, volatility: 0.006 },
  { symbol: "NKE", name: "Nike", basePrice: 78.12, volatility: 0.0045 },
  { symbol: "SPY", name: "S&P 500 ETF", basePrice: 562.14, volatility: 0.002 },
  { symbol: "QQQ", name: "Nasdaq 100 ETF", basePrice: 492.33, volatility: 0.0025 },
  { symbol: "IWM", name: "Russell 2000 ETF", basePrice: 218.77, volatility: 0.003 },
  { symbol: "GLD", name: "Gold ETF", basePrice: 246.08, volatility: 0.002 },
  { symbol: "BTC", name: "Bitcoin", basePrice: 97240, volatility: 0.012 },
  { symbol: "ETH", name: "Ethereum", basePrice: 3628, volatility: 0.014 },
  { symbol: "SOL", name: "Solana", basePrice: 178.4, volatility: 0.016 },
]

export const DEFAULT_WATCHLIST = [
  "AAPL",
  "MSFT",
  "NVDA",
  "TSLA",
  "SPY",
  "BTC",
]

const STORAGE_KEY = "tickr.watchlist.v1"

export function loadWatchlist(): string[] {
  if (typeof window === "undefined") return DEFAULT_WATCHLIST
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_WATCHLIST
    const parsed = JSON.parse(raw) as unknown
    if (
      Array.isArray(parsed) &&
      parsed.every((item) => typeof item === "string") &&
      parsed.length > 0
    ) {
      return parsed
    }
  } catch {
    // ignore corrupt storage
  }
  return DEFAULT_WATCHLIST
}

export function saveWatchlist(symbols: string[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(symbols))
}

export function findSymbol(query: string): SymbolMeta | undefined {
  const normalized = query.trim().toUpperCase()
  return MARKET_CATALOG.find(
    (item) =>
      item.symbol === normalized ||
      item.name.toUpperCase() === normalized
  )
}

export function searchSymbols(query: string, limit = 8): SymbolMeta[] {
  const normalized = query.trim().toUpperCase()
  if (!normalized) return MARKET_CATALOG.slice(0, limit)
  return MARKET_CATALOG.filter(
    (item) =>
      item.symbol.includes(normalized) ||
      item.name.toUpperCase().includes(normalized)
  ).slice(0, limit)
}

function seededNoise(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function createQuote(meta: SymbolMeta, now = Date.now()): Quote {
  const openBias = (seededNoise(meta.symbol.charCodeAt(0) * 17) - 0.5) * 0.01
  const open = meta.basePrice * (1 + openBias)
  const history: number[] = []
  let price = open
  for (let i = 0; i < 24; i += 1) {
    const wobble =
      (seededNoise(now / 1000 + i * meta.symbol.length) - 0.48) *
      meta.volatility *
      meta.basePrice
    price = Math.max(0.01, price + wobble)
    history.push(Number(price.toFixed(price >= 1000 ? 0 : 2)))
  }
  const change = price - open
  const changePercent = (change / open) * 100
  return {
    symbol: meta.symbol,
    name: meta.name,
    price: Number(price.toFixed(price >= 1000 ? 0 : 2)),
    change: Number(change.toFixed(price >= 1000 ? 0 : 2)),
    changePercent: Number(changePercent.toFixed(2)),
    history,
    lastTick: change > 0 ? "up" : change < 0 ? "down" : "flat",
  }
}

export function tickQuote(quote: Quote, meta: SymbolMeta): Quote {
  const delta =
    (Math.random() - 0.48) * meta.volatility * meta.basePrice * 1.8
  const nextPrice = Math.max(0.01, quote.price + delta)
  const open = quote.price - quote.change
  const change = nextPrice - open
  const changePercent = (change / open) * 100
  const history = [...quote.history.slice(-23), nextPrice]
  return {
    ...quote,
    price: Number(nextPrice.toFixed(nextPrice >= 1000 ? 0 : 2)),
    change: Number(change.toFixed(nextPrice >= 1000 ? 0 : 2)),
    changePercent: Number(changePercent.toFixed(2)),
    history: history.map((value) =>
      Number(value.toFixed(value >= 1000 ? 0 : 2))
    ),
    lastTick: delta > 0 ? "up" : delta < 0 ? "down" : "flat",
  }
}

export function formatPrice(value: number) {
  if (value >= 1000) {
    return value.toLocaleString("en-US", {
      maximumFractionDigits: 0,
    })
  }
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function formatChange(value: number) {
  const sign = value > 0 ? "+" : ""
  return `${sign}${value.toFixed(2)}`
}

export function formatPercent(value: number) {
  const sign = value > 0 ? "+" : ""
  return `${sign}${value.toFixed(2)}%`
}
