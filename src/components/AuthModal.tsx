import { useState, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import { Leaf, Sparkles, X, AlertCircle, Loader2 } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signInWithEmail, signUpWithEmail, signInAsGuest, error, clearError } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    setSubmitting(true)
    clearError()
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password)
      } else {
        await signInWithEmail(email, password)
      }
      onClose()
    } catch {
      // Error handled in AuthContext
    } finally {
      setSubmitting(false)
    }
  }

  const handleGuestLogin = async () => {
    setSubmitting(true)
    clearError()
    try {
      await signInAsGuest()
      onClose()
    } catch {
      // Error handled in AuthContext
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-sm rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-surface-elevated)]"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
            <Leaf className="h-5 w-5" />
          </div>
          <div>
            <h2 id="auth-modal-title" className="text-lg font-bold tracking-tight">
              {isSignUp ? 'Create PlantCare Account' : 'Welcome to PlantCare'}
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              {isSignUp ? 'Sign up to manage your smart plants' : 'Sign in to access dashboard'}
            </p>
          </div>
        </div>

        {/* 1-Click Guest Evaluator Button */}
        <button
          onClick={handleGuestLogin}
          disabled={submitting}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[var(--brand-primary)] bg-[var(--brand-subtle)] px-4 py-3 text-sm font-semibold text-[var(--brand-primary)] shadow-sm transition-all hover:bg-[var(--brand-primary)] hover:text-white disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4" />
          <span>Continue as Guest Evaluator</span>
        </button>

        <div className="relative my-5 text-center">
          <hr className="border-[var(--border-subtle)]" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--bg-surface)] px-2 text-xs uppercase tracking-wider text-[var(--text-muted)]">
            Or with email
          </span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-xl bg-red-500/10 p-3 text-xs text-red-500">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p className="flex-1">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)]">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="evaluator@college.edu"
              className="mt-1 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] px-3 py-2.5 text-sm outline-none transition-colors focus:border-[var(--border-focus)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="mt-1 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] px-3 py-2.5 text-sm outline-none transition-colors focus:border-[var(--border-focus)]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[var(--brand-primary-hover)] disabled:opacity-50"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{isSignUp ? 'Sign Up' : 'Sign In'}</span>
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              clearError()
            }}
            className="text-xs font-medium text-[var(--brand-primary)] hover:underline"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  )
}
