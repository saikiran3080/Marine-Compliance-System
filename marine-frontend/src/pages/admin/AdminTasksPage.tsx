import { useState } from 'react'
import { Plus } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { Loader } from '../../components/common/Loader'
import { Modal } from '../../components/common/Modal'
import { Select } from '../../components/common/Select'
import { StatusBadge } from '../../components/common/StatusBadge'
import { FilterPanel } from '../../components/forms/FilterPanel'
import { DataTable } from '../../components/tables/DataTable'
import { Pagination } from '../../components/tables/Pagination'
import { useTaskMutations, useTasks } from '../../hooks/useTasks'
import type { ListFilters, Task } from '../../types'
import { formatDate } from '../../utils/format'

const taskSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(5, 'Description is required'),
  shipId: z.coerce.number().min(1, 'Ship ID is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
})

type TaskFormInput = z.input<typeof taskSchema>
type TaskFormValues = z.output<typeof taskSchema>

export function AdminTasksPage() {
  const [filters, setFilters] = useState<ListFilters>({ page: 0, size: 10 })
  const [open, setOpen] = useState(false)
  const query = useTasks(filters)
  const mutations = useTaskMutations()
  const form = useForm<TaskFormInput, unknown, TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: { priority: 'MEDIUM' },
  })

  const columns = [
    { key: 'title', header: 'Task', render: (task: Task) => <div><p className="font-semibold text-slate-900">{task.title}</p><p className="text-xs text-slate-500">{task.description}</p></div> },
    { key: 'ship', header: 'Ship', render: (task: Task) => task.shipName ?? `Ship ${task.shipId}` },
    { key: 'due', header: 'Due', render: (task: Task) => formatDate(task.dueDate) },
    { key: 'priority', header: 'Priority', render: (task: Task) => <StatusBadge value={task.priority} /> },
    { key: 'status', header: 'Status', render: (task: Task) => <StatusBadge value={task.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      render: (task: Task) => (
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => mutations.updateStatus.mutate({ id: task.id, status: 'IN_PROGRESS' })}>Start</Button>
          <Button variant="secondary" onClick={() => mutations.updateStatus.mutate({ id: task.id, status: 'COMPLETED' })}>Complete</Button>
        </div>
      ),
    },
  ]

  const submit = (values: TaskFormValues) => {
    mutations.createTask.mutate(values, {
      onSuccess: () => {
        form.reset({ priority: 'MEDIUM' })
        setOpen(false)
      },
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-950">Maintenance Management</h2>
          <p className="text-sm text-slate-500">Create, assign, filter, and close vessel maintenance tasks.</p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => setOpen(true)}>Create task</Button>
      </div>
      <FilterPanel filters={filters} onChange={setFilters} statusOptions={['PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE'].map((value) => ({ label: value.replaceAll('_', ' '), value }))} />
      {query.isLoading ? <Loader /> : <DataTable columns={columns} data={query.data?.content ?? []} getRowKey={(task) => task.id} />}
      <Pagination page={filters.page ?? 0} size={filters.size ?? 10} total={query.data?.totalElements ?? 0} onPageChange={(page) => setFilters({ ...filters, page })} onSizeChange={(size) => setFilters({ ...filters, size, page: 0 })} />
      <Modal open={open} title="Create maintenance task" onClose={() => setOpen(false)}>
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={form.handleSubmit(submit)}>
          <Input label="Title" error={form.formState.errors.title?.message} {...form.register('title')} />
          <Input label="Ship ID" type="number" error={form.formState.errors.shipId?.message} {...form.register('shipId')} />
          <Input className="sm:col-span-2" label="Description" error={form.formState.errors.description?.message} {...form.register('description')} />
          <Input label="Due date" type="date" error={form.formState.errors.dueDate?.message} {...form.register('dueDate')} />
          <Select label="Priority" options={['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((value) => ({ label: value, value }))} error={form.formState.errors.priority?.message} {...form.register('priority')} />
          <div className="flex justify-end gap-2 sm:col-span-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={mutations.createTask.isPending}>Save task</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
