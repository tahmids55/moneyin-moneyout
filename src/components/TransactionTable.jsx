import { formatCurrency, formatDateByPreference } from '../utils/finance'

export default function TransactionTable({
  transactions,
  onEdit,
  onDelete,
  currency,
  dateFormat,
  timezone,
}) {
  if (!transactions.length) {
    return (
      <div className="glass rounded-2xl p-5 text-center text-muted">
        No transactions found for your filters.
      </div>
    )
  }

  return (
    <div className="glass overflow-x-auto rounded-2xl p-2">
      <table className="min-w-full border-separate border-spacing-y-2 text-left">
        <thead>
          <tr className="text-xs uppercase tracking-[0.15em] text-muted">
            <th className="px-3 py-2">Date</th>
            <th className="px-3 py-2">Type</th>
            <th className="px-3 py-2">Category</th>
            <th className="px-3 py-2">Amount</th>
            <th className="px-3 py-2">Note</th>
            <th className="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="rounded-xl bg-white/50 text-sm text-main dark:bg-slate-700/50">
              <td className="rounded-l-xl px-3 py-3">
                {formatDateByPreference(tx.date, dateFormat, timezone)}
              </td>
              <td className="px-3 py-3 capitalize">{tx.type}</td>
              <td className="px-3 py-3">{tx.category}</td>
              <td
                className={`px-3 py-3 font-semibold ${
                  tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'
                }`}
              >
                {formatCurrency(tx.amount, currency)}
              </td>
              <td className="px-3 py-3">{tx.note || '-'}</td>
              <td className="rounded-r-xl px-3 py-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-slate-300/70 bg-white/70 px-2 py-1 text-xs text-main hover:bg-white dark:border-slate-600 dark:bg-slate-700/60"
                    onClick={() => onEdit(tx)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs text-rose-700 hover:bg-rose-100"
                    onClick={() => onDelete(tx.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
