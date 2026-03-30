export default function Modal({ open, title, description, onConfirm, onCancel, confirmLabel = 'Confirm' }) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/55 p-4">
      <div className="glass w-full max-w-md rounded-2xl border border-slate-500/30 p-5">
        <h3 className="font-display text-xl text-main">{title}</h3>
        <p className="mt-2 text-sm text-muted">{description}</p>

        <div className="mt-5 flex justify-end gap-3">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn-primary" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
