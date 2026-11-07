import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath)

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file)
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        arrayOfFiles = getAllFiles(fullPath, arrayOfFiles)
      }
    } else {
      arrayOfFiles.push(fullPath)
    }
  })

  return arrayOfFiles
}

describe('Comprehensive Security Audit (Ticket A-13)', () => {
  const rootDir = process.cwd()
  const allSrcFiles = getAllFiles(path.join(rootDir, 'src'))
  // Audit all source application files (excluding the test suites themselves)
  const appSourceFiles = allSrcFiles.filter(
    (f) => !f.includes(`${path.sep}test${path.sep}`),
  )

  it('RULE 5: Zero occurrences of dangerouslySetInnerHTML or eval in src', () => {
    expect(appSourceFiles.length).toBeGreaterThan(5)
    appSourceFiles.forEach((filePath) => {
      const content = fs.readFileSync(filePath, 'utf-8')
      expect(content).not.toContain('dangerouslySetInnerHTML')
      expect(content).not.toMatch(/\beval\s*\(/)
      expect(content).not.toMatch(/new\s+Function\s*\(/)
    })
  })

  it('RULE 6: Zero occurrences of "UV light" (strictly labeled "Grow light")', () => {
    expect(appSourceFiles.length).toBeGreaterThan(5)
    appSourceFiles.forEach((filePath) => {
      const content = fs.readFileSync(filePath, 'utf-8')
      expect(content).not.toMatch(/\bUV\s*light\b/i)
      expect(content).not.toMatch(/\buv-light\b/i)
    })
  })

  it('RULE 3: .gitignore properly protects sensitive files and secrets', () => {
    const gitignorePath = path.join(rootDir, '.gitignore')
    expect(fs.existsSync(gitignorePath)).toBe(true)

    const gitignore = fs.readFileSync(gitignorePath, 'utf-8')
    expect(gitignore).toContain('.env')
    expect(gitignore).toContain('.env.local')
    expect(gitignore).toContain('node_modules')
  })

  it('RULE 4: Firebase Realtime Database rules never permit open read/write', () => {
    const rulesPath = path.join(rootDir, 'database.rules.json')
    expect(fs.existsSync(rulesPath)).toBe(true)

    const raw = fs.readFileSync(rulesPath, 'utf-8')
    expect(raw).not.toMatch(/":\s*true"/)

    const parsed = JSON.parse(raw)
    expect(parsed.rules['.read']).toBe(false)
    expect(parsed.rules['.write']).toBe(false)

    // Hardware pump safety cap validation in rules
    expect(raw).toContain('newData.val() <= 10') // 10s firmware limit
    expect(raw).toContain('auth != null')
  })

  it('SECURITY: .env.example only contains placeholders, never secret values', () => {
    const envExamplePath = path.join(rootDir, '.env.example')
    expect(fs.existsSync(envExamplePath)).toBe(true)

    const content = fs.readFileSync(envExamplePath, 'utf-8')
    expect(content).not.toMatch(/AIza[0-9A-Za-z-_]{35}/) // No real Google API keys
  })
})
