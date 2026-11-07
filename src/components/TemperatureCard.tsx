import { Thermometer } from 'lucide-react'

interface TemperatureCardProps {
  temperature: number | null
  loading?: boolean
}

export function TemperatureCard({ temperature, loading = false }: TemperatureCardProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Thermometer className="h-4 w-4" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Ambient Temperature
          </span>
        </div>
        <div className="mt-4 h-12 w-32 animate-pulse rounded-xl bg-[var(--bg-surface-elevated)]" />
        <div className="mt-3 h-4 w-48 animate-pulse rounded bg-[var(--bg-surface-elevated)]" />
      </div>
    )
  }

  const isNull = temperature === null || isNaN(temperature)

  let statusText = 'Normal'
  let statusColor = 'text-emerald-500 bg-emerald-500/10'

  if (!isNull) {
    if (temperature < 18) {
      statusText = 'Cool'
      statusColor = 'text-sky-500 bg-sky-500/10'
    } else if (temperature > 30) {
      statusText = 'Warm'
      statusColor = 'text-amber-500 bg-amber-500/10'
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-card-hover)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Thermometer className="h-4 w-4" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Ambient Temperature
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
          {isNull ? '--' : temperature.toFixed(1)}
        </span>
        <span className="ml-1 text-xl font-medium text-[var(--text-muted)]">°C</span>
      </div>

      <p className="mt-3 text-xs text-[var(--text-secondary)]">
        {isNull
          ? 'Waiting for ESP32 DHT/temperature telemetry...'
          : `Healthy ambient room climate (${temperature.toFixed(1)}°C)`}
      </p>
    </div>
  )
}
