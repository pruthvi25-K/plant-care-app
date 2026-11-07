import { useState, useEffect, type FormEvent } from 'react'
import type { DeviceProfile } from '../services/mockDevice'
import { validateProfileSettings, type ValidationErrors } from '../utils/validation'
import { Sliders, Check, AlertCircle, Loader2, ChevronDown, ChevronUp, SunMedium } from 'lucide-react'

interface CustomSettingsCardProps {
  currentProfile: DeviceProfile | null
  onSaveProfile: (custom: Partial<DeviceProfile>) => Promise<void>
  saving?: boolean
  disabled?: boolean
}

export function CustomSettingsCard({
  currentProfile,
  onSaveProfile,
  saving = false,
  disabled = false,
}: CustomSettingsCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [minMoisture, setMinMoisture] = useState(currentProfile?.moisture_min ?? 40)
  const [maxMoisture, setMaxMoisture] = useState(currentProfile?.moisture_max ?? 65)
  const [duration, setDuration] = useState(currentProfile?.water_duration_s ?? 3)
  const [lightHours, setLightHours] = useState(currentProfile?.light_schedule_hours ?? 12)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    if (currentProfile) {
      setMinMoisture(currentProfile.moisture_min)
      setMaxMoisture(currentProfile.moisture_max)
      setDuration(currentProfile.water_duration_s)
      setLightHours(currentProfile.light_schedule_hours ?? 12)
    }
  }, [currentProfile])

  const handleValidate = () => {
    const { isValid, errors: errs } = validateProfileSettings(
      minMoisture,
      maxMoisture,
      duration,
      lightHours,
    )
    setErrors(errs)
    return isValid
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!handleValidate()) return

    setSaveSuccess(false)
    try {
      await onSaveProfile({
        preset_name: 'Custom Settings',
        moisture_min: minMoisture,
        moisture_max: maxMoisture,
        water_duration_s: duration,
        light_schedule_hours: lightHours,
      })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch {
      // Error handled by parent
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-[var(--shadow-card)] transition-all">
      {/* Header / Accordion trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between p-4 text-left sm:p-5"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Sliders className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Custom Thresholds &amp; Settings
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Fine-tune min/max soil moisture and Grow light photoperiod
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--brand-primary)]">
          <span>{isOpen ? 'Collapse' : 'Customize'}</span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {/* Expandable Form */}
      {isOpen && (
        <form onSubmit={handleSubmit} className="border-t border-[var(--border-subtle)] p-4 sm:p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Min Moisture Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold">
                <label htmlFor="min-moisture-input" className="text-[var(--text-secondary)]">
                  Min Moisture Threshold (Water Trigger)
                </label>
                <span className="font-bold text-[var(--brand-primary)]">{minMoisture}%</span>
              </div>
              <input
                id="min-moisture-input"
                type="range"
                min="0"
                max="90"
                step="1"
                value={minMoisture}
                onChange={(e) => {
                  setMinMoisture(Number(e.target.value))
                  setSaveSuccess(false)
                }}
                disabled={disabled || saving}
                className="mt-2 w-full accent-[var(--brand-primary)]"
              />
              {errors.min && (
                <p className="mt-1 flex items-center gap-1 text-[11px] text-red-500">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>{errors.min}</span>
                </p>
              )}
            </div>

            {/* Max Moisture Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold">
                <label htmlFor="max-moisture-input" className="text-[var(--text-secondary)]">
                  Max Moisture Target (Stop Trigger)
                </label>
                <span className="font-bold text-[var(--brand-primary)]">{maxMoisture}%</span>
              </div>
              <input
                id="max-moisture-input"
                type="range"
                min="10"
                max="100"
                step="1"
                value={maxMoisture}
                onChange={(e) => {
                  setMaxMoisture(Number(e.target.value))
                  setSaveSuccess(false)
                }}
                disabled={disabled || saving}
                className="mt-2 w-full accent-[var(--brand-primary)]"
              />
              {errors.max && (
                <p className="mt-1 flex items-center gap-1 text-[11px] text-red-500">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>{errors.max}</span>
                </p>
              )}
            </div>

            {/* Pump Pulse Duration */}
            <div>
              <div className="flex justify-between text-xs font-semibold">
                <label htmlFor="duration-input" className="text-[var(--text-secondary)]">
                  Water Pump Pulse Duration
                </label>
                <span className="font-bold text-sky-600 dark:text-sky-400">{duration} seconds</span>
              </div>
              <input
                id="duration-input"
                type="range"
                min="1"
                max="10"
                step="1"
                value={duration}
                onChange={(e) => {
                  setDuration(Number(e.target.value))
                  setSaveSuccess(false)
                }}
                disabled={disabled || saving}
                className="mt-2 w-full accent-sky-500"
              />
              <p className="mt-1 text-[10px] text-[var(--text-muted)]">
                Firmware safety limit: capped at 10 seconds maximum per cycle.
              </p>
              {errors.duration && (
                <p className="mt-1 flex items-center gap-1 text-[11px] text-red-500">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>{errors.duration}</span>
                </p>
              )}
            </div>

            {/* Grow light photoperiod */}
            <div>
              <div className="flex justify-between text-xs font-semibold">
                <label htmlFor="light-hours-input" className="flex items-center gap-1 text-[var(--text-secondary)]">
                  <SunMedium className="h-3.5 w-3.5 text-amber-500" />
                  <span>Grow light Schedule</span>
                </label>
                <span className="font-bold text-amber-600 dark:text-amber-400">{lightHours} hours / day</span>
              </div>
              <input
                id="light-hours-input"
                type="range"
                min="1"
                max="24"
                step="1"
                value={lightHours}
                onChange={(e) => {
                  setLightHours(Number(e.target.value))
                  setSaveSuccess(false)
                }}
                disabled={disabled || saving}
                className="mt-2 w-full accent-amber-500"
              />
              <p className="mt-1 text-[10px] text-[var(--text-muted)]">
                Automated photoperiod when Grow light mode is set to "auto".
              </p>
              {errors.lightHours && (
                <p className="mt-1 flex items-center gap-1 text-[11px] text-red-500">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>{errors.lightHours}</span>
                </p>
              )}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-[var(--border-subtle)]/60 pt-4">
            {saveSuccess ? (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <Check className="h-4 w-4" />
                <span>Custom settings saved &amp; synced to ESP32!</span>
              </span>
            ) : (
              <span className="text-[11px] text-[var(--text-muted)]">
                Values will be verified against Firebase security rules.
              </span>
            )}

            <button
              type="submit"
              disabled={disabled || saving}
              className="flex items-center gap-1.5 rounded-xl bg-[var(--brand-primary)] px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-[var(--brand-primary-hover)] disabled:opacity-50"
            >
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Save Custom Profile</span>
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
