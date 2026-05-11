import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { shipsApi, type ShipPayload } from '../../api/ships.api'
import type { Ship } from '../../types'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { Modal } from '../common/Modal'
import { Select } from '../common/Select'

type ShipRegistrationModalProps = {
  open: boolean
  onClose: () => void
}

const shipStatuses = [
  { label: 'ACTIVE', value: 'ACTIVE' },
  { label: 'DOCKED', value: 'DOCKED' },
  { label: 'MAINTENANCE', value: 'MAINTENANCE' },
]

const shipTypes = [
  { label: 'Cargo Ship', value: 'Cargo Ship' },
  { label: 'Container Ship', value: 'Container Ship' },
  { label: 'Tanker', value: 'Tanker' },
  { label: 'Bulk Carrier', value: 'Bulk Carrier' },
  { label: 'General Cargo', value: 'General Cargo' },
  { label: 'Other', value: 'Other' },
]

export function ShipRegistrationModal({ open, onClose }: ShipRegistrationModalProps) {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState<ShipPayload>({
    name: '',
    imoNumber: '',
    type: '',
    status: 'ACTIVE' as Ship['status'],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const createShip = useMutation({
    mutationFn: (payload: ShipPayload) => shipsApi.create(payload),
    onSuccess: () => {
      toast.success('Ship registered successfully')
      queryClient.invalidateQueries({ queryKey: ['ships'] })
      handleClose()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message ?? 'Failed to register ship')
    },
  })

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Ship name is required'
    if (!formData.imoNumber.trim()) newErrors.imoNumber = 'IMO number is required'
    if (!formData.type.trim()) newErrors.type = 'Ship type is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      createShip.mutate(formData)
    }
  }

  const handleClose = () => {
    setFormData({ name: '', imoNumber: '', type: '', status: 'ACTIVE' as Ship['status'] })
    setErrors({})
    onClose()
  }

  return (
    <Modal open={open} title="Register New Ship" onClose={handleClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Ship Name"
          placeholder="e.g., MV Oceanic Star"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
        />
        <Input
          label="IMO Number"
          placeholder="e.g., 1234567"
          value={formData.imoNumber}
          onChange={(e) => setFormData({ ...formData, imoNumber: e.target.value })}
          error={errors.imoNumber}
        />
        <Select
          label="Ship Type"
          value={formData.type}
          options={[{ label: 'Select a type', value: '' }, ...shipTypes]}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          error={errors.type}
        />
        <Select
          label="Status"
          value={formData.status}
          options={shipStatuses}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as Ship['status'] })}
        />
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={createShip.isPending}>
            Register Ship
          </Button>
        </div>
      </form>
    </Modal>
  )
}
