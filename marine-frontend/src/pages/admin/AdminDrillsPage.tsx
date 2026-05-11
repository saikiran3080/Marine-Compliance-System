import { useState } from 'react'
import { Plus } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { Loader } from '../../components/common/Loader'
import { Modal } from '../../components/common/Modal'
import { StatusBadge } from '../../components/common/StatusBadge'
import { FilterPanel } from '../../components/forms/FilterPanel'
import { DataTable } from '../../components/tables/DataTable'
import { Pagination } from '../../components/tables/Pagination'
import { useDrillMutations, useDrills } from '../../hooks/useDrills'
import type { Drill, ListFilters } from '../../types'
import { formatDateTime } from '../../utils/format'

const drillSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  type: z.string().min(2, 'Type is required'),
  shipId: z.coerce.number().min(1, 'Ship ID is required'),
  scheduledAt: z.string().min(1, 'Schedule date is required'),
})

type DrillFormInput = z.input<typeof drillSchema>
type DrillFormValues = z.output<typeof drillSchema>

export function AdminDrillsPage() {
  const [filters, setFilters] = useState<ListFilters>({ page: 0, size: 10 })
  const [open, setOpen] = useState(false)
  const query = useDrills(filters)
  const { createDrill } = useDrillMutations()
  const form = useForm<DrillFormInput, unknown, DrillFormValues>({
    resolver: zodResolver(drillSchema),
  })
  const columns = [
    { key: 'title', header: 'Drill', render: (drill: Drill) => <div><p className="font-semibold text-slate-900">{drill.title}</p><p className="text-xs text-slate-500">{drill.type}</p></div> },
    { key: 'ship', header: 'Ship', render: (drill: Drill) => drill.shipName ?? `Ship ${drill.shipId}` },
    { key: 'date', header: 'Scheduled', render: (drill: Drill) => formatDateTime(drill.scheduledAt) },
    { key: 'status', header: 'Status', render: (drill: Drill) => <StatusBadge value={drill.status} /> },
    { key: 'crew', header: 'Participants', render: (drill: Drill) => drill.participants?.length ?? 0 },
  ]

  const submit = (values: DrillFormValues) => {
    createDrill.mutate(values, {
      onSuccess: () => {
        form.reset()
        setOpen(false)
      },
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-950">Safety Drill Management</h2>
          <p className="text-sm text-slate-500">Schedule drills and monitor participation by ship.</p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => setOpen(true)}>Schedule drill</Button>
      </div>
      <FilterPanel filters={filters} onChange={setFilters} statusOptions={['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'MISSED'].map((value) => ({ label: value.replaceAll('_', ' '), value }))} />
      {query.isLoading ? <Loader /> : <DataTable columns={columns} data={query.data?.content ?? []} getRowKey={(drill) => drill.id} />}
      <Pagination page={filters.page ?? 0} size={filters.size ?? 10} total={query.data?.totalElements ?? 0} onPageChange={(page) => setFilters({ ...filters, page })} onSizeChange={(size) => setFilters({ ...filters, size, page: 0 })} />
      <Modal open={open} title="Schedule drill" onClose={() => setOpen(false)}>
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={form.handleSubmit(submit)}>
          <Input label="Title" error={form.formState.errors.title?.message} {...form.register('title')} />
          <Input label="Type" placeholder="Fire, abandon ship, man overboard" error={form.formState.errors.type?.message} {...form.register('type')} />
          <Input label="Ship ID" type="number" error={form.formState.errors.shipId?.message} {...form.register('shipId')} />
          <Input label="Scheduled at" type="datetime-local" error={form.formState.errors.scheduledAt?.message} {...form.register('scheduledAt')} />
          <div className="flex justify-end gap-2 sm:col-span-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={createDrill.isPending}>Save drill</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
