import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Loader } from '../components/common/Loader'
import { adminNavigation, crewNavigation } from '../constants/navigation'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { ProtectedRoute, RoleProtectedRoute } from './ProtectedRoute'

const LoginPage = lazy(() =>
  import('../pages/auth/LoginPage').then((module) => ({ default: module.LoginPage })),
)
const RegisterPage = lazy(() =>
  import('../pages/auth/RegisterPage').then((module) => ({ default: module.RegisterPage })),
)
const AdminDashboardPage = lazy(() =>
  import('../pages/admin/AdminDashboardPage').then((module) => ({
    default: module.AdminDashboardPage,
  })),
)
const AdminTasksPage = lazy(() =>
  import('../pages/admin/AdminTasksPage').then((module) => ({ default: module.AdminTasksPage })),
)
const AdminDrillsPage = lazy(() =>
  import('../pages/admin/AdminDrillsPage').then((module) => ({ default: module.AdminDrillsPage })),
)
const ShipsPage = lazy(() =>
  import('../pages/admin/ShipsPage').then((module) => ({ default: module.ShipsPage })),
)
const CompliancePage = lazy(() =>
  import('../pages/admin/CompliancePage').then((module) => ({ default: module.CompliancePage })),
)
const CrewDashboardPage = lazy(() =>
  import('../pages/crew/CrewDashboardPage').then((module) => ({
    default: module.CrewDashboardPage,
  })),
)
const CrewTasksPage = lazy(() =>
  import('../pages/crew/CrewTasksPage').then((module) => ({ default: module.CrewTasksPage })),
)
const CrewDrillsPage = lazy(() =>
  import('../pages/crew/CrewDrillsPage').then((module) => ({ default: module.CrewDrillsPage })),
)

export function AppRoutes() {
  return (
    <Suspense fallback={<Loader label="Loading maritime workspace" />}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute role="ADMIN">
                <DashboardLayout navigation={adminNavigation} title="Admin Operations" />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="tasks" element={<AdminTasksPage />} />
          <Route path="drills" element={<AdminDrillsPage />} />
          <Route path="ships" element={<ShipsPage />} />
          <Route path="compliance" element={<CompliancePage />} />
        </Route>
        <Route
          path="/crew"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute role="CREW">
                <DashboardLayout navigation={crewNavigation} title="Crew Workspace" />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/crew/dashboard" replace />} />
          <Route path="dashboard" element={<CrewDashboardPage />} />
          <Route path="tasks" element={<CrewTasksPage />} />
          <Route path="drills" element={<CrewDrillsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  )
}
