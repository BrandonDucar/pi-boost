import { motion } from 'framer-motion'
import { ExternalLink, Clock, ChevronRight } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { MOCK_NEWS, type NewsItem } from '@/lib/pi-simulation'
import { cn } from '@/lib/utils'

const categoryColors: Record<NewsItem['category'], string> = {
  update: 'badge-gold',
  community: 'badge-purple',
  market: 'bg-green-500/20 text-green-400 border border-green-500/30 badge',
  guide: 'bg-blue-500/20 text-blue-400 border border-blue-500/30 badge',
}

const categoryLabels: Record<NewsItem['category'], string> = {
  update: '📢 Update',
  community: '👥 Community',
  market: '📊 Market',
  guide: '📖 Guide',
}

function NewsCard({ item, delay = 0 }: { item: NewsItem; delay?: number }) {
  const timeAgo = () => {
    const diff = Date.now() - new Date(item.publishedAt).getTime()
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-5 space-y-3 active:scale-[0.98] transition-transform cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3">
        <span className={categoryColors[item.category]}>{categoryLabels[item.category]}</span>
        <div className="flex items-center gap-1 text-pi-muted text-xs shrink-0">
          <Clock size={12} />
          {timeAgo()}
        </div>
      </div>
      <h3 className="font-bold text-pi-text leading-tight">{item.title}</h3>
      <p className="text-sm text-pi-muted leading-relaxed line-clamp-2">{item.summary}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-pi-muted">{item.source} · {item.readTime} min read</span>
        <ChevronRight size={16} className="text-pi-gold" />
      </div>
    </motion.div>
  )
}

const communities = [
  { name: 'Pi Network Telegram', emoji: '✈️', url: 'https://t.me/PiNetworkNews', members: '2.1M' },
  { name: 'Pi on Reddit', emoji: '🤖', url: 'https://reddit.com/r/PiNetwork', members: '485K' },
  { name: 'Pi on Twitter/X', emoji: '🐦', url: 'https://twitter.com/PiCoreTeam', members: '1.3M' },
  { name: 'Pi Discord', emoji: '💬', url: 'https://discord.gg/PiNetwork', members: '320K' },
]

export default function Community() {
  return (
    <div className="min-h-screen bg-pi-dark bg-dark-mesh">
      <Navbar title="Community" />
      <div className="page-container space-y-5">

        {/* Quick community links */}
        <div>
          <div className="section-title">Official Communities</div>
          <div className="grid grid-cols-2 gap-3">
            {communities.map((c, i) => (
              <motion.a
                key={c.name}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                whileTap={{ scale: 0.95 }}
                className="glass-card p-4 space-y-2 hover:border-pi-gold/40 border border-pi-border transition-all"
              >
                <div className="text-2xl">{c.emoji}</div>
                <div className="text-sm font-semibold text-pi-text leading-tight">{c.name}</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-pi-muted">{c.members} members</span>
                  <ExternalLink size={12} className="text-pi-gold" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Pi fact of the day */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5 border border-pi-gold/20"
          style={{ boxShadow: '0 4px 24px rgba(240,165,0,0.1)' }}
        >
          <div className="text-lg mb-2">🌟 Pi Fact of the Day</div>
          <p className="text-sm text-pi-muted leading-relaxed">
            Pi Network's consensus algorithm is based on the Stellar Consensus Protocol (SCP), which is more energy-efficient than Proof of Work used by Bitcoin. This is why Pi mining is phone-friendly!
          </p>
        </motion.div>

        {/* News feed */}
        <div>
          <div className="section-title">Latest News</div>
          <div className="space-y-3">
            {MOCK_NEWS.map((item, i) => (
              <NewsCard key={item.id} item={item} delay={0.05 + i * 0.06} />
            ))}
          </div>
        </div>

        {/* Pi Network milestone tracker */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5 space-y-4 border border-pi-purple/20"
        >
          <h3 className="font-bold text-pi-text">🗺️ Pi Mainnet Progress</h3>
          <div className="space-y-3">
            {[
              { label: 'Testnet Launch', done: true, date: 'March 2020' },
              { label: 'Enclosed Mainnet', done: true, date: 'Dec 2021' },
              { label: 'Open Mainnet Beta', done: true, date: 'Feb 2023' },
              { label: 'Full Open Mainnet', done: false, date: 'TBD' },
              { label: 'Exchange Listing', done: false, date: 'TBD' },
            ].map((milestone, i) => (
              <div key={milestone.label} className="flex items-center gap-3">
                <div className={cn(
                  'w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0',
                  milestone.done ? 'bg-green-500 text-white' : 'bg-pi-border text-pi-muted'
                )}>
                  {milestone.done ? '✓' : '○'}
                </div>
                <div className="flex-1">
                  <div className={cn('text-sm font-semibold', milestone.done ? 'text-pi-text' : 'text-pi-muted')}>
                    {milestone.label}
                  </div>
                </div>
                <div className="text-xs text-pi-muted">{milestone.date}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
