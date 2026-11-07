import { useState } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { useAuth } from '@/context/AuthContext'
import { useDeviceTelemetry } from '@/hooks/useDeviceTelemetry'
import { useDeviceOfflineStatus } from '@/hooks/useDeviceOfflineStatus'
import { useDeviceProfile } from '@/hooks/useDeviceProfile'
import { useDeviceCommands } from '@/hooks/useDeviceCommands'
import { DeviceSelector } from '@/components/DeviceSelector'
import { OfflineBanner } from '@/components/OfflineBanner'
import { MoistureCard } from '@/components/MoistureCard'
import { TemperatureCard } from '@/components/TemperatureCard'
import { ActuatorStatusCard } from '@/components/ActuatorStatusCard'
import { ManualControls } from '@/components/ManualControls'
import { PresetSelector } from '@/components/PresetSelector'
import { CustomSettingsCard } from '@/components/CustomSettingsCard'
import { TelemetryChart } from '@/components/TelemetryChart'
import { AuthModal } from '@/components/AuthModal'
import { Sun, Moon, Leaf, User as UserIcon, LogOut, LogIn } from 'lucide-react'

export function App() {
  const { theme, toggleTheme } = useTheme()
  const { user, isGuest, logout } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [currentDeviceId, setCurrentDeviceId] = useState('plant1')

  const { reading, loading: telemetryLoading } = useDeviceTelemetry(currentDeviceId)
  const { profile, saving: profileSaving, applyPreset, updateProfile } = useDeviceProfile(currentDeviceId)
  const offlineStatus = useDeviceOfflineStatus(reading?.ts)

  const {
    wateringPending,
    wateringSuccess,
    commandError,
    triggerWaterNow,
    setGrowLight,
  } = useDeviceCommands(currentDeviceId, reading?.pump_active ?? false)

  const handleSetLightMode = async (mode: 'auto' | 'manual') => {
    await updateProfile({ light_mode: mode })
  }

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
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6">
        {/* Device Selection Bar */}
        <DeviceSelector
          currentDeviceId={currentDeviceId}
          onSelectDevice={setCurrentDeviceId}
        />

        {/* Offline / Connectivity Banner */}
        <OfflineBanner status={offlineStatus} deviceId={currentDeviceId} />

        {/* Live Monitoring Dashboard Cards */}
        <section aria-labelledby="live-metrics-heading">
          <h2 id="live-metrics-heading" className="sr-only">
            Live Telemetry Metrics
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MoistureCard moisture={reading?.moisture ?? null} loading={telemetryLoading} />
            <TemperatureCard temperature={reading?.temperature ?? null} loading={telemetryLoading} />
            <ActuatorStatusCard
              pumpActive={reading?.pump_active ?? false}
              lightActive={reading?.light_active ?? false}
              lastSeenTs={reading?.ts ?? null}
            />
          </div>
        </section>

        {/* Manual Hardware Actuator Controls (Water Now & Grow Light) */}
        <ManualControls
          pumpActive={reading?.pump_active ?? false}
          lightActive={reading?.light_active ?? false}
          isOffline={offlineStatus.isOffline}
          wateringPending={wateringPending}
          wateringSuccess={wateringSuccess}
          commandError={commandError}
          lightMode={profile?.light_mode ?? 'auto'}
          lightScheduleHours={profile?.light_schedule_hours ?? 12}
          onWaterNow={triggerWaterNow}
          onToggleLight={setGrowLight}
          onSetLightMode={handleSetLightMode}
        />

        {/* Telemetry Historical Trend Chart */}
        <TelemetryChart deviceId={currentDeviceId} />

        {/* Plant Care Presets */}
        <PresetSelector
          currentProfile={profile}
          onSelectPreset={applyPreset}
          saving={profileSaving}
          disabled={offlineStatus.isOffline}
        />

        {/* Custom Fine-Tuning Settings */}
        <CustomSettingsCard
          currentProfile={profile}
          onSaveProfile={updateProfile}
          saving={profileSaving}
          disabled={offlineStatus.isOffline}
        />
      </main>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  )
}
