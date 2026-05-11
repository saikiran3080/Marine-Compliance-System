import { useState ,useMemo } from 'react'
import { Bell } from 'lucide-react'
import { useNotifications } from '../../hooks/useNotifications'
import { useUiStore } from '../../store/uiStore'
import { formatDateTime } from '../../utils/format'
import { Button } from '../common/Button'

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  useNotifications()
  // const notifications = useUiStore((state) => state.notifications)
  const notifications = useUiStore((state) => state.notifications) ?? [];
  const markRead = useUiStore((state) => state.markNotificationRead)
  // const unread = notifications.filter((item) => !item.read).length
  const unread = useMemo(() => 
  notifications?.filter?.((item) => !item.read).length ?? 0, 
  [notifications]
);

  return (
    <div className="relative">
      <Button
        aria-label="Notifications"
        variant="ghost"
        icon={<Bell className="h-5 w-5" />}
        onClick={() => setOpen((value) => !value)}
      />
      {unread ? (
        <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-signal-red px-1 text-[11px] font-bold text-white">
          {unread}
        </span>
      ) : null}
      {open ? (
        <div className="absolute right-0 z-30 mt-2 w-80 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
          <div className="border-b border-slate-200 px-4 py-3">
            <p className="font-semibold text-slate-900">Notifications</p>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {Array.isArray(notifications) && notifications.length ? (
              notifications.map((item) => (
                <button
                  key={item.id}
                  className="block w-full border-b border-slate-100 px-4 py-3 text-left hover:bg-slate-50"
                  onClick={() => markRead(item.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    {!item.read ? <span className="mt-1 h-2 w-2 rounded-full bg-harbor-600" /> : null}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{item.message}</p>
                  <p className="mt-2 text-[11px] font-medium text-slate-400">
                    {formatDateTime(item.createdAt)}
                  </p>
                </button>
              ))
            ) : (
              <p className="px-4 py-6 text-sm text-slate-500">No alerts waiting.</p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
