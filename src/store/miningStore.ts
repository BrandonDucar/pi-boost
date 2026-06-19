import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  calcPiEarned,
  calcTotalRate,
  calcCircleBoost,
  type MiningSession,
  type CircleMember,
  generateMockCircleMembers,
  MINING_SESSION_DURATION,
  BASE_MINING_RATE,
} from '@/lib/pi-simulation'

interface MiningState {
  // Balances
  totalBalance: number
  pendingBalance: number

  // Session
  isMining: boolean
  sessionStartTime: number | null
  sessionDuration: number // seconds (default 24h)
  currentSessionEarned: number

  // Rate
  miningRate: number // π/hour
  baseRate: number
  circleBoost: number

  // Circle
  circleMembers: CircleMember[]
  circleSize: number

  // History
  miningHistory: MiningSession[]
  miningStreak: number

  // Actions
  startMining: () => void
  stopMining: () => void
  updateEarnings: () => void
  setCircleMembers: (members: CircleMember[]) => void
  addBalance: (amount: number) => void
  resetSession: () => void
}

export const useMiningStore = create<MiningState>()(
  persist(
    (set, get) => ({
      totalBalance: 42.7531,
      pendingBalance: 0,
      isMining: false,
      sessionStartTime: null,
      sessionDuration: MINING_SESSION_DURATION,
      currentSessionEarned: 0,
      miningRate: BASE_MINING_RATE,
      baseRate: BASE_MINING_RATE,
      circleBoost: 0,
      circleMembers: generateMockCircleMembers(),
      circleSize: 3, // 3 active members
      miningHistory: [],
      miningStreak: 7,

      startMining: () => {
        const { circleMembers, baseRate } = get()
        const boost = calcCircleBoost(circleMembers)
        const rate = calcTotalRate(baseRate, boost)

        set({
          isMining: true,
          sessionStartTime: Date.now(),
          currentSessionEarned: 0,
          miningRate: rate,
          circleBoost: boost,
          circleSize: circleMembers.filter(m => m.status === 'active').length,
        })
      },

      stopMining: () => {
        const { sessionStartTime, miningRate, currentSessionEarned, totalBalance, miningHistory } = get()

        if (!sessionStartTime) return

        const elapsed = (Date.now() - sessionStartTime) / 1000
        const earned = currentSessionEarned

        const session: MiningSession = {
          id: Date.now().toString(),
          startTime: sessionStartTime,
          endTime: Date.now(),
          earned,
          rate: miningRate,
          circleSize: get().circleSize,
        }

        set({
          isMining: false,
          sessionStartTime: null,
          currentSessionEarned: 0,
          totalBalance: parseFloat((totalBalance + earned).toFixed(6)),
          miningHistory: [session, ...miningHistory].slice(0, 30),
        })
      },

      updateEarnings: () => {
        const { sessionStartTime, miningRate, isMining } = get()
        if (!isMining || !sessionStartTime) return

        const elapsed = (Date.now() - sessionStartTime) / 1000
        const earned = calcPiEarned(miningRate, elapsed)

        set({ currentSessionEarned: earned })
      },

      setCircleMembers: (members: CircleMember[]) => {
        const boost = calcCircleBoost(members)
        const rate = calcTotalRate(get().baseRate, boost)
        set({
          circleMembers: members,
          circleBoost: boost,
          miningRate: rate,
          circleSize: members.filter(m => m.status === 'active').length,
        })
      },

      addBalance: (amount: number) => {
        set(state => ({ totalBalance: parseFloat((state.totalBalance + amount).toFixed(6)) }))
      },

      resetSession: () => {
        set({
          isMining: false,
          sessionStartTime: null,
          currentSessionEarned: 0,
        })
      },
    }),
    {
      name: 'pi-boost-mining',
      // Don't persist isMining or sessionStartTime across refreshes
      partialize: (state) => ({
        totalBalance: state.totalBalance,
        miningHistory: state.miningHistory,
        miningStreak: state.miningStreak,
        circleMembers: state.circleMembers,
      }),
    }
  )
)
