import { useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useMiningStore } from '@/store/miningStore'
import { useUserStore } from '@/store/userStore'

/**
 * useCloudSync — Syncs mining balance and profile to Supabase.
 * Silently no-ops when Supabase is not configured (guest/offline mode).
 */
export function useCloudSync() {
  const { totalBalance, miningStreak, miningHistory } = useMiningStore()
  const { username, walletAddress } = useUserStore()

  /** Push local state up to Supabase */
  const syncToCloud = useCallback(async (userId: string) => {
    if (!supabase || !isSupabaseConfigured) return

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        username,
        wallet_address: walletAddress || null,
        total_balance: totalBalance,
        mining_streak: miningStreak,
        updated_at: new Date().toISOString(),
      })

    if (error) console.warn('[Pi Boost] Cloud sync failed:', error.message)
    else console.log('[Pi Boost] Synced to cloud ✓')
  }, [totalBalance, miningStreak, username, walletAddress])

  /** Pull cloud state and merge with local */
  const syncFromCloud = useCallback(async (userId: string) => {
    if (!supabase || !isSupabaseConfigured) return

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error || !data) return

    // Only update if cloud balance is higher (prevent data loss)
    const store = useMiningStore.getState()
    if (data.total_balance > store.totalBalance) {
      store.addBalance(data.total_balance - store.totalBalance)
    }

    useUserStore.getState().setProfile({
      username: data.username,
      walletAddress: data.wallet_address ?? '',
    })

    console.log('[Pi Boost] Pulled from cloud ✓')
  }, [])

  return { syncToCloud, syncFromCloud }
}
