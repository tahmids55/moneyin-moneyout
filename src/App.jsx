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
import ReportsPage from './pages/ReportsPage'
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
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ReportsPage />
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
            background: isDarkTheme ? '#232326' : 'rgba(250, 250, 252, 0.98)',
            color: isDarkTheme ? '#E4E4E7' : '#27272a',
            border: isDarkTheme ? '1px solid #2F2F34' : '1px solid #d4d4d8',
            boxShadow: isDarkTheme
              ? '0 10px 24px rgba(0, 0, 0, 0.4)'
              : '0 10px 24px rgba(24, 24, 27, 0.14)',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
    </>
  )
}

export default App
