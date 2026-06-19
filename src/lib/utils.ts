import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merges Tailwind CSS classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format Pi balance to 4 decimal places */
export function formatPi(value: number): string {
  return value.toFixed(4)
}

/** Format Pi to compact display (e.g. 1.2K) */
export function formatPiCompact(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
  return value.toFixed(2)
}

/** Format USD price */
export function formatUSD(value: number): string {
  if (value < 0.01) return `$${value.toFixed(6)}`
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

/** Format duration in seconds to HH:MM:SS */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':')
}

/** Format duration to human-readable */
export function formatDurationHuman(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m remaining`
  return `${m}m remaining`
}

/** Generate a random Pi wallet address (for demo purposes) */
export function generateWalletAddress(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let addr = 'G'
  for (let i = 0; i < 55; i++) {
    addr += chars[Math.floor(Math.random() * chars.length)]
  }
  return addr
}

/** Calculate mining rate based on security circle size */
export function calculateMiningRate(circleSize: number, baseRate = 0.1): number {
  // Pi Network formula: base rate × (1 + 0.2 × each active member, up to 5)
  const activeBonus = Math.min(circleSize, 5) * 0.2
  return baseRate * (1 + activeBonus)
}

/** Generate simulated price history for charts */
export function generatePriceHistory(
  days: number,
  basePrice: number,
  volatility = 0.05
): Array<{ date: string; price: number; volume: number }> {
  const data = []
  let price = basePrice
  const now = new Date()

  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const change = (Math.random() - 0.48) * volatility
    price = Math.max(0.001, price * (1 + change))
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: parseFloat(price.toFixed(4)),
      volume: Math.floor(Math.random() * 1000000 + 500000),
    })
  }
  return data
}

/** Copy text to clipboard */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    return true
  }
}

/** Get percentage progress of mining session */
export function getMiningProgress(startTime: number, sessionDuration = 86400): number {
  const elapsed = (Date.now() - startTime) / 1000
  return Math.min(100, (elapsed / sessionDuration) * 100)
}

/** Truncate wallet address for display */
export function truncateAddress(address: string, chars = 6): string {
  if (address.length <= chars * 2 + 3) return address
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

/** Get greeting based on time of day */
export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}
