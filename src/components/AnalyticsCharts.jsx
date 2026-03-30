import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'
import { getExpenseByCategory, getMonthlyIncomeExpenseSeries } from '../utils/finance'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

export default function AnalyticsCharts({ transactions, theme = 'light' }) {
  const categoryMap = getExpenseByCategory(transactions)
  const categoryLabels = Object.keys(categoryMap)
  const categoryValues = Object.values(categoryMap)

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

  return (
    <section className="grid gap-6 lg:grid-cols-5">
      <div className="glass rounded-2xl p-5 lg:col-span-2">
        <h3 className="font-display text-xl text-main">Expense Categories</h3>
        <p className="mb-4 text-sm text-muted">Where your spending goes</p>
        <div className="mx-auto h-64 max-w-xs">
          <Pie data={pieData} />
        </div>
      </div>

      <div className="glass rounded-2xl p-5 lg:col-span-3">
        <h3 className="font-display text-xl text-main">Monthly Income vs Expense</h3>
        <p className="mb-4 text-sm text-muted">Last 6 months trend</p>
        <div className="h-64">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </section>
  )
}
