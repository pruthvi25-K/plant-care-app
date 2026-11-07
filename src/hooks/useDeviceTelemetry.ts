import { useEffect, useState } from 'react'
import { ref, onValue, off } from 'firebase/database'
import { database } from '../services/firebase'
import type { TelemetryReading } from '../services/mockDevice'

export function useDeviceTelemetry(deviceId: string = 'plant1') {
  const [reading, setReading] = useState<TelemetryReading | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    const readingRef = ref(database, `plants/${deviceId}/reading`)

    const unsubscribe = onValue(
      readingRef,
      (snapshot) => {
        setLoading(false)
        if (snapshot.exists()) {
          const val = snapshot.val() as TelemetryReading
          setReading(val)
        } else {
          setReading(null)
        }
      },
      (err) => {
        setLoading(false)
        setError(err.message)
      },
    )

    return () => {
      off(readingRef)
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [deviceId])

  return { reading, loading, error }
}
