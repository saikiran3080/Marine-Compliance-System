import { useQuery } from '@tanstack/react-query'
import { shipsApi } from '../../api/ships.api'
import type { Ship } from '../../types'
import { Loader } from '../common/Loader'
import { Modal } from '../common/Modal'
import { StatusBadge } from '../common/StatusBadge'

type ShipDetailModalProps = {
  open: boolean
  shipId: string | null
  onClose: () => void
}

export function ShipDetailModal({ open, shipId, onClose }: ShipDetailModalProps) {
  const query = useQuery({
    queryKey: ['ship', shipId],
    queryFn: () => shipsApi.detail(shipId!),
    enabled: open && !!shipId,
  })

  const ship = query.data as Ship | undefined

  return (
    <Modal open={open} title={ship?.name || 'Ship Details'} onClose={onClose}>
      {query.isLoading ? (
        <Loader label="Loading ship details" />
      ) : ship ? (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase text-slate-600">Ship Name</p>
              <p className="mt-2 text-lg font-bold text-slate-900">{ship.name}</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase text-slate-600">IMO Number</p>
              <p className="mt-2 text-lg font-bold text-slate-900">{ship.imoNumber}</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase text-slate-600">Ship Type</p>
              <p className="mt-2 text-lg font-bold text-slate-900">{ship.type}</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase text-slate-600">Status</p>
              <div className="mt-2">
                <StatusBadge value={ship.status} />
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-600">Ship ID (UUID)</p>
            <p className="mt-2 font-mono text-sm text-slate-700">{ship.id}</p>
          </div>
        </div>
      ) : null}
    </Modal>
  )
}
