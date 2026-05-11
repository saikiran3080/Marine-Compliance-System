import { apiClient } from './axios'
import type { Ship } from '../types'

export type ShipPayload = {
  name: string
  imoNumber: string
  type: string
  status: Ship['status']
}

export const shipsApi = {
  list: async () => {
    const response = await apiClient.get('/api/ships')
    return response.data.data ?? response.data
  },
  detail: async (id: string) => {
    const response = await apiClient.get(`/api/ships/${id}`)
    return response.data.data ?? response.data
  },
  create: async (payload: ShipPayload) => {
    const response = await apiClient.post('/api/ships', payload)
    return response.data.data ?? response.data
  },
}
