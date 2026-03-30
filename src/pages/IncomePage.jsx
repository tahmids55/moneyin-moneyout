import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import TransactionTable from '../components/TransactionTable'
import TransactionForm from '../components/TransactionForm'
import FiltersBar from '../components/FiltersBar'
import Modal from '../components/Modal'
import SkeletonLoader from '../components/SkeletonLoader'
import { useAuth } from '../hooks/useAuth'
import { usePreferences } from '../hooks/usePreferences'
import { useTransactions } from '../hooks/useTransactions'
import { addTransaction, deleteTransaction, updateTransaction } from '../services/transactionService'

const initialFilters = {
  fromDate: '',
  toDate: '',
  type: 'income',
  category: 'all',
  search: '',
}

export default function IncomePage() {
  const { user } = useAuth()
  const { currency, dateFormat, timezone } = usePreferences()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [filters, setFilters] = useState(initialFilters)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)

  const { filteredTransactions, transactions, loading } = useTransactions(user?.uid, filters)

  const categories = useMemo(() => {
    const categorySet = new Set(transactions.map((tx) => tx.category).filter(Boolean))
    return Array.from(categorySet)
  }, [transactions])

  const submitTransaction = async (form) => {
    try {
      const payload = {
        ...form,
        type: 'income',
        date: form.parsedDate || new Date(form.date),
      }

      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, payload)
        setEditingTransaction(null)
        toast.success('Income updated')
      } else {
        await addTransaction(user.uid, payload)
        toast.success('Income added')
      }
    } catch {
      toast.error('Unable to save income')
    }
  }

  const confirmDelete = async () => {
    if (!pendingDelete?.id) {
      return
    }

    try {
      await deleteTransaction(pendingDelete.id)
      toast.success('Income entry deleted')
      setPendingDelete(null)
    } catch {
      toast.error('Unable to delete income entry')
    }
  }

  return (
    <div className="app-shell">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="app-content">
        <Topbar
          title="Income"
          subtitle="Manage your incoming cashflow with quick filters"
          onMenu={() => setMobileOpen(true)}
        />

        <TransactionForm
          key={editingTransaction?.id || 'new-income'}
          onSubmit={submitTransaction}
          editingTransaction={editingTransaction}
          onCancelEdit={() => setEditingTransaction(null)}
        />

        <FiltersBar
          filters={filters}
          categories={categories}
          onChange={(next) => setFilters({ ...next, type: 'income' })}
          onReset={() => setFilters(initialFilters)}
        />

        {loading ? (
          <section className="glass rounded-2xl border border-slate-500/20 p-5">
            <SkeletonLoader rows={5} />
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
          title="Delete income entry"
          description="This action cannot be undone. Do you want to continue?"
          confirmLabel="Delete"
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      </main>
    </div>
  )
}
