import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { tasksApi, type TaskPayload } from '../api/tasks.api'
import type { ListFilters, TaskStatus } from '../types'

export function useTasks(filters: ListFilters) {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => tasksApi.list(filters),
  })
}

export function useMyTasks(filters: ListFilters) {
  return useQuery({
    queryKey: ['tasks', 'my', filters],
    queryFn: () => tasksApi.my(filters),
  })
}

export function useTaskMutations() {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['tasks'] })

  const createTask = useMutation({
    mutationFn: (payload: TaskPayload) => tasksApi.create(payload),
    onSuccess: () => {
      toast.success('Task created')
      invalidate()
    },
  })

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      tasksApi.updateStatus(id, status),
    onSuccess: () => {
      toast.success('Task status updated')
      invalidate()
    },
  })

  const addNote = useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) => tasksApi.addNote(id, message),
    onSuccess: () => {
      toast.success('Note added')
      invalidate()
    },
  })

  return { createTask, updateStatus, addNote }
}
