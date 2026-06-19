import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, Zap, ChevronRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { isSupabaseConfigured } from '@/lib/supabase'
import { cn } from '@/lib/utils'

type AuthMode = 'login' | 'signup'

interface InputFieldProps {
  id: string
  type: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  icon: React.ReactNode
  suffix?: React.ReactNode
}

function InputField({ id, type, placeholder, value, onChange, icon, suffix }: InputFieldProps) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-pi-muted">{icon}</div>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="pi-input pl-11 pr-11"
        autoComplete="off"
      />
      {suffix && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-pi-muted">{suffix}</div>
      )}
    </div>
  )
}

/**
 * Auth — Login / Signup page.
 * Shows only when Supabase is configured. Guest mode skips this entirely.
 */
export default function Auth() {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, continueAsGuest, isLoading, error } = useAuth()

  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')
    setSuccess('')

    if (!email || !password) {
      setLocalError('Please fill in all fields.')
      return
    }
    if (mode === 'signup' && !username) {
      setLocalError('Please enter a username.')
      return
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.')
      return
    }

    if (mode === 'login') {
      const err = await signInWithEmail(email, password)
      if (err) setLocalError(err.message)
    } else {
      const err = await signUpWithEmail(email, password, username)
      if (err) setLocalError(err.message)
      else setSuccess('Check your email to confirm your account!')
    }
  }

  const displayError = localError || error

  return (
    <div className="min-h-screen bg-pi-dark bg-dark-mesh flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-pi-glow rounded-full blur-3xl opacity-25 pointer-events-none" />

      <div className="w-full max-w-sm space-y-6 relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-20 h-20 rounded-full bg-pi-gradient flex items-center justify-center text-4xl font-black text-pi-dark shadow-pi-gold-lg mx-auto"
          >
            π
          </motion.div>
          <h1 className="text-3xl font-black gradient-text">Pi Boost</h1>
          <p className="text-pi-muted text-sm">Your Pi Network companion</p>
        </motion.div>

        {/* Mode tabs */}
        <div className="flex bg-pi-surface rounded-2xl p-1 gap-1 border border-pi-border">
          {(['login', 'signup'] as AuthMode[]).map(m => (
            <motion.button
              key={m}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setMode(m); setLocalError(''); setSuccess('') }}
              className={cn(
                'flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200',
                mode === m
                  ? 'bg-pi-gold text-pi-dark shadow'
                  : 'text-pi-muted hover:text-pi-text'
              )}
            >
              {m === 'login' ? 'Sign In' : 'Create Account'}
            </motion.button>
          ))}
        </div>

        {/* Form */}
        <AnimatePresence mode="wait">
          <motion.form
            key={mode}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-3"
          >
            {mode === 'signup' && (
              <InputField
                id="auth-username"
                type="text"
                placeholder="Pi username"
                value={username}
                onChange={setUsername}
                icon={<User size={17} />}
              />
            )}
            <InputField
              id="auth-email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={setEmail}
              icon={<Mail size={17} />}
            />
            <InputField
              id="auth-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={setPassword}
              icon={<Lock size={17} />}
              suffix={
                <button type="button" onClick={() => setShowPassword(v => !v)} className="hover:text-pi-text transition-colors">
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              }
            />

            {/* Error / Success */}
            <AnimatePresence>
              {displayError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                >
                  {displayError}
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3"
                >
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              id="auth-submit-btn"
              type="submit"
              whileTap={{ scale: 0.97 }}
              disabled={isLoading}
              className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-pi-dark border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <Zap size={18} fill="currentColor" />
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </>
              )}
            </motion.button>
          </motion.form>
        </AnimatePresence>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-pi-border" />
          <span className="text-pi-muted text-xs">or</span>
          <div className="flex-1 h-px bg-pi-border" />
        </div>

        {/* Google OAuth */}
        {isSupabaseConfigured && (
          <motion.button
            id="auth-google-btn"
            whileTap={{ scale: 0.97 }}
            onClick={signInWithGoogle}
            className="btn-secondary w-full py-3.5 flex items-center justify-center gap-3 rounded-2xl font-semibold"
          >
            {/* Google G icon */}
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/>
              <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.615 24 12.255 24z"/>
              <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z"/>
              <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.64 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/>
            </svg>
            Continue with Google
          </motion.button>
        )}

        {/* Guest mode */}
        <motion.button
          id="auth-guest-btn"
          whileTap={{ scale: 0.97 }}
          onClick={continueAsGuest}
          className="w-full flex items-center justify-center gap-2 text-pi-muted hover:text-pi-text text-sm py-2 transition-colors"
        >
          Continue as Guest
          <ChevronRight size={15} />
        </motion.button>

        <p className="text-center text-xs text-pi-muted px-4">
          By continuing, you agree that Pi Boost is an independent third-party app, not affiliated with Pi Network.
        </p>
      </div>
    </div>
  )
}
