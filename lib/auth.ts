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

  // Método de teste simples
  async testSimpleUpload(file: File): Promise<AuthResponse> {
    try {
      const token = this.getToken()
      if (!token) {
        return {
          error: 'Usuário não autenticado',
        }
      }

      console.log('=== TESTE SIMPLES FRONTEND ===')
      console.log('Arquivo para teste:', file)
      console.log('Nome:', file.name)
      console.log('Tamanho:', file.size)
      console.log('Tipo:', file.type)

      const formData = new FormData()
      formData.append('test_file', file)
      formData.append('test_text', 'teste de texto')

      console.log('FormData construído:')
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value)
      }

      const response = await fetch(`${API_BASE_URL}/v1/test-simple-upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData,
      })

      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)
      console.log('=== FIM TESTE SIMPLES ===')

      if (!response.ok) {
        return {
          error: data.message || 'Erro no teste',
        }
      }

      return {
        message: 'Teste realizado com sucesso',
      }
    } catch (error) {
      console.error('Erro no teste simples:', error)
      return {
        error: 'Erro de conexão no teste.',
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

      // Logs para debug
      console.log('=== INÍCIO UPDATE PROFILE FRONTEND ===')
      console.log('profileData recebido:', profileData)
      console.log('Tem foto?', !!profileData.foto)
      if (profileData.foto) {
        console.log('Detalhes da foto:')
        console.log('- Nome:', profileData.foto.name)
        console.log('- Tamanho:', profileData.foto.size)
        console.log('- Tipo:', profileData.foto.type)
      }
      console.log('=== FIM LOGS FRONTEND ===')

      // Se há uma foto, usar FormData
      if (profileData.foto) {
        const formData = new FormData()
        
        console.log('Construindo FormData...')
        
        // Adicionar campos de texto
        Object.keys(profileData).forEach(key => {
          if (key === 'foto') {
            console.log('Adicionando foto ao FormData:', profileData.foto!.name)
            formData.append('foto', profileData.foto!)
          } else if (key === 'social_links') {
            // Adicionar campos de redes sociais individualmente
            if (profileData.social_links) {
              Object.keys(profileData.social_links).forEach(socialKey => {
                const value = profileData.social_links![socialKey as keyof typeof profileData.social_links]
                if (value !== undefined && value !== '') {
                  console.log(`Adicionando social_links[${socialKey}]:`, value)
                  formData.append(`social_links[${socialKey}]`, value)
                }
              })
            }
          } else {
            const value = profileData[key as keyof UpdateProfileData]
            if (value !== undefined && value !== '') {
              console.log(`Adicionando ${key}:`, value)
              formData.append(key, String(value))
            }
          }
        })

        // Log do FormData antes do envio
        console.log('FormData construído:')
        for (let [key, value] of formData.entries()) {
          console.log(`${key}:`, value)
        }

        const response = await fetch(`${API_BASE_URL}/v1/profile`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          body: formData,
        })

        console.log('Response status:', response.status)
        console.log('Response headers:', Object.fromEntries(response.headers.entries()))

        const data = await response.json()
        console.log('Response data:', data)

        if (!response.ok) {
          return {
            error: data.message || 'Erro ao atualizar perfil',
          }
        }

        return {
          message: data.message || 'Perfil atualizado com sucesso',
          avatar_url: data.avatar_url,
          avatar_thumb_url: data.avatar_thumb_url,
        }
      } else {
        // Sem foto, usar JSON normal
        console.log('Enviando dados sem foto (JSON)')
        
        const response = await fetch(`${API_BASE_URL}/v1/profile`, {
          method: 'POST',
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

  // Deleta (inativa) a conta do usuário autenticado
  async deleteAccount(): Promise<AuthResponse> {
    try {
      const token = this.getToken()
      if (!token) {
        return {
          error: 'Usuário não autenticado',
        }
      }

      const response = await fetch(`${API_BASE_URL}/v1/me`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          error: data.message || 'Erro ao remover conta',
        }
      }

      // Logout após remoção
      await this.logout()

      return {
        message: data.message || 'Conta removida com sucesso',
      }
    } catch (error) {
      console.error('Erro ao remover conta:', error)
      return {
        error: 'Erro de conexão. Tente novamente.',
      }
    }
  }
}

export const authService = new AuthService() 
