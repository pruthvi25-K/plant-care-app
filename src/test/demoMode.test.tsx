import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react'
import { DemoModeBanner } from '../components/DemoModeBanner'
import { DemoModeProvider, useDemoMode } from '../context/DemoModeContext'

describe('Demo Mode Simulation System (Ticket A-11)', () => {
  describe('DemoModeBanner Component', () => {
    it('renders Launch Demo Mode banner when mode is off', () => {
      render(<DemoModeBanner isDemoMode={false} onToggleDemoMode={vi.fn()} />)
      expect(screen.getByText(/Need an offline hardware demonstration/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Launch Demo Mode/i })).toBeInTheDocument()
    })

    it('renders Demo Simulation Active status when mode is on', () => {
      render(<DemoModeBanner isDemoMode={true} onToggleDemoMode={vi.fn()} />)
      expect(screen.getByText('Demo Simulation Active')).toBeInTheDocument()
      expect(screen.getByText(/In-Memory Node/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Exit Demo Mode/i })).toBeInTheDocument()
    })

    it('triggers onToggleDemoMode when button is clicked', () => {
      const handleToggle = vi.fn()
      render(<DemoModeBanner isDemoMode={false} onToggleDemoMode={handleToggle} />)

      fireEvent.click(screen.getByRole('button', { name: /Launch Demo Mode/i }))
      expect(handleToggle).toHaveBeenCalled()
    })
  })

  describe('DemoModeContext & In-Memory Simulation Loop', () => {
    it('initializes and toggles simulated hardware mode', () => {
      const { result } = renderHook(() => useDemoMode(), {
        wrapper: DemoModeProvider,
      })

      expect(typeof result.current.isDemoMode).toBe('boolean')

      act(() => {
        result.current.toggleDemoMode()
      })

      expect(result.current.isDemoMode).toBe(true)
      expect(result.current.demoReading).not.toBeNull()
      expect(result.current.demoReading?.moisture).toBeGreaterThanOrEqual(10)
    })

    it('simulates instant manual watering pulse in-memory', async () => {
      const { result } = renderHook(() => useDemoMode(), {
        wrapper: DemoModeProvider,
      })

      if (!result.current.isDemoMode) {
        act(() => {
          result.current.toggleDemoMode()
        })
      }

      await act(async () => {
        await result.current.demoWaterNow(3)
      })

      expect(result.current.demoReading?.pump_active).toBe(true)
    })

    it('simulates Grow light actuator toggle in-memory', async () => {
      const { result } = renderHook(() => useDemoMode(), {
        wrapper: DemoModeProvider,
      })

      if (!result.current.isDemoMode) {
        act(() => {
          result.current.toggleDemoMode()
        })
      }

      await act(async () => {
        await result.current.demoToggleLight(true)
      })

      expect(result.current.demoReading?.light_active).toBe(true)
    })
  })
})
