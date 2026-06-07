import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

import { AppProvider } from './context/AppProvider'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { env } from './config/env.config'

const GOOGLE_CLIENT_ID = env.VITE_GOOGLE_CLIENT_ID

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

createRoot(rootElement).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppProvider>
        <App />
      </AppProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
