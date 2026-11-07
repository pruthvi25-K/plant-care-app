import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MoistureCard } from '../components/MoistureCard'
import { TemperatureCard } from '../components/TemperatureCard'
import { ActuatorStatusCard } from '../components/ActuatorStatusCard'
import { DeviceSelector } from '../components/DeviceSelector'

describe('Live Dashboard Components (Ticket A-05)', () => {
  describe('MoistureCard', () => {
    it('renders empty placeholder when moisture is null', () => {
      render(<MoistureCard moisture={null} />)
      expect(screen.getByText('--')).toBeInTheDocument()
      expect(screen.getByText('Soil Moisture')).toBeInTheDocument()
    })

    it('renders valid moisture percentage and Optimal badge', () => {
      render(<MoistureCard moisture={55.4} />)
      expect(screen.getByText('55.4')).toBeInTheDocument()
      expect(screen.getByText('Optimal Moisture')).toBeInTheDocument()
    })

    it('renders Low warning badge when moisture is below 30%', () => {
      render(<MoistureCard moisture={22.0} />)
      expect(screen.getByText('Low — Needs Water')).toBeInTheDocument()
    })
  })

  describe('TemperatureCard', () => {
    it('renders temperature in Celsius', () => {
      render(<TemperatureCard temperature={24.2} />)
      expect(screen.getByText('24.2')).toBeInTheDocument()
      expect(screen.getByText('°C')).toBeInTheDocument()
      expect(screen.getByText(/Healthy ambient room climate/)).toBeInTheDocument()
    })
  })

  describe('ActuatorStatusCard', () => {
    it('renders Actuator Status with IDLE and OFF states', () => {
      render(
        <ActuatorStatusCard pumpActive={false} lightActive={false} lastSeenTs={1794145800} />,
      )
      expect(screen.getByText('IDLE')).toBeInTheDocument()
      expect(screen.getByText('OFF')).toBeInTheDocument()
      expect(screen.getByText('Grow light')).toBeInTheDocument()
    })

    it('renders PUMPING and ACTIVE states when triggered', () => {
      render(
        <ActuatorStatusCard pumpActive={true} lightActive={true} lastSeenTs={1794145800} />,
      )
      expect(screen.getByText('PUMPING')).toBeInTheDocument()
      expect(screen.getByText('ACTIVE')).toBeInTheDocument()
    })

    it('CRITICAL: strictly labels as "Grow light" and never contains "UV light"', () => {
      const { container } = render(
        <ActuatorStatusCard pumpActive={false} lightActive={true} lastSeenTs={null} />,
      )
      expect(screen.getByText('Grow light')).toBeInTheDocument()
      expect(container.textContent).not.toMatch(/UV light/i)
    })
  })

  describe('DeviceSelector', () => {
    it('switches device node when selected', () => {
      const onSelect = vi.fn()
      render(<DeviceSelector currentDeviceId="plant1" onSelectDevice={onSelect} />)

      const select = screen.getByLabelText(/Select Hardware Device/i)
      fireEvent.change(select, { target: { value: 'plant2' } })

      expect(onSelect).toHaveBeenCalledWith('plant2')
    })
  })
})
