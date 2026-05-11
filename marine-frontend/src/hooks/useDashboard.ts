import { useQuery } from '@tanstack/react-query'
import { complianceApi } from '../api/compliance.api'
import { dashboardApi } from '../api/dashboard.api'

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'admin'],
    queryFn: dashboardApi.admin,
  })
}

export function useCrewDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'crew'],
    queryFn: dashboardApi.crew,
  })
}

export function useComplianceDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'compliance'],
    queryFn: complianceApi.dashboard,
  })
}
