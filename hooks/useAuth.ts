import { useState, useEffect } from 'react'
import { authService, User, UpdateProfileData } from '@/lib/auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = authService.isAuthenticated()
        setIsAuthenticated(authenticated)

        if (authenticated) {
          const currentUser = await authService.getCurrentUser()
          setUser(currentUser)
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, pin: string) => {
    const response = await authService.verifyAuth(email, pin)
    
    if (response.token) {
      setIsAuthenticated(true)
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
    }
    
    return response
  }

  const logout = async () => {
    await authService.logout()
    setIsAuthenticated(false)
    setUser(null)
  }

  const initAuth = async (email: string) => {
    return await authService.initAuth(email)
  }

  const updateProfile = async (profileData: UpdateProfileData) => {
    const response = await authService.updateProfile(profileData)
    
    if (response.message) {
      // Recarregar dados do usuário após atualização
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
    }
    
    return response
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    initAuth,
    updateProfile,
  }
} 