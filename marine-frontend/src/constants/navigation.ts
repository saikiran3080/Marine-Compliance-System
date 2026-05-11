import {
  BarChart3,
  ClipboardCheck,
  Gauge,
  LifeBuoy,
  ShipWheel,
  Wrench,
} from 'lucide-react'

export const adminNavigation = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: Gauge },
  { label: 'Ships', href: '/admin/ships', icon: ShipWheel },
  { label: 'Maintenance', href: '/admin/tasks', icon: Wrench },
  { label: 'Drills', href: '/admin/drills', icon: LifeBuoy },
  { label: 'Compliance', href: '/admin/compliance', icon: ClipboardCheck },
]

export const crewNavigation = [
  { label: 'Dashboard', href: '/crew/dashboard', icon: BarChart3 },
  { label: 'My Tasks', href: '/crew/tasks', icon: Wrench },
  { label: 'My Drills', href: '/crew/drills', icon: LifeBuoy },
]
