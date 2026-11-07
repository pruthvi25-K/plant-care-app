import { useState } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { useAuth } from '@/context/AuthContext'
import { AuthModal } from '@/components/AuthModal'
import { Sun, Moon, Leaf, User as UserIcon, LogOut, LogIn } from 'lucide-react'

export function App() {
  const { theme, toggleTheme } = useTheme()
  const { user, isGuest, logout } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] theme-transition">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-[var(--brand-primary)]" />
            <h1 className="text-lg font-bold tracking-tight">PlantCare</h1>
          </div>

          <div className="flex items-center gap-2">
            {/* User Auth Status Button */}
            {user ? (
              <div className="flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] px-3 py-1.5 text-xs">
                <UserIcon className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
                <span className="font-semibold text-[var(--text-secondary)]">
                  {isGuest ? 'Guest Evaluator' : user.email?.split('@')[0]}
                </span>
                <button
                  onClick={() => logout()}
                  title="Sign Out"
                  aria-label="Sign Out"
                  className="ml-1 text-[var(--text-muted)] hover:text-red-500"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-[var(--brand-primary)] px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] transition-colors hover:bg-[var(--border-subtle)]"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-[var(--telemetry-sun)]" />
              ) : (
                <Moon className="h-4 w-4 text-[var(--text-secondary)]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Telemetry Placeholders */}
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Soil Moisture
            </p>
            <p className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
              --<span className="ml-1 text-lg font-medium text-[var(--text-muted)]">%</span>
            </p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Awaiting live reading...
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Temperature
            </p>
            <p className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
              --<span className="ml-1 text-lg font-medium text-[var(--text-muted)]">°C</span>
            </p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Awaiting live reading...
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Device Status
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-[var(--status-warning)]" />
              <span className="text-sm font-medium text-[var(--text-secondary)]">
                Awaiting connection
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  )
}
