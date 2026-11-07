/**
 * ESP32 Hardware Simulator (Ticket A-03)
 * Simulates physical telemetry and actuators for Plant Care nodes.
 */

export interface TelemetryReading {
  moisture: number
  temperature: number
  pump_active: boolean
  light_active: boolean
  ts: number
}

export interface DeviceCommand {
  water_now?: boolean
  water_duration_s?: number
  grow_light?: boolean
  ts: number
}

export interface DeviceProfile {
  preset_name?: string
  moisture_min: number
  moisture_max: number
  water_duration_s: number
  light_mode?: 'auto' | 'manual' | 'off'
  light_schedule_hours?: number
  updated_at?: number
}

export class MockESP32Device {
  public deviceId: string
  private moisture: number
  private temperature: number
  private pumpActive: boolean = false
  private lightActive: boolean = false
  private pumpTimer: ReturnType<typeof setTimeout> | null = null

  constructor(deviceId: string = 'plant1', initialMoisture = 55.0, initialTemp = 24.5) {
    this.deviceId = deviceId
    this.moisture = initialMoisture
    this.temperature = initialTemp
  }

  /**
   * Generates a realistic telemetry reading, simulating gradual soil moisture loss.
   */
  public generateReading(): TelemetryReading {
    if (!this.pumpActive) {
      // Natural soil drying: decreases by 0.05% to 0.15% per cycle
      const drying = 0.05 + Math.random() * 0.1
      this.moisture = Math.max(10, +(this.moisture - drying).toFixed(1))
    }

    // Slight ambient temperature variance (+/- 0.2 C)
    const tempDrift = (Math.random() - 0.5) * 0.4
    this.temperature = +(this.temperature + tempDrift).toFixed(1)

    return {
      moisture: this.moisture,
      temperature: this.temperature,
      pump_active: this.pumpActive,
      light_active: this.lightActive,
      ts: Math.floor(Date.now() / 1000),
    }
  }

  /**
   * Processes an incoming command payload from plants/{deviceId}/command.
   * Firmware safety rules enforced:
   * 1. Ignores stale commands older than 30 seconds.
   * 2. Hard caps pump pulse duration at 10 seconds.
   */
  public handleCommand(
    command: DeviceCommand,
    onPumpComplete?: () => void,
  ): { status: 'executed' | 'ignored_stale' | 'already_active'; duration?: number } {
    const currentTs = Math.floor(Date.now() / 1000)

    // Stale command check (>30s)
    if (currentTs - command.ts > 30) {
      return { status: 'ignored_stale' }
    }

    // Grow light actuator update
    if (typeof command.grow_light === 'boolean') {
      this.lightActive = command.grow_light
    }

    // Water Now trigger
    if (command.water_now) {
      if (this.pumpActive) {
        return { status: 'already_active' }
      }

      // Hardware safety: cap pump duration between 1s and 10s (default 3s)
      const rawDuration = command.water_duration_s ?? 3
      const durationSeconds = Math.min(10, Math.max(1, rawDuration))

      this.pumpActive = true

      // Simulate soil hydration
      this.moisture = Math.min(100, +(this.moisture + durationSeconds * 5.5).toFixed(1))

      if (this.pumpTimer) clearTimeout(this.pumpTimer)
      this.pumpTimer = setTimeout(() => {
        this.pumpActive = false
        if (onPumpComplete) onPumpComplete()
      }, durationSeconds * 1000)

      return { status: 'executed', duration: durationSeconds }
    }

    return { status: 'executed' }
  }

  public getStatus() {
    return {
      deviceId: this.deviceId,
      moisture: this.moisture,
      temperature: this.temperature,
      pumpActive: this.pumpActive,
      lightActive: this.lightActive,
    }
  }

  public stop() {
    if (this.pumpTimer) {
      clearTimeout(this.pumpTimer)
      this.pumpTimer = null
    }
  }
}
