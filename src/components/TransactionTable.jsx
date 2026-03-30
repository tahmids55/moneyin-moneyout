import EmptyState from './EmptyState'
import TransactionRow from './TransactionRow'

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
      <EmptyState
        title="No transactions found"
        subtitle="Try adjusting your filters or add a new transaction."
      />
    )
  }

  return (
    <div className="space-y-3">
      <div className="glass hidden overflow-x-auto rounded-2xl border border-slate-500/20 p-3 md:block">
        <table className="min-w-full border-separate border-spacing-y-1.5 text-left">
          <thead>
            <tr className="sticky top-0 bg-slate-950/95 text-xs uppercase tracking-[0.15em] text-slate-400">
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Title / Note</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <TransactionRow
                key={tx.id}
                tx={tx}
                onEdit={onEdit}
                onDelete={onDelete}
                currency={currency}
                dateFormat={dateFormat}
                timezone={timezone}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {transactions.map((tx) => (
          <TransactionRow
            key={tx.id}
            tx={tx}
            onEdit={onEdit}
            onDelete={onDelete}
            currency={currency}
            dateFormat={dateFormat}
            timezone={timezone}
            mobile
          />
        ))}
      </div>
    </div>
  )
}
