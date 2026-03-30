import { useEffect, useMemo, useState } from 'react'
import { endOfDay, isAfter, isBefore, parseISO } from 'date-fns'
import { subscribeToTransactions } from '../services/transactionService'

function toDate(value) {
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

export function useTransactions(uid, filters) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!uid) {
      return undefined
    }

    const unsubscribe = subscribeToTransactions(
      uid,
      (items) => {
        setTransactions(items)
        setError(null)
        setLoading(false)
      },
      (nextError) => {
        setError(nextError)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [uid])

  const filteredTransactions = useMemo(() => {
    const fromDate = filters?.fromDate ? parseISO(filters.fromDate) : null
    const toDateValue = filters?.toDate ? endOfDay(parseISO(filters.toDate)) : null

    const normalizedFilterType = (() => {
      if (!filters?.type || filters.type === 'all') {
        return 'all'
      }

      if (filters.type === 'assets') {
        return 'asset'
      }

      if (filters.type === 'debts') {
        return 'debt'
      }

      return filters.type
    })()

    return transactions.filter((item) => {
      const txDate = toDate(item.date)
      const normalizedNote = (item.note || '').toLowerCase()
      const normalizedCategory = (item.category || '').toLowerCase()
      const itemType = item.type === 'assets' ? 'asset' : item.type === 'debts' ? 'debt' : item.type

      if (normalizedFilterType !== 'all' && itemType !== normalizedFilterType) {
        return false
      }

      if (
        filters?.category &&
        filters.category !== 'all' &&
        normalizedCategory !== filters.category.toLowerCase()
      ) {
        return false
      }

      if (filters?.search && !normalizedNote.includes(filters.search.toLowerCase())) {
        return false
      }

      if (fromDate && txDate && isBefore(txDate, fromDate)) {
        return false
      }

      if (toDateValue && txDate && isAfter(txDate, toDateValue)) {
        return false
      }

      return true
    })
  }, [filters, transactions])

  if (!uid) {
    return {
      transactions: [],
      filteredTransactions: [],
      loading: false,
      error: null,
    }
  }

  return { transactions, filteredTransactions, loading, error }
}
