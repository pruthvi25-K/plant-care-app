import { useState, useRef, useEffect } from 'react'
import { ref, update } from 'firebase/database'
import { database } from '../services/firebase'
import type { DeviceCommand } from '../services/mockDevice'

export interface CommandState {
  wateringPending: boolean
  wateringSuccess: boolean
  commandError: string | null
}

export function useDeviceCommands(
  deviceId: string = 'plant1',
  pumpActive: boolean = false,
) {
  const [wateringPending, setWateringPending] = useState(false)
  const [wateringSuccess, setWateringSuccess] = useState(false)
  const [commandError, setCommandError] = useState<string | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // When pump becomes active on physical hardware, acknowledge command
  useEffect(() => {
    if (pumpActive && wateringPending) {
      setWateringPending(false)
      setWateringSuccess(true)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setTimeout(() => setWateringSuccess(false), 4000)
    }
  }, [pumpActive, wateringPending])

  const triggerWaterNow = async (durationSeconds: number = 3) => {
    setCommandError(null)
    setWateringPending(true)
    setWateringSuccess(false)

    try {
      const commandRef = ref(database, `plants/${deviceId}/command`)
      const payload: DeviceCommand = {
        water_now: true,
        water_duration_s: Math.min(10, Math.max(1, durationSeconds)),
        ts: Math.floor(Date.now() / 1000),
      }

      await update(commandRef, payload)

      // 10s hardware timeout check
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        setWateringPending((current) => {
          if (current) {
            setCommandError('Device did not respond within 10 seconds')
            return false
          }
          return false
        })
      }, 10000)
    } catch (err: unknown) {
      setWateringPending(false)
      const msg = err instanceof Error ? err.message : 'Failed to send water command'
      setCommandError(msg)
      throw err
    }
  }

  const setGrowLight = async (active: boolean) => {
    setCommandError(null)
    try {
      const commandRef = ref(database, `plants/${deviceId}/command`)
      await update(commandRef, {
        grow_light: active,
        ts: Math.floor(Date.now() / 1000),
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to toggle Grow light'
      setCommandError(msg)
      throw err
    }
  }

  return {
    wateringPending,
    wateringSuccess,
    commandError,
    triggerWaterNow,
    setGrowLight,
    clearError: () => setCommandError(null),
  }
}
