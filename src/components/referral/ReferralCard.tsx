import { motion } from 'framer-motion'
import { Copy, Share2, QrCode, UserPlus, CheckCircle, XCircle, Clock } from 'lucide-react'
import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useUserStore } from '@/store/userStore'
import { useMiningStore } from '@/store/miningStore'
import { copyToClipboard, cn } from '@/lib/utils'
import type { MemberStatus } from '@/lib/pi-simulation'

function statusIcon(status: MemberStatus) {
  if (status === 'active') return <CheckCircle size={14} className="text-green-400" />
  if (status === 'inactive') return <XCircle size={14} className="text-red-400" />
  return <Clock size={14} className="text-yellow-400" />
}

function statusColor(status: MemberStatus) {
  if (status === 'active') return 'text-green-400'
  if (status === 'inactive') return 'text-red-400'
  return 'text-yellow-400'
}

/** Referral invite card with copy link + QR code toggle */
export function ReferralCard() {
  const { referralCode, referralLink } = useUserStore()
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)

  const handleCopy = async () => {
    await copyToClipboard(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 space-y-4"
      style={{ boxShadow: '0 4px 24px rgba(240,165,0,0.15)' }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-pi-text">Your Invite Link</h3>
          <p className="text-xs text-pi-muted mt-0.5">Share to grow your security circle</p>
        </div>
        <div className="badge-gold text-sm font-mono">{referralCode}</div>
      </div>

      {/* Link display */}
      <div className="bg-pi-dark rounded-xl px-4 py-3 flex items-center justify-between border border-pi-border">
        <span className="text-xs text-pi-muted truncate flex-1 font-mono">{referralLink}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all',
            copied
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'btn-primary'
          )}
        >
          <Copy size={16} />
          {copied ? 'Copied!' : 'Copy Link'}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowQR(v => !v)}
          className="btn-secondary px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold"
        >
          <QrCode size={16} />
          QR
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigator.share?.({ url: referralLink, title: 'Join me on Pi Network!' })}
          className="btn-secondary px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold"
        >
          <Share2 size={16} />
        </motion.button>
      </div>

      {/* QR Code */}
      {showQR && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="flex flex-col items-center gap-3 pt-2"
        >
          <div className="bg-white p-4 rounded-2xl">
            <QRCodeSVG value={referralLink} size={180} fgColor="#0A0A0F" level="M" />
          </div>
          <p className="text-xs text-pi-muted">Scan to join with your invite code</p>
        </motion.div>
      )}
    </motion.div>
  )
}

/** Security circle member list */
export function CircleMembers() {
  const { circleMembers } = useMiningStore()

  return (
    <div className="space-y-2">
      {circleMembers.map((member, i) => (
        <motion.div
          key={member.id}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }}
          className="glass-card p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-pi-gradient flex items-center justify-center font-bold text-pi-dark text-sm">
              {member.avatar}
            </div>
            <div>
              <div className="font-semibold text-pi-text text-sm">@{member.username}</div>
              <div className={cn('text-xs flex items-center gap-1 mt-0.5', statusColor(member.status))}>
                {statusIcon(member.status)}
                <span className="capitalize">{member.status}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            {member.status === 'active' ? (
              <>
                <div className="text-pi-gold font-bold text-sm">+{member.contribution}%</div>
                <div className="text-xs text-pi-muted">contribution</div>
              </>
            ) : (
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="badge bg-pi-surface-2 text-pi-muted border border-pi-border hover:border-pi-gold/40 hover:text-pi-gold transition-all"
              >
                Remind
              </motion.button>
            )}
          </div>
        </motion.div>
      ))}

      {/* Add member button */}
      {circleMembers.length < 5 && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full glass-card p-4 flex items-center justify-center gap-2 text-pi-gold border-dashed border-pi-gold/30 hover:border-pi-gold/60 transition-all"
        >
          <UserPlus size={18} />
          <span className="font-semibold text-sm">Add Circle Member ({5 - circleMembers.length} spots)</span>
        </motion.button>
      )}
    </div>
  )
}
