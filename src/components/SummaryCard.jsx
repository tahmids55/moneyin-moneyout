export default function SummaryCard({ label, value, hint, tone = 'neutral' }) {
  return (
    <article className={`summary-card summary-${tone}`}>
      <p className="summary-label">{label}</p>
      <p className="summary-value">{value}</p>
      {hint ? <p className="summary-hint">{hint}</p> : null}
    </article>
  )
}
