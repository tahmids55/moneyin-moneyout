import { formatCurrency, formatDateByPreference } from '../utils/finance'

export default function TransactionRow({
  tx,
  onEdit,
  onDelete,
  currency,
  dateFormat,
  timezone,
  mobile = false,
}) {
  const isCashIn = tx.type === 'income' || tx.type === 'debt' || tx.type === 'debts'
  const typeClass = isCashIn ? 'tag-income' : 'tag-expense'
  const statusLabel =
    tx.type === 'debt' || tx.type === 'debts'
      ? 'Debt'
      : tx.type === 'asset' || tx.type === 'assets'
        ? 'Asset'
        : tx.type === 'income'
          ? 'Income'
          : 'Expense'

  if (mobile) {
    return (
      <article className="rounded-xl border border-slate-500/20 bg-slate-900/65 p-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-100">{tx.category}</p>
            <p className="text-xs text-slate-400">{tx.note || 'No note'}</p>
          </div>
          <span className={`status-tag ${typeClass}`}>{statusLabel}</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <p className="text-slate-300">{formatDateByPreference(tx.date, dateFormat, timezone)}</p>
          <p className={isCashIn ? 'text-emerald-300' : 'text-rose-300'}>
            {formatCurrency(tx.amount, currency)}
          </p>
        </div>
        <div className="mt-3 flex gap-2">
          <button type="button" className="btn-secondary text-xs" onClick={() => onEdit(tx)}>
            Edit
          </button>
          <button type="button" className="btn-secondary text-xs" onClick={() => onDelete(tx)}>
            Delete
          </button>
        </div>
      </article>
    )
  }

  return (
    <tr className="border border-slate-500/15 bg-slate-900/65 text-sm text-slate-100 hover:bg-slate-800/65">
      <td className="px-3 py-3 text-slate-300">{formatDateByPreference(tx.date, dateFormat, timezone)}</td>
      <td className="px-3 py-3">
        <p className="font-medium">{tx.category}</p>
        <p className="text-xs text-slate-400">{tx.note || 'No note'}</p>
      </td>
      <td className="px-3 py-3 capitalize text-slate-300">{statusLabel}</td>
      <td className="px-3 py-3 text-slate-300">{tx.category}</td>
      <td className={isCashIn ? 'px-3 py-3 font-semibold text-emerald-300' : 'px-3 py-3 font-semibold text-rose-300'}>
        {formatCurrency(tx.amount, currency)}
      </td>
      <td className="px-3 py-3">
        <span className={`status-tag ${typeClass}`}>{isCashIn ? 'Incoming' : 'Spent'}</span>
      </td>
      <td className="px-3 py-3">
        <div className="flex gap-2">
          <button type="button" className="btn-secondary text-xs" onClick={() => onEdit(tx)}>
            Edit
          </button>
          <button type="button" className="btn-secondary text-xs" onClick={() => onDelete(tx)}>
            Delete
          </button>
        </div>
      </td>
    </tr>
  )
}
