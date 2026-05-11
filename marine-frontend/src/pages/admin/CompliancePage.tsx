import { AlertTriangle, CalendarCheck, ShieldCheck, Wrench } from 'lucide-react'
import { EmptyState } from '../../components/common/EmptyState'
import { Loader } from '../../components/common/Loader'
import { KpiCard } from '../../components/dashboard/KpiCard'
import { useComplianceDashboard } from '../../hooks/useDashboard'
import { toPercent } from '../../utils/format'

export function CompliancePage() {
  const query = useComplianceDashboard()
  const data = query.data

  if (query.isLoading) return <Loader label="Loading compliance dashboard" />
  if (!data) return <EmptyState title="Compliance data unavailable" />

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <KpiCard label="Maintenance rate" value={toPercent(data.maintenanceCompletionRate)} icon={<Wrench className="h-5 w-5" />} />
        <KpiCard label="Drill participation" value={toPercent(data.drillParticipationRate)} icon={<CalendarCheck className="h-5 w-5" />} />
        <KpiCard label="Overall compliance" value={toPercent(data.overallCompliance)} icon={<ShieldCheck className="h-5 w-5" />} />
        <KpiCard label="Overdue maintenance" value={data.overdueMaintenance} icon={<AlertTriangle className="h-5 w-5" />} />
        <KpiCard label="Missed drills" value={data.missedDrills} icon={<AlertTriangle className="h-5 w-5" />} />
      </div>
      <section className="data-card rounded-lg p-5">
        <h2 className="text-base font-semibold text-slate-900">Compliance Summary</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-md border border-slate-200 p-4">
            <p className="text-sm text-slate-600">Pending Maintenance Tasks</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{data.pendingMaintenance}</p>
          </div>
          <div className="rounded-md border border-slate-200 p-4">
            <p className="text-sm text-slate-600">Overdue Maintenance Tasks</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{data.overdueMaintenance}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
