import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { api } from '../api/client.ts'
import type { AuthResponse } from '../types/index.ts'

interface UserInfo {
  token: string
  user_id: string
  email: string
  name: string
}

interface AuthContextValue {
  user: UserInfo | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function loadUser(): UserInfo | null {
  try {
    const raw = localStorage.getItem('user')
    return raw ? (JSON.parse(raw) as UserInfo) : null
  } catch {
    return null
  }
}

function saveUser(u: UserInfo) {
  localStorage.setItem('user', JSON.stringify(u))
}

function clearUser() {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(() => loadUser())

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post<AuthResponse>('/auth/login', { email, password })
    const info: UserInfo = {
      token: res.token,
      user_id: res.user_id,
      email: res.email,
      name: res.name,
    }
    localStorage.setItem('token', res.token)
    saveUser(info)
    setUser(info)
  }, [])

  const register = useCallback(async (email: string, password: string, name: string) => {
    const res = await api.post<AuthResponse>('/auth/register', { email, password, name })
    const info: UserInfo = {
      token: res.token,
      user_id: res.user_id,
      email: res.email,
      name: res.name,
    }
    localStorage.setItem('token', res.token)
    saveUser(info)
    setUser(info)
  }, [])

  const logout = useCallback(() => {
    clearUser()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
