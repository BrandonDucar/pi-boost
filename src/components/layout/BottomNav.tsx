import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { Home, Users, TrendingUp, MessageSquare, Wrench } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', icon: Home, label: 'Mine' },
  { to: '/referrals', icon: Users, label: 'Circle' },
  { to: '/price', icon: TrendingUp, label: 'Price' },
  { to: '/community', icon: MessageSquare, label: 'Community' },
  { to: '/utilities', icon: Wrench, label: 'Tools' },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-pi-surface/95 backdrop-blur-xl border-t border-pi-border pb-safe">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 pt-2 pb-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-200 min-w-[56px]',
                isActive
                  ? 'text-pi-gold'
                  : 'text-pi-muted hover:text-pi-text'
              )
            }
          >
            {({ isActive }) => (
              <>
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className="relative"
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 -m-2 bg-pi-gold/15 rounded-xl"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={cn(
                      'relative z-10 transition-all duration-200',
                      isActive && 'drop-shadow-[0_0_6px_rgba(240,165,0,0.6)]'
                    )}
                  />
                </motion.div>
                <span className="text-[10px] font-semibold leading-none">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
