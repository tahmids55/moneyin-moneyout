import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import TransactionsPage from './pages/TransactionsPage'
import SettingsPage from './pages/SettingsPage'
import IncomePage from './pages/IncomePage'
import ExpensesPage from './pages/ExpensesPage'
import AboutPage from './pages/AboutPage'
import { usePreferences } from './hooks/usePreferences'

function App() {
  const { theme } = usePreferences()
  const isDarkTheme = theme === 'dark' || theme === 'dark-gray'

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
        <Route
          path="/income"
          element={
            <ProtectedRoute>
              <IncomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <ExpensesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <AboutPage />
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
              isDarkTheme
                ? 'rgba(44, 44, 44, 0.95)'
                : 'rgba(255, 255, 255, 0.96)',
            color: isDarkTheme ? '#E5E7EB' : '#111827',
            border:
              isDarkTheme
                ? '1px solid rgba(156, 163, 175, 0.4)'
                : '1px solid rgba(203, 213, 225, 0.7)',
            boxShadow:
              isDarkTheme
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
