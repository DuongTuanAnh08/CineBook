export type UserRole = 'guest' | 'customer' | 'admin' | 'manager'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: UserRole
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}
