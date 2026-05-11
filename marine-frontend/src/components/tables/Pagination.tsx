import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../common/Button'

export function Pagination({
  page,
  size,
  total,
  onPageChange,
  onSizeChange,
}: {
  page: number
  size: number
  total: number
  onPageChange: (page: number) => void
  onSizeChange: (size: number) => void
}) {
  const totalPages = Math.max(1, Math.ceil(total / size))

  return (
    <div className="flex flex-col items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 sm:flex-row">
      <p className="text-sm text-slate-500">
        Page <span className="font-semibold text-slate-800">{page + 1}</span> of {totalPages} · {total} records
      </p>
      <div className="flex items-center gap-2">
        <select
          value={size}
          onChange={(event) => onSizeChange(Number(event.target.value))}
          className="h-9 rounded-md border border-slate-300 bg-white px-2 text-sm"
        >
          {[10, 20, 50].map((option) => (
            <option key={option} value={option}>
              {option} rows
            </option>
          ))}
        </select>
        <Button
          aria-label="Previous page"
          disabled={page <= 0}
          icon={<ChevronLeft className="h-4 w-4" />}
          variant="secondary"
          onClick={() => onPageChange(page - 1)}
        />
        <Button
          aria-label="Next page"
          disabled={page + 1 >= totalPages}
          icon={<ChevronRight className="h-4 w-4" />}
          variant="secondary"
          onClick={() => onPageChange(page + 1)}
        />
      </div>
    </div>
  )
}
