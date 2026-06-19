import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

export interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  isGuest: boolean // true when using localStorage-only mode
  error: string | null
}

/**
 * useAuth — Supabase auth hook with graceful localStorage fallback.
 * When Supabase is not configured, the app runs in "guest" mode —
 * all data stays local and the user skips the auth screen.
 */
export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: isSupabaseConfigured, // only load if supabase is active
    isAuthenticated: false,
    isGuest: !isSupabaseConfigured,
    error: null,
  })

  useEffect(() => {
    if (!supabase) {
      // Guest mode — no Supabase, skip auth entirely
      setState(s => ({ ...s, isLoading: false, isGuest: true }))
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState(s => ({
        ...s,
        session,
        user: session?.user ?? null,
        isAuthenticated: !!session,
        isLoading: false,
      }))
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setState(s => ({
        ...s,
        session,
        user: session?.user ?? null,
        isAuthenticated: !!session,
        isLoading: false,
      }))
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    if (!supabase) return
    setState(s => ({ ...s, isLoading: true, error: null }))
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setState(s => ({ ...s, isLoading: false, error: error?.message ?? null }))
    return error
  }, [])

  const signUpWithEmail = useCallback(async (email: string, password: string, username: string) => {
    if (!supabase) return
    setState(s => ({ ...s, isLoading: true, error: null }))
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    })
    setState(s => ({ ...s, isLoading: false, error: error?.message ?? null }))
    return error
  }, [])

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) return
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }, [])

  const signOut = useCallback(async () => {
    if (!supabase) return
    await supabase.auth.signOut()
  }, [])

  const continueAsGuest = useCallback(() => {
    setState(s => ({ ...s, isGuest: true, isLoading: false }))
  }, [])

  return {
    ...state,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
    continueAsGuest,
  }
}
