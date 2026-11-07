import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthProvider } from '../context/AuthContext'
import { DemoModeProvider } from '../context/DemoModeContext'
import { App } from '../App'

function renderApp() {
  return render(
    <AuthProvider>
      <DemoModeProvider>
        <App />
      </DemoModeProvider>
    </AuthProvider>,
  )
}

describe('App Dashboard (Ticket A-05 / A-11)', () => {
  it('renders the PlantCare heading', () => {
    renderApp()
    expect(screen.getByText('PlantCare')).toBeInTheDocument()
  })

  it('renders soil moisture live telemetry card', () => {
    renderApp()
    expect(screen.getByText('Soil Moisture')).toBeInTheDocument()
  })

  it('renders ambient temperature live card', () => {
    renderApp()
    expect(screen.getByText('Ambient Temperature')).toBeInTheDocument()
  })

  it('renders actuator status card', () => {
    renderApp()
    expect(screen.getByText('Actuator Status')).toBeInTheDocument()
  })

  it('renders hardware node selector', () => {
    renderApp()
    expect(screen.getByLabelText(/Select Hardware Device/i)).toBeInTheDocument()
  })

  it('renders theme toggle button', () => {
    renderApp()
    const btn = screen.getByRole('button', { name: /switch to .+ mode/i })
    expect(btn).toBeInTheDocument()
  })

  it('renders sign in button in header', () => {
    renderApp()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('CRITICAL: strictly labels as "Grow light" and does NOT contain "UV light"', () => {
    renderApp()
    expect(screen.getAllByText(/Grow light/i).length).toBeGreaterThan(0)
    const body = document.body.textContent ?? ''
    expect(body).not.toMatch(/UV light/i)
  })
})
