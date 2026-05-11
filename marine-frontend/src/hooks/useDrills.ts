import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { drillsApi, type DrillPayload } from '../api/drills.api'
import type { ListFilters } from '../types'

export function useDrills(filters: ListFilters) {
  return useQuery({
    queryKey: ['drills', filters],
    queryFn: () => drillsApi.list(filters),
  })
}

export function useMyDrills(filters: ListFilters) {
  return useQuery({
    queryKey: ['drills', 'my', filters],
    queryFn: () => drillsApi.my(filters),
  })
}

export function useDrillMutations() {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['drills'] })

  const createDrill = useMutation({
    mutationFn: (payload: DrillPayload) => drillsApi.create(payload),
    onSuccess: () => {
      toast.success('Drill scheduled')
      invalidate()
    },
  })

  const markAttendance = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'PRESENT' | 'ABSENT' }) =>
      drillsApi.attendance(id, status),
    onSuccess: () => {
      toast.success('Attendance updated')
      invalidate()
    },
  })

  const completeDrill = useMutation({
    mutationFn: (id: string) => drillsApi.completion(id),
    onSuccess: () => {
      toast.success('Drill completed')
      invalidate()
    },
  })

  return { createDrill, markAttendance, completeDrill }
}
