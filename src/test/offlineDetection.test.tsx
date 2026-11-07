import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { renderHook } from '@testing-library/react'
import { useDeviceOfflineStatus } from '../hooks/useDeviceOfflineStatus'
import { OfflineBanner } from '../components/OfflineBanner'

describe('Offline Detection System (Ticket A-06)', () => {
  describe('useDeviceOfflineStatus hook', () => {
    it('flags device as offline when no timestamp is present', () => {
      const { result } = renderHook(() => useDeviceOfflineStatus(null))
      expect(result.current.isOffline).toBe(true)
      expect(result.current.statusLabel).toBe('OFFLINE')
      expect(result.current.secondsSince).toBeNull()
    })

    it('reports ONLINE when last reading was 5 seconds ago', () => {
      const now = Math.floor(Date.now() / 1000)
      const { result } = renderHook(() => useDeviceOfflineStatus(now - 5))
      expect(result.current.isOffline).toBe(false)
      expect(result.current.isStale).toBe(false)
      expect(result.current.statusLabel).toBe('ONLINE')
    })

    it('reports AWAITING_TELEMETRY when reading is between 15s and 30s', () => {
      const now = Math.floor(Date.now() / 1000)
      const { result } = renderHook(() => useDeviceOfflineStatus(now - 20))
      expect(result.current.isOffline).toBe(false)
      expect(result.current.isStale).toBe(true)
      expect(result.current.statusLabel).toBe('AWAITING_TELEMETRY')
    })

    it('reports OFFLINE when reading is older than 30s threshold', () => {
      const now = Math.floor(Date.now() / 1000)
      const { result } = renderHook(() => useDeviceOfflineStatus(now - 35))
      expect(result.current.isOffline).toBe(true)
      expect(result.current.statusLabel).toBe('OFFLINE')
    })
  })

  describe('OfflineBanner Component', () => {
    it('renders online indicator when device is active', () => {
      render(
        <OfflineBanner
          status={{ isOffline: false, isStale: false, secondsSince: 4, statusLabel: 'ONLINE' }}
          deviceId="plant1"
        />,
      )
      expect(screen.getByText(/Node plant1 Online/i)).toBeInTheDocument()
    })

    it('renders prominent red warning banner when device is offline (> 30s)', () => {
      render(
        <OfflineBanner
          status={{ isOffline: true, isStale: true, secondsSince: 45, statusLabel: 'OFFLINE' }}
          deviceId="plant1"
        />,
      )
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText(/Hardware Node Offline/i)).toBeInTheDocument()
      expect(screen.getByText(/Last Seen 45s Ago/i)).toBeInTheDocument()
      expect(screen.getByText(/Actuator controls \("Water Now" & "Grow light"\) are locked/i)).toBeInTheDocument()
    })
  })
})
