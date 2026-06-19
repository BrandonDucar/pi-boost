import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, Server, Wallet, Copy, Plus, Trash2, CheckCircle } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { useUserStore } from '@/store/userStore'
import { usePiPrice } from '@/hooks/usePiPrice'
import { calculateMiningRate, formatPi, formatUSD, copyToClipboard, truncateAddress, generateWalletAddress } from '@/lib/utils'
import { cn } from '@/lib/utils'

// ─── Mining Calculator ─────────────────────────────────────────────────────────
function MiningCalculator() {
  const [circleSize, setCircleSize] = useState(3)
  const { priceData } = usePiPrice()
  const rate = calculateMiningRate(circleSize)
  const dailyPi = rate * 24
  const weeklyPi = dailyPi * 7
  const dailyUSD = priceData ? dailyPi * priceData.currentPrice : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 space-y-4"
    >
      <div className="flex items-center gap-2">
        <Calculator size={20} className="text-pi-gold" />
        <h3 className="font-bold text-pi-text">Mining Calculator</h3>
      </div>

      <div>
        <label className="text-xs text-pi-muted mb-2 block">
          Security Circle Size: <span className="text-pi-gold font-bold">{circleSize} members</span>
        </label>
        <input
          type="range"
          min={0}
          max={5}
          value={circleSize}
          onChange={e => setCircleSize(Number(e.target.value))}
          className="w-full accent-pi-gold"
        />
        <div className="flex justify-between text-xs text-pi-muted mt-1">
          <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Rate', value: `${rate.toFixed(4)} π/hr` },
          { label: 'Circle Boost', value: `+${circleSize * 20}%` },
          { label: 'Daily Pi', value: `${formatPi(dailyPi)} π` },
          { label: 'Weekly Pi', value: `${formatPi(weeklyPi)} π` },
          { label: 'Daily USD*', value: dailyUSD ? formatUSD(dailyUSD) : '—' },
          { label: '30-Day Pi', value: `${formatPi(dailyPi * 30)} π` },
        ].map(stat => (
          <div key={stat.label} className="bg-pi-dark rounded-xl p-3">
            <div className="text-xs text-pi-muted">{stat.label}</div>
            <div className="font-bold text-pi-text mt-1">{stat.value}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-pi-muted">*Based on simulated Pi price. Not financial advice.</p>
    </motion.div>
  )
}

// ─── Node Setup Checklist ──────────────────────────────────────────────────────
const NODE_STEPS = [
  { key: 'install-docker', label: 'Install Docker Desktop', detail: 'Required for running the Pi Node container.' },
  { key: 'download-node', label: 'Download Pi Node App', detail: 'Download from Pi Network official site.' },
  { key: 'configure-ports', label: 'Configure Port Forwarding', detail: 'Open ports 31400–31409 on your router.' },
  { key: 'add-wallet', label: 'Connect Pi Wallet', detail: 'Link your Pi wallet address to the node.' },
  { key: 'start-node', label: 'Start the Node', detail: 'Launch and let it sync with the network.' },
  { key: 'verify-status', label: 'Verify Node Status', detail: 'Confirm "Connected" status in the node app.' },
]

function NodeChecklist() {
  const { nodeChecklist, toggleNodeStep } = useUserStore()
  const completedCount = Object.values(nodeChecklist).filter(Boolean).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Server size={20} className="text-pi-purple-light" />
          <h3 className="font-bold text-pi-text">Node Setup Guide</h3>
        </div>
        <div className="badge-gold text-xs">{completedCount}/{NODE_STEPS.length}</div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-pi-dark rounded-full h-2">
        <motion.div
          animate={{ width: `${(completedCount / NODE_STEPS.length) * 100}%` }}
          className="h-2 rounded-full bg-pi-gradient"
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="space-y-2">
        {NODE_STEPS.map(step => {
          const done = nodeChecklist[step.key]
          return (
            <motion.button
              key={step.key}
              onClick={() => toggleNodeStep(step.key)}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3',
                done
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-pi-dark border-pi-border hover:border-pi-gold/30'
              )}
            >
              <div className={cn(
                'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5',
                done ? 'bg-green-500 border-green-500' : 'border-pi-border'
              )}>
                {done && <CheckCircle size={12} className="text-white" />}
              </div>
              <div>
                <div className={cn('text-sm font-semibold', done ? 'text-pi-muted line-through' : 'text-pi-text')}>
                  {step.label}
                </div>
                <div className="text-xs text-pi-muted mt-0.5">{step.detail}</div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}

// ─── Wallet Manager ────────────────────────────────────────────────────────────
function WalletManager() {
  const { savedAddresses, addAddress, removeAddress, setPrimaryAddress } = useUserStore()
  const [newLabel, setNewLabel] = useState('')
  const [newAddress, setNewAddress] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [copiedAddr, setCopiedAddr] = useState<string | null>(null)

  const handleAdd = () => {
    if (newLabel && newAddress) {
      addAddress(newLabel, newAddress)
      setNewLabel('')
      setNewAddress('')
      setShowAdd(false)
    }
  }

  const handleCopy = async (address: string) => {
    await copyToClipboard(address)
    setCopiedAddr(address)
    setTimeout(() => setCopiedAddr(null), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet size={20} className="text-pi-gold" />
          <h3 className="font-bold text-pi-text">Wallet Manager</h3>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowAdd(v => !v)}
          className="btn-secondary px-3 py-2 rounded-xl text-xs flex items-center gap-1"
        >
          <Plus size={14} />
          Add
        </motion.button>
      </div>

      {/* Add form */}
      {showAdd && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-2 pb-2 border-b border-pi-border"
        >
          <input
            placeholder="Label (e.g. Main Wallet)"
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            className="pi-input text-sm"
          />
          <input
            placeholder="Pi wallet address"
            value={newAddress}
            onChange={e => setNewAddress(e.target.value)}
            className="pi-input text-sm font-mono"
          />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="btn-primary flex-1 py-2.5 text-sm rounded-xl">Save</button>
            <button onClick={() => setNewAddress(generateWalletAddress())} className="btn-secondary px-3 py-2.5 text-xs rounded-xl">Demo</button>
          </div>
        </motion.div>
      )}

      {savedAddresses.length === 0 ? (
        <p className="text-pi-muted text-sm text-center py-4">No wallets saved yet. Add one above.</p>
      ) : (
        <div className="space-y-2">
          {savedAddresses.map((addr, i) => (
            <motion.div
              key={addr.address}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className={cn(
                'p-3 rounded-xl border transition-all',
                addr.isPrimary ? 'border-pi-gold/40 bg-pi-gold/5' : 'border-pi-border bg-pi-dark'
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-pi-text">{addr.label}</span>
                  {addr.isPrimary && <span className="badge-gold text-xs">Primary</span>}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleCopy(addr.address)} className="p-1.5 rounded-lg hover:bg-pi-surface-2 transition-colors">
                    {copiedAddr === addr.address
                      ? <CheckCircle size={14} className="text-green-400" />
                      : <Copy size={14} className="text-pi-muted" />
                    }
                  </button>
                  <button onClick={() => removeAddress(addr.address)} className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors">
                    <Trash2 size={14} className="text-pi-muted hover:text-red-400" />
                  </button>
                </div>
              </div>
              <div className="font-mono text-xs text-pi-muted">{truncateAddress(addr.address)}</div>
              {!addr.isPrimary && (
                <button
                  onClick={() => setPrimaryAddress(addr.address)}
                  className="text-xs text-pi-gold mt-1 hover:underline"
                >
                  Set as primary
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function Utilities() {
  return (
    <div className="min-h-screen bg-pi-dark bg-dark-mesh">
      <Navbar title="Tools" />
      <div className="page-container space-y-5">
        <MiningCalculator />
        <NodeChecklist />
        <WalletManager />
      </div>
    </div>
  )
}
