import { createClient } from '@supabase/supabase-js'

/**
 * Supabase client — gracefully degrades to null when env vars are not set.
 * The app works fully offline (localStorage) without Supabase configured.
 * To enable cloud sync, add these to .env:
 *   VITE_SUPABASE_URL=https://your-project.supabase.co
 *   VITE_SUPABASE_ANON_KEY=your-anon-key
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null

export type AuthProvider = 'email' | 'google'

/** Database schema types */
export interface DbProfile {
  id: string
  username: string
  wallet_address: string | null
  total_balance: number
  mining_streak: number
  created_at: string
  updated_at: string
}

export interface DbMiningSession {
  id: string
  user_id: string
  start_time: string
  end_time: string
  earned: number
  rate: number
  circle_size: number
}
