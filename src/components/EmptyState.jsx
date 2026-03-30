export default function EmptyState({ title, subtitle }) {
  return (
    <div className="glass rounded-2xl border border-dashed border-slate-500/35 p-8 text-center">
      <h3 className="font-display text-xl text-main">{title}</h3>
      {subtitle ? <p className="mt-2 text-sm text-muted">{subtitle}</p> : null}
    </div>
  )
}
