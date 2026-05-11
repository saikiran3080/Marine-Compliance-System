import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { Select } from '../common/Select'
import { SearchBar } from '../common/SearchBar'
import type { ListFilters } from '../../types'

export function FilterPanel({
  filters,
  onChange,
  statusOptions,
}: {
  filters: ListFilters
  onChange: (filters: ListFilters) => void
  statusOptions: Array<{ label: string; value: string }>
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 lg:flex-row lg:items-end">
      <SearchBar
        value={filters.search ?? ''}
        onChange={(search) => onChange({ ...filters, search, page: 0 })}
      />
      <Select
        label="Status"
        value={filters.status ?? ''}
        options={[{ label: 'All statuses', value: '' }, ...statusOptions]}
        onChange={(event) => onChange({ ...filters, status: event.target.value, page: 0 })}
      />
      <Input
        label="Ship ID"
        value={filters.shipId ?? ''}
        onChange={(event) => onChange({ ...filters, shipId: event.target.value, page: 0 })}
      />
      <Input
        label="Date"
        type="date"
        value={filters.date ?? ''}
        onChange={(event) => onChange({ ...filters, date: event.target.value, page: 0 })}
      />
      <label className="flex h-11 items-center gap-2 rounded-md border border-slate-300 px-3 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          checked={Boolean(filters.overdue)}
          onChange={(event) => onChange({ ...filters, overdue: event.target.checked, page: 0 })}
        />
        Overdue
      </label>
      <Button variant="secondary" onClick={() => onChange({ page: 0, size: filters.size ?? 10 })}>
        Reset
      </Button>
    </div>
  )
}
