import { LogOut, Menu, UserCircle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useUiStore } from '../../store/uiStore'
import { Button } from '../common/Button'
import { NotificationBell } from '../notifications/NotificationBell'

export function Header({ title }: { title: string }) {
  const { user, logout } = useAuth()
  const toggleSidebar = useUiStore((state) => state.toggleSidebar)

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur lg:px-6">
      <div className="flex items-center gap-3">
        <Button
          aria-label="Open navigation"
          className="lg:hidden"
          icon={<Menu className="h-5 w-5" />}
          variant="ghost"
          onClick={toggleSidebar}
        />
        <div>
          <h1 className="text-lg font-bold text-slate-950">{title}</h1>
          <p className="hidden text-xs text-slate-500 sm:block">
            Live maintenance, drills, and compliance operations
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <NotificationBell />
        <div className="hidden items-center gap-2 rounded-md border border-slate-200 px-3 py-2 md:flex">
          <UserCircle className="h-5 w-5 text-slate-500" />
          <div className="text-left">
            <p className="text-xs font-semibold text-slate-900">{user?.name ?? 'Operator'}</p>
            <p className="text-[11px] text-slate-500">{user?.role ?? 'CREW'}</p>
          </div>
        </div>
        <Button
          aria-label="Logout"
          icon={<LogOut className="h-4 w-4" />}
          variant="secondary"
          onClick={logout}
        />
      </div>
    </header>
  )
}
