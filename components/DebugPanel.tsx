"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { authService } from '@/lib/auth'
import { useAuth } from '@/hooks/useAuth'

export default function DebugPanel() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { user, isAuthenticated } = useAuth()

  const testAuth = async () => {
    setIsLoading(true)
    try {
      const token = authService.getToken()
      const isAuth = authService.isAuthenticated()
      const email = authService.getUserEmail()
      
      setDebugInfo({
        token: token ? `${token.substring(0, 20)}...` : 'Nenhum',
        isAuthenticated: isAuth,
        email,
        user: user,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      setDebugInfo({ error: error instanceof Error ? error.message : 'Erro desconhecido' })
    } finally {
      setIsLoading(false)
    }
  }

  const testMeEndpoint = async () => {
    setIsLoading(true)
    try {
      const userData = await authService.getCurrentUser()
      setDebugInfo({
        meEndpoint: userData,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      setDebugInfo({ error: error instanceof Error ? error.message : 'Erro desconhecido' })
    } finally {
      setIsLoading(false)
    }
  }

  const showUserData = () => {
    const fullName = [user?.firstname, user?.lastname].filter(Boolean).join(' ')
    
    // Função para converter revenue
    const convertRevenue = (revenue: string) => {
      switch (revenue) {
        case "-10MM": return "Até 10 milhões"
        case "10MM-30MM": return "De 10 a 30 milhões"
        case "30MM-50MM": return "De 30 a 50 milhões"
        case "+50MM": return "Mais de 50 milhões"
        default: return revenue
      }
    }
    
    setDebugInfo({
      userData: {
        name: fullName || user?.name || 'N/A',
        firstname: user?.firstname || 'N/A',
        lastname: user?.lastname || 'N/A',
        email: typeof user?.email,
        revenue: {
          original: user?.info?.revenue || 'N/A',
          converted: user?.info?.revenue ? convertRevenue(user.info.revenue) : 'N/A'
        },
        info: user?.info,
        timestamp: new Date().toISOString()
      }
    })
  }

  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 bg-gray-900 border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-gray-300 flex items-center justify-between">
          Debug Panel
          <Badge variant={isAuthenticated ? "default" : "destructive"} className="text-xs">
            {isAuthenticated ? "Auth" : "No Auth"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" onClick={testAuth} disabled={isLoading}>
            Test Auth
          </Button>
          <Button size="sm" onClick={testMeEndpoint} disabled={isLoading}>
            Test /me
          </Button>
          <Button size="sm" onClick={showUserData} disabled={isLoading}>
            User Data
          </Button>
        </div>
        
        {debugInfo && (
          <div className="text-xs bg-gray-800 p-2 rounded border border-gray-700 max-h-40 overflow-y-auto">
            <pre className="text-gray-300">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 