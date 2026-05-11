import { apiClient } from './axios'
// import type { ComplianceDashboard } from '../types'

export const complianceApi = {
  dashboard: async () => {
    const response = await apiClient.get('/api/compliance/dashboard')
    return response.data.data ?? response.data
  },
  ship: async (id: string) => {
    const response = await apiClient.get(`/api/compliance/ship/${id}`)
    return response.data.data ?? response.data
  },
}
