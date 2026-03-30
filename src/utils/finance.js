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

export function normalizeTransactionType(type) {
  const normalized = String(type || '').trim().toLowerCase().replace(/\s+/g, '_')

  if (normalized === 'assets' || normalized === 'asset') {
    return 'asset_debit'
  }

  if (normalized === 'debts' || normalized === 'debt') {
    return 'debt_credit'
  }

  if (
    normalized === 'income' ||
    normalized === 'expense' ||
    normalized === 'asset_debit' ||
    normalized === 'asset_credit' ||
    normalized === 'debt_debit' ||
    normalized === 'debt_credit'
  ) {
    return normalized
  }

  return 'expense'
}

export function isCashInType(type) {
  const normalized = normalizeTransactionType(type)
  return normalized === 'income' || normalized === 'asset_credit' || normalized === 'debt_credit'
}

export function isCashOutType(type) {
  return !isCashInType(type)
}

export function getTransactionTypeLabel(type) {
  const normalized = normalizeTransactionType(type)

  if (normalized === 'asset_debit') {
    return 'Asset Debit'
  }

  if (normalized === 'asset_credit') {
    return 'Asset Credit'
  }

  if (normalized === 'debt_debit') {
    return 'Debts Debit'
  }

  if (normalized === 'debt_credit') {
    return 'Debts Credit'
  }

  if (normalized === 'income') {
    return 'Income'
  }

  return 'Expense'
}

export function getTotals(transactions) {
  return transactions.reduce(
    (acc, tx) => {
      const normalizedType = normalizeTransactionType(tx.type)
      const amount = Number(tx.amount)

      if (normalizedType === 'income') {
        acc.income += Number(tx.amount)
      }

      if (normalizedType === 'expense') {
        acc.expense += amount
      }

      if (normalizedType === 'asset_debit') {
        acc.assets += amount
      }

      if (normalizedType === 'asset_credit') {
        acc.assets -= amount
      }

      if (normalizedType === 'debt_credit') {
        acc.debts += amount
      }

      if (normalizedType === 'debt_debit') {
        acc.debts -= amount
      }

      if (isCashInType(normalizedType)) {
        acc.cashInflow += amount
      } else {
        acc.cashOutflow += amount
      }

      return acc
    },
    { income: 0, expense: 0, debts: 0, assets: 0, cashInflow: 0, cashOutflow: 0 },
  )
}

export function getExpenseByCategory(transactions) {
  const result = {}

  transactions
    .filter((tx) => isCashOutType(tx.type))
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
      .filter((tx) => isCashInType(tx.type))
      .filter((tx) => {
        const date = toDate(tx.date)
        return date && date >= start && date <= end
      })
      .reduce((sum, tx) => sum + Number(tx.amount), 0)
  })

  const expense = months.map((monthDate) =>
    transactions
      .filter((tx) => isCashOutType(tx.type))
      .filter((tx) => {
        const date = toDate(tx.date)
        return date && isSameMonth(date, monthDate)
      })
      .reduce((sum, tx) => sum + Number(tx.amount), 0),
  )

  return { labels, income, expense }
}
