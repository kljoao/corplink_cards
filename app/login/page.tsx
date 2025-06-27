"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Mail, Smartphone, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import Header from "@/components/Header"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [step, setStep] = useState<"email" | "sms">("email")
  const [email, setEmail] = useState("")
  const [smsCode, setSmsCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [countdown, setCountdown] = useState(0)
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading, login, initAuth } = useAuth()

  // Verificar se já está autenticado
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/perfil")
    }
  }, [isAuthenticated, authLoading, router])

  // Countdown para reenvio
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!email || !email.includes("@")) {
      setError("Por favor, insira um e-mail válido")
      return
    }

    setIsLoading(true)
    
    try {
      const response = await initAuth(email)
      
      if (response.error) {
        setError(response.error)
      } else {
        setIsCodeSent(true)
        setStep("sms")
        setSuccess(response.message || "Código enviado com sucesso!")
        setCountdown(60) // 60 segundos para reenvio
        
        setTimeout(() => {
          setSuccess("")
        }, 3000)
      }
    } catch (error) {
      setError("Erro inesperado. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSmsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!smsCode || smsCode.length !== 4) {
      setError("Por favor, insira o código de 4 dígitos")
      return
    }

    setIsLoading(true)
    
    try {
      const response = await login(email, smsCode)
      
      if (response.error) {
        setError(response.error)
      } else {
        setSuccess("Login realizado com sucesso!")
        setTimeout(() => {
          router.push("/perfil")
        }, 1500)
      }
    } catch (error) {
      setError("Erro inesperado. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToEmail = () => {
    setStep("email")
    setSmsCode("")
    setError("")
    setSuccess("")
    setIsCodeSent(false)
    setCountdown(0)
  }

  const handleResendCode = async () => {
    if (countdown > 0) return
    
    setIsLoading(true)
    setError("")
    
    try {
      const response = await initAuth(email)
      
      if (response.error) {
        setError(response.error)
      } else {
        setSuccess("Código reenviado com sucesso!")
        setCountdown(60)
        
        setTimeout(() => {
          setSuccess("")
        }, 3000)
      }
    } catch (error) {
      setError("Erro ao reenviar código. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  // Mostrar loading enquanto verifica autenticação
  if (authLoading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white">
      <Header />
      
      <main className="container mx-auto px-4 pt-[150px] max-w-md">
        <Card className="bg-gradient-to-br from-[#1a2332] to-[#131b2c] border-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-400">
              {step === "email" ? "Entrar na sua conta" : "Confirmar código"}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {step === "email" 
                ? "Digite seu e-mail para continuar" 
                : "Digite o código enviado para seu telefone"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {step === "email" ? (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300 font-medium">
                    E-mail
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="bg-[#0d1326] border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500/20 pl-10"
                      disabled={isLoading}
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center space-x-2 text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading || !email}
                  className={cn(
                    "w-full relative overflow-hidden transition-all duration-300",
                    email && !isLoading
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                      : "bg-gray-800 text-gray-400"
                  )}
                >
                  {isLoading ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 animate-pulse"></div>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Enviando código...
                    </>
                  ) : (
                    "Próximo"
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSmsSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="smsCode" className="text-gray-300 font-medium">
                    Código de verificação
                  </Label>
                  <div className="relative">
                    <Input
                      id="smsCode"
                      type="text"
                      value={smsCode}
                      onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="0000"
                      maxLength={4}
                      className="bg-[#0d1326] border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500/20 pl-10 text-center text-lg tracking-widest"
                      disabled={isLoading}
                    />
                    <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  </div>
                  <p className="text-xs text-gray-500">
                    Código enviado para o telefone cadastrado
                  </p>
                </div>

                {error && (
                  <div className="flex items-center space-x-2 text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="flex items-center space-x-2 text-green-400 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    <span>{success}</span>
                  </div>
                )}

                <div className="space-y-3">
                  <Button
                    type="submit"
                    disabled={isLoading || smsCode.length !== 4}
                    className={cn(
                      "w-full relative overflow-hidden transition-all duration-300",
                      smsCode.length === 4 && !isLoading
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                        : "bg-gray-800 text-gray-400"
                    )}
                  >
                    {isLoading ? (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 animate-pulse"></div>
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        Verificando...
                      </>
                    ) : (
                      "Confirmar"
                    )}
                  </Button>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleResendCode}
                      disabled={isLoading || countdown > 0}
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                    >
                      {isLoading ? (
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      ) : countdown > 0 ? (
                        `${countdown}s`
                      ) : (
                        "Reenviar código"
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleBackToEmail}
                      disabled={isLoading}
                      className="text-gray-400 hover:text-gray-300 hover:bg-gray-800/20"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Voltar
                    </Button>
                  </div>
                </div>
              </form>
            )}

            {step === "sms" && (
              <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 rounded-lg p-4 border border-blue-900/30">
                <div className="text-center">
                  <p className="text-sm text-blue-400 font-medium">Verificação em duas etapas</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Um código de verificação foi enviado para o telefone cadastrado em sua conta.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
} 