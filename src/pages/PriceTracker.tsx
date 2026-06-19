import { motion } from 'framer-motion'
import { RefreshCw, Bell, TrendingUp, Award } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { PriceChart, PriceTicker } from '@/components/price/PriceChart'
import { usePiPrice } from '@/hooks/usePiPrice'
import { useSettingsStore } from '@/store/settingsStore'
import { formatUSD } from '@/lib/utils'

export default function PriceTracker() {
  const { priceData, isLoading, refresh } = usePiPrice()
  const { priceAlerts, removePriceAlert, togglePriceAlert, addPriceAlert } = useSettingsStore()

  if (isLoading || !priceData) {
    return (
      <div className="min-h-screen bg-pi-dark flex items-center justify-center">
        <div className="text-center space-y-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-10 h-10 border-2 border-pi-gold border-t-transparent rounded-full mx-auto"
          />
          <div className="text-pi-muted text-sm">Loading price data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pi-dark bg-dark-mesh">
      <Navbar title="Pi Price" />
      <div className="page-container space-y-5">

        {/* Refresh button */}
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs text-pi-muted">Last updated</div>
            <div className="text-xs text-pi-text">{priceData.lastUpdated.toLocaleTimeString()}</div>
          </div>
          <motion.button
            whileTap={{ scale: 0.9, rotate: 180 }}
            onClick={refresh}
            className="btn-secondary px-4 py-2 rounded-xl flex items-center gap-2 text-sm"
          >
            <RefreshCw size={15} />
            Refresh
          </motion.button>
        </div>

        {/* Price ticker */}
        <PriceTicker
          priceUSD={priceData.priceUSD}
          priceBTC={priceData.priceBTC}
          priceEUR={priceData.priceEUR}
          change24h={priceData.change24h}
          changePercent24h={priceData.changePercent24h}
          marketCap={priceData.marketCap}
          volume24h={priceData.volume24h}
        />

        {/* Chart */}
        <PriceChart
          history7d={priceData.history7d}
          history30d={priceData.history30d}
          historyAll={priceData.historyAll}
          currentPrice={priceData.currentPrice}
        />

        {/* ATH / Supply */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4"
          >
            <div className="flex items-center gap-2 text-pi-gold mb-2">
              <Award size={16} />
              <span className="text-xs font-bold uppercase tracking-wide">All-Time High</span>
            </div>
            <div className="text-xl font-black text-pi-text">{formatUSD(priceData.allTimeHigh)}</div>
            <div className="text-xs text-pi-muted mt-1">
              {((priceData.currentPrice / priceData.allTimeHigh - 1) * 100).toFixed(1)}% from ATH
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass-card p-4"
          >
            <div className="flex items-center gap-2 text-pi-purple-light mb-2">
              <TrendingUp size={16} />
              <span className="text-xs font-bold uppercase tracking-wide">Circulating</span>
            </div>
            <div className="text-xl font-black text-pi-text">100M</div>
            <div className="text-xs text-pi-muted mt-1">π in circulation</div>
          </motion.div>
        </div>

        {/* AI Prediction (mock) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5 border border-pi-purple/30"
          style={{ boxShadow: '0 4px 24px rgba(107,33,168,0.2)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="text-lg">🔮</div>
            <span className="text-sm font-bold text-pi-purple-light uppercase tracking-wide">AI Prediction (Mock)</span>
            <div className="badge badge-purple text-xs ml-auto">Beta</div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-pi-muted text-sm">7-Day Target</span>
              <span className="font-bold text-green-400">{formatUSD(priceData.currentPrice * 1.08)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-pi-muted text-sm">30-Day Target</span>
              <span className="font-bold text-green-400">{formatUSD(priceData.currentPrice * 1.22)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-pi-muted text-sm">Sentiment</span>
              <span className="badge-gold text-xs">Bullish 🚀</span>
            </div>
          </div>
          <p className="text-xs text-pi-muted mt-3">⚠️ Not financial advice. Predictions are simulated for demonstration.</p>
        </motion.div>

        {/* Price alerts */}
        <div>
          <div className="section-title flex items-center gap-2">
            <Bell size={16} className="text-pi-gold" />
            <span>Price Alerts</span>
          </div>
          <div className="space-y-2">
            {priceAlerts.map((alert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`text-lg ${alert.direction === 'above' ? '📈' : '📉'}`}>
                    {alert.direction === 'above' ? '📈' : '📉'}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-pi-text">
                      Alert when Pi goes {alert.direction} {formatUSD(alert.price)}
                    </div>
                    <div className="text-xs text-pi-muted">Price alert</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => togglePriceAlert(i)}
                    className={`w-10 h-6 rounded-full transition-all ${alert.active ? 'bg-pi-gold' : 'bg-pi-border'}`}
                  >
                    <motion.div
                      animate={{ x: alert.active ? 16 : 2 }}
                      className="w-4 h-4 bg-white rounded-full shadow mx-auto"
                    />
                  </motion.button>
                  <button
                    onClick={() => removePriceAlert(i)}
                    className="text-pi-muted hover:text-red-400 text-xs transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
