import { create } from 'zustand'
import type { ListFilters, NotificationItem } from '../types'

type UiState = {
  sidebarOpen: boolean
  notifications: NotificationItem[]
  filters: ListFilters
  toggleSidebar: () => void
  closeSidebar: () => void
  setNotifications: (notifications: NotificationItem[]) => void
  markNotificationRead: (id: string) => void
  setFilters: (filters: ListFilters) => void
  resetFilters: () => void
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: false,
  notifications: [],
  filters: { page: 0, size: 10 },
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),
  setNotifications: (notifications) => set({ notifications }),
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((item) =>
        item.id === id ? { ...item, read: true } : item,
      ),
    })),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  resetFilters: () => set({ filters: { page: 0, size: 10 } }),
}))
