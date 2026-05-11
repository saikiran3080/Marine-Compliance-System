import type { ReactNode } from 'react'
import { Anchor } from 'lucide-react'

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#eef9fb_0%,#f7fafc_45%,#e7eef4_100%)]">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-8">
        <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <section className="hidden lg:block">
            <div className="max-w-xl">
              <div className="mb-8 inline-flex items-center gap-3 rounded-md bg-white px-4 py-3 shadow-soft">
                <Anchor className="h-6 w-6 text-harbor-600" />
                <span className="font-bold text-slate-950">Maritime Compliance System</span>
              </div>
              <h1 className="text-5xl font-bold leading-tight tracking-tight text-slate-950">
                Operational clarity for safer fleets.
              </h1>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                Track vessel maintenance, safety drills, crew actions, and compliance risk from one secure operations cockpit.
              </p>
            </div>
          </section>
          <section className="glass-panel rounded-lg border border-white/70 p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-950">{title}</h2>
              <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
            </div>
            {children}
          </section>
        </div>
      </div>
    </main>
  )
}
