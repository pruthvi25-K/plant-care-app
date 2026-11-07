/**
 * Mock Device CLI Runner
 * Connects to Firebase Realtime Database (emulator or live) and simulates plant1 telemetry.
 */
import { MockESP32Device } from '../src/services/mockDevice'
import { database, auth } from '../src/services/firebase'
import { ref, set, onValue, push } from 'firebase/database'
import { signInAnonymously } from 'firebase/auth'

async function run() {
  console.log('🌱 Starting Mock ESP32 Hardware Simulator for "plant1"...')

  try {
    await signInAnonymously(auth)
    console.log('✓ Simulator authenticated as Guest/Device')
  } catch {
    console.log('ℹ Proceeding without auth (local emulator mode)')
  }

  const device = new MockESP32Device('plant1')
  const readingRef = ref(database, 'plants/plant1/reading')
  const commandRef = ref(database, 'plants/plant1/command')
  const historyRef = ref(database, 'plants/plant1/history')

  let tickCount = 0

  // Telemetry loop: writes every 5 seconds
  const interval = setInterval(async () => {
    const reading = device.generateReading()
    await set(readingRef, reading)
    console.log(`[Telemetry] Moisture: ${reading.moisture}% | Temp: ${reading.temperature}°C | Pump: ${reading.pump_active} | Grow light: ${reading.light_active}`)

    // Periodically append history entry (every 10 ticks = 50s)
    tickCount++
    if (tickCount % 10 === 0) {
      await push(historyRef, {
        moisture: reading.moisture,
        temperature: reading.temperature,
        ts: reading.ts,
      })
      console.log('✓ Telemetry logged to history log')
    }
  }, 5000)

  // Command listener: responds to commands
  onValue(commandRef, async (snapshot) => {
    const cmd = snapshot.val()
    if (!cmd) return

    const result = device.handleCommand(cmd, async () => {
      // Upon pump finish, reset command.water_now
      await set(ref(database, 'plants/plant1/command/water_now'), false)
      console.log('✓ Watering pulse completed, reset water_now flag')
    })

    if (result.status === 'executed' && result.duration) {
      console.log(`⚡ Command executed: Watering for ${result.duration}s`)
    } else if (result.status === 'ignored_stale') {
      console.warn('⚠️ Stale command ignored (>30s old)')
    }
  })

  process.on('SIGINT', () => {
    clearInterval(interval)
    device.stop()
    console.log('\nSimulator stopped.')
    process.exit(0)
  })
}

run().catch(console.error)
