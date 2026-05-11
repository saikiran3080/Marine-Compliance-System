import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { authApi, type LoginPayload, type RegisterPayload } from '../api/auth.api'
import { useAuthStore } from '../store/authStore'

export function useAuth() {
  const navigate = useNavigate()
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const setSession = useAuthStore((state) => state.setSession)
  const logoutStore = useAuthStore((state) => state.logout)

  const login = useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: async ({ token: nextToken, user: loginUser }) => {
      setSession(nextToken, loginUser)
      const nextUser = await authApi.me().catch(() => loginUser)
      if (!nextUser) {
        toast.error('Login succeeded, but the user role could not be loaded.')
        return
      }
      setSession(nextToken, nextUser)
      toast.success('Welcome aboard')
      navigate(nextUser.role === 'ADMIN' ? '/admin/dashboard' : '/crew/dashboard')
    },
  })

  const register = useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: async ({ token: nextToken, user: registerUser }) => {
      setSession(nextToken, registerUser)
      const nextUser = await authApi.me().catch(() => registerUser)
      if (!nextUser) {
        toast.error('Account created, but the user role could not be loaded.')
        return
      }
      setSession(nextToken, nextUser)
      toast.success('Account created')
      navigate(nextUser.role === 'ADMIN' ? '/admin/dashboard' : '/crew/dashboard')
    },
  })

  const logout = () => {
    logoutStore()
    navigate('/login')
  }

  return { token, user, login, register, logout, isHydrating: false }
}
