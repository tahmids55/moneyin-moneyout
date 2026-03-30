export default function SettingsSection({ title, description, children }) {
  return (
    <section className="glass rounded-2xl border border-slate-500/20 p-5">
      <h2 className="font-display text-xl text-main">{title}</h2>
      {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  )
}
