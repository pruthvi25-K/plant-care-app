import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthProvider } from '../context/AuthContext'
import { App } from '../App'

function renderApp() {
  return render(
    <AuthProvider>
      <App />
    </AuthProvider>,
  )
}

describe('App scaffold', () => {
  it('renders the PlantCare heading', () => {
    renderApp()
    expect(screen.getByText('PlantCare')).toBeInTheDocument()
  })

  it('renders soil moisture placeholder card', () => {
    renderApp()
    expect(screen.getByText('Soil Moisture')).toBeInTheDocument()
  })

  it('renders temperature placeholder card', () => {
    renderApp()
    expect(screen.getByText('Temperature')).toBeInTheDocument()
  })

  it('renders device status card', () => {
    renderApp()
    expect(screen.getByText('Device Status')).toBeInTheDocument()
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

  it('does NOT contain the term "UV light" anywhere', () => {
    renderApp()
    const body = document.body.textContent ?? ''
    expect(body).not.toMatch(/UV light/i)
  })
})
