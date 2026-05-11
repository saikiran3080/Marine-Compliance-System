import { NavLink } from 'react-router-dom'
import { Anchor, X } from 'lucide-react'
import type { ComponentType } from 'react'
import { useUiStore } from '../../store/uiStore'
import { Button } from '../common/Button'

type NavItem = {
  label: string
  href: string
  icon: ComponentType<{ className?: string }>
}

export function Sidebar({ navigation, title }: { navigation: NavItem[]; title: string }) {
  const sidebarOpen = useUiStore((state) => state.sidebarOpen)
  const closeSidebar = useUiStore((state) => state.closeSidebar)

  return (
    <>
      {sidebarOpen ? (
        <div className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={closeSidebar} />
      ) : null}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white transition lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-harbor-600 p-2 text-white">
              <Anchor className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-950">{title}</p>
              <p className="text-xs text-slate-500">Compliance System</p>
            </div>
          </div>
          <Button
            aria-label="Close navigation"
            className="lg:hidden"
            icon={<X className="h-4 w-4" />}
            variant="ghost"
            onClick={closeSidebar}
          />
        </div>
        <nav className="space-y-1 p-4">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-harbor-50 text-harbor-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
