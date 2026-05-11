import { useState } from 'react'
import { Button } from '../../components/common/Button'
import { Loader } from '../../components/common/Loader'
import { StatusBadge } from '../../components/common/StatusBadge'
import { FilterPanel } from '../../components/forms/FilterPanel'
import { DataTable } from '../../components/tables/DataTable'
import { Pagination } from '../../components/tables/Pagination'
import { useDrillMutations, useMyDrills } from '../../hooks/useDrills'
import type { Drill, ListFilters } from '../../types'
import { formatDateTime } from '../../utils/format'

export function CrewDrillsPage() {
  const [filters, setFilters] = useState<ListFilters>({ page: 0, size: 10 })
  const query = useMyDrills(filters)
  const { markAttendance, completeDrill } = useDrillMutations()
  const columns = [
    { key: 'title', header: 'Drill', render: (drill: Drill) => <div><p className="font-semibold text-slate-900">{drill.title}</p><p className="text-xs text-slate-500">{drill.type}</p></div> },
    { key: 'ship', header: 'Ship', render: (drill: Drill) => drill.shipName ?? `Ship ${drill.shipId}` },
    { key: 'date', header: 'Scheduled', render: (drill: Drill) => formatDateTime(drill.scheduledAt) },
    { key: 'attendance', header: 'Attendance', render: (drill: Drill) => <StatusBadge value={drill.attendanceStatus ?? 'PENDING'} /> },
    { key: 'status', header: 'Status', render: (drill: Drill) => <StatusBadge value={drill.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      render: (drill: Drill) => (
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => markAttendance.mutate({ id: drill.id, status: 'PRESENT' })}>Present</Button>
          <Button onClick={() => completeDrill.mutate(drill.id)}>Complete</Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-950">My Safety Drills</h2>
        <p className="text-sm text-slate-500">Mark attendance and submit drill completion.</p>
      </div>
      <FilterPanel filters={filters} onChange={setFilters} statusOptions={['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'MISSED'].map((value) => ({ label: value.replaceAll('_', ' '), value }))} />
      {query.isLoading ? <Loader /> : <DataTable columns={columns} data={query.data?.content ?? []} getRowKey={(drill) => drill.id} />}
      <Pagination page={filters.page ?? 0} size={filters.size ?? 10} total={query.data?.totalElements ?? 0} onPageChange={(page) => setFilters({ ...filters, page })} onSizeChange={(size) => setFilters({ ...filters, size, page: 0 })} />
    </div>
  )
}
