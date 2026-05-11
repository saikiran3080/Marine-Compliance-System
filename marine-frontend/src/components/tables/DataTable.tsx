import type { ReactNode } from 'react'
import { EmptyState } from '../common/EmptyState'

export type Column<T> = {
  key: string
  header: string
  render: (row: T) => ReactNode
}

export function DataTable<T>({
  columns,
  data,
  getRowKey,
}: {
  columns: Column<T>[]
  data: T[]
  getRowKey: (row: T) => string | number
}) {
  if (!data.length) return <EmptyState />

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white scrollbar-thin">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 font-semibold text-slate-600">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row) => (
            <tr key={getRowKey(row)} className="hover:bg-slate-50">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 text-slate-700">
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
