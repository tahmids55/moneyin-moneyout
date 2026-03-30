export default function ToggleSwitch({ checked, onChange, label }) {
  return (
    <label className="toggle-row">
      <span className="text-sm text-main">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`toggle-switch ${checked ? 'toggle-on' : 'toggle-off'}`}
      >
        <span className="toggle-knob" />
      </button>
    </label>
  )
}
