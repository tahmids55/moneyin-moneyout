export default function QuickActionCard({ icon, label, onClick }) {
  return (
    <button type="button" className="quick-action-card" onClick={onClick}>
      <span className="quick-action-icon">{icon}</span>
      <span className="quick-action-label">{label}</span>
    </button>
  )
}
