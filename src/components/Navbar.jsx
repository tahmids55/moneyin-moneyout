import { NavLink, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { logoutUser } from '../services/authService'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const navigate = useNavigate()
  const { profile, user } = useAuth()

  const onLogout = async () => {
    await logoutUser()
    toast.success('Logged out')
    navigate('/login')
  }

  const displayName = profile?.name || user?.email?.split('@')[0] || 'Student'

  return (
    <header className="glass sticky top-4 z-40 mx-auto mt-4 flex w-[94%] max-w-6xl items-center justify-between rounded-2xl px-4 py-3 backdrop-blur-xl md:px-6">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-muted">Student Finance Tracker</p>
        <p className="font-display text-lg text-main">Hi, {displayName}</p>
      </div>

      <nav className="flex items-center gap-2 md:gap-4">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `rounded-lg px-3 py-2 text-sm transition ${
              isActive
                ? 'bg-white/70 text-main shadow dark:bg-slate-700/70'
                : 'text-muted hover:bg-white/30 hover:text-main dark:hover:bg-slate-700/50'
            }`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/transactions"
          className={({ isActive }) =>
            `rounded-lg px-3 py-2 text-sm transition ${
              isActive
                ? 'bg-white/70 text-main shadow dark:bg-slate-700/70'
                : 'text-muted hover:bg-white/30 hover:text-main dark:hover:bg-slate-700/50'
            }`
          }
        >
          Transactions
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `rounded-lg px-3 py-2 text-sm transition ${
              isActive
                ? 'bg-white/70 text-main shadow dark:bg-slate-700/70'
                : 'text-muted hover:bg-white/30 hover:text-main dark:hover:bg-slate-700/50'
            }`
          }
        >
          Settings
        </NavLink>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-lg border border-slate-300/60 bg-white/30 px-3 py-2 text-sm font-medium text-main hover:bg-white/60 dark:border-slate-600 dark:bg-slate-700/50"
        >
          Logout
        </button>
      </nav>
    </header>
  )
}
