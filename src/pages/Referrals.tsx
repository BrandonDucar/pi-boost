import { motion } from 'framer-motion'
import { Users, TrendingUp, UserCheck } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { ReferralCard, CircleMembers } from '@/components/referral/ReferralCard'
import { useUserStore } from '@/store/userStore'
import { useMiningStore } from '@/store/miningStore'
import { formatPi } from '@/lib/utils'

export default function Referrals() {
  const { referrals } = useUserStore()
  const { circleMembers, miningRate } = useMiningStore()
  const activeCircle = circleMembers.filter(m => m.status === 'active').length

  return (
    <div className="min-h-screen bg-pi-dark bg-dark-mesh">
      <Navbar title="Circle & Referrals" />
      <div className="page-container space-y-5">

        {/* Header stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Invited', value: referrals.length.toString(), icon: <Users size={16} />, color: 'text-pi-gold' },
            { label: 'Active Circle', value: `${activeCircle}/5`, icon: <UserCheck size={16} />, color: 'text-green-400' },
            { label: 'Your Rate', value: `${formatPi(miningRate)}`, icon: <TrendingUp size={16} />, color: 'text-pi-purple-light' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-3 text-center"
            >
              <div className={`flex justify-center mb-1 ${stat.color}`}>{stat.icon}</div>
              <div className={`text-lg font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-pi-muted mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Referral invite card */}
        <ReferralCard />

        {/* Security circle */}
        <div>
          <div className="section-title flex items-center gap-2">
            <span>Security Circle</span>
            <div className="badge-gold text-xs">{activeCircle} active</div>
          </div>
          <CircleMembers />
        </div>

        {/* Referred users */}
        {referrals.length > 0 && (
          <div>
            <div className="section-title">Referred Miners</div>
            <div className="space-y-2">
              {referrals.map((user, i) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  className="glass-card p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-pi-surface-2 border border-pi-border flex items-center justify-center font-bold text-pi-gold">
                      {user.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-pi-text text-sm">@{user.username}</div>
                      <div className="text-xs text-pi-muted">Joined {user.joinedAt}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    {user.miningActive ? (
                      <div className="flex flex-col items-end gap-1">
                        <div className="badge-success text-xs">Mining</div>
                        <div className="text-xs text-pi-muted">{user.miningRate} π/hr</div>
                      </div>
                    ) : (
                      <div className="badge bg-red-500/20 text-red-400 border border-red-500/30 text-xs">Inactive</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
