import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pi: {
          gold: '#F0A500',
          'gold-light': '#FFD166',
          'gold-dark': '#C88400',
          orange: '#E07B00',
          purple: '#6B21A8',
          'purple-light': '#9333EA',
          dark: '#0A0A0F',
          surface: '#13131A',
          'surface-2': '#1A1A25',
          border: '#1E1E2E',
          'border-light': '#2A2A3E',
          text: '#E2E8F0',
          muted: '#64748B',
          success: '#22C55E',
          warning: '#F59E0B',
          error: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'pi-gradient': 'linear-gradient(135deg, #F0A500 0%, #6B21A8 100%)',
        'pi-glow': 'radial-gradient(ellipse at center, rgba(240,165,0,0.15) 0%, transparent 70%)',
        'dark-mesh': 'radial-gradient(at 40% 20%, rgba(107,33,168,0.1) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(240,165,0,0.08) 0px, transparent 50%)',
      },
      boxShadow: {
        'pi-gold': '0 0 20px rgba(240,165,0,0.3)',
        'pi-gold-lg': '0 0 40px rgba(240,165,0,0.4)',
        'pi-purple': '0 0 20px rgba(107,33,168,0.3)',
        'glass': '0 8px 32px rgba(0,0,0,0.4)',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'ring-fill': 'ring-fill 1s ease-out forwards',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(240,165,0,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(240,165,0,0.6)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}

export default config
