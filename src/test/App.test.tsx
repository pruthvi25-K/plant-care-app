import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { App } from '../App'

describe('App scaffold', () => {
  it('renders the PlantCare heading', () => {
    render(<App />)
    expect(screen.getByText('PlantCare')).toBeInTheDocument()
  })

  it('renders soil moisture placeholder card', () => {
    render(<App />)
    expect(screen.getByText('Soil Moisture')).toBeInTheDocument()
  })

  it('renders temperature placeholder card', () => {
    render(<App />)
    expect(screen.getByText('Temperature')).toBeInTheDocument()
  })

  it('renders device status card', () => {
    render(<App />)
    expect(screen.getByText('Device Status')).toBeInTheDocument()
  })

  it('renders theme toggle button', () => {
    render(<App />)
    const btn = screen.getByRole('button', { name: /switch to .+ mode/i })
    expect(btn).toBeInTheDocument()
  })

  it('does NOT contain the term "UV light" anywhere', () => {
    render(<App />)
    const body = document.body.textContent ?? ''
    expect(body).not.toMatch(/UV light/i)
  })
})
