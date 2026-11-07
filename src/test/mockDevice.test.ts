import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MockESP32Device } from '../services/mockDevice'

describe('MockESP32Device Simulator (Ticket A-03)', () => {
  let device: MockESP32Device

  beforeEach(() => {
    vi.useFakeTimers()
    device = new MockESP32Device('plant1', 50.0, 24.0)
  })

  afterEach(() => {
    device.stop()
    vi.useRealTimers()
  })

  it('generates readings within valid physical constraints', () => {
    const reading = device.generateReading()
    expect(reading.moisture).toBeGreaterThanOrEqual(0)
    expect(reading.moisture).toBeLessThanOrEqual(100)
    expect(reading.temperature).toBeGreaterThanOrEqual(-10)
    expect(reading.temperature).toBeLessThanOrEqual(60)
    expect(reading.pump_active).toBe(false)
    expect(reading.light_active).toBe(false)
    expect(reading.ts).toBeGreaterThan(0)
  })

  it('simulates gradual soil drying when pump is off', () => {
    const reading1 = device.generateReading()
    const reading2 = device.generateReading()
    expect(reading2.moisture).toBeLessThanOrEqual(reading1.moisture)
  })

  it('firmware ignores stale commands older than 30 seconds', () => {
    const now = Math.floor(Date.now() / 1000)
    const staleCommand = {
      water_now: true,
      water_duration_s: 3,
      ts: now - 35, // 35 seconds ago
    }

    const result = device.handleCommand(staleCommand)
    expect(result.status).toBe('ignored_stale')
    expect(device.getStatus().pumpActive).toBe(false)
  })

  it('firmware hard-caps pump duration at 10 seconds maximum', () => {
    const now = Math.floor(Date.now() / 1000)
    const dangerousCommand = {
      water_now: true,
      water_duration_s: 60, // user requested 60s
      ts: now,
    }

    const result = device.handleCommand(dangerousCommand)
    expect(result.status).toBe('executed')
    expect(result.duration).toBe(10) // Capped at 10s
    expect(device.getStatus().pumpActive).toBe(true)

    // Fast-forward 10 seconds
    vi.advanceTimersByTime(10000)
    expect(device.getStatus().pumpActive).toBe(false)
  })

  it('toggles Grow light status via command', () => {
    const now = Math.floor(Date.now() / 1000)
    device.handleCommand({ grow_light: true, ts: now })
    expect(device.getStatus().lightActive).toBe(true)

    device.handleCommand({ grow_light: false, ts: now })
    expect(device.getStatus().lightActive).toBe(false)
  })
})
