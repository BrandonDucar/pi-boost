import { motion } from 'framer-motion'
import { Moon, Sun, Bell, Shield, Newspaper, Users, ChevronRight, Info, Github } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { useSettingsStore } from '@/store/settingsStore'
import { useUserStore } from '@/store/userStore'
import { cn } from '@/lib/utils'

interface ToggleRowProps {
  label: string
  sublabel?: string
  icon: React.ReactNode
  enabled: boolean
  onToggle: () => void
}

function ToggleRow({ label, sublabel, icon, enabled, onToggle }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-pi-border last:border-0">
      <div className="flex items-center gap-3">
        <div className="text-pi-gold w-8 flex justify-center">{icon}</div>
        <div>
          <div className="text-sm font-semibold text-pi-text">{label}</div>
          {sublabel && <div className="text-xs text-pi-muted">{sublabel}</div>}
        </div>
      </div>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        className={`w-12 h-6 rounded-full relative transition-all duration-200 ${enabled ? 'bg-pi-gold' : 'bg-pi-border'}`}
      >
        <motion.div
          animate={{ x: enabled ? 24 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
        />
      </motion.button>
    </div>
  )
}

export default function Settings() {
  const { theme, setTheme, notifications, toggleNotification } = useSettingsStore()
  const { username, email, avatarInitial, walletAddress } = useUserStore()

  return (
    <div className="min-h-screen bg-pi-dark bg-dark-mesh">
      <Navbar title="Settings" />
      <div className="page-container space-y-5">

        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5 flex items-center gap-4"
          style={{ boxShadow: '0 4px 24px rgba(240,165,0,0.15)' }}
        >
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-pi-gradient flex items-center justify-center text-2xl font-black text-pi-dark shadow-pi-gold">
            {avatarInitial}
          </div>
          <div className="flex-1">
            <div className="font-bold text-lg text-pi-text">{username}</div>
            <div className="text-pi-muted text-sm">{email || 'Not connected'}</div>
            <div className="text-xs font-mono text-pi-muted mt-1 truncate max-w-[180px]">
              {walletAddress ? walletAddress.slice(0, 16) + '...' : 'No wallet set'}
            </div>
          </div>
          <ChevronRight size={20} className="text-pi-muted" />
        </motion.div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card p-5 space-y-2"
        >
          <h3 className="font-bold text-pi-text mb-3">Appearance</h3>

          <div className="flex gap-3">
            {(['dark', 'light'] as const).map(t => (
              <motion.button
                key={t}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTheme(t)}
                className={cn(
                  'flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 font-semibold text-sm transition-all',
                  theme === t
                    ? 'border-pi-gold bg-pi-gold/10 text-pi-gold'
                    : 'border-pi-border text-pi-muted hover:border-pi-gold/30'
                )}
              >
                {t === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-5"
        >
          <h3 className="font-bold text-pi-text mb-3">Notifications</h3>
          <ToggleRow
            label="Mining Reminders"
            sublabel="Get reminded every 24 hours"
            icon={<Bell size={18} />}
            enabled={notifications.miningReminders}
            onToggle={() => toggleNotification('miningReminders')}
          />
          <ToggleRow
            label="Price Alerts"
            sublabel="When Pi hits your target price"
            icon={<Shield size={18} />}
            enabled={notifications.priceAlerts}
            onToggle={() => toggleNotification('priceAlerts')}
          />
          <ToggleRow
            label="Circle Reminders"
            sublabel="Inactive security circle members"
            icon={<Users size={18} />}
            enabled={notifications.circleReminders}
            onToggle={() => toggleNotification('circleReminders')}
          />
          <ToggleRow
            label="News Updates"
            sublabel="Pi Network announcements"
            icon={<Newspaper size={18} />}
            enabled={notifications.newsUpdates}
            onToggle={() => toggleNotification('newsUpdates')}
          />
        </motion.div>

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-5 space-y-3"
        >
          <h3 className="font-bold text-pi-text mb-1">About Pi Boost</h3>

          {[
            { label: 'Version', value: '1.0.0' },
            { label: 'Status', value: 'Beta' },
            { label: 'Official Pi?', value: 'Third-party companion app' },
          ].map(item => (
            <div key={item.label} className="flex justify-between items-center py-2 border-b border-pi-border last:border-0">
              <span className="text-sm text-pi-muted">{item.label}</span>
              <span className="text-sm text-pi-text font-medium">{item.value}</span>
            </div>
          ))}

          <div className="pt-2 space-y-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-pi-gold text-sm hover:underline"
            >
              <Github size={16} />
              View on GitHub
            </a>
            <div className="flex items-start gap-2 text-xs text-pi-muted">
              <Info size={14} className="shrink-0 mt-0.5" />
              <span>
                Pi Boost is an independent companion app and is not affiliated with Pi Network or SocialChain, Inc.
                Mining data is simulated. Prices are for illustration only.
              </span>
            </div>
          </div>
        </motion.div>

        {/* Danger zone */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5 border border-red-500/20"
        >
          <h3 className="font-bold text-red-400 mb-3">Danger Zone</h3>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              localStorage.clear()
              window.location.reload()
            }}
            className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/10 transition-all"
          >
            Reset All Data
          </motion.button>
          <p className="text-xs text-pi-muted mt-2">This will clear all local data and restart the app.</p>
        </motion.div>
      </div>
    </div>
  )
}
