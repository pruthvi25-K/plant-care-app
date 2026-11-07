import { Droplet } from 'lucide-react'

interface MoistureCardProps {
  moisture: number | null
  loading?: boolean
}

export function MoistureCard({ moisture, loading = false }: MoistureCardProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <Droplet className="h-4 w-4" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Soil Moisture
          </span>
        </div>
        <div className="mt-4 h-12 w-32 animate-pulse rounded-xl bg-[var(--bg-surface-elevated)]" />
        <div className="mt-4 h-2.5 w-full animate-pulse rounded-full bg-[var(--bg-surface-elevated)]" />
      </div>
    )
  }

  const isNull = moisture === null || isNaN(moisture)

  let statusText = 'Optimal Moisture'
  let statusColor = 'text-emerald-500 bg-emerald-500/10'

  if (!isNull) {
    if (moisture < 30) {
      statusText = 'Low — Needs Water'
      statusColor = 'text-amber-500 bg-amber-500/10'
    } else if (moisture > 75) {
      statusText = 'High — Well Saturated'
      statusColor = 'text-sky-500 bg-sky-500/10'
    }
  }

  const clampedVal = isNull ? 0 : Math.min(100, Math.max(0, moisture))

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-card-hover)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <Droplet className="h-4 w-4" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Soil Moisture
          </span>
        </div>
        {!isNull && (
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${statusColor}`}>
            {statusText}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-baseline">
        <span className="text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">
          {isNull ? '--' : clampedVal.toFixed(1)}
        </span>
        <span className="ml-1 text-xl font-medium text-[var(--text-muted)]">%</span>
      </div>

      {/* Progress Track */}
      <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-[var(--bg-surface-elevated)]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-500 transition-all duration-500"
          style={{ width: `${clampedVal}%` }}
        />
      </div>

      <div className="mt-2 flex justify-between text-[10px] font-medium text-[var(--text-muted)]">
        <span>0% (Dry)</span>
        <span>Ideal: 40–70%</span>
        <span>100% (Wet)</span>
      </div>
    </div>
  )
}
