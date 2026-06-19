import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { motion } from 'framer-motion'
import { useState } from 'react'
import type { PricePoint } from '@/lib/pi-simulation'
import { formatUSD } from '@/lib/utils'

type TimeRange = '7D' | '30D' | 'ALL'

interface PriceChartProps {
  history7d: PricePoint[]
  history30d: PricePoint[]
  historyAll: PricePoint[]
  currentPrice: number
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-pi-surface border border-pi-border rounded-xl px-3 py-2 text-sm shadow-glass">
        <p className="text-pi-muted text-xs mb-1">{label}</p>
        <p className="text-pi-gold font-bold">{formatUSD(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

/** Area price chart for Pi value tracker */
export function PriceChart({ history7d, history30d, historyAll, currentPrice }: PriceChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('7D')

  const data = timeRange === '7D' ? history7d : timeRange === '30D' ? history30d : historyAll

  const ranges: TimeRange[] = ['7D', '30D', 'ALL']

  return (
    <div className="glass-card p-5 space-y-4">
      {/* Range selector */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-pi-text">Price History</h3>
        <div className="flex bg-pi-dark rounded-xl p-1 gap-1">
          {ranges.map(r => (
            <motion.button
              key={r}
              whileTap={{ scale: 0.9 }}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                timeRange === r
                  ? 'bg-pi-gold text-pi-dark'
                  : 'text-pi-muted hover:text-pi-text'
              }`}
            >
              {r}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F0A500" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#F0A500" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,30,46,0.8)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: '#64748B', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval={timeRange === '7D' ? 1 : timeRange === '30D' ? 5 : 30}
            />
            <YAxis
              tick={{ fill: '#64748B', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `$${v}`}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#F0A500"
              strokeWidth={2}
              fill="url(#priceGradient)"
              dot={false}
              activeDot={{ r: 5, fill: '#F0A500', stroke: '#0A0A0F', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

/** Live price ticker card */
export function PriceTicker({
  priceUSD,
  priceBTC,
  priceEUR,
  change24h,
  changePercent24h,
  marketCap,
  volume24h,
}: {
  priceUSD: number
  priceBTC: number
  priceEUR: number
  change24h: number
  changePercent24h: number
  marketCap: number
  volume24h: number
}) {
  const [currency, setCurrency] = useState<'USD' | 'BTC' | 'EUR'>('USD')
  const isPositive = change24h >= 0

  const displayPrice = currency === 'USD'
    ? formatUSD(priceUSD)
    : currency === 'BTC'
    ? `₿${priceBTC.toFixed(8)}`
    : `€${priceEUR.toFixed(2)}`

  return (
    <motion.div
      className="glass-card p-5 space-y-4"
      style={{ boxShadow: '0 4px 24px rgba(240,165,0,0.15)' }}
    >
      {/* Currency tabs */}
      <div className="flex bg-pi-dark rounded-xl p-1 gap-1 w-fit">
        {(['USD', 'BTC', 'EUR'] as const).map(c => (
          <button
            key={c}
            onClick={() => setCurrency(c)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currency === c ? 'bg-pi-gold text-pi-dark' : 'text-pi-muted'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Price display */}
      <div className="flex items-end justify-between">
        <div>
          <motion.div
            key={displayPrice}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black text-pi-text text-glow"
          >
            {displayPrice}
          </motion.div>
          <div className={`text-sm font-semibold mt-1 flex items-center gap-1 ${
            isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            <span>{isPositive ? '▲' : '▼'}</span>
            <span>{isPositive ? '+' : ''}{change24h.toFixed(2)} ({changePercent24h.toFixed(2)}%)</span>
            <span className="text-pi-muted font-normal">24h</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-pi-muted">Market Cap</div>
          <div className="font-bold text-pi-text text-sm">${(marketCap / 1_000_000).toFixed(0)}M</div>
          <div className="text-xs text-pi-muted mt-1">Volume 24h</div>
          <div className="font-bold text-pi-text text-sm">${(volume24h / 1_000_000).toFixed(1)}M</div>
        </div>
      </div>
    </motion.div>
  )
}
