export default function ChartCard({ title, subtitle, children, className = '' }) {
  return (
    <section className={`glass rounded-2xl border border-slate-500/20 p-5 ${className}`}>
      <h3 className="font-display text-lg text-main">{title}</h3>
      {subtitle ? <p className="mb-3 text-sm text-muted">{subtitle}</p> : null}
      {children}
    </section>
  )
}
