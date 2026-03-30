export default function FiltersBar({ filters, categories, onChange, onReset }) {
  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="font-display text-xl text-main">Filters</h3>

      <div className="mt-4 grid gap-3 md:grid-cols-5">
        <label className="field-label">
          From
          <input
            type="date"
            value={filters.fromDate}
            onChange={(event) => onChange({ ...filters, fromDate: event.target.value })}
            className="field-input"
          />
        </label>

        <label className="field-label">
          To
          <input
            type="date"
            value={filters.toDate}
            onChange={(event) => onChange({ ...filters, toDate: event.target.value })}
            className="field-input"
          />
        </label>

        <label className="field-label">
          Type
          <select
            value={filters.type}
            onChange={(event) => onChange({ ...filters, type: event.target.value })}
            className="field-input"
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="asset">Asset</option>
            <option value="debt">Debt</option>
          </select>
        </label>

        <label className="field-label">
          Category
          <select
            value={filters.category}
            onChange={(event) => onChange({ ...filters, category: event.target.value })}
            className="field-input"
          >
            <option value="all">All</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="field-label">
          Search note
          <input
            type="text"
            value={filters.search}
            onChange={(event) => onChange({ ...filters, search: event.target.value })}
            className="field-input"
            placeholder="Exam fee"
          />
        </label>
      </div>

      <button type="button" className="btn-secondary mt-4" onClick={onReset}>
        Reset Filters
      </button>
    </div>
  )
}
