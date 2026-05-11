import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { shipsApi } from '../../api/ships.api'
import { ShipDetailModal } from '../../components/modals/ShipDetailModal'
import { ShipRegistrationModal } from '../../components/modals/ShipRegistrationModal'
import { Button } from '../../components/common/Button'
import { EmptyState } from '../../components/common/EmptyState'
import { Loader } from '../../components/common/Loader'
import { StatusBadge } from '../../components/common/StatusBadge'
import { DataTable } from '../../components/tables/DataTable'
import type { Ship } from '../../types'

export function ShipsPage() {
  const [registerModalOpen, setRegisterModalOpen] = useState(false)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedShipId, setSelectedShipId] = useState<string | null>(null)

  const query = useQuery({ queryKey: ['ships'], queryFn: shipsApi.list })

  const handleViewDetails = (shipId: string) => {
    setSelectedShipId(shipId)
    setDetailModalOpen(true)
  }

  const columns = [
    { key: 'name', header: 'Ship', render: (ship: Ship) => <span className="font-semibold text-slate-900">{ship.name}</span> },
    { key: 'imoNumber', header: 'IMO', render: (ship: Ship) => ship.imoNumber },
    { key: 'type', header: 'Type', render: (ship: Ship) => ship.type },
    { key: 'status', header: 'Status', render: (ship: Ship) => <StatusBadge value={ship.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      render: (ship: Ship) => (
        <button
          onClick={() => handleViewDetails(ship.id)}
          className="text-sm font-semibold text-harbor-600 hover:text-harbor-700 hover:underline"
        >
          View Details
        </button>
      ),
    },
  ]

  if (query.isLoading) return <Loader label="Loading ships" />
  if (!query.data) return <EmptyState title="No ship registry loaded" />

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Fleet Registry</h2>
            <p className="text-sm text-slate-500">Manage all registered vessels and their operational status.</p>
          </div>
          <Button icon={<Plus className="h-4 w-4" />} onClick={() => setRegisterModalOpen(true)}>
            Register Ship
          </Button>
        </div>
        <DataTable columns={columns} data={query.data} getRowKey={(ship) => ship.id} />
      </div>

      <ShipRegistrationModal open={registerModalOpen} onClose={() => setRegisterModalOpen(false)} />
      <ShipDetailModal open={detailModalOpen} shipId={selectedShipId} onClose={() => setDetailModalOpen(false)} />
    </>
  )
}
