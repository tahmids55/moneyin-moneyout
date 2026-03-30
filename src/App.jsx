import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import TransactionsPage from './pages/TransactionsPage'
import SettingsPage from './pages/SettingsPage'
import { usePreferences } from './hooks/usePreferences'

function App() {
  const { theme } = usePreferences()

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <TransactionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '0.8rem',
            background:
              theme === 'dark'
                ? 'rgba(44, 44, 44, 0.95)'
                : 'rgba(255, 255, 255, 0.96)',
            color: theme === 'dark' ? '#E5E7EB' : '#111827',
            border:
              theme === 'dark'
                ? '1px solid rgba(156, 163, 175, 0.4)'
                : '1px solid rgba(203, 213, 225, 0.7)',
            boxShadow:
              theme === 'dark'
                ? '0 12px 26px rgba(0, 0, 0, 0.45)'
                : '0 10px 24px rgba(15, 23, 42, 0.1)',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
    </>
  )
}

export default App
