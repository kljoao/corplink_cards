const API_BASE_URL = process.env.NEXT_PUBLIC_API || 'https://admin.corplink.co/api'

export interface AuthResponse {
  message?: string
  token?: string
  error?: string
  avatar_url?: string
  avatar_thumb_url?: string
}

export interface User {
  id: string
  name?: string
  firstname?: string
  lastname?: string
  email: string
  avatar?: string
  info?: {
    company?: string
    occupation?: string
    sector?: string
    phone?: string
    phone_prefix?: string
    social_links?: {
      instagram?: string
      linkedin?: string
      whatsapp?: '0' | '1'
    }
    revenue?: string
    birthday?: string
    numid?: string
    created_at?: string
    updated_at?: string
  }
}

export interface UpdateProfileData {
  fullname?: string
  phone_prefix?: string
  phone?: string
  company?: string
  sector?: string
  revenue?: string
  birthday?: string
  occupation?: string
  social_links?: {
    instagram?: string
    linkedin?: string
    whatsapp?: '0' | '1'
  }
  foto?: File
}

class AuthService {
  private token: string | null = null

  // Função para definir cookie
  private setCookie(name: string, value: string, days: number = 7) {
    if (typeof window === 'undefined') return
    
    const expires = new Date()
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000))
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`
  }

  // Função para obter cookie
  private getCookie(name: string): string | null {
    if (typeof window === 'undefined') return null
    
    const nameEQ = name + "="
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  }

  // Função para remover cookie
  private removeCookie(name: string) {
    if (typeof window === 'undefined') return
    
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
  }

  // Inicia o processo de autenticação 2FA
  async initAuth(email: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/auth/init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          error: data.message || 'Erro ao iniciar autenticação',
        }
      }

      return {
        message: data.message || 'Código enviado com sucesso',
      }
    } catch (error) {
      console.error('Erro ao iniciar autenticação:', error)
      return {
        error: 'Erro de conexão. Tente novamente.',
      }
    }
  }

  // Verifica o código 2FA e completa o login
  async verifyAuth(email: string, pin: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, pin }),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          error: data.error || data.message || 'Código inválido',
        }
      }

      // Salva o token em cookie e localStorage
      this.token = data.token
      this.setCookie('auth_token', data.token, 7) // 7 dias
      this.setCookie('user_email', email, 7)
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('user_email', email)
      }

      return {
        token: data.token,
        message: 'Login realizado com sucesso',
      }
    } catch (error) {
      console.error('Erro ao verificar código:', error)
      return {
        error: 'Erro de conexão. Tente novamente.',
      }
    }
  }

  // Atualiza o perfil do usuário
  async updateProfile(profileData: UpdateProfileData): Promise<AuthResponse> {
    try {
      const token = this.getToken()
      if (!token) {
        return {
          error: 'Usuário não autenticado',
        }
      }

      // Se há uma foto, usar FormData
      if (profileData.foto) {
        const formData = new FormData()
        
        // Adicionar campos de texto
        Object.keys(profileData).forEach(key => {
          if (key === 'foto') {
            formData.append('foto', profileData.foto!)
          } else if (key === 'social_links') {
            // Adicionar campos de redes sociais individualmente
            if (profileData.social_links) {
              Object.keys(profileData.social_links).forEach(socialKey => {
                const value = profileData.social_links![socialKey as keyof typeof profileData.social_links]
                if (value !== undefined && value !== '') {
                  formData.append(`social_links[${socialKey}]`, value)
                }
              })
            }
          } else {
            const value = profileData[key as keyof UpdateProfileData]
            if (value !== undefined && value !== '') {
              formData.append(key, String(value))
            }
          }
        })

        const response = await fetch(`${API_BASE_URL}/v1/profile`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          body: formData,
        })

        const data = await response.json()

        if (!response.ok) {
          return {
            error: data.message || 'Erro ao atualizar perfil',
          }
        }

        return {
          message: data.message || 'Perfil atualizado com sucesso',
        }
      } else {
        // Sem foto, usar JSON normal
        const response = await fetch(`${API_BASE_URL}/v1/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(profileData),
        })

        const data = await response.json()

        if (!response.ok) {
          return {
            error: data.message || 'Erro ao atualizar perfil',
          }
        }

        return {
          message: data.message || 'Perfil atualizado com sucesso',
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      return {
        error: 'Erro de conexão. Tente novamente.',
      }
    }
  }

  // Faz logout
  async logout(): Promise<void> {
    try {
      const token = this.getToken()
      if (token) {
        await fetch(`${API_BASE_URL}/v1/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        })
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    } finally {
      this.token = null
      this.removeCookie('auth_token')
      this.removeCookie('user_email')
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_email')
      }
    }
  }

  // Verifica se o usuário está autenticado
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false
    
    const token = this.getCookie('auth_token') || localStorage.getItem('auth_token')
    return !!token
  }

  // Obtém o token atual
  getToken(): string | null {
    if (typeof window === 'undefined') return null
    
    return this.getCookie('auth_token') || localStorage.getItem('auth_token') || this.token
  }

  // Obtém o email do usuário
  getUserEmail(): string | null {
    if (typeof window === 'undefined') return null
    
    return this.getCookie('user_email') || localStorage.getItem('user_email')
  }

  // Busca dados do usuário autenticado
  async getCurrentUser(): Promise<User | null> {
    try {
      const token = this.getToken()
      if (!token) return null

      const response = await fetch(`${API_BASE_URL}/v1/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Falha ao buscar dados do usuário')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error)
      return null
    }
  }
}

export const authService = new AuthService() 