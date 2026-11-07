import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'
import { MockESP32Device, type TelemetryReading, type DeviceProfile } from '../services/mockDevice'
import { PLANT_PRESETS } from '../hooks/useDeviceProfile'

export interface DemoModeContextType {
  isDemoMode: boolean
  toggleDemoMode: () => void
  demoReading: TelemetryReading | null
  demoProfile: DeviceProfile
  demoWaterNow: (durationSeconds?: number) => Promise<void>
  demoToggleLight: (active: boolean) => Promise<void>
  demoApplyPreset: (key: keyof typeof PLANT_PRESETS) => void
  demoUpdateProfile: (custom: Partial<DeviceProfile>) => void
  demoWateringPending: boolean
  demoWateringSuccess: boolean
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined)

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('plantcare-demo-mode') === 'true'
  })

  const [demoReading, setDemoReading] = useState<TelemetryReading | null>(null)
  const [demoProfile, setDemoProfile] = useState<DeviceProfile>(PLANT_PRESETS.tropical)
  const [demoWateringPending, setDemoWateringPending] = useState(false)
  const [demoWateringSuccess, setDemoWateringSuccess] = useState(false)

  const deviceRef = useRef<MockESP32Device | null>(null)

  useEffect(() => {
    localStorage.setItem('plantcare-demo-mode', String(isDemoMode))

    if (!isDemoMode) {
      if (deviceRef.current) {
        deviceRef.current.stop()
        deviceRef.current = null
      }
      return
    }

    // Initialize mock device
    const mock = new MockESP32Device('demo-plant', 46.5, 23.8)
    deviceRef.current = mock

    // Immediate initial reading
    setDemoReading(mock.generateReading())

    // 3-second simulation loop
    const timer = setInterval(() => {
      if (deviceRef.current) {
        const next = deviceRef.current.generateReading()
        setDemoReading({ ...next })
      }
    }, 3000)

    return () => {
      clearInterval(timer)
      if (deviceRef.current) {
        deviceRef.current.stop()
        deviceRef.current = null
      }
    }
  }, [isDemoMode])

  const toggleDemoMode = () => {
    setIsDemoMode((prev) => !prev)
  }

  const demoWaterNow = async (durationSeconds: number = 3) => {
    if (!deviceRef.current) return

    setDemoWateringPending(true)
    setDemoWateringSuccess(false)

    // Execute simulated watering
    deviceRef.current.handleCommand(
      {
        water_now: true,
        water_duration_s: durationSeconds,
        ts: Math.floor(Date.now() / 1000),
      },
      () => {
        // Upon pump completion
        setDemoWateringPending(false)
        setDemoWateringSuccess(true)
        if (deviceRef.current) {
          setDemoReading(deviceRef.current.generateReading())
        }
        setTimeout(() => setDemoWateringSuccess(false), 3000)
      },
    )

    // Update reading immediately with active pump
    setDemoReading(deviceRef.current.generateReading())
    setDemoWateringPending(false)
  }

  const demoToggleLight = async (active: boolean) => {
    if (!deviceRef.current) return
    deviceRef.current.handleCommand({
      grow_light: active,
      ts: Math.floor(Date.now() / 1000),
    })
    setDemoReading(deviceRef.current.generateReading())
  }

  const demoApplyPreset = (key: keyof typeof PLANT_PRESETS) => {
    const target = PLANT_PRESETS[key]
    if (target) {
      setDemoProfile({ ...target, updated_at: Math.floor(Date.now() / 1000) })
    }
  }

  const demoUpdateProfile = (custom: Partial<DeviceProfile>) => {
    setDemoProfile((prev) => ({
      ...prev,
      ...custom,
      updated_at: Math.floor(Date.now() / 1000),
    }))
  }

  return (
    <DemoModeContext.Provider
      value={{
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
      }}
    >
      {children}
    </DemoModeContext.Provider>
  )
}

export function useDemoMode(): DemoModeContextType {
  const context = useContext(DemoModeContext)
  if (!context) {
    throw new Error('useDemoMode must be used within a DemoModeProvider')
  }
  return context
}
