import { motion } from 'framer-motion'

interface MiningRingProps {
  progress: number      // 0 to 100
  isMining: boolean
  size?: number
  strokeWidth?: number
  children?: React.ReactNode
}

/**
 * MiningRing — Animated SVG circular progress ring.
 * Shows mining session progress from 0–100%.
 * Glows gold when actively mining.
 */
export function MiningRing({
  progress,
  isMining,
  size = 260,
  strokeWidth = 12,
  children,
}: MiningRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference
  const center = size / 2

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Outer glow ring (only when mining) */}
      {isMining && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              '0 0 30px rgba(240,165,0,0.2)',
              '0 0 60px rgba(240,165,0,0.4)',
              '0 0 30px rgba(240,165,0,0.2)',
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* SVG ring */}
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        style={{ filter: isMining ? 'drop-shadow(0 0 8px rgba(240,165,0,0.5))' : 'none' }}
      >
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(30,30,46,0.8)"
          strokeWidth={strokeWidth}
        />

        {/* Secondary decorative ring */}
        <circle
          cx={center}
          cy={center}
          r={radius - strokeWidth - 4}
          fill="none"
          stroke="rgba(240,165,0,0.06)"
          strokeWidth={1}
        />

        {/* Progress arc */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke="url(#pi-gradient)"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          initial={{ strokeDashoffset: circumference }}
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="pi-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F0A500" />
            <stop offset="50%" stopColor="#FFD166" />
            <stop offset="100%" stopColor="#6B21A8" />
          </linearGradient>
        </defs>

        {/* Progress dot at the tip */}
        {progress > 2 && (
          <motion.circle
            cx={center + radius * Math.cos(((progress / 100) * 360 - 90) * (Math.PI / 180))}
            cy={center + radius * Math.sin(((progress / 100) * 360 - 90) * (Math.PI / 180))}
            r={strokeWidth / 2 + 1}
            fill="#F0A500"
            animate={{
              r: isMining ? [strokeWidth / 2, strokeWidth / 2 + 2, strokeWidth / 2] : strokeWidth / 2,
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}
