import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CustomSettingsCard } from '../components/CustomSettingsCard'
import { validateProfileSettings } from '../utils/validation'
import { PLANT_PRESETS } from '../hooks/useDeviceProfile'

describe('Custom Settings & Validation System (Ticket A-08)', () => {
  describe('validateProfileSettings utility', () => {
    it('approves valid custom threshold settings', () => {
      const res = validateProfileSettings(35, 65, 3, 12)
      expect(res.isValid).toBe(true)
      expect(Object.keys(res.errors).length).toBe(0)
    })

    it('rejects settings where min is greater than or equal to max', () => {
      const res = validateProfileSettings(70, 50, 3, 12)
      expect(res.isValid).toBe(false)
      expect(res.errors.min).toContain('less than maximum')
    })

    it('rejects settings where separation is less than 5%', () => {
      const res = validateProfileSettings(50, 52, 3, 12)
      expect(res.isValid).toBe(false)
      expect(res.errors.max).toContain('at least 5%')
    })

    it('enforces pump duration limits (1s to 10s firmware limit)', () => {
      const tooLong = validateProfileSettings(40, 70, 15, 12)
      expect(tooLong.isValid).toBe(false)
      expect(tooLong.errors.duration).toContain('10 seconds')

      const tooShort = validateProfileSettings(40, 70, 0, 12)
      expect(tooShort.isValid).toBe(false)
      expect(tooShort.errors.duration).toContain('between 1 and 10')
    })

    it('validates Grow light photoperiod between 1 and 24 hours', () => {
      const invalidHours = validateProfileSettings(40, 70, 3, 25)
      expect(invalidHours.isValid).toBe(false)
      expect(invalidHours.errors.lightHours).toContain('between 1 and 24')
    })
  })

  describe('CustomSettingsCard Component', () => {
    it('renders collapsed accordion initially and expands on click', () => {
      render(
        <CustomSettingsCard
          currentProfile={PLANT_PRESETS.tropical}
          onSaveProfile={vi.fn()}
        />,
      )

      expect(screen.getByText('Custom Thresholds & Settings')).toBeInTheDocument()
      const expandBtn = screen.getByRole('button', { name: /customize/i })
      fireEvent.click(expandBtn)

      expect(screen.getByLabelText(/Min Moisture Threshold/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Max Moisture Target/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Water Pump Pulse Duration/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Grow light Schedule/i)).toBeInTheDocument()
    })

    it('submits validated custom profile when form is saved', async () => {
      const handleSave = vi.fn().mockResolvedValue(undefined)
      render(
        <CustomSettingsCard
          currentProfile={PLANT_PRESETS.tropical}
          onSaveProfile={handleSave}
        />,
      )

      fireEvent.click(screen.getByRole('button', { name: /customize/i }))
      fireEvent.click(screen.getByRole('button', { name: /Save Custom Profile/i }))

      expect(handleSave).toHaveBeenCalledWith(
        expect.objectContaining({
          preset_name: 'Custom Settings',
          moisture_min: 40,
          moisture_max: 65,
          water_duration_s: 4,
          light_schedule_hours: 12,
        }),
      )
    })

    it('CRITICAL: strictly labels as "Grow light" and does NOT contain "UV light"', () => {
      const { container } = render(
        <CustomSettingsCard
          currentProfile={PLANT_PRESETS.tropical}
          onSaveProfile={vi.fn()}
        />,
      )

      fireEvent.click(screen.getByRole('button', { name: /customize/i }))
      expect(screen.getAllByText(/Grow light/i).length).toBeGreaterThan(0)
      expect(container.textContent).not.toMatch(/UV light/i)
    })
  })
})
