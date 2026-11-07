import { useState, useEffect } from 'react'

export interface OfflineStatus {
  isOffline: boolean
  isStale: boolean
  secondsSince: number | null
  statusLabel: 'ONLINE' | 'AWAITING_TELEMETRY' | 'OFFLINE'
}

export function useDeviceOfflineStatus(
  readingTs: number | null | undefined,
  offlineThresholdSeconds: number = 30,
): OfflineStatus {
  const [secondsSince, setSecondsSince] = useState<number | null>(() => {
    if (!readingTs) return null
    return Math.max(0, Math.floor(Date.now() / 1000 - readingTs))
  })

  useEffect(() => {
    if (!readingTs) {
      setSecondsSince(null)
      return
    }

    const update = () => {
      const now = Math.floor(Date.now() / 1000)
      setSecondsSince(Math.max(0, now - readingTs))
    }

    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [readingTs])

  if (readingTs === null || readingTs === undefined || secondsSince === null) {
    return {
      isOffline: true,
      isStale: true,
      secondsSince: null,
      statusLabel: 'OFFLINE',
    }
  }

  const isOffline = secondsSince > offlineThresholdSeconds
  const isStale = secondsSince > 15

  let statusLabel: 'ONLINE' | 'AWAITING_TELEMETRY' | 'OFFLINE' = 'ONLINE'
  if (isOffline) {
    statusLabel = 'OFFLINE'
  } else if (isStale) {
    statusLabel = 'AWAITING_TELEMETRY'
  }

  return {
    isOffline,
    isStale,
    secondsSince,
    statusLabel,
  }
}
