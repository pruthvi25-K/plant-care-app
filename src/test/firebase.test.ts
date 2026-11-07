import { describe, it, expect } from 'vitest'
import { app, auth, database } from '../services/firebase'
import fs from 'fs'
import path from 'path'

describe('Firebase Service & Configuration', () => {
  it('initializes Firebase app, auth, and database instances', () => {
    expect(app).toBeDefined()
    expect(auth).toBeDefined()
    expect(database).toBeDefined()
  })

  it('enforces non-negotiable security rules in database.rules.json', () => {
    const rulesPath = path.resolve(process.cwd(), 'database.rules.json')
    expect(fs.existsSync(rulesPath)).toBe(true)

    const raw = fs.readFileSync(rulesPath, 'utf-8')
    const rulesObj = JSON.parse(raw)

    // Rule 4: Firebase rules must never be true for read/write
    expect(raw).not.toMatch(/":\s*true"/)
    expect(rulesObj.rules['.read']).toBe(false)
    expect(rulesObj.rules['.write']).toBe(false)

    // Plants device paths
    const deviceRules = rulesObj.rules.plants['$deviceId']
    expect(deviceRules).toBeDefined()

    // Reading rules
    expect(deviceRules.reading['.read']).toContain('auth != null')
    expect(deviceRules.reading['.write']).toContain('auth != null')
    expect(deviceRules.reading.moisture['.validate']).toContain('0')
    expect(deviceRules.reading.moisture['.validate']).toContain('100')

    // Profile rules
    expect(deviceRules.profile['.read']).toContain('auth != null')
    expect(deviceRules.profile['.write']).toContain('auth != null')
    expect(deviceRules.profile.water_duration_s['.validate']).toContain('10') // Firmware 10s cap

    // Command rules
    expect(deviceRules.command['.read']).toContain('auth != null')
    expect(deviceRules.command['.write']).toContain('auth != null')
    expect(deviceRules.command.water_duration_s['.validate']).toContain('10')
  })
})
