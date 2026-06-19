/**
 * Pi Mining Simulation Engine
 * Handles the core logic for simulated Pi mining sessions.
 */

export const MINING_SESSION_DURATION = 24 * 60 * 60 // 24 hours in seconds
export const BASE_MINING_RATE = 0.1 // π/hour base rate
export const MAX_CIRCLE_SIZE = 5

/** Security circle member status */
export type MemberStatus = 'active' | 'inactive' | 'pending'

/** A member in the user's security circle */
export interface CircleMember {
  id: string
  username: string
  avatar: string
  status: MemberStatus
  contribution: number // percentage contribution to rate boost
  joinedAt: string
}

/** A single mining session record */
export interface MiningSession {
  id: string
  startTime: number
  endTime: number
  earned: number
  rate: number
  circleSize: number
}

/** Calculate mining rate boost from circle members */
export function calcCircleBoost(members: CircleMember[]): number {
  const activeMembers = members.filter(m => m.status === 'active')
  return Math.min(activeMembers.length, MAX_CIRCLE_SIZE) * 0.2
}

/** Calculate total mining rate */
export function calcTotalRate(baseRate: number, circleBoost: number): number {
  return parseFloat((baseRate * (1 + circleBoost)).toFixed(4))
}

/** Calculate Pi earned in a partial session */
export function calcPiEarned(rate: number, elapsedSeconds: number): number {
  const hours = elapsedSeconds / 3600
  return parseFloat((rate * hours).toFixed(6))
}

/** Calculate member contribution percentage */
export function calcMemberContribution(memberIndex: number, totalActive: number): number {
  if (totalActive === 0) return 0
  return parseFloat(((1 / totalActive) * 100).toFixed(1))
}

/** Generate mock circle members for demo */
export function generateMockCircleMembers(): CircleMember[] {
  const members = [
    { id: '1', username: 'alex_pi', status: 'active' as MemberStatus, avatar: 'A' },
    { id: '2', username: 'sarah_miner', status: 'active' as MemberStatus, avatar: 'S' },
    { id: '3', username: 'john_doe', status: 'inactive' as MemberStatus, avatar: 'J' },
    { id: '4', username: 'pi_holder99', status: 'active' as MemberStatus, avatar: 'P' },
    { id: '5', username: 'crypto_fan', status: 'pending' as MemberStatus, avatar: 'C' },
  ]

  const activeCount = members.filter(m => m.status === 'active').length

  return members.map((m, i) => ({
    ...m,
    contribution: m.status === 'active' ? calcMemberContribution(i, activeCount) : 0,
    joinedAt: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
  }))
}

/** Simulate Pi price data with realistic variation */
export interface PricePoint {
  date: string
  price: number
  volume: number
}

export function generatePriceData(days: number, basePrice = 34.5): PricePoint[] {
  const data: PricePoint[] = []
  let price = basePrice
  const now = new Date()

  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // Simulate realistic price movement with trend + noise
    const trend = 0.002 // slight upward trend
    const noise = (Math.random() - 0.48) * 0.06
    price = Math.max(20, price * (1 + trend + noise))

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: parseFloat(price.toFixed(2)),
      volume: Math.floor(Math.random() * 5000000 + 1000000),
    })
  }

  return data
}

/** Mock referral users */
export interface ReferralUser {
  id: string
  username: string
  avatar: string
  joinedAt: string
  miningActive: boolean
  miningRate: number
}

export function generateMockReferrals(): ReferralUser[] {
  return [
    { id: '1', username: 'mark_pi', avatar: 'M', joinedAt: '2024-01-15', miningActive: true, miningRate: 0.12 },
    { id: '2', username: 'linda_crypto', avatar: 'L', joinedAt: '2024-02-03', miningActive: false, miningRate: 0 },
    { id: '3', username: 'david_h', avatar: 'D', joinedAt: '2024-02-20', miningActive: true, miningRate: 0.1 },
    { id: '4', username: 'emma_w', avatar: 'E', joinedAt: '2024-03-10', miningActive: true, miningRate: 0.15 },
  ]
}

/** Community news items (mock) */
export interface NewsItem {
  id: string
  title: string
  summary: string
  source: string
  publishedAt: string
  category: 'update' | 'community' | 'market' | 'guide'
  readTime: number
  imageUrl?: string
}

export const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Pi Network Mainnet Migration: What You Need to Know',
    summary: 'The Pi Core Team has released new details about the upcoming mainnet migration process and KYC requirements for all miners.',
    source: 'Pi Network Official',
    publishedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    category: 'update',
    readTime: 4,
  },
  {
    id: '2',
    title: 'Mining Rate Boost: Grow Your Security Circle to 5',
    summary: 'Discover how having 5 active security circle members can increase your mining rate by up to 100%. Tips to find genuine members.',
    source: 'Pi Boost Community',
    publishedAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    category: 'guide',
    readTime: 3,
  },
  {
    id: '3',
    title: 'Pi Price Analysis: Community Predictions for Q3 2024',
    summary: 'Community analysts share their perspective on Pi\'s price trajectory as mainnet activity increases.',
    source: 'Pi Market Watch',
    publishedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    category: 'market',
    readTime: 5,
  },
  {
    id: '4',
    title: 'Global Pi Day Celebrations Reach 47 Countries',
    summary: 'The annual Pi Day saw record participation with over 1 million miners celebrating the milestone together.',
    source: 'Pi Community',
    publishedAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    category: 'community',
    readTime: 2,
  },
  {
    id: '5',
    title: 'Node Operators: New Performance Rewards Program Announced',
    summary: 'Pi Core Team announces additional rewards for super nodes that maintain 99.9% uptime, effective next month.',
    source: 'Pi Network Official',
    publishedAt: new Date(Date.now() - 72 * 3600000).toISOString(),
    category: 'update',
    readTime: 3,
  },
]
