import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import TransactionForm from '../components/TransactionForm'
import FiltersBar from '../components/FiltersBar'
import TransactionTable from '../components/TransactionTable'
import QuickActionCard from '../components/QuickActionCard'
import Modal from '../components/Modal'
import SkeletonLoader from '../components/SkeletonLoader'
import { useAuth } from '../hooks/useAuth'
import { useTransactions } from '../hooks/useTransactions'
import {
  addTransaction,
  deleteTransaction,
  updateTransaction,
} from '../services/transactionService'
import { toDate } from '../utils/finance'
import { usePreferences } from '../hooks/usePreferences'

const initialFilters = {
  fromDate: '',
  toDate: '',
  type: 'all',
  category: 'all',
  search: '',
}

export default function TransactionsPage() {
  const { user } = useAuth()
  const { currency, dateFormat, timezone } = usePreferences()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [filters, setFilters] = useState(initialFilters)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)

  const { filteredTransactions, transactions, error, loading } = useTransactions(user?.uid, filters)

  useEffect(() => {
    if (!error) {
      return
    }

    toast.error(error.message || 'Could not load transactions')
  }, [error])

  const categories = useMemo(() => {
    const categorySet = new Set(transactions.map((tx) => tx.category).filter(Boolean))
    return Array.from(categorySet)
  }, [transactions])

  const submitTransaction = async (form) => {
    try {
      const payload = {
        ...form,
        date: form.parsedDate || new Date(form.date),
      }

      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, payload)
        setEditingTransaction(null)
        toast.success('Transaction updated')
      } else {
        await addTransaction(user.uid, payload)
        toast.success('Transaction added')
      }
    } catch {
      toast.error('Unable to save transaction')
    }
  }

  const removeTransaction = async () => {
    if (!pendingDelete?.id) {
      return
    }

    try {
      await deleteTransaction(pendingDelete.id)
      toast.success('Transaction deleted')
      setPendingDelete(null)
    } catch {
      toast.error('Unable to delete transaction')
    }
  }

  const exportCsv = () => {
    if (!filteredTransactions.length) {
      toast.error('No transactions to export')
      return
    }

    const header = ['date', 'type', 'category', 'amount', 'note']
    const rows = filteredTransactions.map((tx) => [
      toDate(tx.date)?.toISOString().slice(0, 10) || '',
      tx.type,
      tx.category,
      String(tx.amount),
      (tx.note || '').replaceAll('"', '""'),
    ])

    const csvContent = [header, ...rows]
      .map((row) => row.map((item) => `"${item}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'transactions-export.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const parseCsv = (content) => {
    const lines = content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)

    if (lines.length < 2) {
      return []
    }

    const headers = lines[0]
      .split(',')
      .map((item) => item.replaceAll('"', '').trim().toLowerCase())

    return lines.slice(1).map((line) => {
      const values = line
        .match(/("[^"]*"|[^,]+)/g)
        ?.map((value) => value.replace(/^"|"$/g, '').trim()) || []

      const row = {}
      headers.forEach((header, index) => {
        row[header] = values[index] ?? ''
      })
      return row
    })
  }

  const importCsv = async (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    try {
      const content = await file.text()
      const rows = parseCsv(content)

      if (!rows.length) {
        toast.error('CSV file is empty or invalid')
        return
      }

      const validRows = rows.filter(
        (row) => row.type && row.category && row.amount && row.date,
      )

      await Promise.all(
        validRows.map((row) =>
          addTransaction(user.uid, {
            type: row.type.toLowerCase() === 'income' ? 'income' : 'expense',
            category: row.category,
            amount: Number(row.amount),
            note: row.note || '',
            date: new Date(row.date),
          }),
        ),
      )

      toast.success(`Imported ${validRows.length} transactions`)
    } catch {
      toast.error('Failed to import CSV')
    } finally {
      event.target.value = ''
    }
  }

  const actions = [
    { label: '+ Add Income', tone: 'primary', onClick: () => setEditingTransaction(null) },
    { label: '+ Add Expense', tone: 'primary', onClick: () => setEditingTransaction(null) },
    { label: 'Export', onClick: exportCsv },
    { label: 'Import', onClick: () => document.getElementById('csv-import-input')?.click() },
    { label: 'Filter', onClick: () => setFilters(initialFilters) },
  ]

  const quickActions = [
    { label: 'Add Income', icon: 'IN', onClick: () => setEditingTransaction(null) },
    { label: 'Add Expense', icon: 'EX', onClick: () => setEditingTransaction(null) },
    { label: 'Export CSV', icon: 'EC', onClick: exportCsv },
    { label: 'Import CSV', icon: 'IC', onClick: () => document.getElementById('csv-import-input')?.click() },
  ]

  return (
    <div className="app-shell">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="app-content">
        <Topbar
          title="Transactions"
          subtitle="Track, filter, and manage your ledger entries"
          onMenu={() => setMobileOpen(true)}
          actions={actions}
        />

        <section className="glass rounded-2xl border border-slate-500/20 p-5">
          <h2 className="font-display text-lg text-main">Quick Actions</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((item) => (
              <QuickActionCard
                key={item.label}
                icon={item.icon}
                label={item.label}
                onClick={item.onClick}
              />
            ))}
          </div>
        </section>

        <TransactionForm
          key={editingTransaction?.id || 'new'}
          onSubmit={submitTransaction}
          editingTransaction={editingTransaction}
          onCancelEdit={() => setEditingTransaction(null)}
        />

        <FiltersBar
          filters={filters}
          categories={categories}
          onChange={setFilters}
          onReset={() => setFilters(initialFilters)}
        />

        <div className="flex justify-end">
          <div className="flex gap-3">
            <label className="btn-secondary cursor-pointer">
              Import CSV
              <input
                id="csv-import-input"
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={importCsv}
              />
            </label>
            <button type="button" className="btn-secondary" onClick={exportCsv}>
              Export CSV
            </button>
          </div>
        </div>

        {loading ? (
          <section className="glass rounded-2xl border border-slate-500/20 p-5">
            <SkeletonLoader rows={6} />
          </section>
        ) : (
          <TransactionTable
            transactions={filteredTransactions}
            onEdit={setEditingTransaction}
            onDelete={setPendingDelete}
            currency={currency}
            dateFormat={dateFormat}
            timezone={timezone}
          />
        )}

        <Modal
          open={Boolean(pendingDelete)}
          title="Delete transaction"
          description="This action cannot be undone. Do you want to continue?"
          confirmLabel="Delete"
          onConfirm={removeTransaction}
          onCancel={() => setPendingDelete(null)}
        />
      </main>
    </div>
  )
}
