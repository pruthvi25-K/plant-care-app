import { useEffect, useState } from 'react'
import { ref, onValue, set, off } from 'firebase/database'
import { database } from '../services/firebase'
import type { DeviceProfile } from '../services/mockDevice'

export const PLANT_PRESETS: Record<string, DeviceProfile> = {
  succulent: {
    preset_name: 'Succulent / Cactus',
    moisture_min: 15,
    moisture_max: 30,
    water_duration_s: 2,
    light_mode: 'auto',
    light_schedule_hours: 14,
  },
  tropical: {
    preset_name: 'Foliage / Tropical',
    moisture_min: 40,
    moisture_max: 65,
    water_duration_s: 4,
    light_mode: 'auto',
    light_schedule_hours: 12,
  },
  herbs: {
    preset_name: 'Herbs & Kitchen',
    moisture_min: 50,
    moisture_max: 70,
    water_duration_s: 3,
    light_mode: 'auto',
    light_schedule_hours: 14,
  },
  fern: {
    preset_name: 'Fern / Humid',
    moisture_min: 60,
    moisture_max: 80,
    water_duration_s: 5,
    light_mode: 'auto',
    light_schedule_hours: 10,
  },
}

export function useDeviceProfile(deviceId: string = 'plant1') {
  const [profile, setProfile] = useState<DeviceProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    const profileRef = ref(database, `plants/${deviceId}/profile`)

    const unsubscribe = onValue(
      profileRef,
      (snapshot) => {
        setLoading(false)
        if (snapshot.exists()) {
          setProfile(snapshot.val() as DeviceProfile)
        } else {
          // Default fallback to Tropical preset if profile doesn't exist yet
          setProfile(PLANT_PRESETS.tropical)
        }
      },
      (err) => {
        setLoading(false)
        setError(err.message)
      },
    )

    return () => {
      off(profileRef)
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [deviceId])

  const applyPreset = async (presetKey: keyof typeof PLANT_PRESETS) => {
    const target = PLANT_PRESETS[presetKey]
    if (!target) return

    setSaving(true)
    setError(null)
    try {
      const profileRef = ref(database, `plants/${deviceId}/profile`)
      const payload: DeviceProfile = {
        ...target,
        updated_at: Math.floor(Date.now() / 1000),
      }
      await set(profileRef, payload)
      setProfile(payload)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to apply preset'
      setError(msg)
      throw err
    } finally {
      setSaving(false)
    }
  }

  const updateProfile = async (custom: Partial<DeviceProfile>) => {
    setSaving(true)
    setError(null)
    try {
      const current = profile ?? PLANT_PRESETS.tropical
      const payload: DeviceProfile = {
        ...current,
        ...custom,
        updated_at: Math.floor(Date.now() / 1000),
      }
      const profileRef = ref(database, `plants/${deviceId}/profile`)
      await set(profileRef, payload)
      setProfile(payload)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile'
      setError(msg)
      throw err
    } finally {
      setSaving(false)
    }
  }

  return { profile, loading, saving, error, applyPreset, updateProfile }
}
