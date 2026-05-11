import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'

export function KpiCard({
  label,
  value,
  helper,
  icon,
}: {
  label: string
  value: string | number
  helper?: string
  icon: ReactNode
}) {
  return (
    <div className="data-card rounded-lg p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{value}</p>
        </div>
        <div className="rounded-md bg-harbor-50 p-2 text-harbor-600">{icon}</div>
      </div>
      {helper ? (
        <p className="mt-4 flex items-center gap-1 text-xs font-medium text-slate-500">
          <ArrowUpRight className="h-3.5 w-3.5 text-signal-green" />
          {helper}
        </p>
      ) : null}
    </div>
  )
}
