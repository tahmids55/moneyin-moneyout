import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import StatCard from '../components/StatCard'
import AnalyticsCharts from '../components/AnalyticsCharts'
import { useAuth } from '../hooks/useAuth'
import { useTransactions } from '../hooks/useTransactions'
import { formatCurrency, formatDateByPreference, getTotals, toDate } from '../utils/finance'
import { useBudget } from '../hooks/useBudget'
import { upsertMonthlyBudget } from '../services/budgetService'
import { usePreferences } from '../hooks/usePreferences'

export default function DashboardPage() {
  const { user } = useAuth()
  const { currency, dateFormat, timezone, theme, notificationsEnabled, overspendAlertsEnabled } =
    usePreferences()
  const { transactions, loading } = useTransactions(user?.uid)
  const { budget } = useBudget(user?.uid)
  const [budgetInput, setBudgetInput] = useState('')

  const totals = useMemo(() => getTotals(transactions), [transactions])
  const balance = totals.income - totals.expense

  const currentMonthExpense = useMemo(() => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    return transactions
      .filter((tx) => tx.type === 'expense')
      .filter((tx) => {
        const date = toDate(tx.date)
        return date && date.getMonth() === currentMonth && date.getFullYear() === currentYear
      })
      .reduce((sum, tx) => sum + Number(tx.amount), 0)
  }, [transactions])

  const monthlyBudget = Number(budget?.monthlyBudget || 0)
  const remainingBudget = monthlyBudget - currentMonthExpense
  const budgetExceeded = monthlyBudget > 0 && remainingBudget < 0

  const saveBudget = async (event) => {
    event.preventDefault()

    if (!budgetInput) {
      return
    }

    try {
      await upsertMonthlyBudget(user.uid, budgetInput)
      setBudgetInput('')
      toast.success('Monthly budget updated')
    } catch {
      toast.error('Could not save budget')
    }
  }

  return (
    <div className="app-shell">
      <Navbar />

      <main className="mx-auto mt-6 w-[94%] max-w-6xl space-y-6 pb-12">
        <section className="grid gap-4 md:grid-cols-3">
          <StatCard label="Total Income" value={totals.income} tone="income" currency={currency} />
          <StatCard label="Total Expense" value={totals.expense} tone="expense" currency={currency} />
          <StatCard label="Balance" value={balance} tone="balance" currency={currency} />
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="glass rounded-2xl p-5 lg:col-span-2">
            <h2 className="font-display text-2xl text-main">Budget Planner</h2>
            <p className="mt-1 text-sm text-muted">Set a monthly spending cap and stay under it.</p>

            <form onSubmit={saveBudget} className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="number"
                min="0"
                step="0.01"
                value={budgetInput}
                onChange={(event) => setBudgetInput(event.target.value)}
                placeholder={monthlyBudget ? `Current: ${monthlyBudget}` : 'Set monthly budget'}
                className="field-input"
              />
              <button type="submit" className="btn-primary">
                Save Budget
              </button>
            </form>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-white/50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Monthly Budget</p>
                <p className="font-display text-2xl text-main">{formatCurrency(monthlyBudget, currency)}</p>
              </div>
              <div
                className={`rounded-xl p-4 ${
                  budgetExceeded
                    ? 'bg-rose-100/85 text-rose-700 dark:bg-rose-900/35 dark:text-rose-300'
                    : 'bg-emerald-100/85 text-emerald-700 dark:bg-emerald-900/35 dark:text-emerald-300'
                }`}
              >
                <p className="text-xs uppercase tracking-[0.2em]">Remaining</p>
                <p className="font-display text-2xl">{formatCurrency(remainingBudget, currency)}</p>
              </div>
            </div>

            {budgetExceeded && notificationsEnabled && overspendAlertsEnabled ? (
              <p className="mt-4 rounded-lg bg-rose-200/70 p-3 text-sm font-medium text-rose-900">
                Budget warning: you exceeded your monthly limit by{' '}
                {formatCurrency(Math.abs(remainingBudget), currency)}.
              </p>
            ) : null}
          </div>

          <div className="glass rounded-2xl p-5">
            <h2 className="font-display text-2xl text-main">Live Feed</h2>
            <p className="mt-1 text-sm text-muted">Recent transactions update in real time.</p>
            <ul className="mt-4 space-y-2">
              {loading ? (
                <li className="text-sm text-muted">Loading transactions...</li>
              ) : (
                transactions.slice(0, 5).map((tx) => (
                  <li key={tx.id} className="rounded-xl bg-white/50 p-3 dark:bg-slate-700/50">
                    <p className="text-sm font-medium text-main">
                      {tx.category} - {formatCurrency(tx.amount, currency)}
                    </p>
                    <p className="text-xs text-muted">
                      {tx.type} on {formatDateByPreference(toDate(tx.date), dateFormat, timezone)}
                    </p>
                  </li>
                ))
              )}
            </ul>
          </div>
        </section>

        <AnalyticsCharts transactions={transactions} theme={theme} />
      </main>
    </div>
  )
}
