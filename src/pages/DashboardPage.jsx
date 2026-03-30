import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import SummaryCard from '../components/SummaryCard'
import QuickActionCard from '../components/QuickActionCard'
import AnalyticsCharts from '../components/AnalyticsCharts'
import BudgetProgressCard from '../components/BudgetProgressCard'
import SkeletonLoader from '../components/SkeletonLoader'
import { useAuth } from '../hooks/useAuth'
import { useTransactions } from '../hooks/useTransactions'
import { formatCurrency, formatDateByPreference, getTotals, toDate } from '../utils/finance'
import { useBudget } from '../hooks/useBudget'
import { upsertMonthlyBudget } from '../services/budgetService'
import { usePreferences } from '../hooks/usePreferences'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { currency, dateFormat, timezone, theme, notificationsEnabled, overspendAlertsEnabled } =
    usePreferences()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { transactions, loading } = useTransactions(user?.uid)
  const { budget } = useBudget(user?.uid)
  const [budgetInput, setBudgetInput] = useState('')
  const referenceNow = useMemo(() => new Date(), [])

  const totals = useMemo(() => getTotals(transactions), [transactions])
  const balance = totals.cashInflow - totals.cashOutflow

  const currentMonthExpense = useMemo(() => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    return transactions
      .filter((tx) => tx.type === 'expense' || tx.type === 'asset' || tx.type === 'assets')
      .filter((tx) => {
        const date = toDate(tx.date)
        return date && date.getMonth() === currentMonth && date.getFullYear() === currentYear
      })
      .reduce((sum, tx) => sum + Number(tx.amount), 0)
  }, [transactions])

  const monthlyBudget = Number(budget?.monthlyBudget || 0)
  const remainingBudget = monthlyBudget - currentMonthExpense
  const budgetExceeded = monthlyBudget > 0 && remainingBudget < 0
  const savingsRate = totals.income > 0 ? ((balance / totals.income) * 100).toFixed(1) : '0.0'
  const budgetUsedPercent = monthlyBudget > 0 ? ((currentMonthExpense / monthlyBudget) * 100).toFixed(1) : '0.0'

  const todaySpending = useMemo(() => {
    const today = new Date()
    return transactions
      .filter((tx) => tx.type === 'expense' || tx.type === 'asset' || tx.type === 'assets')
      .filter((tx) => {
        const date = toDate(tx.date)
        return date && date.toDateString() === today.toDateString()
      })
      .reduce((sum, tx) => sum + Number(tx.amount), 0)
  }, [transactions])

  const weekSpending = useMemo(() => {
    const now = referenceNow.getTime()
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000
    return transactions
      .filter((tx) => tx.type === 'expense' || tx.type === 'asset' || tx.type === 'assets')
      .filter((tx) => {
        const date = toDate(tx.date)
        return date && now - date.getTime() <= sevenDaysMs
      })
      .reduce((sum, tx) => sum + Number(tx.amount), 0)
  }, [referenceNow, transactions])

  const highestCategory = useMemo(() => {
    const map = {}
    transactions
      .filter((tx) => tx.type === 'expense' || tx.type === 'asset' || tx.type === 'assets')
      .forEach((tx) => {
        const key = tx.category || 'Other'
        map[key] = (map[key] || 0) + Number(tx.amount)
      })

    const [name, amount] = Object.entries(map).sort((a, b) => b[1] - a[1])[0] || ['None', 0]
    return { name, amount }
  }, [transactions])

  const topActions = [
    { label: '+ Add Income', onClick: () => navigate('/transactions'), tone: 'primary' },
    { label: '+ Add Expense', onClick: () => navigate('/transactions'), tone: 'primary' },
    { label: 'Export', onClick: () => navigate('/transactions') },
    { label: 'Import', onClick: () => navigate('/transactions') },
    { label: 'Filter', onClick: () => navigate('/transactions') },
  ]

  const quickActions = [
    { label: 'Add Income', icon: 'IN', onClick: () => navigate('/transactions') },
    { label: 'Add Expense', icon: 'EX', onClick: () => navigate('/transactions') },
    { label: 'Add Category', icon: 'CT', onClick: () => toast('Category manager is in Settings') },
    { label: 'Set Budget', icon: 'BG', onClick: () => document.getElementById('budget-input')?.focus() },
    { label: 'Export CSV', icon: 'EC', onClick: () => navigate('/transactions') },
    { label: 'Import CSV', icon: 'IC', onClick: () => navigate('/transactions') },
  ]

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
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="app-content">
        <Topbar
          title="Student Finance Dashboard"
          subtitle="Smart overview of your income, expenses, and budget health"
          onMenu={() => setMobileOpen(true)}
          actions={topActions}
        />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <SummaryCard label="Total Income" value={formatCurrency(totals.income, currency)} tone="success" />
          <SummaryCard label="Total Expense" value={formatCurrency(totals.expense, currency)} tone="danger" />
          <SummaryCard label="Total Debts" value={formatCurrency(totals.debts, currency)} tone="success" />
          <SummaryCard label="Total Assets" value={formatCurrency(totals.assets, currency)} tone="warning" />
          <SummaryCard label="Balance" value={formatCurrency(balance, currency)} tone="primary" />
          <SummaryCard label="Monthly Savings Rate" value={`${savingsRate}%`} tone="violet" />
          <SummaryCard label="Budget Used" value={`${budgetUsedPercent}%`} tone="warning" />
          <SummaryCard label="Remaining Budget" value={formatCurrency(remainingBudget, currency)} tone="neutral" />
        </section>

        <section className="glass rounded-2xl border border-slate-500/20 p-5">
          <h2 className="font-display text-xl text-main">Quick Actions</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {quickActions.map((action) => (
              <QuickActionCard
                key={action.label}
                icon={action.icon}
                label={action.label}
                onClick={action.onClick}
              />
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-12">
          <div className="glass rounded-2xl border border-slate-500/20 p-5 xl:col-span-8">
            <h2 className="font-display text-2xl text-main">Budget Planner</h2>
            <p className="mt-1 text-sm text-muted">Set a monthly spending cap and stay under it.</p>

            <form onSubmit={saveBudget} className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                id="budget-input"
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

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-xl bg-slate-900/55 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Monthly Budget</p>
                <p className="font-display text-2xl text-slate-100">{formatCurrency(monthlyBudget, currency)}</p>
              </div>
              <div
                className={`rounded-xl p-4 ${
                  budgetExceeded
                    ? 'bg-rose-900/35 text-rose-300'
                    : 'bg-emerald-900/35 text-emerald-300'
                }`}
              >
                <p className="text-xs uppercase tracking-[0.2em]">Remaining</p>
                <p className="font-display text-2xl">{formatCurrency(remainingBudget, currency)}</p>
              </div>
              <div className="rounded-xl bg-slate-900/55 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">This Month Spent</p>
                <p className="font-display text-2xl text-slate-100">{formatCurrency(currentMonthExpense, currency)}</p>
              </div>
            </div>

            {budgetExceeded && notificationsEnabled && overspendAlertsEnabled ? (
              <p className="mt-4 rounded-lg bg-rose-900/35 p-3 text-sm font-medium text-rose-200">
                Budget warning: you exceeded your monthly limit by{' '}
                {formatCurrency(Math.abs(remainingBudget), currency)}.
              </p>
            ) : null}
          </div>

          <div className="space-y-4 xl:col-span-4">
            <BudgetProgressCard budget={monthlyBudget} spent={currentMonthExpense} currency={currency} />

            <section className="glass rounded-2xl border border-slate-500/20 p-5">
              <h3 className="font-display text-lg text-main">Finance Pulse</h3>
              <div className="mt-4 space-y-3 text-sm">
                <div className="widget-item">
                  <span>Today spending</span>
                  <strong>{formatCurrency(todaySpending, currency)}</strong>
                </div>
                <div className="widget-item">
                  <span>This week total</span>
                  <strong>{formatCurrency(weekSpending, currency)}</strong>
                </div>
                <div className="widget-item">
                  <span>Highest category</span>
                  <strong>{highestCategory.name}</strong>
                </div>
                <div className="widget-item">
                  <span>Category amount</span>
                  <strong>{formatCurrency(highestCategory.amount, currency)}</strong>
                </div>
                <div className="widget-item">
                  <span>Budget alerts</span>
                  <strong>{budgetExceeded ? '1 pending' : 'No warnings'}</strong>
                </div>
                <div className="widget-item">
                  <span>Recurring reminders</span>
                  <strong>Next 7 days</strong>
                </div>
              </div>
            </section>
          </div>
        </section>

        <section className="glass rounded-2xl border border-slate-500/20 p-5">
          <h2 className="font-display text-xl text-main">Recent Transactions</h2>
          <p className="text-sm text-muted">Latest activity synced from Firestore</p>

          {loading ? (
            <SkeletonLoader rows={5} className="mt-4" />
          ) : (
            <ul className="mt-4 space-y-2">
              {transactions.slice(0, 6).map((tx) => (
                <li key={tx.id} className="rounded-xl border border-slate-500/20 bg-slate-900/62 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-100">{tx.category}</p>
                      <p className="text-xs text-slate-400">
                        {tx.note || 'No note'} - {formatDateByPreference(toDate(tx.date), dateFormat, timezone)}
                      </p>
                    </div>
                    <span
                      className={
                        tx.type === 'income' || tx.type === 'debt' || tx.type === 'debts'
                          ? 'status-tag tag-income'
                          : 'status-tag tag-expense'
                      }
                    >
                      {formatCurrency(tx.amount, currency)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <AnalyticsCharts transactions={transactions} theme={theme} />
      </main>
    </div>
  )
}
