"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Mail,
  Smartphone,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Header from "@/components/Header"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { Toaster } from "sonner"

export default function LoginPage() {
  const [step, setStep] = useState<"email" | "twofa" | "success">("email")
  const [email, setEmail] = useState("")
  const [twoFACode, setTwoFACode] = useState(["", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [resendTimer, setResendTimer] = useState(0)
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading, login, initAuth } = useAuth()

  // Verificar se já está autenticado
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/perfil")
    }
  }, [isAuthenticated, authLoading, router])

  // Countdown para reenvio do 2FA Teste
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

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
        setStep("twofa")
        setSuccess(response.message || "Código enviado com sucesso!")
        setResendTimer(60)
        setTimeout(() => setSuccess(""), 3000)
      }
    } catch (error) {
      setError("Erro inesperado. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTwoFAChange = (index: number, value: string) => {
    if (value.length > 1) return // Apenas um dígito por campo
    const newCode = [...twoFACode]
    newCode[index] = value
    setTwoFACode(newCode)
    // Auto-focus no próximo campo
    if (value && index < 3) {
      const nextInput = document.getElementById(`twofa-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleTwoFAKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !twoFACode[index] && index > 0) {
      const prevInput = document.getElementById(`twofa-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleTwoFASubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = twoFACode.join("")
    if (code.length !== 4) {
      setError("Por favor, digite o código completo")
      return
    }
    setIsLoading(true)
    setError("")
    try {
      const response = await login(email, code)
      if (response.error) {
        setError(response.error)
      } else {
        setSuccess("Login realizado com sucesso!")
        setStep("success")
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
    setTwoFACode(["", "", "", ""])
    setError("")
    setSuccess("")
    setIsCodeSent(false)
    setResendTimer(0)
  }

  const handleResendCode = async () => {
    if (resendTimer > 0) return
    setIsLoading(true)
    setError("")
    try {
      const response = await initAuth(email)
      if (response.error) {
        setError(response.error)
      } else {
        setSuccess("Código reenviado com sucesso!")
        setResendTimer(60)
        setTimeout(() => setSuccess(""), 3000)
        setTwoFACode(["", "", "", ""])
        // Focus no primeiro campo
        const firstInput = document.getElementById("twofa-0")
        firstInput?.focus()
      }
    } catch (error) {
      setError("Erro ao reenviar código. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br bg-[#000015] relative overflow-hidden text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
            linear-gradient(45deg, transparent 30%, rgba(59, 130, 246, 0.05) 50%, transparent 70%)
          `,
          }}
        />
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" className="animate-pulse">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(59, 130, 246, 0.1)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>
      <Header/>
      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-4">
        <div className={`w-full max-w-md ${step === "twofa" ? "mt-[150px]" : ""}`}>
          {/* Login Card */}
          <div className="relative">
            {/* Glass Effect Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl" />
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur-xl opacity-50" />
            {/* Card Content */}
            <div className="relative p-8 space-y-6">
              {step === "email" && (
                <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                  <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold text-white">Entrar na sua conta</h1>
                    <p className="text-gray-400">Digite seu e-mail para continuar</p>
                  </div>
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300 font-medium">
                        E-mail
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    {error && (
                      <div className="flex items-center space-x-2 text-red-400 text-sm animate-in fade-in-0 slide-in-from-top-2 duration-300">
                        <AlertCircle className="h-4 w-4" />
                        <span>{error}</span>
                      </div>
                    )}
                    <Button
                      type="submit"
                      disabled={isLoading || !email}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          <span>Enviando código...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>Próximo</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      )}
                    </Button>
                  </form>
                </div>
              )}
              {step === "twofa" && (
                <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                  <div className="text-center space-y-3">
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg animate-pulse" />
                        <div className="relative bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-full p-3">
                          <Shield className="h-8 w-8 text-blue-400" />
                        </div>
                      </div>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Código de verificação</h1>
                    <p className="text-gray-400">Digite o código de 4 dígitos enviado para seu dispositivo cadastrado</p>
                  </div>
                  <form onSubmit={handleTwoFASubmit} className="space-y-6">
                    <div className="space-y-4">
                      <Label className="text-gray-300 font-medium text-center block">Código de verificação</Label>
                      <div className="flex justify-center space-x-3">
                        {twoFACode.map((digit, index) => (
                          <Input
                            key={index}
                            id={`twofa-${index}`}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleTwoFAChange(index, e.target.value.replace(/\D/g, ""))}
                            onKeyDown={(e) => handleTwoFAKeyDown(index, e)}
                            className="w-14 h-14 text-center text-2xl font-bold bg-white/5 backdrop-blur-sm border-white/20 text-white focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 rounded-xl"
                            disabled={isLoading}
                          />
                        ))}
                      </div>
                    </div>
                    {error && (
                      <div className="flex items-center justify-center space-x-2 text-red-400 text-sm animate-in fade-in-0 slide-in-from-top-2 duration-300">
                        <AlertCircle className="h-4 w-4" />
                        <span>{error}</span>
                      </div>
                    )}
                    <div className="text-center space-y-3">
                      <p className="text-gray-400 text-sm">Não recebeu o código?</p>
                      {resendTimer > 0 ? (
                        <p className="text-gray-500 text-sm">
                          Reenviar em <span className="font-mono font-bold text-blue-400">{resendTimer}s</span>
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendCode}
                          disabled={isLoading}
                          className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          {isLoading ? "Reenviando..." : "Reenviar código"}
                        </button>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <button
                        type="button"
                        onClick={handleBackToEmail}
                        className="text-gray-400 hover:text-white transition-colors"
                        disabled={isLoading}
                      >
                        ← Voltar
                      </button>
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading || twoFACode.join("").length !== 4}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          <span>Verificando...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>Verificar código</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      )}
                    </Button>
                  </form>
                </div>
              )}
              {step === "success" && (
                <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                  <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold text-white">Login realizado com sucesso!</h1>
                    <p className="text-gray-400">Você será redirecionado para a página de perfil em instantes.</p>
                  </div>
                  <Button
                    type="button"
                    onClick={handleBackToEmail}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center space-x-2">
                      <span>Voltar para o login</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Toaster/ >
    </div>
  )
} 
