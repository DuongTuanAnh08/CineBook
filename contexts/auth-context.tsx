"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User, AuthState, UserRole } from '@/types/auth'

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, phone: string, password: string) => Promise<void>
  logout: () => void
  setMockUser: (role: UserRole) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demonstration
const mockUsers: Record<UserRole, User | null> = {
  guest: null,
  customer: {
    id: '1',
    name: 'Nguyễn Văn A',
    email: 'customer@cinebook.vn',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=customer',
    role: 'customer',
  },
  admin: {
    id: '2',
    name: 'Admin CineBook',
    email: 'admin@cinebook.vn',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    role: 'admin',
  },
  manager: {
    id: '3',
    name: 'Manager CineBook',
    email: 'manager@cinebook.vn',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=manager',
    role: 'manager',
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  })

  const login = useCallback(async (email: string, _password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }))
    await new Promise(resolve => setTimeout(resolve, 1000))
    const isAdmin = email.includes('admin') || email.includes('manager')
    const user = isAdmin ? mockUsers.admin : mockUsers.customer
    setAuthState({ user, isAuthenticated: true, isLoading: false })
  }, [])

  const register = useCallback(async (name: string, email: string, _phone: string, _password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }))
    await new Promise(resolve => setTimeout(resolve, 1000))
    const user: User = {
      id: Date.now().toString(),
      name,
      email,
      role: 'customer',
    }
    setAuthState({ user, isAuthenticated: true, isLoading: false })
  }, [])

  const logout = useCallback(() => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
  }, [])

  // For demo purposes - switch between user roles
  const setMockUser = useCallback((role: UserRole) => {
    const user = mockUsers[role]
    setAuthState({
      user,
      isAuthenticated: role !== 'guest',
      isLoading: false,
    })
  }, [])

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout, setMockUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
