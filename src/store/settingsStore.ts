import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'dark' | 'light'
type Currency = 'USD' | 'BTC' | 'EUR'

interface SettingsState {
  theme: Theme
  currency: Currency
  notifications: {
    miningReminders: boolean
    priceAlerts: boolean
    circleReminders: boolean
    newsUpdates: boolean
  }
  priceAlerts: Array<{ price: number; direction: 'above' | 'below'; active: boolean }>

  // Actions
  setTheme: (theme: Theme) => void
  setCurrency: (currency: Currency) => void
  toggleNotification: (key: keyof SettingsState['notifications']) => void
  addPriceAlert: (price: number, direction: 'above' | 'below') => void
  removePriceAlert: (index: number) => void
  togglePriceAlert: (index: number) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      currency: 'USD',
      notifications: {
        miningReminders: true,
        priceAlerts: true,
        circleReminders: true,
        newsUpdates: false,
      },
      priceAlerts: [
        { price: 50, direction: 'above', active: true },
        { price: 20, direction: 'below', active: true },
      ],

      setTheme: (theme) => {
        set({ theme })
        // Apply theme class to document root
        document.documentElement.classList.toggle('dark', theme === 'dark')
        document.documentElement.classList.toggle('light', theme === 'light')
      },

      setCurrency: (currency) => set({ currency }),

      toggleNotification: (key) => {
        set(state => ({
          notifications: {
            ...state.notifications,
            [key]: !state.notifications[key],
          },
        }))
      },

      addPriceAlert: (price, direction) => {
        set(state => ({
          priceAlerts: [...state.priceAlerts, { price, direction, active: true }],
        }))
      },

      removePriceAlert: (index) => {
        set(state => ({
          priceAlerts: state.priceAlerts.filter((_, i) => i !== index),
        }))
      },

      togglePriceAlert: (index) => {
        set(state => ({
          priceAlerts: state.priceAlerts.map((alert, i) =>
            i === index ? { ...alert, active: !alert.active } : alert
          ),
        }))
      },
    }),
    {
      name: 'pi-boost-settings',
    }
  )
)
