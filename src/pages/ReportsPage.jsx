import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import SummaryCard from '../components/SummaryCard'
import SkeletonLoader from '../components/SkeletonLoader'
import EmptyState from '../components/EmptyState'
import { useAuth } from '../hooks/useAuth'
import { useTransactions } from '../hooks/useTransactions'
import { useBudget } from '../hooks/useBudget'
import { usePreferences } from '../hooks/usePreferences'
import { formatCurrency, formatDateByPreference, getTotals, toDate } from '../utils/finance'

const monthOptions = [
  { label: 'January', value: 0 },
  { label: 'February', value: 1 },
  { label: 'March', value: 2 },
  { label: 'April', value: 3 },
  { label: 'May', value: 4 },
  { label: 'June', value: 5 },
  { label: 'July', value: 6 },
  { label: 'August', value: 7 },
  { label: 'September', value: 8 },
  { label: 'October', value: 9 },
  { label: 'November', value: 10 },
  { label: 'December', value: 11 },
]

export default function ReportsPage() {
  const { user } = useAuth()
  const { currency, dateFormat, timezone } = usePreferences()
  const { transactions, loading } = useTransactions(user?.uid)
  const { budget } = useBudget(user?.uid)
  const [mobileOpen, setMobileOpen] = useState(false)

  const now = useMemo(() => new Date(), [])
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth())

  const availableYears = useMemo(() => {
    const years = new Set()

    transactions.forEach((tx) => {
      const date = toDate(tx.date)
      if (date) {
        years.add(date.getFullYear())
      }
    })

    if (!years.size) {
      years.add(now.getFullYear())
    }

    return Array.from(years).sort((a, b) => b - a)
  }, [now, transactions])

  useEffect(() => {
    if (!availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0])
    }
  }, [availableYears, selectedYear])

  const monthlyTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        const date = toDate(tx.date)
        return date && date.getFullYear() === selectedYear && date.getMonth() === selectedMonth
      })
      .sort((a, b) => {
        const aDate = toDate(a.date)?.getTime() || 0
        const bDate = toDate(b.date)?.getTime() || 0
        return aDate - bDate
      })
  }, [selectedMonth, selectedYear, transactions])

  const monthTotals = useMemo(() => getTotals(monthlyTransactions), [monthlyTransactions])

  const monthlyBudget = Number(budget?.monthlyBudget || 0)
  const balance = monthTotals.cashInflow - monthTotals.cashOutflow
  const remainingBudget = monthlyBudget - monthTotals.cashOutflow
  const budgetUsedPercent =
    monthlyBudget > 0 ? ((monthTotals.cashOutflow / monthlyBudget) * 100).toFixed(1) : '0.0'
  const savingsRate =
    monthTotals.cashInflow > 0 ? ((balance / monthTotals.cashInflow) * 100).toFixed(1) : '0.0'

  const transactionsByDay = useMemo(() => {
    const grouped = {}

    monthlyTransactions.forEach((tx) => {
      const date = toDate(tx.date)
      if (!date) {
        return
      }

      const key = format(date, 'yyyy-MM-dd')

      if (!grouped[key]) {
        grouped[key] = []
      }

      grouped[key].push(tx)
    })

    return Object.entries(grouped)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([dateKey, items]) => ({
        dateKey,
        dayLabel: Number(dateKey.split('-')[2]),
        items,
      }))
  }, [monthlyTransactions])

  return (
    <div className="app-shell">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="app-content">
        <Topbar
          title="Monthly Reports"
          subtitle="Select year and month to see a full summary and day-sorted transaction history"
          onMenu={() => setMobileOpen(true)}
        />

        <section className="glass rounded-2xl border border-slate-500/20 p-5">
          <h2 className="font-display text-xl text-main">Report Filters</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-[0.12em] text-muted">Year</label>
              <select
                value={selectedYear}
                onChange={(event) => setSelectedYear(Number(event.target.value))}
                className="field-input mt-2"
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.12em] text-muted">Month</label>
              <select
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(Number(event.target.value))}
                className="field-input mt-2"
              >
                {monthOptions.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <SummaryCard
            label="Month Income"
            value={formatCurrency(monthTotals.income, currency)}
            tone="success"
          />
          <SummaryCard
            label="Month Expenses"
            value={formatCurrency(monthTotals.expense, currency)}
            tone="danger"
          />
          <SummaryCard label="Month Debts" value={formatCurrency(monthTotals.debts, currency)} tone="success" />
          <SummaryCard label="Month Assets" value={formatCurrency(monthTotals.assets, currency)} tone="warning" />
          <SummaryCard label="Balance" value={formatCurrency(balance, currency)} tone="primary" />
          <SummaryCard
            label="Monthly Budget"
            value={formatCurrency(monthlyBudget, currency)}
            tone="neutral"
          />
          <SummaryCard label="Budget Used" value={`${budgetUsedPercent}%`} tone="warning" />
          <SummaryCard
            label="Budget Remaining"
            value={formatCurrency(remainingBudget, currency)}
            tone="violet"
          />
          <SummaryCard label="Savings Rate" value={`${savingsRate}%`} tone="primary" />
          <SummaryCard label="Transactions" value={String(monthlyTransactions.length)} tone="neutral" />
        </section>

        <section className="glass rounded-2xl border border-slate-500/20 p-5">
          <h2 className="font-display text-xl text-main">
            {monthOptions[selectedMonth]?.label} {selectedYear} Transaction History
          </h2>
          <p className="text-sm text-muted">Sorted by day from the start to end of the selected month.</p>

          {loading ? (
            <SkeletonLoader rows={8} className="mt-4" />
          ) : transactionsByDay.length ? (
            <div className="mt-4 space-y-4">
              {transactionsByDay.map((group) => (
                <div key={group.dateKey} className="rounded-xl border border-slate-500/20 bg-slate-900/55 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-100">
                      Day {group.dayLabel} - {formatDateByPreference(group.dateKey, dateFormat, timezone)}
                    </p>
                    <p className="text-xs text-slate-400">{group.items.length} transactions</p>
                  </div>

                  <div className="space-y-2">
                    {group.items.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-slate-500/20 bg-slate-950/60 px-3 py-2"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-100">{tx.category || 'Other'}</p>
                          <p className="truncate text-xs text-slate-400">{tx.note || 'No note'}</p>
                        </div>

                        <div className="text-right">
                          <p className="text-xs uppercase tracking-[0.12em] text-slate-400">{tx.type}</p>
                          <p
                            className={
                              tx.type === 'income' || tx.type === 'debt' || tx.type === 'debts'
                                ? 'text-sm font-semibold text-emerald-300'
                                : 'text-sm font-semibold text-rose-300'
                            }
                          >
                            {formatCurrency(tx.amount, currency)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState
                title="No transactions for this month"
                subtitle="Pick another month/year to see the report history."
              />
            </div>
          )}
        </section>
      </main>
    </div>
  )
}