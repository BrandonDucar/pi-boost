import { NavLink } from 'react-router-dom'
import { Settings, Bell } from 'lucide-react'
import { motion } from 'framer-motion'
import { useUserStore } from '@/store/userStore'
import { getGreeting } from '@/lib/utils'

interface NavbarProps {
  title?: string
  showGreeting?: boolean
}

export function Navbar({ title, showGreeting = false }: NavbarProps) {
  const { username, avatarInitial } = useUserStore()

  return (
    <header className="sticky top-0 z-40 bg-pi-dark/80 backdrop-blur-xl border-b border-pi-border/50">
      <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-3 pt-safe">
        {/* Left: Logo or title */}
        <div className="flex flex-col">
          {showGreeting ? (
            <>
              <span className="text-xs text-pi-muted">{getGreeting()},</span>
              <span className="text-base font-bold text-pi-text">{username} 👋</span>
            </>
          ) : (
            <div className="flex items-center gap-2">
              {/* Pi Logo SVG */}
              <div className="w-8 h-8 rounded-full bg-pi-gradient flex items-center justify-center">
                <span className="text-pi-dark font-black text-sm">π</span>
              </div>
              <span className="text-lg font-bold gradient-text">{title || 'Pi Boost'}</span>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Notification bell */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-xl bg-pi-surface border border-pi-border flex items-center justify-center text-pi-muted hover:text-pi-gold hover:border-pi-gold/40 transition-all"
          >
            <Bell size={18} />
          </motion.button>

          {/* Settings */}
          <NavLink to="/settings">
            {({ isActive }) => (
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm transition-all
                  ${isActive
                    ? 'bg-pi-gold text-pi-dark'
                    : 'bg-pi-surface border border-pi-border text-pi-gold'
                  }`}
              >
                {avatarInitial}
              </motion.div>
            )}
          </NavLink>
        </div>
      </div>
    </header>
  )
}
