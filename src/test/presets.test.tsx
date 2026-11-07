import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PresetSelector } from '../components/PresetSelector'
import { PLANT_PRESETS } from '../hooks/useDeviceProfile'

describe('Plant Presets System (Ticket A-07)', () => {
  it('defines valid thresholds and safe pump durations for all presets', () => {
    Object.values(PLANT_PRESETS).forEach((preset) => {
      expect(preset.moisture_min).toBeGreaterThanOrEqual(0)
      expect(preset.moisture_max).toBeLessThanOrEqual(100)
      expect(preset.moisture_min).toBeLessThan(preset.moisture_max)
      expect(preset.water_duration_s).toBeGreaterThanOrEqual(1)
      expect(preset.water_duration_s).toBeLessThanOrEqual(10) // 10s firmware limit
    })
  })

  it('renders all 4 preset cards with their moisture targets', () => {
    render(<PresetSelector currentProfile={PLANT_PRESETS.tropical} onSelectPreset={() => {}} />)

    expect(screen.getByText('Succulent / Cactus')).toBeInTheDocument()
    expect(screen.getByText('Foliage / Tropical')).toBeInTheDocument()
    expect(screen.getByText('Herbs & Kitchen')).toBeInTheDocument()
    expect(screen.getByText('Fern / Humid')).toBeInTheDocument()

    expect(screen.getByText('15% – 30%')).toBeInTheDocument()
    expect(screen.getByText('40% – 65%')).toBeInTheDocument()
  })

  it('highlights the currently active preset with an Active badge', () => {
    render(<PresetSelector currentProfile={PLANT_PRESETS.succulent} onSelectPreset={() => {}} />)

    const activeBadges = screen.getAllByText('Active')
    expect(activeBadges.length).toBeGreaterThan(0)
  })

  it('calls onSelectPreset with chosen preset key when clicked', () => {
    const handleSelect = vi.fn()
    render(<PresetSelector currentProfile={PLANT_PRESETS.tropical} onSelectPreset={handleSelect} />)

    const succulentBtn = screen.getByText('Succulent / Cactus').closest('button')!
    fireEvent.click(succulentBtn)

    expect(handleSelect).toHaveBeenCalledWith('succulent')
  })

  it('disables preset cards when disabled=true (e.g., node offline)', () => {
    const handleSelect = vi.fn()
    render(
      <PresetSelector
        currentProfile={PLANT_PRESETS.tropical}
        onSelectPreset={handleSelect}
        disabled={true}
      />,
    )

    const fernBtn = screen.getByText('Fern / Humid').closest('button')!
    expect(fernBtn).toBeDisabled()
  })

  it('CRITICAL: strictly labels light as "Grow light" and never contains "UV light"', () => {
    const { container } = render(
      <PresetSelector currentProfile={PLANT_PRESETS.tropical} onSelectPreset={() => {}} />,
    )

    const growLightLabels = screen.getAllByText('Grow light:')
    expect(growLightLabels.length).toBe(4)
    expect(container.textContent).not.toMatch(/UV light/i)
  })
})
