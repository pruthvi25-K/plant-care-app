import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TelemetryChart } from '../components/TelemetryChart'

describe('Telemetry History Chart (Ticket A-10)', () => {
  it('renders history chart heading and toggle controls', () => {
    render(<TelemetryChart deviceId="plant1" />)

    expect(screen.getByText('Telemetry Trends & History')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Last 1 Hour' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Last 24 Hours' })).toBeInTheDocument()
  })

  it('switches time range between 1 Hour and 24 Hours', () => {
    render(<TelemetryChart deviceId="plant1" />)

    const btn1H = screen.getByRole('button', { name: 'Last 1 Hour' })
    const btn24H = screen.getByRole('button', { name: 'Last 24 Hours' })

    expect(btn1H).toHaveAttribute('aria-pressed', 'true')
    expect(btn24H).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(btn24H)

    expect(btn24H).toHaveAttribute('aria-pressed', 'true')
    expect(btn1H).toHaveAttribute('aria-pressed', 'false')
  })

  it('CRITICAL: strictly does NOT contain "UV light"', () => {
    const { container } = render(<TelemetryChart deviceId="plant1" />)
    expect(container.textContent).not.toMatch(/UV light/i)
  })
})
