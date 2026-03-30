import { formatCurrency } from '../utils/finance'

export default function BudgetProgressCard({ budget, spent, currency = 'USD' }) {
  const safeBudget = Math.max(Number(budget || 0), 0)
  const safeSpent = Math.max(Number(spent || 0), 0)
  const ratio = safeBudget > 0 ? Math.min((safeSpent / safeBudget) * 100, 100) : 0

  return (
    <section className="glass rounded-2xl border border-slate-500/20 p-5">
      <h3 className="font-display text-lg text-main">Budget Progress</h3>
      <p className="mt-1 text-sm text-muted">Monthly allocation tracking</p>

      <div className="mt-4 h-2 w-full rounded-full bg-slate-700/70">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
          style={{ width: `${ratio}%` }}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-slate-900/55 p-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Budget</p>
          <p className="mt-1 font-semibold text-slate-100">{formatCurrency(safeBudget, currency)}</p>
        </div>
        <div className="rounded-xl bg-slate-900/55 p-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Used</p>
          <p className="mt-1 font-semibold text-slate-100">{formatCurrency(safeSpent, currency)}</p>
        </div>
      </div>
    </section>
  )
}
