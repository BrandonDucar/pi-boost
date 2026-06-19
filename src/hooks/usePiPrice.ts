import { useState, useEffect, useCallback } from 'react'
import { generatePriceData, type PricePoint } from '@/lib/pi-simulation'

/** Pi price data and market stats */
export interface PiPriceData {
  currentPrice: number
  priceUSD: number
  priceBTC: number
  priceEUR: number
  change24h: number
  changePercent24h: number
  marketCap: number
  volume24h: number
  allTimeHigh: number
  circulatingSupply: number
  history7d: PricePoint[]
  history30d: PricePoint[]
  historyAll: PricePoint[]
  lastUpdated: Date
}

const MOCK_BASE_PRICE = 34.52
const BTC_PRICE = 68000 // mock BTC price

/**
 * usePiPrice — Simulates live Pi price fetching.
 * In production, this would call CoinGecko or a real Pi API.
 */
export function usePiPrice() {
  const [priceData, setPriceData] = useState<PiPriceData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const generatePriceDataFull = useCallback((): PiPriceData => {
    // Simulate small real-time price tick (±0.5%)
    const tick = (Math.random() - 0.5) * 0.01
    const currentPrice = parseFloat((MOCK_BASE_PRICE * (1 + tick)).toFixed(2))
    const change24h = parseFloat(((Math.random() - 0.4) * 3).toFixed(2))

    return {
      currentPrice,
      priceUSD: currentPrice,
      priceBTC: parseFloat((currentPrice / BTC_PRICE).toFixed(8)),
      priceEUR: parseFloat((currentPrice * 0.92).toFixed(2)),
      change24h,
      changePercent24h: parseFloat(((change24h / currentPrice) * 100).toFixed(2)),
      marketCap: Math.floor(currentPrice * 100_000_000), // 100M circulating
      volume24h: Math.floor(Math.random() * 50_000_000 + 10_000_000),
      allTimeHigh: 72.34,
      circulatingSupply: 100_000_000,
      history7d: generatePriceData(7, currentPrice),
      history30d: generatePriceData(30, currentPrice),
      historyAll: generatePriceData(180, 10), // start lower for realism
      lastUpdated: new Date(),
    }
  }, [])

  useEffect(() => {
    // Simulate initial load
    const timeout = setTimeout(() => {
      setPriceData(generatePriceDataFull())
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timeout)
  }, [generatePriceDataFull])

  // Simulate live price tick every 30s
  useEffect(() => {
    if (isLoading) return

    const interval = setInterval(() => {
      setPriceData(prev => {
        if (!prev) return prev
        const tick = (Math.random() - 0.5) * 0.008
        const newPrice = parseFloat((prev.currentPrice * (1 + tick)).toFixed(2))
        return {
          ...prev,
          currentPrice: newPrice,
          priceUSD: newPrice,
          priceBTC: parseFloat((newPrice / BTC_PRICE).toFixed(8)),
          priceEUR: parseFloat((newPrice * 0.92).toFixed(2)),
          lastUpdated: new Date(),
        }
      })
    }, 30_000)

    return () => clearInterval(interval)
  }, [isLoading])

  const refresh = useCallback(() => {
    setIsLoading(true)
    setTimeout(() => {
      setPriceData(generatePriceDataFull())
      setIsLoading(false)
    }, 500)
  }, [generatePriceDataFull])

  return { priceData, isLoading, error, refresh }
}
