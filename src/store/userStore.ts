import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateWalletAddress } from '@/lib/utils'
import { generateMockReferrals, type ReferralUser } from '@/lib/pi-simulation'

interface UserState {
  // Profile
  username: string
  email: string
  walletAddress: string
  avatarInitial: string
  joinedAt: string
  onboardingComplete: boolean

  // Referrals
  referrals: ReferralUser[]
  referralCode: string
  referralLink: string

  // Wallet addresses
  savedAddresses: Array<{ label: string; address: string; isPrimary: boolean }>

  // Node setup
  nodeChecklist: Record<string, boolean>

  // Actions
  setProfile: (profile: Partial<Pick<UserState, 'username' | 'email' | 'walletAddress'>>) => void
  completeOnboarding: () => void
  addAddress: (label: string, address: string) => void
  removeAddress: (address: string) => void
  setPrimaryAddress: (address: string) => void
  toggleNodeStep: (step: string) => void
  generateNewReferralCode: () => void
}

const DEFAULT_REFERRAL_CODE = 'PIBOOST' + Math.random().toString(36).substring(2, 8).toUpperCase()

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      username: 'Pi Miner',
      email: '',
      walletAddress: generateWalletAddress(),
      avatarInitial: 'P',
      joinedAt: new Date().toISOString(),
      onboardingComplete: false,

      referrals: generateMockReferrals(),
      referralCode: DEFAULT_REFERRAL_CODE,
      referralLink: `https://minepi.com/${DEFAULT_REFERRAL_CODE}`,

      savedAddresses: [],

      nodeChecklist: {
        'install-docker': false,
        'download-node': false,
        'configure-ports': false,
        'add-wallet': false,
        'start-node': false,
        'verify-status': false,
      },

      setProfile: (profile) => {
        set(state => ({
          ...state,
          ...profile,
          avatarInitial: profile.username ? profile.username[0].toUpperCase() : state.avatarInitial,
        }))
      },

      completeOnboarding: () => {
        set({ onboardingComplete: true })
      },

      addAddress: (label, address) => {
        set(state => ({
          savedAddresses: [
            ...state.savedAddresses,
            { label, address, isPrimary: state.savedAddresses.length === 0 },
          ],
        }))
      },

      removeAddress: (address) => {
        set(state => ({
          savedAddresses: state.savedAddresses.filter(a => a.address !== address),
        }))
      },

      setPrimaryAddress: (address) => {
        set(state => ({
          savedAddresses: state.savedAddresses.map(a => ({
            ...a,
            isPrimary: a.address === address,
          })),
        }))
      },

      toggleNodeStep: (step) => {
        set(state => ({
          nodeChecklist: {
            ...state.nodeChecklist,
            [step]: !state.nodeChecklist[step],
          },
        }))
      },

      generateNewReferralCode: () => {
        const code = 'PIBOOST' + Math.random().toString(36).substring(2, 8).toUpperCase()
        set({ referralCode: code, referralLink: `https://minepi.com/${code}` })
      },
    }),
    {
      name: 'pi-boost-user',
    }
  )
)
