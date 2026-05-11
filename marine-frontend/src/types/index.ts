export type Role = 'ADMIN' | 'CREW'

export type User = {
  id: string
  name: string
  email: string
  role: Role
  shipId?: string
  rank?: string
}

export type AuthResponse = {
  token: string
  user: User | null
}

export type Page<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE'
export type DrillStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'MISSED'
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH'
export type ShipStatus = 'ACTIVE' | 'DOCKED' | 'MAINTENANCE'
export type MaintenanceStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE'
export type DrillType = 'FIRE_DRILL' | 'ABANDON_SHIP' | 'MUSTER' | 'LIFEBOAT' | 'OTHER'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type Ship = {
  id: string
  name: string
  imoNumber: string
  type: string
  status: ShipStatus
}

export type Task = {
  id: string
  title: string
  description: string
  shipId: string
  shipName?: string
  assignedCrewId?: string
  assignedCrewName?: string
  priority: Priority
  status: MaintenanceStatus
  dueDate: string
  completedAt?: string
  overdue: boolean
  complianceImpacted?: boolean
  notes?: Note[]
}

export type Note = {
  id: string
  message: string
  crewName: string
  createdAt?: string
}

export type Drill = {
  id: string
  title: string
  type: DrillType
  shipId: string
  shipName?: string
  scheduledDate: string
  createdById?: string
  participations?: ParticipantAttendance[]
}

export type ParticipantAttendance = {
  id: string
  crewId: string
  crewName: string
  attended?: boolean
  completed?: boolean
  remarks?: string
}

export type NotificationItem = {
  id: string
  title: string
  message: string
  type: 'TASK' | 'DRILL' | 'COMPLIANCE' | 'SYSTEM'
  read: boolean
  createdAt: string
}

export type ShipRiskSummary = {
  shipId: string
  shipName: string
  overdueMaintenance: number
  missedDrills: number
  compliancePercentage: number
}

export type AdminDashboard = {
  totalShips: number
  totalCrew: number
  pendingMaintenanceCount: number
  overdueMaintenanceCount: number
  upcomingDrills: number
  missedDrills: number
  compliancePercentage: number
  highRiskShips: ShipRiskSummary[]
}

export type CrewDashboard = {
  assignedTasks: number
  pendingTasks: number
  upcomingDrills: number
  attendancePercentage: number
  notifications: NotificationItem[]
}

export type ComplianceDashboard = {
  pendingMaintenance: number
  overdueMaintenance: number
  maintenanceCompletionRate: number
  drillParticipationRate: number
  missedDrills: number
  overallCompliance: number
}

export type ListFilters = {
  page?: number
  size?: number
  search?: string
  status?: string
  shipId?: string
  date?: string
  overdue?: boolean
}
