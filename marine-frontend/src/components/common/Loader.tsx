import { Loader2 } from 'lucide-react'

export function Loader({ label = 'Loading operations data' }: { label?: string }) {
  return (
    <div className="flex min-h-52 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white">
      <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin text-harbor-600" />
        {label}
      </div>
    </div>
  )
}

export function SkeletonGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="h-32 animate-pulse rounded-lg bg-slate-200" />
      ))}
    </div>
  )
}
