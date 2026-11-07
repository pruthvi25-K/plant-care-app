import { Sparkles, PlayCircle, StopCircle } from 'lucide-react'

interface DemoModeBannerProps {
  isDemoMode: boolean
  onToggleDemoMode: () => void
}

export function DemoModeBanner({ isDemoMode, onToggleDemoMode }: DemoModeBannerProps) {
  if (!isDemoMode) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-purple-500/20 bg-purple-500/5 px-3 py-2 text-xs text-purple-700 dark:text-purple-300">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-500" />
          <span>Need an offline hardware demonstration without live ESP32?</span>
        </div>
        <button
          type="button"
          onClick={onToggleDemoMode}
          className="flex items-center gap-1 rounded-lg bg-purple-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs transition-opacity hover:opacity-90"
        >
          <PlayCircle className="h-3.5 w-3.5" />
          <span>Launch Demo Mode</span>
        </button>
      </div>
    )
  }

  return (
    <div
      role="status"
      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-purple-500/40 bg-gradient-to-r from-purple-500/15 via-indigo-500/10 to-purple-500/15 p-4 text-xs shadow-md"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white shadow-sm">
          <Sparkles className="h-5 w-5 animate-spin" style={{ animationDuration: '6s' }} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-purple-700 dark:text-purple-300">
              Demo Simulation Active
            </h4>
            <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-300">
              In-Memory Node
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-[var(--text-secondary)]">
            Running virtual ESP32 soil moisture decay &amp; pump actuators. Zero hardware or Firebase credentials required.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggleDemoMode}
        className="flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-[var(--bg-surface)] px-3 py-1.5 text-xs font-bold text-purple-700 shadow-xs transition-all hover:bg-purple-500/10 dark:text-purple-300"
      >
        <StopCircle className="h-4 w-4 text-red-500" />
        <span>Exit Demo Mode</span>
      </button>
    </div>
  )
}
