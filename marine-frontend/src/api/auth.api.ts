import { apiClient } from './axios'
import type { AuthResponse, User } from '../types'

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  name: string
  email: string
  password: string
  role: 'ADMIN' | 'CREW'
}

type RawAuthResponse = Record<string, unknown>

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {}
}

function getPayload(data: unknown): Record<string, unknown> {
  const raw = asRecord(data)
  const wrappedData = asRecord(raw.data)
  return Object.keys(wrappedData).length ? wrappedData : raw
}

function normalizeRole(value: unknown): User['role'] | null {
  if (typeof value !== 'string') return null
  const role = value.replace('ROLE_', '').toUpperCase()
  return role === 'ADMIN' || role === 'CREW' ? role : null
}

function extractRole(source: Record<string, unknown>) {
  const directRole = normalizeRole(source.role ?? source.authority ?? source.userRole)
  if (directRole) return directRole

  const roles = source.roles ?? source.authorities
  if (Array.isArray(roles)) {
    for (const item of roles) {
      const itemRole = normalizeRole(
        typeof item === 'string' ? item : asRecord(item).authority ?? asRecord(item).role,
      )
      if (itemRole) return itemRole
    }
  }

  return null
}

function getToken(raw: RawAuthResponse) {
  const payload = getPayload(raw)
  const token =
    payload.token ??
    payload.jwt ??
    payload.accessToken ??
    payload.access_token ??
    payload.bearerToken

  if (typeof token !== 'string' || !token) {
    throw new Error('Login succeeded, but no JWT token was returned by the backend.')
  }

  return token
}

function normalizeUser(raw: RawAuthResponse): User | null {
  const payload = getPayload(raw)
  const nestedUser = asRecord(payload.user)
  const source = Object.keys(nestedUser).length ? nestedUser : payload
  const role = extractRole(source)

  if (!role && !source.email && !source.name && !source.id && !source.userId) return null

  const rawId = source.id ?? source.userId ?? ''

  return {
    id: String(rawId),
    name: String(source.name ?? source.fullName ?? source.username ?? source.email ?? 'Operator'),
    email: String(source.email ?? source.username ?? ''),
    role: role ?? 'CREW',
    shipId: source.shipId ? String(source.shipId) : undefined,
    rank: typeof source.rank === 'string' ? source.rank : undefined,
  }
}

function normalizeAuthResponse(data: unknown): AuthResponse {
  const raw = asRecord(data)
  return {
    token: getToken(raw),
    user: normalizeUser(raw),
  }
}

function normalizeMe(data: unknown): User {
  const user = normalizeUser(asRecord(data))
  if (!user) {
    throw new Error('Could not read the authenticated user profile from /api/auth/me.')
  }
  return user
}

export const authApi = {
  login: async (payload: LoginPayload) => {
    const { data } = await apiClient.post<unknown>('/api/auth/login', payload)
    return normalizeAuthResponse(data)
  },
  register: async (payload: RegisterPayload) => {
    const { data } = await apiClient.post<unknown>('/api/auth/register', payload)
    return normalizeAuthResponse(data)
  },
  me: async () => {
    const { data } = await apiClient.get<unknown>('/api/auth/me')
    return normalizeMe(data)
  },
}
