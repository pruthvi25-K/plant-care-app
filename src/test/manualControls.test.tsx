import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ManualControls } from '../components/ManualControls'

describe('Manual Controls System (Ticket A-09)', () => {
  it('renders Water Now and Grow light control sections', () => {
    render(
      <ManualControls
        pumpActive={false}
        lightActive={false}
        isOffline={false}
        wateringPending={false}
        wateringSuccess={false}
        commandError={null}
        onWaterNow={vi.fn()}
        onToggleLight={vi.fn()}
        onSetLightMode={vi.fn()}
      />,
    )

    expect(screen.getByText('Manual Hardware Controls')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Water plant now/i })).toBeInTheDocument()
    expect(screen.getByText(/Turn Grow light ON/i)).toBeInTheDocument()
  })

  it('triggers onWaterNow with safe 3s pulse when Water Now is clicked', async () => {
    const handleWater = vi.fn().mockResolvedValue(undefined)
    render(
      <ManualControls
        pumpActive={false}
        lightActive={false}
        isOffline={false}
        wateringPending={false}
        wateringSuccess={false}
        commandError={null}
        onWaterNow={handleWater}
        onToggleLight={vi.fn()}
        onSetLightMode={vi.fn()}
      />,
    )

    const waterBtn = screen.getByRole('button', { name: /Water plant now/i })
    fireEvent.click(waterBtn)

    expect(handleWater).toHaveBeenCalledWith(3)
  })

  it('disables Water Now and Grow light buttons when hardware is offline', () => {
    render(
      <ManualControls
        pumpActive={false}
        lightActive={false}
        isOffline={true}
        wateringPending={false}
        wateringSuccess={false}
        commandError={null}
        onWaterNow={vi.fn()}
        onToggleLight={vi.fn()}
        onSetLightMode={vi.fn()}
      />,
    )

    const waterBtn = screen.getByRole('button', { name: /Water plant now/i })
    const lightBtn = screen.getByRole('button', { name: /Turn Grow light/i })

    expect(waterBtn).toBeDisabled()
    expect(lightBtn).toBeDisabled()
  })

  it('disables Water Now button when pump is already active', () => {
    render(
      <ManualControls
        pumpActive={true}
        lightActive={false}
        isOffline={false}
        wateringPending={false}
        wateringSuccess={false}
        commandError={null}
        onWaterNow={vi.fn()}
        onToggleLight={vi.fn()}
        onSetLightMode={vi.fn()}
      />,
    )

    const waterBtn = screen.getByRole('button', { name: /Water plant now/i })
    expect(waterBtn).toBeDisabled()
    expect(screen.getByText(/Pump Active/i)).toBeInTheDocument()
  })

  it('toggles Grow light actuator when button is clicked', () => {
    const handleLight = vi.fn().mockResolvedValue(undefined)
    render(
      <ManualControls
        pumpActive={false}
        lightActive={false}
        isOffline={false}
        wateringPending={false}
        wateringSuccess={false}
        commandError={null}
        onWaterNow={vi.fn()}
        onToggleLight={handleLight}
        onSetLightMode={vi.fn()}
      />,
    )

    const lightBtn = screen.getByRole('button', { name: /Turn Grow light ON/i })
    fireEvent.click(lightBtn)

    expect(handleLight).toHaveBeenCalledWith(true)
  })

  it('CRITICAL: strictly labels as "Grow light" and does NOT contain "UV light"', () => {
    const { container } = render(
      <ManualControls
        pumpActive={false}
        lightActive={true}
        isOffline={false}
        wateringPending={false}
        wateringSuccess={false}
        commandError={null}
        onWaterNow={vi.fn()}
        onToggleLight={vi.fn()}
        onSetLightMode={vi.fn()}
      />,
    )

    expect(screen.getAllByText(/Grow light/i).length).toBeGreaterThan(0)
    expect(container.textContent).not.toMatch(/UV light/i)
  })
})
