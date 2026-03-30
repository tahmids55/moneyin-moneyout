import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './hooks/useAuth'
import { PreferencesProvider } from './hooks/usePreferences'
import { firebaseConfigError, firebaseReady } from './firebase/config'

if (!firebaseReady) {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <main
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: '#f8fafc',
          padding: '1.5rem',
          fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif',
        }}
      >
        <section
          style={{
            maxWidth: 680,
            width: '100%',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 14,
            padding: '1.25rem 1.1rem',
            boxShadow: '0 8px 22px rgba(15, 23, 42, 0.08)',
          }}
        >
          <h1 style={{ marginTop: 0, marginBottom: '0.55rem', color: '#0f172a' }}>
            Firebase environment is not configured
          </h1>
          <p style={{ marginTop: 0, marginBottom: '0.75rem', color: '#334155' }}>
            Add all VITE_FIREBASE_* values in Vercel Project Settings and redeploy.
          </p>
          <pre
            style={{
              margin: 0,
              whiteSpace: 'pre-wrap',
              overflowWrap: 'anywhere',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              padding: '0.75rem',
              color: '#0f172a',
              fontSize: 13,
            }}
          >
            {firebaseConfigError}
          </pre>
        </section>
      </main>
    </StrictMode>,
  )
} else {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <PreferencesProvider>
            <App />
          </PreferencesProvider>
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>,
  )
}
