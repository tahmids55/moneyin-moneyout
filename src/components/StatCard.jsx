import { formatCurrency } from '../utils/finance'

export default function StatCard({ label, value, tone = 'neutral', currency = 'USD' }) {
  const toneClasses = {
    neutral: 'from-slate-800/88 to-slate-900/72 text-slate-100',
    income: 'from-emerald-900/40 to-cyan-900/25 text-emerald-300',
    expense: 'from-rose-900/36 to-fuchsia-900/28 text-rose-300',
    balance: 'from-violet-900/35 to-indigo-900/28 text-violet-200',
  }

  return (
    <div
      className={`glass rounded-2xl border border-slate-500/20 bg-gradient-to-br p-5 shadow-lg shadow-black/25 ${toneClasses[tone]}`}
    >
      <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{label}</p>
      <p className="font-display mt-2 text-3xl">{formatCurrency(value, currency)}</p>
    </div>
  )
}
