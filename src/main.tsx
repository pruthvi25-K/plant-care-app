import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext'
import { DemoModeProvider } from './context/DemoModeContext'
import { App } from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <DemoModeProvider>
        <App />
      </DemoModeProvider>
    </AuthProvider>
  </StrictMode>,
)
