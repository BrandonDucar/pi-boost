import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { BottomNav } from '@/components/layout/BottomNav'
import { PageTransition } from '@/components/layout/PageTransition'
import { useUserStore } from '@/store/userStore'
import { useSettingsStore } from '@/store/settingsStore'
import { useAuth } from '@/hooks/useAuth'
import { useCloudSync } from '@/hooks/useCloudSync'
import { isSupabaseConfigured } from '@/lib/supabase'
import Auth from '@/pages/Auth'
import Onboarding from '@/pages/Onboarding'
import Dashboard from '@/pages/Dashboard'
import Referrals from '@/pages/Referrals'
import PriceTracker from '@/pages/PriceTracker'
import Community from '@/pages/Community'
import Utilities from '@/pages/Utilities'
import Settings from '@/pages/Settings'

/** Main app shell — shown after auth + onboarding */
function AppLayout() {
  const { user } = useAuth()
  const { syncToCloud, syncFromCloud } = useCloudSync()

  // Pull from cloud on mount, then sync up periodically
  useEffect(() => {
    if (user) {
      syncFromCloud(user.id)
      const interval = setInterval(() => syncToCloud(user.id), 60_000)
      return () => clearInterval(interval)
    }
  }, [user, syncToCloud, syncFromCloud])

  return (
    <div className="relative">
      <PageTransition>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/referrals" element={<Referrals />} />
          <Route path="/price" element={<PriceTracker />} />
          <Route path="/community" element={<Community />} />
          <Route path="/utilities" element={<Utilities />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PageTransition>
      <BottomNav />
    </div>
  )
}

/** Fullscreen spinner while auth state resolves */
function AuthLoader() {
  return (
    <div className="min-h-screen bg-pi-dark flex items-center justify-center">
      <div className="text-center space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-2 border-pi-gold border-t-transparent rounded-full mx-auto"
        />
        <div className="text-pi-muted text-sm">Loading Pi Boost…</div>
      </div>
    </div>
  )
}

export default function App() {
  const { onboardingComplete } = useUserStore()
  const { theme } = useSettingsStore()
  const { isLoading, isAuthenticated, isGuest } = useAuth()

  // Apply theme class on mount and theme change
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [theme])

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth loading spinner */}
        {isLoading && <Route path="*" element={<AuthLoader />} />}

        {/* Auth wall (only when Supabase is configured AND not yet authed AND not guest) */}
        {!isLoading && isSupabaseConfigured && !isAuthenticated && !isGuest && (
          <>
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </>
        )}

        {/* Onboarding (first launch) */}
        {!isLoading && (isAuthenticated || isGuest) && !onboardingComplete && (
          <>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="*" element={<Onboarding />} />
          </>
        )}

        {/* Main app */}
        {!isLoading && (isAuthenticated || isGuest) && onboardingComplete && (
          <Route path="/*" element={<AppLayout />} />
        )}

        {/* Guest mode (no Supabase) — go straight to onboarding / app */}
        {!isLoading && !isSupabaseConfigured && !onboardingComplete && (
          <Route path="*" element={<Onboarding />} />
        )}
      </Routes>
    </BrowserRouter>
  )
}
