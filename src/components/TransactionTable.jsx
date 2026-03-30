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
    <div className="glass overflow-x-auto rounded-2xl border border-slate-500/20 p-3">
      <table className="min-w-full border-separate border-spacing-y-1.5 text-left">
        <thead>
          <tr className="text-xs uppercase tracking-[0.15em] text-slate-400">
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
            <tr key={tx.id} className="rounded-xl border border-slate-500/15 bg-slate-900/68 text-sm text-slate-100 even:bg-slate-800/62">
              <td className="rounded-l-xl px-3 py-3 text-slate-300">
                {formatDateByPreference(tx.date, dateFormat, timezone)}
              </td>
              <td className="px-3 py-3 capitalize text-slate-300">{tx.type}</td>
              <td className="px-3 py-3 font-medium">{tx.category}</td>
              <td
                className={`px-3 py-3 font-semibold ${
                  tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'
                }`}
              >
                {formatCurrency(tx.amount, currency)}
              </td>
              <td className="px-3 py-3 text-slate-300">{tx.note || '-'}</td>
              <td className="rounded-r-xl px-3 py-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-cyan-400/35 bg-cyan-500/12 px-2 py-1 text-xs text-cyan-200 hover:bg-cyan-500/22"
                    onClick={() => onEdit(tx)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-rose-400/35 bg-rose-500/12 px-2 py-1 text-xs text-rose-200 hover:bg-rose-500/22"
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
