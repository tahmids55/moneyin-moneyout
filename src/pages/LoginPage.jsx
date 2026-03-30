import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { loginWithEmail } from '../services/authService'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event) => {
    event.preventDefault()

    try {
      setLoading(true)
      await loginWithEmail(email, password)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.message || 'Unable to login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-shell glass">
        <p className="badge">Student Finance Tracker</p>
        <h1 className="auth-title">Log In</h1>
        <p className="auth-subtitle">Track every coin, own every month.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <label className="field-label">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="field-input"
            />
          </label>

          <label className="field-label">
            Password
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="field-input"
            />
          </label>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-sm text-muted">
          New here?{' '}
          <Link to="/register" className="font-semibold text-main underline decoration-sky-300">
            Create account
          </Link>
        </p>
      </div>
    </main>
  )
}
