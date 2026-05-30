import { createContext, useContext, useState, useCallback } from 'react'
import { jwtDecode } from 'jwt-decode'

const AuthContext = createContext(undefined)

// Mock users for demonstration
const mockUsers = {
  guest: null,
  user: {
    id: '1',
    name: 'Nguyễn Văn A',
    email: 'user@cinebook.vn',
    phone: '0901234567',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
    role: 'user',
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

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  })

  const login = useCallback(async (email, _password) => {
    setAuthState(prev => ({ ...prev, isLoading: true }))
    await new Promise(resolve => setTimeout(resolve, 1000))
    const isAdmin = email.includes('admin') || email.includes('manager')
    const user = isAdmin ? mockUsers.admin : mockUsers.user
    setAuthState({ user, isAuthenticated: true, isLoading: false })
  }, [])

  const register = useCallback(async (name, email, _phone, _password) => {
    setAuthState(prev => ({ ...prev, isLoading: true }))
    await new Promise(resolve => setTimeout(resolve, 1000))
    const user = {
      id: Date.now().toString(),
      name,
      email,
      role: 'user',
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

  const loginWithGoogle = useCallback(async (credential) => {
    setAuthState(prev => ({ ...prev, isLoading: true }))
    try {
      const decoded = jwtDecode(credential)
      const user = {
        id: decoded.sub, // Google unique ID
        name: decoded.name,
        email: decoded.email,
        avatar: decoded.picture,
        role: 'user', // Default to user
        provider: 'google'
      }
      setAuthState({ user, isAuthenticated: true, isLoading: false })
    } catch (error) {
      console.error("Google Login Error:", error);
      setAuthState({ user: null, isAuthenticated: false, isLoading: false })
    }
  }, [])

  // For demo purposes - switch between user roles
  const setMockUser = useCallback((role) => {
    const user = mockUsers[role]
    setAuthState({
      user,
      isAuthenticated: role !== 'guest',
      isLoading: false,
    })
  }, [])

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout, setMockUser, loginWithGoogle }}>
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
