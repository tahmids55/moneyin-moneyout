import { NavLink, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Transactions', path: '/transactions' },
  { label: 'Income', path: '/income' },
  { label: 'Expenses', path: '/expenses' },
  { label: 'Categories', soon: true },
  { label: 'Reports', path: '/reports' },
  { label: 'Settings', path: '/settings' },
  { label: 'About Us', path: '/about' },
]

function UserAvatar({ displayName }) {
  const initials = (displayName || 'Student')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('')

  return (
    <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-blue-400 to-zinc-400 text-sm font-bold text-slate-950">
      {initials || 'ST'}
    </div>
  )
}

export default function Sidebar({ mobileOpen, onClose }) {
  const navigate = useNavigate()
  const { profile, user } = useAuth()
  const displayName = profile?.name || user?.email?.split('@')[0] || 'Student'

  const onSoonClick = (label) => {
    toast(label + ' module will be added soon')
    navigate('/dashboard')
    onClose?.()
  }

  return (
    <>
      <aside className="app-sidebar hidden lg:flex">
        <div className="sidebar-header">
          <UserAvatar displayName={displayName} />
          <div className="min-w-0">
            <p className="sidebar-user-name truncate text-sm font-semibold">{displayName}</p>
            <p className="sidebar-user-email truncate text-xs">{user?.email || 'student'}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            if (item.path) {
              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
                >
                  {item.label}
                </NavLink>
              )
            }

            return (
              <button
                key={item.label}
                type="button"
                className="sidebar-link w-full text-left"
                onClick={() => onSoonClick(item.label)}
              >
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="sidebar-brand">
          <p>MONEYIN</p>
          <p>MONEYOUT</p>
        </div>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[1px] lg:hidden" onClick={onClose}>
          <aside className="mobile-drawer" onClick={(event) => event.stopPropagation()}>
            <div className="sidebar-header">
              <UserAvatar displayName={displayName} />
              <div className="min-w-0">
                <p className="sidebar-user-name truncate text-sm font-semibold">{displayName}</p>
                <p className="sidebar-user-email truncate text-xs">{user?.email || 'student'}</p>
              </div>
            </div>

            <nav className="sidebar-nav">
              {navItems.map((item) => {
                if (item.path) {
                  return (
                    <NavLink
                      key={item.label}
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                      }
                    >
                      {item.label}
                    </NavLink>
                  )
                }

                return (
                  <button
                    key={item.label}
                    type="button"
                    className="sidebar-link w-full text-left"
                    onClick={() => onSoonClick(item.label)}
                  >
                    {item.label}
                  </button>
                )
              })}
            </nav>
          </aside>
        </div>
      ) : null}
    </>
  )
}
