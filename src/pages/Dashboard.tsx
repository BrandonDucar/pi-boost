import { motion } from 'framer-motion'
import { useMining } from '@/hooks/useMining'
import { useMiningStore } from '@/store/miningStore'
import { MiningRing } from '@/components/mining/MiningRing'
import { MiningButton } from '@/components/mining/MiningButton'
import { MiningStats } from '@/components/mining/MiningStats'
import { Navbar } from '@/components/layout/Navbar'
import { formatPi, formatDurationHuman } from '@/lib/utils'

/** Dashboard — the main mining screen */
export default function Dashboard() {
  const {
    isMining,
    progress,
    currentSessionEarned,
    miningRate,
    totalBalance,
    miningStreak,
    remainingFormatted,
    elapsedFormatted,
    handleToggleMining,
  } = useMining()

  const { circleSize, circleMembers } = useMiningStore()
  const activeMembers = circleMembers.filter(m => m.status === 'active')

  return (
    <div className="min-h-screen bg-pi-dark bg-dark-mesh">
      <Navbar showGreeting />

      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-pi-glow rounded-full blur-3xl opacity-20 pointer-events-none" />

      <div className="page-container flex flex-col items-center gap-6">

        {/* Balance header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full text-center space-y-1"
        >
          <div className="text-pi-muted text-xs uppercase tracking-widest font-medium">Total Balance</div>
          <div className="text-5xl font-black gradient-text text-glow">
            {formatPi(totalBalance)}
          </div>
          <div className="text-pi-muted text-sm font-mono">π PI</div>
        </motion.div>

        {/* Mining ring + center info */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center"
        >
          <MiningRing progress={progress} isMining={isMining}>
            <div className="flex flex-col items-center gap-1 text-center px-6">
              {isMining ? (
                <>
                  {/* Active mining center */}
                  <motion.div
                    animate={{ opacity: [1, 0.6, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-xs font-bold text-pi-gold uppercase tracking-widest"
                  >
                    ⚡ MINING
                  </motion.div>
                  <div className="text-2xl font-black text-pi-gold text-glow">
                    +{formatPi(currentSessionEarned)}
                  </div>
                  <div className="text-xs text-pi-muted">π earned this session</div>
                  <div className="text-xs text-pi-text/60 mt-1 font-mono">
                    {remainingFormatted} left
                  </div>
                </>
              ) : (
                <>
                  {/* Idle center */}
                  <div className="text-4xl mb-1">⚡</div>
                  <div className="text-sm font-bold text-pi-muted">Tap to start</div>
                  <div className="text-xs text-pi-muted/60">24h session</div>
                </>
              )}
            </div>
          </MiningRing>
        </motion.div>

        {/* Mining rate badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <div className="badge-gold text-sm">
            {miningRate.toFixed(4)} π/hr
          </div>
          {isMining && (
            <motion.div
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-green-400"
            />
          )}
          {isMining && (
            <span className="text-xs text-green-400 font-semibold">Live</span>
          )}
        </motion.div>

        {/* Mine button */}
        <MiningButton isMining={isMining} onToggle={handleToggleMining} />

        {/* Session info strip */}
        {isMining && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full glass-card px-5 py-3 flex items-center justify-between"
          >
            <div className="text-center">
              <div className="text-xs text-pi-muted">Elapsed</div>
              <div className="text-sm font-mono font-bold text-pi-text">{elapsedFormatted}</div>
            </div>
            <div className="w-px h-8 bg-pi-border" />
            <div className="text-center">
              <div className="text-xs text-pi-muted">Progress</div>
              <div className="text-sm font-bold text-pi-gold">{progress.toFixed(1)}%</div>
            </div>
            <div className="w-px h-8 bg-pi-border" />
            <div className="text-center">
              <div className="text-xs text-pi-muted">Remaining</div>
              <div className="text-sm font-mono font-bold text-pi-text">{remainingFormatted}</div>
            </div>
          </motion.div>
        )}

        {/* Security circle mini strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="w-full glass-card p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-pi-text">Security Circle</span>
            <span className="badge-gold text-xs">{activeMembers.length}/5 active</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Avatars */}
            <div className="flex -space-x-2">
              {circleMembers.slice(0, 5).map((member, i) => (
                <motion.div
                  key={member.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-pi-dark
                    ${member.status === 'active' ? 'bg-pi-gradient text-pi-dark' : 'bg-pi-border text-pi-muted'}
                  `}
                >
                  {member.avatar}
                </motion.div>
              ))}
            </div>
            <div className="flex-1 ml-2">
              <div className="text-xs text-pi-muted">Circle boost</div>
              <div className="text-sm font-bold text-pi-gold">+{(activeMembers.length * 20)}% mining rate</div>
            </div>
          </div>
        </motion.div>

        {/* Stats grid */}
        <MiningStats
          miningRate={miningRate}
          miningStreak={miningStreak}
          circleSize={activeMembers.length}
          currentSessionEarned={currentSessionEarned}
          elapsedFormatted={elapsedFormatted}
        />

        {/* Pi fact of the day */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full glass-card p-4 border-l-4 border-pi-purple"
        >
          <div className="text-xs text-pi-purple-light font-bold uppercase tracking-wide mb-1">💡 Pi Fact</div>
          <p className="text-sm text-pi-muted leading-relaxed">
            Pi Network was founded by Stanford graduates and has over 55 million engaged pioneers worldwide. Mining is free and uses minimal battery power.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
