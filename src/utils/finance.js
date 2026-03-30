import {
  endOfMonth,
  format,
  isSameMonth,
  parseISO,
  startOfMonth,
  subMonths,
} from 'date-fns'

export function toDate(value) {
  if (!value) {
    return null
  }

  if (typeof value?.toDate === 'function') {
    return value.toDate()
  }

  if (value instanceof Date) {
    return value
  }

  if (typeof value === 'string') {
    return parseISO(value)
  }

  return null
}

export function toCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(Number(value || 0))
}

export function formatCurrency(value, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(Number(value || 0))
}

export function formatDateByPreference(value, dateFormat = 'DD/MM/YYYY', timezone = 'UTC') {
  const date = toDate(value)

  if (!date) {
    return '-'
  }

  const locale = dateFormat === 'MM/DD/YYYY' ? 'en-US' : 'en-GB'

  return new Intl.DateTimeFormat(locale, {
    timeZone: timezone,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

export function getTotals(transactions) {
  return transactions.reduce(
    (acc, tx) => {
      if (tx.type === 'income') {
        acc.income += Number(tx.amount)
      } else {
        acc.expense += Number(tx.amount)
      }

      return acc
    },
    { income: 0, expense: 0 },
  )
}

export function getExpenseByCategory(transactions) {
  const result = {}

  transactions
    .filter((tx) => tx.type === 'expense')
    .forEach((tx) => {
      const key = tx.category || 'Other'
      result[key] = (result[key] || 0) + Number(tx.amount)
    })

  return result
}

export function getMonthlyIncomeExpenseSeries(transactions, monthCount = 6) {
  const now = new Date()
  const months = Array.from({ length: monthCount }).map((_, index) =>
    subMonths(now, monthCount - 1 - index),
  )

  const labels = months.map((monthDate) => format(monthDate, 'MMM yyyy'))

  const income = months.map((monthDate) => {
    const start = startOfMonth(monthDate)
    const end = endOfMonth(monthDate)

    return transactions
      .filter((tx) => tx.type === 'income')
      .filter((tx) => {
        const date = toDate(tx.date)
        return date && date >= start && date <= end
      })
      .reduce((sum, tx) => sum + Number(tx.amount), 0)
  })

  const expense = months.map((monthDate) =>
    transactions
      .filter((tx) => tx.type === 'expense')
      .filter((tx) => {
        const date = toDate(tx.date)
        return date && isSameMonth(date, monthDate)
      })
      .reduce((sum, tx) => sum + Number(tx.amount), 0),
  )

  return { labels, income, expense }
}
