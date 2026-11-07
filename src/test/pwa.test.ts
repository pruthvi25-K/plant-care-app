import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('PWA & Mobile Polish Verification (Ticket A-12)', () => {
  it('includes valid manifest.json with required PWA metadata', () => {
    const manifestPath = path.resolve(process.cwd(), 'public/manifest.json')
    expect(fs.existsSync(manifestPath)).toBe(true)

    const raw = fs.readFileSync(manifestPath, 'utf-8')
    const manifest = JSON.parse(raw)

    expect(manifest.name).toContain('PlantCare')
    expect(manifest.short_name).toBe('PlantCare')
    expect(manifest.display).toBe('standalone')
    expect(manifest.theme_color).toBe('#166534')
    expect(manifest.icons.length).toBeGreaterThan(0)
  })

  it('includes service worker script with caching lifecycle events', () => {
    const swPath = path.resolve(process.cwd(), 'public/sw.js')
    expect(fs.existsSync(swPath)).toBe(true)

    const swContent = fs.readFileSync(swPath, 'utf-8')
    expect(swContent).toContain("addEventListener('install'")
    expect(swContent).toContain("addEventListener('activate'")
    expect(swContent).toContain("addEventListener('fetch'")
  })

  it('configures index.html with PWA viewport, manifest link, and theme meta', () => {
    const htmlPath = path.resolve(process.cwd(), 'index.html')
    const html = fs.readFileSync(htmlPath, 'utf-8')

    expect(html).toContain('rel="manifest"')
    expect(html).toContain('name="theme-color"')
    expect(html).toContain('name="viewport"')
    expect(html).toContain('width=device-width')
  })
})
