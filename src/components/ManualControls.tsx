import { useState } from 'react'
import { Droplet, SunMedium, Loader2, Check, AlertCircle, Sparkles } from 'lucide-react'

interface ManualControlsProps {
  pumpActive: boolean
  lightActive: boolean
  isOffline: boolean
  wateringPending: boolean
  wateringSuccess: boolean
  commandError: string | null
  lightMode?: 'auto' | 'manual' | 'off'
  lightScheduleHours?: number
  onWaterNow: (durationSeconds?: number) => Promise<void>
  onToggleLight: (active: boolean) => Promise<void>
  onSetLightMode: (mode: 'auto' | 'manual') => Promise<void>
}

export function ManualControls({
  pumpActive,
  lightActive,
  isOffline,
  wateringPending,
  wateringSuccess,
  commandError,
  lightMode = 'auto',
  lightScheduleHours = 12,
  onWaterNow,
  onToggleLight,
  onSetLightMode,
}: ManualControlsProps) {
  const [pulseDuration] = useState(3) // 3-second safe default

  const handleWaterClick = async () => {
    if (pumpActive || wateringPending || isOffline) return
    await onWaterNow(pulseDuration)
  }

  const handleLightToggle = async () => {
    if (isOffline) return
    await onToggleLight(!lightActive)
  }

  return (
    <section aria-labelledby="manual-controls-heading" className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <h3 id="manual-controls-heading" className="text-sm font-bold tracking-tight text-[var(--text-primary)]">
            Manual Hardware Controls
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            Directly trigger water pulse and control the Grow light
          </p>
        </div>
      </div>

      {/* Command Error Alert */}
      {commandError && (
        <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-500">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p className="flex-1">{commandError}</p>
        </div>
      )}

      {/* Success Toast */}
      {wateringSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
          <Check className="h-4 w-4" />
          <span>Watering pulse delivered successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Water Now Actuator Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Water Pump Trigger
              </span>
              <span className="text-[11px] font-semibold text-[var(--text-secondary)]">
                3s Pulse (Firmware Capped)
              </span>
            </div>
            <h4 className="mt-2 text-base font-bold text-[var(--text-primary)]">
              Instant Soil Hydration
            </h4>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              Dispatches immediate watering pulse. Automatically locked when offline or during active pumping.
            </p>
          </div>

          <div className="mt-5">
            <button
              type="button"
              onClick={handleWaterClick}
              disabled={isOffline || pumpActive || wateringPending}
              aria-label="Water plant now"
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold shadow-md transition-all ${
                pumpActive
                  ? 'bg-sky-500 text-white animate-pulse'
                  : 'bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-600 hover:to-blue-700'
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {wateringPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Transmitting to ESP32...</span>
                </>
              ) : pumpActive ? (
                <>
                  <Droplet className="h-4 w-4 animate-bounce" />
                  <span>Pump Active (Watering...)</span>
                </>
              ) : (
                <>
                  <Droplet className="h-4 w-4" />
                  <span>Water Now (3s Pulse)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Grow Light Actuator Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-card)]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Grow light Control
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  lightActive
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    : 'bg-slate-200 dark:bg-slate-800 text-[var(--text-muted)]'
                }`}
              >
                {lightActive ? 'LIGHT ON' : 'LIGHT OFF'}
              </span>
            </div>

            <h4 className="mt-2 text-base font-bold text-[var(--text-primary)]">
              Photoperiod &amp; Grow Light
            </h4>

            {/* Mode Selector Tabs */}
            <div className="mt-3 grid grid-cols-2 gap-1 rounded-xl bg-[var(--bg-surface-elevated)] p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => onSetLightMode('auto')}
                disabled={isOffline}
                className={`rounded-lg py-1.5 transition-colors ${
                  lightMode === 'auto'
                    ? 'bg-[var(--bg-surface)] text-[var(--brand-primary)] shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                Auto Schedule
              </button>
              <button
                type="button"
                onClick={() => onSetLightMode('manual')}
                disabled={isOffline}
                className={`rounded-lg py-1.5 transition-colors ${
                  lightMode === 'manual'
                    ? 'bg-[var(--bg-surface)] text-[var(--brand-primary)] shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                Manual Override
              </button>
            </div>

            <p className="mt-2 text-xs text-[var(--text-secondary)]">
              {lightMode === 'auto'
                ? `Automated 24h cycle: ${lightScheduleHours}h daily light according to active preset.`
                : 'Direct manual override: Toggle Grow light immediately on or off.'}
            </p>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={handleLightToggle}
              disabled={isOffline}
              aria-label={`Turn Grow light ${lightActive ? 'off' : 'on'}`}
              className={`flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-bold transition-all ${
                lightActive
                  ? 'border-amber-400 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:border-[var(--border-focus)]'
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <SunMedium className="h-4 w-4 text-amber-500" />
              <span>{lightActive ? 'Turn Grow light OFF' : 'Turn Grow light ON'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
