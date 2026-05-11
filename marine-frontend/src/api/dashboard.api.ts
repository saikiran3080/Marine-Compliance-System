import { apiClient } from './axios'
// import type { AdminDashboard, CrewDashboard } from '../types'

export const dashboardApi = {
  admin: async () => {
    // const { data } = await apiClient.get<AdminDashboard>('/api/dashboard/admin')
    // return data
    const response = await apiClient.get('/api/dashboard/admin')
    return response.data.data ?? response.data
  },
  crew: async () => {
    // const { data } = await apiClient.get<CrewDashboard>('/api/dashboard/crew')
    const response = await apiClient.get('/api/dashboard/crew')
    return response.data.data ?? response.data
  },
}
