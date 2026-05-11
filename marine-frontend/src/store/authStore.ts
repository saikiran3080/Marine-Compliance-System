import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Role, User } from '../types'

type AuthState = {
  token: string | null
  user: User | null
  setSession: (token: string, user: User | null) => void
  setUser: (user: User) => void
  logout: () => void
  isAuthenticated: () => boolean
  role: () => Role | null
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setSession: (token, user) => set({ token, user }),
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null }),
      isAuthenticated: () => Boolean(get().token),
      role: () => get().user?.role ?? null,
    }),
    { name: 'maritime-auth' },
  ),
)
