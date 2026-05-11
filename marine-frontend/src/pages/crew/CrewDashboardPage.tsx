import { Bell, CalendarCheck, ClipboardList, Gauge } from 'lucide-react'
import { EmptyState } from '../../components/common/EmptyState'
import { Loader } from '../../components/common/Loader'
import { KpiCard } from '../../components/dashboard/KpiCard'
import { useCrewDashboard } from '../../hooks/useDashboard'
import type { NotificationItem } from '../../types'
import { formatDateTime, toPercent } from '../../utils/format'

export function CrewDashboardPage() {
  const query = useCrewDashboard()
  const data = query.data

  if (query.isLoading) return <Loader label="Loading crew dashboard" />
  if (!data) return <EmptyState title="Crew dashboard unavailable" />

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Assigned tasks" value={data.assignedTasks} icon={<ClipboardList className="h-5 w-5" />} />
        <KpiCard label="Pending tasks" value={data.pendingTasks} icon={<Gauge className="h-5 w-5" />} />
        <KpiCard label="Upcoming drills" value={data.upcomingDrills} icon={<CalendarCheck className="h-5 w-5" />} />
        <KpiCard label="Attendance rate" value={toPercent(data.attendancePercentage)} icon={<Bell className="h-5 w-5" />} />
      </div>
      <section className="data-card rounded-lg p-5">
        <h2 className="text-base font-semibold text-slate-900">My Notifications</h2>
        <div className="mt-4 space-y-3">
          {data.notifications?.length ? (
            data.notifications.map((item: NotificationItem) => (
              <div key={item.id} className="rounded-md border border-slate-200 p-4">
                <p className="font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-500">{item.message}</p>
                <p className="mt-2 text-xs text-slate-400">{formatDateTime(item.createdAt)}</p>
              </div>
            ))
          ) : (
            <EmptyState title="No crew notifications" description="Assigned operational alerts will appear here." />
          )}
        </div>
      </section>
    </div>
  )
}
