import { AlertTriangle, CalendarCheck, ClipboardList, Ship, ShieldCheck, Users, Wrench } from 'lucide-react'
import { EmptyState } from '../../components/common/EmptyState'
import { Loader, SkeletonGrid } from '../../components/common/Loader'
import { KpiCard } from '../../components/dashboard/KpiCard'
import { useAdminDashboard, useComplianceDashboard } from '../../hooks/useDashboard'
import type { ShipRiskSummary } from '../../types'
import { toPercent } from '../../utils/format'

export function AdminDashboardPage() {
  const dashboard = useAdminDashboard()
  const compliance = useComplianceDashboard()
  const data = dashboard.data

  if (dashboard.isLoading) return <SkeletonGrid />
  if (!data) return <EmptyState title="Dashboard unavailable" description="Connect the backend API to load fleet operations." />

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <KpiCard label="Total ships" value={data.totalShips} icon={<Ship className="h-5 w-5" />} />
        <KpiCard label="Total crew" value={data.totalCrew} icon={<Users className="h-5 w-5" />} />
        <KpiCard label="Pending maintenance" value={data.pendingMaintenanceCount} icon={<ClipboardList className="h-5 w-5" />} />
        <KpiCard label="Overdue maintenance" value={data.overdueMaintenanceCount} icon={<AlertTriangle className="h-5 w-5" />} />
        <KpiCard label="Upcoming drills" value={data.upcomingDrills} icon={<CalendarCheck className="h-5 w-5" />} />
        <KpiCard label="Compliance" value={toPercent(data.compliancePercentage)} icon={<ShieldCheck className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="data-card rounded-lg p-5">
          <h2 className="text-base font-semibold text-slate-900">High-Risk Ships</h2>
          <div className="mt-4 space-y-3">
            {data.highRiskShips?.length ? (
              data.highRiskShips.map((ship: ShipRiskSummary) => (
                <div key={ship.shipId} className="rounded-md border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{ship.shipName}</p>
                      <div className="mt-2 grid grid-cols-3 gap-2 text-sm text-slate-500">
                        <span>Overdue: {ship.overdueMaintenance}</span>
                        <span>Missed drills: {ship.missedDrills}</span>
                        <span>Compliance: {toPercent(ship.compliancePercentage)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState title="All clear" description="No high-risk ships detected." />
            )}
          </div>
        </section>
        <section className="data-card rounded-lg p-5">
          <h2 className="text-base font-semibold text-slate-900">Compliance Monitor</h2>
          {compliance.isLoading ? (
            <Loader label="Loading compliance" />
          ) : (
            <div className="mt-4 grid gap-3">
              <KpiCard label="Maintenance rate" value={toPercent(compliance.data?.maintenanceCompletionRate)} icon={<Wrench className="h-5 w-5" />} />
              <KpiCard label="Drill participation" value={toPercent(compliance.data?.drillParticipationRate)} icon={<CalendarCheck className="h-5 w-5" />} />
              <KpiCard label="Overall compliance" value={toPercent(compliance.data?.overallCompliance)} icon={<ShieldCheck className="h-5 w-5" />} />
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
