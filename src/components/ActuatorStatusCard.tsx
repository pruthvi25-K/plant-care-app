import { Activity, SunMedium, Waves } from 'lucide-react'

interface ActuatorStatusCardProps {
  pumpActive: boolean
  lightActive: boolean
  lastSeenTs: number | null
}

export function ActuatorStatusCard({
  pumpActive,
  lightActive,
  lastSeenTs,
}: ActuatorStatusCardProps) {
  const timeString = lastSeenTs
    ? new Date(lastSeenTs * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : 'No data yet'

  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-card-hover)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Activity className="h-4 w-4" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Actuator Status
          </span>
        </div>
        <span className="text-[11px] font-medium text-[var(--text-muted)]">
          Last sync: {timeString}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {/* Pump Status */}
        <div
          className={`flex items-center gap-2.5 rounded-xl border p-3 transition-colors ${
            pumpActive
              ? 'border-sky-400 bg-sky-500/10 text-sky-600 dark:text-sky-300'
              : 'border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)]'
          }`}
        >
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
              pumpActive ? 'bg-sky-500 text-white animate-pulse' : 'bg-black/5 dark:bg-white/5'
            }`}
          >
            <Waves className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Water Pump
            </p>
            <p className="text-xs font-bold">{pumpActive ? 'PUMPING' : 'IDLE'}</p>
          </div>
        </div>

        {/* Grow Light Status */}
        <div
          className={`flex items-center gap-2.5 rounded-xl border p-3 transition-colors ${
            lightActive
              ? 'border-amber-400 bg-amber-500/10 text-amber-700 dark:text-amber-300'
              : 'border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)]'
          }`}
        >
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
              lightActive ? 'bg-amber-500 text-white animate-pulse' : 'bg-black/5 dark:bg-white/5'
            }`}
          >
            <SunMedium className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Grow light
            </p>
            <p className="text-xs font-bold">{lightActive ? 'ACTIVE' : 'OFF'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
