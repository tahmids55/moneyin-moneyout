import { NavLink, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { logoutUser } from '../services/authService'
import { useAuth } from '../hooks/useAuth'

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M3 11.5 12 4l9 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6.5 10.5V20h11V10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function ExpenseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.5 9h17" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M12 15.3a3.3 3.3 0 1 0 0-6.6 3.3 3.3 0 0 0 0 6.6Z" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a1.7 1.7 0 1 1-2.4 2.4l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9v.2a1.7 1.7 0 1 1-3.4 0v-.2a1 1 0 0 0-.7-.9 1 1 0 0 0-1.1.2l-.1.1a1.7 1.7 0 1 1-2.4-2.4l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6h-.2a1.7 1.7 0 1 1 0-3.4h.2a1 1 0 0 0 .9-.7 1 1 0 0 0-.2-1.1l-.1-.1a1.7 1.7 0 1 1 2.4-2.4l.1.1a1 1 0 0 0 1.1.2h.1a1 1 0 0 0 .6-.9v-.2a1.7 1.7 0 1 1 3.4 0v.2a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a1.7 1.7 0 1 1 2.4 2.4l-.1.1a1 1 0 0 0-.2 1.1v.1a1 1 0 0 0 .9.6h.2a1.7 1.7 0 1 1 0 3.4h-.2a1 1 0 0 0-.9.6Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M9 4.5H6.5A2.5 2.5 0 0 0 4 7v10a2.5 2.5 0 0 0 2.5 2.5H9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M13.5 8.5 18 12l-4.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10 12h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export default function Navbar() {
  const navigate = useNavigate()
  const { profile, user } = useAuth()

  const onLogout = async () => {
    await logoutUser()
    toast.success('Logged out')
    navigate('/login')
  }

  const displayName = profile?.name || user?.email?.split('@')[0] || 'Student'
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase())
    .join('')
  const navItems = [
    { to: '/dashboard', label: 'Home', icon: <HomeIcon /> },
    { to: '/transactions', label: 'Expenses', icon: <ExpenseIcon /> },
    { to: '/settings', label: 'Settings', icon: <SettingsIcon /> },
  ]

  return (
    <>
      <aside className="app-sidebar hidden flex-col px-3 py-4 lg:flex">
        <div className="mx-2 flex items-center gap-3 rounded-xl border border-slate-500/20 bg-slate-800/40 p-3">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-cyan-300/90 to-blue-500/85 text-sm font-bold text-slate-950">
            {initials || 'ST'}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-100">{displayName}</p>
            <p className="truncate text-xs text-slate-400">{user?.email || 'finance user'}</p>
          </div>
        </div>

        <nav className="mt-6 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${isActive ? 'sidebar-link-active' : ''} sidebar-link`
              }
            >
              <span className="text-cyan-300">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-3">
          <button
            type="button"
            onClick={onLogout}
            className="sidebar-link w-full border border-slate-500/25 bg-slate-800/30"
          >
            <span className="text-rose-300"><LogoutIcon /></span>
            <span>Logout</span>
          </button>

          <div className="rounded-xl border border-cyan-400/25 bg-slate-900/65 px-3 py-2">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">MoneyIN</p>
            <p className="text-xs uppercase tracking-[0.24em] text-violet-300">MoneyOUT</p>
          </div>
        </div>
      </aside>

      <header className="glass sticky top-3 z-40 mx-4 mt-3 flex items-center justify-between rounded-xl px-3 py-2 lg:hidden">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-muted">MoneyIN MoneyOUT</p>
          <p className="text-sm font-semibold text-main">{displayName}</p>
        </div>
        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-lg p-2 transition ${
                  isActive
                    ? 'bg-cyan-400/20 text-cyan-300'
                    : 'text-muted hover:bg-white/20 hover:text-main dark:hover:bg-slate-700/50'
                }`
              }
              aria-label={item.label}
            >
              {item.icon}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg p-2 text-rose-400 transition hover:bg-rose-500/15"
            aria-label="Logout"
          >
            <LogoutIcon />
          </button>
        </div>
      </header>
    </>
  )
}
