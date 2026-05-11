import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { notificationsApi } from '../api/notifications.api'
import { useUiStore } from '../store/uiStore'

export function useNotifications() {
  const setNotifications = useUiStore((state) => state.setNotifications)
  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsApi.list,
    refetchInterval: 120_000,
  })

  useEffect(() => {
    if (query.data) setNotifications(query.data)
  }, [query.data, setNotifications])

  return query
}
