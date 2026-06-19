import { motion } from 'framer-motion'
import { Flame, Users, Clock, TrendingUp } from 'lucide-react'
import { formatPi } from '@/lib/utils'

interface MiningStatsProps {
  miningRate: number
  miningStreak: number
  circleSize: number
  currentSessionEarned: number
  elapsedFormatted: string
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string
  sublabel?: string
  glowColor?: string
  delay?: number
}

function StatCard({ icon, label, value, sublabel, glowColor = 'rgba(240,165,0,0.2)', delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="glass-card p-4 flex flex-col gap-2"
      style={{ boxShadow: `0 4px 24px ${glowColor}` }}
    >
      <div className="flex items-center justify-between">
        <span className="text-pi-muted text-xs font-medium uppercase tracking-wide">{label}</span>
        <div className="text-pi-gold">{icon}</div>
      </div>
      <div>
        <div className="text-xl font-bold text-pi-text">{value}</div>
        {sublabel && <div className="text-xs text-pi-muted mt-0.5">{sublabel}</div>}
      </div>
    </motion.div>
  )
}

/**
 * MiningStats — 2x2 grid of quick stat cards below the mining ring.
 */
export function MiningStats({
  miningRate,
  miningStreak,
  circleSize,
  currentSessionEarned,
  elapsedFormatted,
}: MiningStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      <StatCard
        icon={<TrendingUp size={16} />}
        label="Mining Rate"
        value={`${miningRate.toFixed(4)} π/hr`}
        sublabel={`${(miningRate * 24).toFixed(4)} π/day est.`}
        delay={0}
      />
      <StatCard
        icon={<Flame size={16} />}
        label="Streak"
        value={`${miningStreak} days`}
        sublabel="Keep it going! 🔥"
        glowColor="rgba(239,68,68,0.15)"
        delay={0.05}
      />
      <StatCard
        icon={<Users size={16} />}
        label="Security Circle"
        value={`${circleSize}/5`}
        sublabel={`+${(circleSize * 20)}% rate boost`}
        glowColor="rgba(107,33,168,0.2)"
        delay={0.1}
      />
      <StatCard
        icon={<Clock size={16} />}
        label="Session Earned"
        value={`${formatPi(currentSessionEarned)} π`}
        sublabel={elapsedFormatted ? `Elapsed: ${elapsedFormatted}` : 'Not mining'}
        delay={0.15}
      />
    </div>
  )
}
