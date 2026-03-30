import { useState } from 'react'
import { format, isValid, parse } from 'date-fns'
import { usePreferences } from '../hooks/usePreferences'

function getPattern(dateFormat) {
  return dateFormat === 'MM/DD/YYYY' ? 'MM/dd/yyyy' : 'dd/MM/yyyy'
}

function getDefaultForm(dateFormat) {
  return {
    type: 'expense',
    amount: '',
    category: '',
    note: '',
    date: format(new Date(), getPattern(dateFormat)),
  }
}

function getInitialForm(editingTransaction, dateFormat) {
  if (!editingTransaction) {
    return getDefaultForm(dateFormat)
  }

  const rawDate =
    typeof editingTransaction.date?.toDate === 'function'
      ? editingTransaction.date.toDate()
      : new Date(editingTransaction.date)

  return {
    type: editingTransaction.type,
    amount: String(editingTransaction.amount),
    category: editingTransaction.category,
    note: editingTransaction.note || '',
    date: format(rawDate, getPattern(dateFormat)),
  }
}

export default function TransactionForm({ onSubmit, editingTransaction, onCancelEdit }) {
  const { dateFormat } = usePreferences()
  const [form, setForm] = useState(() => getInitialForm(editingTransaction, dateFormat))
  const [dateError, setDateError] = useState('')

  const updateForm = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const submitForm = (event) => {
    event.preventDefault()

    if (!form.amount || !form.category || !form.date) {
      return
    }

    const parsedDate = parse(form.date, getPattern(dateFormat), new Date())

    if (!isValid(parsedDate)) {
      setDateError(`Invalid date. Use ${dateFormat} format.`)
      return
    }

    setDateError('')
    onSubmit({ ...form, parsedDate })

    if (!editingTransaction) {
      setForm(getDefaultForm(dateFormat))
    }
  }

  return (
    <form onSubmit={submitForm} className="glass rounded-2xl p-5">
      <h3 className="font-display text-xl text-main">
        {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
      </h3>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="field-label">
          Type
          <select name="type" value={form.type} onChange={updateForm} className="field-input">
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="asset">Asset</option>
            <option value="debt">Debt</option>
          </select>
        </label>

        <label className="field-label">
          Amount
          <input
            type="number"
            min="0"
            step="0.01"
            name="amount"
            value={form.amount}
            onChange={updateForm}
            className="field-input"
            required
          />
        </label>

        <label className="field-label">
          Category
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={updateForm}
            className="field-input"
            placeholder="Food, Transport, Scholarship..."
            required
          />
        </label>

        <label className="field-label">
          Date ({dateFormat})
          <input
            type="text"
            name="date"
            value={form.date}
            onChange={updateForm}
            className="field-input"
            placeholder={dateFormat}
            required
          />
          {dateError ? <span className="mt-1 text-xs text-rose-400">{dateError}</span> : null}
        </label>

        <label className="field-label md:col-span-2">
          Note
          <input
            type="text"
            name="note"
            value={form.note}
            onChange={updateForm}
            className="field-input"
            placeholder="Optional note"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button type="submit" className="btn-primary">
          {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
        </button>

        {editingTransaction ? (
          <button type="button" className="btn-secondary" onClick={onCancelEdit}>
            Cancel Edit
          </button>
        ) : null}
      </div>
    </form>
  )
}
