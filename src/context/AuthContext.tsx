import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { auth } from '../services/firebase'

export interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  isGuest: boolean
  signInWithEmail: (email: string, pass: string) => Promise<void>
  signUpWithEmail: (email: string, pass: string) => Promise<void>
  signInAsGuest: () => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const signInWithEmail = async (email: string, pass: string) => {
    setError(null)
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, pass)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to sign in'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signUpWithEmail = async (email: string, pass: string) => {
    setError(null)
    setLoading(true)
    try {
      await createUserWithEmailAndPassword(auth, email, pass)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to sign up'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signInAsGuest = async () => {
    setError(null)
    setLoading(true)
    try {
      await signInAnonymously(auth)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Guest evaluation sign-in failed'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setError(null)
    try {
      await fbSignOut(auth)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to log out'
      setError(msg)
    }
  }

  const clearError = () => setError(null)

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isGuest: Boolean(user?.isAnonymous),
        signInWithEmail,
        signUpWithEmail,
        signInAsGuest,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
