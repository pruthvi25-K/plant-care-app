import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AuthProvider } from '../context/AuthContext'
import { AuthModal } from '../components/AuthModal'

describe('AuthModal Component (Ticket A-04)', () => {
  it('renders auth modal with email inputs and guest evaluator option', () => {
    render(
      <AuthProvider>
        <AuthModal isOpen={true} onClose={() => {}} />
      </AuthProvider>,
    )

    expect(screen.getByText('Welcome to PlantCare')).toBeInTheDocument()
    expect(screen.getByText('Continue as Guest Evaluator')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('evaluator@college.edu')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
  })

  it('switches between Sign In and Sign Up modes', () => {
    render(
      <AuthProvider>
        <AuthModal isOpen={true} onClose={() => {}} />
      </AuthProvider>,
    )

    const switchBtn = screen.getByText("Don't have an account? Sign up")
    fireEvent.click(switchBtn)

    expect(screen.getByText('Create PlantCare Account')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument()
  })

  it('calls onClose when close icon is clicked', () => {
    const handleClose = vi.fn()
    render(
      <AuthProvider>
        <AuthModal isOpen={true} onClose={handleClose} />
      </AuthProvider>,
    )

    const closeBtn = screen.getByLabelText('Close dialog')
    fireEvent.click(closeBtn)

    expect(handleClose).toHaveBeenCalled()
  })

  it('does not render when isOpen is false', () => {
    render(
      <AuthProvider>
        <AuthModal isOpen={false} onClose={() => {}} />
      </AuthProvider>,
    )

    expect(screen.queryByText('Welcome to PlantCare')).not.toBeInTheDocument()
  })
})
