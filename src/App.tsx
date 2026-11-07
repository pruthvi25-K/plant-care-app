import { useState } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { useAuth } from '@/context/AuthContext'
import { useDemoMode } from '@/context/DemoModeContext'
import { useDeviceTelemetry } from '@/hooks/useDeviceTelemetry'
import { useDeviceOfflineStatus } from '@/hooks/useDeviceOfflineStatus'
import { useDeviceProfile } from '@/hooks/useDeviceProfile'
import { useDeviceCommands } from '@/hooks/useDeviceCommands'
import { DeviceSelector } from '@/components/DeviceSelector'
import { OfflineBanner } from '@/components/OfflineBanner'
import { DemoModeBanner } from '@/components/DemoModeBanner'
import { MoistureCard } from '@/components/MoistureCard'
import { TemperatureCard } from '@/components/TemperatureCard'
import { ActuatorStatusCard } from '@/components/ActuatorStatusCard'
import { ManualControls } from '@/components/ManualControls'
import { PresetSelector } from '@/components/PresetSelector'
import { CustomSettingsCard } from '@/components/CustomSettingsCard'
import { TelemetryChart } from '@/components/TelemetryChart'
import { AuthModal } from '@/components/AuthModal'
import { Sun, Moon, Leaf, User as UserIcon, LogOut, LogIn, Sparkles } from 'lucide-react'

export function App() {
  const { theme, toggleTheme } = useTheme()
  const { user, isGuest, logout } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [currentDeviceId, setCurrentDeviceId] = useState('plant1')

  // Real Hardware State
  const { reading: liveReading, loading: liveLoading } = useDeviceTelemetry(currentDeviceId)
  const {
    profile: liveProfile,
    saving: liveSaving,
    applyPreset: liveApplyPreset,
    updateProfile: liveUpdateProfile,
  } = useDeviceProfile(currentDeviceId)
  const liveOfflineStatus = useDeviceOfflineStatus(liveReading?.ts)

  const {
    wateringPending: liveWateringPending,
    wateringSuccess: liveWateringSuccess,
    commandError: liveCommandError,
    triggerWaterNow: liveTriggerWaterNow,
    setGrowLight: liveSetGrowLight,
  } = useDeviceCommands(currentDeviceId, liveReading?.pump_active ?? false)

  // Demo Mode State
  const {
    isDemoMode,
    toggleDemoMode,
    demoReading,
    demoProfile,
    demoWaterNow,
    demoToggleLight,
    demoApplyPreset,
    demoUpdateProfile,
    demoWateringPending,
    demoWateringSuccess,
  } = useDemoMode()

  // Unified State Resolution: Demo Mode overrides live network
  const activeReading = isDemoMode ? demoReading : liveReading
  const activeProfile = isDemoMode ? demoProfile : liveProfile
  const activeLoading = isDemoMode ? false : liveLoading
  const activeSaving = isDemoMode ? false : liveSaving
  const activeOfflineStatus = isDemoMode
    ? { isOffline: false, isStale: false, secondsSince: 1, statusLabel: 'ONLINE' as const }
    : liveOfflineStatus

  const activeWateringPending = isDemoMode ? demoWateringPending : liveWateringPending
  const activeWateringSuccess = isDemoMode ? demoWateringSuccess : liveWateringSuccess
  const activeCommandError = isDemoMode ? null : liveCommandError

  const handleWaterNow = async (seconds?: number) => {
    if (isDemoMode) {
      await demoWaterNow(seconds)
    } else {
      await liveTriggerWaterNow(seconds)
    }
  }

  const handleToggleLight = async (active: boolean) => {
    if (isDemoMode) {
      await demoToggleLight(active)
    } else {
      await liveSetGrowLight(active)
    }
  }

  const handleApplyPreset = (key: 'succulent' | 'tropical' | 'herbs' | 'fern') => {
    if (isDemoMode) {
      demoApplyPreset(key)
    } else {
      liveApplyPreset(key)
    }
  }

  const handleUpdateProfile = async (custom: Parameters<typeof liveUpdateProfile>[0]) => {
    if (isDemoMode) {
      demoUpdateProfile(custom)
    } else {
      await liveUpdateProfile(custom)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] theme-transition">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-[var(--brand-primary)]" />
            <h1 className="text-lg font-bold tracking-tight">PlantCare</h1>
            {isDemoMode && (
              <span className="hidden items-center gap-1 rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-700 sm:flex dark:text-purple-300">
                <Sparkles className="h-3 w-3" />
                <span>DEMO</span>
              </span>
            )}
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
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6">
        {/* Demo Mode Toggle Banner */}
        <DemoModeBanner isDemoMode={isDemoMode} onToggleDemoMode={toggleDemoMode} />

        {/* Device Selection Bar (only relevant when not in demo mode) */}
        {!isDemoMode && (
          <DeviceSelector
            currentDeviceId={currentDeviceId}
            onSelectDevice={setCurrentDeviceId}
          />
        )}

        {/* Offline / Connectivity Banner */}
        <OfflineBanner status={activeOfflineStatus} deviceId={isDemoMode ? 'Virtual Demo Node' : currentDeviceId} />

        {/* Live Monitoring Dashboard Cards */}
        <section aria-labelledby="live-metrics-heading">
          <h2 id="live-metrics-heading" className="sr-only">
            Live Telemetry Metrics
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MoistureCard moisture={activeReading?.moisture ?? null} loading={activeLoading} />
            <TemperatureCard temperature={activeReading?.temperature ?? null} loading={activeLoading} />
            <ActuatorStatusCard
              pumpActive={activeReading?.pump_active ?? false}
              lightActive={activeReading?.light_active ?? false}
              lastSeenTs={activeReading?.ts ?? null}
            />
          </div>
        </section>

        {/* Manual Hardware Actuator Controls (Water Now & Grow Light) */}
        <ManualControls
          pumpActive={activeReading?.pump_active ?? false}
          lightActive={activeReading?.light_active ?? false}
          isOffline={activeOfflineStatus.isOffline}
          wateringPending={activeWateringPending}
          wateringSuccess={activeWateringSuccess}
          commandError={activeCommandError}
          lightMode={activeProfile?.light_mode ?? 'auto'}
          lightScheduleHours={activeProfile?.light_schedule_hours ?? 12}
          onWaterNow={handleWaterNow}
          onToggleLight={handleToggleLight}
          onSetLightMode={async (mode) => handleUpdateProfile({ light_mode: mode })}
        />

        {/* Telemetry Historical Trend Chart */}
        <TelemetryChart deviceId={currentDeviceId} />

        {/* Plant Care Presets */}
        <PresetSelector
          currentProfile={activeProfile}
          onSelectPreset={handleApplyPreset}
          saving={activeSaving}
          disabled={activeOfflineStatus.isOffline}
        />

        {/* Custom Fine-Tuning Settings */}
        <CustomSettingsCard
          currentProfile={activeProfile}
          onSaveProfile={handleUpdateProfile}
          saving={activeSaving}
          disabled={activeOfflineStatus.isOffline}
        />
      </main>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  )
}
