function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export default function Topbar({ title, subtitle, actions = [], onMenu }) {
  return (
    <header className="glass topbar-shell">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onMenu}
          className="topbar-menu-btn lg:hidden"
          aria-label="Open navigation"
        >
          <MenuIcon />
        </button>
        <div>
          <h1 className="topbar-title">{title}</h1>
          {subtitle ? <p className="topbar-subtitle">{subtitle}</p> : null}
        </div>
      </div>

      <div className="topbar-actions">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={action.onClick}
            className={action.tone === 'primary' ? 'btn-primary' : 'btn-secondary'}
          >
            {action.label}
          </button>
        ))}
      </div>
    </header>
  )
}
