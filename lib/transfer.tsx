"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Chrome,
  Github,
  Linkedin,
  CheckCircle,
  AlertCircle,
  Shield,
} from "lucide-react"

export default function LoginPage() {
  const [step, setStep] = useState<"email" | "twofa" | "password" | "success">("email")
  const [email, setEmail] = useState("")
  const [twoFACode, setTwoFACode] = useState(["", "", "", ""])
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [resendTimer, setResendTimer] = useState(0)

  // Timer para reenvio do código 2FA
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError("Por favor, digite seu e-mail")
      return
    }

    setIsLoading(true)
    setError("")

    // Simular envio do código 2FA
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    setStep("twofa")
    setResendTimer(60) // 60 segundos para reenvio
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

    // Simular verificação do código 2FA
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    setStep("password")
  }

  const handleResendCode = async () => {
    setIsLoading(true)
    setError("")

    // Simular reenvio do código
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    setResendTimer(60)
    setTwoFACode(["", "", "", ""])

    // Focus no primeiro campo
    const firstInput = document.getElementById("twofa-0")
    firstInput?.focus()
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) {
      setError("Por favor, digite sua senha")
      return
    }

    setIsLoading(true)
    setError("")

    // Simular login
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsLoading(false)
    setStep("success")

    // Redirecionar após sucesso
    setTimeout(() => {
      window.location.href = "/perfil"
    }, 2000)
  }

  const handleSocialLogin = (provider: string) => {
    console.log(`Login com ${provider}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1c] via-[#0d1326] to-[#1a1f2e] relative overflow-hidden">
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

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6 md:p-8">
        <div className="flex items-center space-x-3">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-sm opacity-70 animate-pulse-glow" />
            <div className="relative w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
              <div className="w-7 h-7 bg-[#0a0f1c] rounded-full flex items-center justify-center">
                <div className="w-3.5 h-3.5 bg-white rounded-full" />
              </div>
            </div>
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">CORPLINK</span>
        </div>

        <Button
          variant="outline"
          className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300"
        >
          Faça Parte
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-4">
        <div className="w-full max-w-md">
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

                  <div className="relative">
                    <Separator className="bg-white/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-gradient-to-br from-[#1a2332] to-[#131b2c] px-3 text-sm text-gray-400">
                        ou continue com
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {step === "twofa" && (
                <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-500">
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
                    <p className="text-gray-400">Digite o código de 4 dígitos enviado para</p>
                    <p className="text-blue-400 font-medium">{email}</p>
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
                        onClick={() => setStep("email")}
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

              {step === "password" && (
                <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-500">
                  <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold text-white">Digite sua senha</h1>
                    <p className="text-gray-400">
                      Para <span className="text-blue-400">{email}</span>
                    </p>
                  </div>

                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-300 font-medium">
                        Senha
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Digite sua senha"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10 bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="flex items-center space-x-2 text-red-400 text-sm animate-in fade-in-0 slide-in-from-top-2 duration-300">
                        <AlertCircle className="h-4 w-4" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <button
                        type="button"
                        onClick={() => setStep("twofa")}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        ← Voltar
                      </button>
                      <button type="button" className="text-blue-400 hover:text-blue-300 transition-colors">
                        Esqueci minha senha
                      </button>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading || !password}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          <span>Entrando...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>Entrar</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      )}
                    </Button>
                  </form>
                </div>
              )}

              {step === "success" && (
                <div className="space-y-6 text-center animate-in fade-in-0 zoom-in-95 duration-500">
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
                      <div className="relative bg-green-500/10 backdrop-blur-sm border border-green-500/20 rounded-full p-4">
                        <CheckCircle className="h-12 w-12 text-green-400" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-white">Login realizado!</h1>
                    <p className="text-gray-400">Redirecionando para seu perfil...</p>
                  </div>

                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-4">
            <p className="text-gray-400 text-sm">
              Não tem uma conta?{" "}
              <button className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                Faça sua Inscrição
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  )
}
