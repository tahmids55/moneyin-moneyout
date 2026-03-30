import { formatCurrency } from '../utils/finance'

export default function StatCard({ label, value, tone = 'neutral', currency = 'USD' }) {
  const toneClasses = {
    neutral: 'from-white/80 to-white/30 text-main dark:from-slate-700/80 dark:to-slate-800/70',
    income: 'from-emerald-100/90 to-emerald-50/30 text-emerald-700 dark:from-emerald-900/40 dark:to-emerald-800/30 dark:text-emerald-300',
    expense: 'from-rose-100/90 to-rose-50/30 text-rose-700 dark:from-rose-900/40 dark:to-rose-800/30 dark:text-rose-300',
    balance: 'from-sky-100/90 to-blue-50/30 text-blue-700 dark:from-blue-900/40 dark:to-blue-800/30 dark:text-blue-300',
  }

  return (
    <div
      className={`glass rounded-2xl bg-gradient-to-br p-5 shadow-lg shadow-slate-200/60 ${toneClasses[tone]}`}
    >
      <p className="text-xs uppercase tracking-[0.22em] text-muted">{label}</p>
      <p className="font-display mt-2 text-3xl">{formatCurrency(value, currency)}</p>
    </div>
  )
}
