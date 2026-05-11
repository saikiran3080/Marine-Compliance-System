import { apiClient } from './axios'
import type { NotificationItem } from '../types'

export const notificationsApi = {
  list: async () => {
    const { data } = await apiClient.get<NotificationItem[]>('/api/notifications')
    return data
  },
}
