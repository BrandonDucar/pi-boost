import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Shield, Users, Bell, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/store/userStore'

const steps = [
  {
    id: 0,
    icon: '⚡',
    title: 'Welcome to Pi Boost',
    description: 'Your smart companion for Pi Network mining. Track your sessions, manage your security circle, and monitor Pi value — all in one place.',
    gradient: 'from-pi-gold/20 to-transparent',
  },
  {
    id: 1,
    icon: '🛡️',
    title: 'Set Up Your Profile',
    description: 'Enter your Pi username and wallet address to personalize your experience.',
    gradient: 'from-pi-purple/20 to-transparent',
    hasInput: true,
  },
  {
    id: 2,
    icon: '🔔',
    title: 'Stay on Track',
    description: 'Enable notifications to get reminded to mine every 24 hours and receive price alerts.',
    gradient: 'from-green-500/10 to-transparent',
    hasToggle: true,
  },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const { setProfile, completeOnboarding } = useUserStore()
  const [step, setStep] = useState(0)
  const [username, setUsername] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const isLastStep = step === steps.length - 1

  const handleNext = () => {
    if (step === 1 && username) {
      setProfile({ username, walletAddress })
    }
    if (isLastStep) {
      completeOnboarding()
      navigate('/')
    } else {
      setStep(s => s + 1)
    }
  }

  const currentStep = steps[step]

  return (
    <div className="min-h-screen bg-pi-dark bg-dark-mesh flex flex-col items-center justify-between p-6 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-pi-glow rounded-full blur-3xl opacity-30 pointer-events-none" />

      {/* Skip button */}
      <div className="w-full flex justify-end pt-safe">
        <button
          onClick={() => { completeOnboarding(); navigate('/') }}
          className="text-pi-muted text-sm hover:text-pi-text transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm gap-8">
        {/* Step indicator */}
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: i === step ? 28 : 8,
                backgroundColor: i <= step ? '#F0A500' : '#1E1E2E',
              }}
              className="h-2 rounded-full transition-all"
            />
          ))}
        </div>

        {/* Step card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="w-full space-y-6"
          >
            {/* Icon */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-7xl text-center"
            >
              {currentStep.icon}
            </motion.div>

            {/* Text */}
            <div className="text-center space-y-3">
              <h1 className="text-2xl font-black text-pi-text">{currentStep.title}</h1>
              <p className="text-pi-muted leading-relaxed">{currentStep.description}</p>
            </div>

            {/* Step-specific content */}
            {currentStep.hasInput && (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Pi username (e.g. john_pi)"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="pi-input"
                />
                <input
                  type="text"
                  placeholder="Pi wallet address (optional)"
                  value={walletAddress}
                  onChange={e => setWalletAddress(e.target.value)}
                  className="pi-input font-mono text-sm"
                />
              </div>
            )}

            {currentStep.hasToggle && (
              <div className="glass-card p-4 space-y-3">
                {[
                  { label: 'Mining reminders', sublabel: 'Every 24 hours', icon: <Bell size={18} /> },
                  { label: 'Price alerts', sublabel: 'When Pi hits targets', icon: <Shield size={18} /> },
                  { label: 'Circle reminders', sublabel: 'Inactive members', icon: <Users size={18} /> },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-pi-gold">
                      {item.icon}
                      <div>
                        <div className="text-sm font-semibold text-pi-text">{item.label}</div>
                        <div className="text-xs text-pi-muted">{item.sublabel}</div>
                      </div>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setNotificationsEnabled(v => !v)}
                      className={`w-12 h-6 rounded-full transition-all ${
                        notificationsEnabled ? 'bg-pi-gold' : 'bg-pi-border'
                      }`}
                    >
                      <motion.div
                        animate={{ x: notificationsEnabled ? 24 : 2 }}
                        className="w-5 h-5 bg-white rounded-full shadow"
                      />
                    </motion.button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CTA Button */}
      <div className="w-full max-w-sm pb-safe space-y-3">
        <motion.button
          id={`onboarding-step-${step}-btn`}
          whileTap={{ scale: 0.96 }}
          onClick={handleNext}
          className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
        >
          {isLastStep ? (
            <>
              <CheckCircle size={20} />
              Let's Start Mining!
            </>
          ) : (
            <>
              Continue
              <ChevronRight size={20} />
            </>
          )}
        </motion.button>

        {step > 0 && (
          <button
            onClick={() => setStep(s => s - 1)}
            className="w-full text-center text-pi-muted text-sm hover:text-pi-text transition-colors py-2"
          >
            Back
          </button>
        )}
      </div>
    </div>
  )
}
