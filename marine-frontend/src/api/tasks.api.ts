import { apiClient } from './axios'
import type { ListFilters, Page, Task, TaskStatus } from '../types'

export type TaskPayload = {
  title: string
  description: string
  shipId: string
  dueDate: string
  priority: Task['priority']
}

export const tasksApi = {
  list: async (filters: ListFilters) => {
    const { data } = await apiClient.get<Page<Task>>('/api/tasks', { params: filters })
    return data
  },
  my: async (filters: ListFilters) => {
    const { data } = await apiClient.get<Page<Task> | Task[]>('/api/tasks/my', {
      params: filters,
    })
    return Array.isArray(data)
      ? { content: data, totalElements: data.length, totalPages: 1, number: 0, size: data.length }
      : data
  },
  create: async (payload: TaskPayload) => {
    const { data } = await apiClient.post<Task>('/api/tasks', payload)
    return data
  },
  updateStatus: async (id: string, status: TaskStatus) => {
    const { data } = await apiClient.put<Task>(`/api/tasks/${id}/status`, { status })
    return data
  },
  assignCrew: async (id: string, crewId: string) => {
    const { data } = await apiClient.put<Task>(`/api/tasks/${id}/assign/${crewId}`)
    return data
  },
  addNote: async (id: string, message: string) => {
    const { data } = await apiClient.post<Task>(`/api/tasks/${id}/notes`, { message })
    return data
  },
  overdue: async () => {
    const { data } = await apiClient.get<Task[]>('/api/tasks/overdue')
    return data
  },
}
