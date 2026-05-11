import { Outlet } from 'react-router-dom'
import type { ComponentType } from 'react'
import { Header } from '../components/layout/Header'
import { Sidebar } from '../components/layout/Sidebar'

type NavItem = {
  label: string
  href: string
  icon: ComponentType<{ className?: string }>
}

export function DashboardLayout({
  navigation,
  title,
}: {
  navigation: NavItem[]
  title: string
}) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        <Sidebar navigation={navigation} title={title} />
        <div className="min-w-0 flex-1">
          <Header title={title} />
          <main className="p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
