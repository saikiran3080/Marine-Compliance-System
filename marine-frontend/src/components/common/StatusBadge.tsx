import type { DrillStatus, RiskLevel, TaskStatus } from '../../types'

const styles: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 ring-amber-200',
  IN_PROGRESS: 'bg-sky-50 text-sky-700 ring-sky-200',
  COMPLETED: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  OVERDUE: 'bg-red-50 text-red-700 ring-red-200',
  SCHEDULED: 'bg-blue-50 text-blue-700 ring-blue-200',
  MISSED: 'bg-red-50 text-red-700 ring-red-200',
  HIGH: 'bg-red-50 text-red-700 ring-red-200',
  MEDIUM: 'bg-amber-50 text-amber-700 ring-amber-200',
  LOW: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
}

export function StatusBadge({ value }: { value: TaskStatus | DrillStatus | RiskLevel | string }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${styles[value] ?? 'bg-slate-100 text-slate-700 ring-slate-200'}`}
    >
      {value.replaceAll('_', ' ')}
    </span>
  )
}
