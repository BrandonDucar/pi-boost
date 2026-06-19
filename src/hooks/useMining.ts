import { useEffect, useRef, useCallback } from 'react'
import { useMiningStore } from '@/store/miningStore'
import { getMiningProgress, formatDuration } from '@/lib/utils'
import { MINING_SESSION_DURATION } from '@/lib/pi-simulation'

/**
 * useMining — Core mining session hook.
 * Manages the real-time timer, earnings updates, and session state.
 */
export function useMining() {
  const {
    isMining,
    sessionStartTime,
    sessionDuration,
    currentSessionEarned,
    miningRate,
    totalBalance,
    miningStreak,
    startMining,
    stopMining,
    updateEarnings,
  } = useMiningStore()

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Update earnings every second while mining
  useEffect(() => {
    if (isMining) {
      intervalRef.current = setInterval(updateEarnings, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isMining, updateEarnings])

  // Auto-stop when session completes
  useEffect(() => {
    if (!isMining || !sessionStartTime) return
    const elapsed = (Date.now() - sessionStartTime) / 1000
    const remaining = sessionDuration - elapsed

    if (remaining <= 0) {
      stopMining()
      return
    }

    const timeout = setTimeout(stopMining, remaining * 1000)
    return () => clearTimeout(timeout)
  }, [isMining, sessionStartTime, sessionDuration, stopMining])

  // Derived values
  const elapsed = sessionStartTime ? (Date.now() - sessionStartTime) / 1000 : 0
  const remaining = Math.max(0, sessionDuration - elapsed)
  const progress = sessionStartTime ? getMiningProgress(sessionStartTime, sessionDuration) : 0
  const remainingFormatted = formatDuration(Math.ceil(remaining))
  const elapsedFormatted = formatDuration(Math.floor(elapsed))

  const handleToggleMining = useCallback(() => {
    if (isMining) {
      stopMining()
    } else {
      startMining()
    }
  }, [isMining, startMining, stopMining])

  return {
    isMining,
    progress,
    elapsed,
    remaining,
    remainingFormatted,
    elapsedFormatted,
    currentSessionEarned,
    miningRate,
    totalBalance,
    miningStreak,
    sessionStartTime,
    handleToggleMining,
  }
}
