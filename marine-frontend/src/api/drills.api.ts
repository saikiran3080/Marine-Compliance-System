import { apiClient } from './axios'
import type { Drill, ListFilters, Page } from '../types'

export type DrillPayload = {
  title: string
  type: string
  shipId: string
  scheduledAt: string
}

export const drillsApi = {
  list: async (filters: ListFilters) => {
    const { data } = await apiClient.get<Page<Drill>>('/api/drills', { params: filters })
    return data
  },
  my: async (filters: ListFilters) => {
    const { data } = await apiClient.get<Page<Drill> | Drill[]>('/api/drills/my', {
      params: filters,
    })
    return Array.isArray(data)
      ? { content: data, totalElements: data.length, totalPages: 1, number: 0, size: data.length }
      : data
  },
  create: async (payload: DrillPayload) => {
    const { data } = await apiClient.post<Drill>('/api/drills', payload)
    return data
  },
  attendance: async (id: string, attendanceStatus: 'PRESENT' | 'ABSENT') => {
    const { data } = await apiClient.put<Drill>(`/api/drills/${id}/attendance`, {
      attendanceStatus,
    })
    return data
  },
  completion: async (id: string) => {
    const { data } = await apiClient.put<Drill>(`/api/drills/${id}/completion`)
    return data
  },
}
