import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js'
import { Bar, Line, Pie } from 'react-chartjs-2'
import { getExpenseByCategory, getMonthlyIncomeExpenseSeries } from '../utils/finance'
import ChartCard from './ChartCard'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement)

export default function AnalyticsCharts({ transactions, theme = 'light' }) {
  const categoryMap = getExpenseByCategory(transactions)
  const categoryLabels = Object.keys(categoryMap)
  const categoryValues = Object.values(categoryMap)
  const topCategories = [...Object.entries(categoryMap)].sort((a, b) => b[1] - a[1]).slice(0, 5)

  const pieData = {
    labels: categoryLabels.length ? categoryLabels : ['No expenses yet'],
    datasets: [
      {
        label: 'Expense by Category',
        data: categoryValues.length ? categoryValues : [1],
        backgroundColor:
          theme === 'dark'
            ? ['#9CA3AF', '#6B7280', '#F87171', '#34D399', '#FBBF24', '#E5E7EB', '#52525B']
            : ['#C0C0C0', '#6B7280', '#F87171', '#34D399', '#FBBF24', '#9CA3AF', '#D1D5DB'],
      },
    ],
  }

  const monthly = getMonthlyIncomeExpenseSeries(transactions)

  const barData = {
    labels: monthly.labels,
    datasets: [
      {
        label: 'Income',
        data: monthly.income,
        backgroundColor: 'rgba(52, 211, 153, 0.8)',
      },
      {
        label: 'Expense',
        data: monthly.expense,
        backgroundColor: 'rgba(248, 113, 113, 0.82)',
      },
    ],
  }

  const lineData = {
    labels: monthly.labels,
    datasets: [
      {
        label: 'Net Cashflow',
        data: monthly.income.map((income, index) => income - monthly.expense[index]),
        borderColor: '#22d3ee',
        backgroundColor: 'rgba(34, 211, 238, 0.18)',
        tension: 0.35,
        fill: true,
      },
    ],
  }

  const axisTextColor = theme === 'dark' ? '#F9FAFB' : '#111827'
  const gridColor = theme === 'dark' ? 'rgba(148, 163, 184, 0.25)' : 'rgba(148, 163, 184, 0.2)'

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: axisTextColor,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: axisTextColor },
        grid: { color: gridColor },
      },
      y: {
        ticks: { color: axisTextColor },
        grid: { color: gridColor },
      },
    },
  }

  const lineOptions = {
    ...barOptions,
    plugins: {
      legend: {
        labels: {
          color: axisTextColor,
        },
      },
    },
  }

  return (
    <section className="grid gap-6 xl:grid-cols-12">
      <ChartCard className="xl:col-span-4" title="Expense by Category" subtitle="Distribution across categories">
        <div className="mx-auto h-64 max-w-xs">
          <Pie data={pieData} />
        </div>
      </ChartCard>

      <ChartCard className="xl:col-span-5" title="Monthly Income vs Expense" subtitle="Six-month view">
        <div className="h-64">
          <Bar data={barData} options={barOptions} />
        </div>
      </ChartCard>

      <ChartCard className="xl:col-span-4" title="Spending Trend" subtitle="Net movement over time">
        <div className="h-64">
          <Line data={lineData} options={lineOptions} />
        </div>
      </ChartCard>

      <section className="glass rounded-2xl border border-slate-500/20 p-5 xl:col-span-3">
        <h3 className="font-display text-lg text-main">Top Categories</h3>
        <p className="mb-3 text-sm text-muted">Highest spending segments</p>
        <ul className="space-y-2">
          {(topCategories.length ? topCategories : [['No expense data', 0]]).map(([name, value]) => (
            <li key={name} className="flex items-center justify-between rounded-lg bg-slate-900/55 px-3 py-2 text-sm">
              <span className="text-slate-200">{name}</span>
              <span className="status-tag tag-expense">{Number(value).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </section>
    </section>
  )
}
