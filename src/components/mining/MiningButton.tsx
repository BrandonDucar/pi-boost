import { motion } from 'framer-motion'
import { Zap, Square } from 'lucide-react'

interface MiningButtonProps {
  isMining: boolean
  onToggle: () => void
  disabled?: boolean
}

/**
 * MiningButton — The primary tap-to-mine CTA button.
 * Shows "Start Mining" when idle and "Stop" with pulse when active.
 */
export function MiningButton({ isMining, onToggle, disabled = false }: MiningButtonProps) {
  return (
    <motion.button
      id="mining-toggle-btn"
      onClick={onToggle}
      disabled={disabled}
      whileTap={{ scale: 0.93 }}
      whileHover={{ scale: 1.03 }}
      className="relative overflow-hidden rounded-3xl px-10 py-4 font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        background: isMining
          ? 'linear-gradient(135deg, rgba(239,68,68,0.9), rgba(185,28,28,0.9))'
          : 'linear-gradient(135deg, #F0A500, #C88400)',
        boxShadow: isMining
          ? '0 0 30px rgba(239,68,68,0.4), 0 4px 20px rgba(0,0,0,0.4)'
          : '0 0 30px rgba(240,165,0,0.5), 0 4px 20px rgba(0,0,0,0.4)',
        color: isMining ? '#fff' : '#0A0A0F',
      }}
      animate={
        isMining
          ? {
              boxShadow: [
                '0 0 30px rgba(239,68,68,0.3)',
                '0 0 50px rgba(239,68,68,0.6)',
                '0 0 30px rgba(239,68,68,0.3)',
              ],
            }
          : {}
      }
      transition={isMining ? { duration: 2, repeat: Infinity } : {}}
    >
      {/* Shimmer overlay */}
      {!isMining && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ['-200%', '200%'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
        />
      )}

      {/* Ripple effect on mining */}
      {isMining && (
        <motion.div
          className="absolute inset-0 rounded-3xl border border-red-400/50"
          animate={{ scale: [1, 1.08, 1], opacity: [0.8, 0, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      <span className="relative z-10 flex items-center gap-3">
        {isMining ? (
          <>
            <Square size={20} fill="white" />
            Stop Mining
          </>
        ) : (
          <>
            <Zap size={22} fill="#0A0A0F" />
            Start Mining
          </>
        )}
      </span>
    </motion.button>
  )
}
