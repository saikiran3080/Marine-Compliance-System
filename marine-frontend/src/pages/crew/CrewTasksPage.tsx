import { useState } from 'react'
import { Button } from '../../components/common/Button'
import { Loader } from '../../components/common/Loader'
import { StatusBadge } from '../../components/common/StatusBadge'
import { FilterPanel } from '../../components/forms/FilterPanel'
import { DataTable } from '../../components/tables/DataTable'
import { Pagination } from '../../components/tables/Pagination'
import { useMyTasks, useTaskMutations } from '../../hooks/useTasks'
import type { ListFilters, Task } from '../../types'
import { formatDate } from '../../utils/format'

export function CrewTasksPage() {
  const [filters, setFilters] = useState<ListFilters>({ page: 0, size: 10 })
  const query = useMyTasks(filters)
  const { updateStatus } = useTaskMutations()
  const columns = [
    { key: 'title', header: 'Task', render: (task: Task) => <div><p className="font-semibold text-slate-900">{task.title}</p><p className="text-xs text-slate-500">{task.description}</p></div> },
    { key: 'ship', header: 'Ship', render: (task: Task) => task.shipName ?? `Ship ${task.shipId}` },
    { key: 'due', header: 'Due', render: (task: Task) => formatDate(task.dueDate) },
    { key: 'status', header: 'Status', render: (task: Task) => <StatusBadge value={task.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      render: (task: Task) => (
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => updateStatus.mutate({ id: task.id, status: 'IN_PROGRESS' })}>Start</Button>
          <Button onClick={() => updateStatus.mutate({ id: task.id, status: 'COMPLETED' })}>Complete</Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-950">My Maintenance Tasks</h2>
        <p className="text-sm text-slate-500">Crew users only see tasks assigned to their account.</p>
      </div>
      <FilterPanel filters={filters} onChange={setFilters} statusOptions={['PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE'].map((value) => ({ label: value.replaceAll('_', ' '), value }))} />
      {query.isLoading ? <Loader /> : <DataTable columns={columns} data={query.data?.content ?? []} getRowKey={(task) => task.id} />}
      <Pagination page={filters.page ?? 0} size={filters.size ?? 10} total={query.data?.totalElements ?? 0} onPageChange={(page) => setFilters({ ...filters, page })} onSizeChange={(size) => setFilters({ ...filters, size, page: 0 })} />
    </div>
  )
}
