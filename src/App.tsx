import { useTheme } from '@/hooks/useTheme'
import { Sun, Moon, Leaf } from 'lucide-react'

export function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] theme-transition">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-[var(--brand-primary)]" />
            <h1 className="text-lg font-bold tracking-tight">PlantCare</h1>
          </div>
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] transition-colors hover:bg-[var(--border-subtle)]"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-[var(--telemetry-sun)]" />
            ) : (
              <Moon className="h-5 w-5 text-[var(--text-secondary)]" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Placeholder Card */}
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Soil Moisture
            </p>
            <p className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
              --<span className="ml-1 text-lg font-medium text-[var(--text-muted)]">%</span>
            </p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Awaiting first reading...
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
              Awaiting first reading...
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Device Status
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-[var(--status-warning)]" />
              <span className="text-sm font-medium text-[var(--text-secondary)]">
                No device connected
              </span>
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-[var(--text-muted)]">
          🌱 PlantCare Dashboard — Scaffold ready. Tickets A-02+ will connect Firebase.
        </p>
      </main>
    </div>
  )
}
