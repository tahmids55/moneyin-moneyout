import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { registerWithEmail } from '../services/authService'
import { createUserProfile } from '../services/userService'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event) => {
    event.preventDefault()

    try {
      setLoading(true)
      const result = await registerWithEmail(email, password)

      await createUserProfile({
        uid: result.user.uid,
        name,
        email,
      })

      toast.success('Account created')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.message || 'Unable to register')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-shell glass">
        <p className="badge">Student Finance Tracker</p>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Build stronger money habits with clear visuals.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <label className="field-label">
            Name
            <input
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="field-input"
            />
          </label>

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
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-main underline decoration-sky-300">
            Login
          </Link>
        </p>
      </div>
    </main>
  )
}
