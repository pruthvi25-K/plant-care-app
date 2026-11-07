import { PLANT_PRESETS } from '../hooks/useDeviceProfile'
import type { DeviceProfile } from '../services/mockDevice'
import { CheckCircle2, Loader2, Sprout, SunMedium } from 'lucide-react'

interface PresetSelectorProps {
  currentProfile: DeviceProfile | null
  onSelectPreset: (key: 'succulent' | 'tropical' | 'herbs' | 'fern') => void
  saving?: boolean
  disabled?: boolean
}

const PRESET_ICONS: Record<string, string> = {
  succulent: '🌵',
  tropical: '🌿',
  herbs: '🌱',
  fern: '🍃',
}

export function PresetSelector({
  currentProfile,
  onSelectPreset,
  saving = false,
  disabled = false,
}: PresetSelectorProps) {
  const activePresetName = currentProfile?.preset_name?.toLowerCase() ?? ''

  return (
    <section aria-labelledby="preset-heading" className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Sprout className="h-4 w-4" />
          </div>
          <div>
            <h3 id="preset-heading" className="text-sm font-bold tracking-tight text-[var(--text-primary)]">
              Plant Care Presets
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Auto-syncs soil moisture thresholds and Grow light photoperiod
            </p>
          </div>
        </div>

        {saving && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--brand-primary)]">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Syncing to ESP32...</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {(Object.entries(PLANT_PRESETS) as [keyof typeof PLANT_PRESETS, DeviceProfile][]).map(
          ([key, preset]) => {
            const isSelected = activePresetName.includes(key) || activePresetName === preset.preset_name?.toLowerCase()

            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelectPreset(key as 'succulent' | 'tropical' | 'herbs' | 'fern')}
                disabled={disabled || saving}
                aria-pressed={isSelected}
                className={`relative flex flex-col justify-between rounded-2xl border p-4 text-left transition-all ${
                  isSelected
                    ? 'border-[var(--brand-primary)] bg-[var(--brand-subtle)]/40 shadow-sm ring-2 ring-[var(--brand-primary)]/20'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-focus)] hover:shadow-[var(--shadow-card)]'
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl" role="img" aria-hidden="true">
                      {PRESET_ICONS[key] || '🌱'}
                    </span>
                    {isSelected && (
                      <span className="flex items-center gap-1 rounded-full bg-[var(--brand-primary)] px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Active</span>
                      </span>
                    )}
                  </div>

                  <h4 className="mt-2 text-sm font-bold text-[var(--text-primary)]">
                    {preset.preset_name}
                  </h4>
                </div>

                <div className="mt-4 space-y-1.5 border-t border-[var(--border-subtle)]/60 pt-3 text-xs text-[var(--text-secondary)]">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Target Moisture:</span>
                    <span className="font-semibold text-[var(--text-primary)]">
                      {preset.moisture_min}% – {preset.moisture_max}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Water Pulse:</span>
                    <span className="font-semibold text-[var(--text-primary)]">
                      {preset.water_duration_s}s per cycle
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">Grow light:</span>
                    <span className="flex items-center gap-1 font-semibold text-[var(--text-primary)]">
                      <SunMedium className="h-3 w-3 text-amber-500" />
                      <span>{preset.light_schedule_hours}h daily</span>
                    </span>
                  </div>
                </div>
              </button>
            )
          },
        )}
      </div>
    </section>
  )
}
