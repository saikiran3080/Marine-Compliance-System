import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Navigate, useLocation } from 'react-router-dom'
import type { Role } from '../types'
import { authApi } from '../api/auth.api'
import { Loader } from '../components/common/Loader'
import { useAuthStore } from '../store/authStore'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const logout = useAuthStore((state) => state.logout)
  const location = useLocation()
  const profileQuery = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.me,
    enabled: Boolean(token && !user),
    retry: false,
  })

  useEffect(() => {
    if (profileQuery.data) setUser(profileQuery.data)
  }, [profileQuery.data, setUser])

  useEffect(() => {
    if (profileQuery.isError) logout()
  }, [logout, profileQuery.isError])

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!user && profileQuery.isLoading) {
    return <Loader label="Restoring your secure session" />
  }

  if (!user && profileQuery.isError) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export function RoleProtectedRoute({
  role,
  children,
}: {
  role: Role
  children: ReactNode
}) {
  const user = useAuthStore((state) => state.user)

  if (!user) {
    return <Loader label="Loading user permissions" />
  }

  if (user?.role !== role) {
    return <Navigate to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/crew/dashboard'} replace />
  }

  return children
}
