"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Mail, Smartphone, CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import Header from "@/components/Header"

export default function LoginPage() {
  const [step, setStep] = useState<"email" | "sms">("email")
  const [email, setEmail] = useState("")
  const [smsCode, setSmsCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!email || !email.includes("@")) {
      setError("Por favor, insira um e-mail válido")
      return
    }

    setIsLoading(true)
    
    // Simular envio do código SMS
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsLoading(false)
    setIsCodeSent(true)
    setStep("sms")
  }

  const handleSmsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!smsCode || smsCode.length !== 4) {
      setError("Por favor, insira o código de 4 dígitos")
      return
    }

    setIsLoading(true)
    
    // Simular verificação do código
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Simular sucesso (código 1234)
    if (smsCode === "1234") {
      setSuccess("Login realizado com sucesso!")
      // Aqui você redirecionaria para a página principal
      setTimeout(() => {
        window.location.href = "/"
      }, 2000)
    } else {
      setError("Código inválido. Tente novamente.")
    }
    
    setIsLoading(false)
  }

  const handleBackToEmail = () => {
    setStep("email")
    setSmsCode("")
    setError("")
    setSuccess("")
  }

  const handleResendCode = async () => {
    setIsLoading(true)
    setError("")
    
    // Simular reenvio do código
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsLoading(false)
    setSuccess("Código reenviado com sucesso!")
    
    setTimeout(() => {
      setSuccess("")
    }, 3000)
  }

  return (
    <div className="min-h-screen text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-md">
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
          
          <CardContent className="space-y-6">
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
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
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
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Verificando...
                      </>
                    ) : (
                      "Confirmar"
                    )}
                  </Button>

                  <div className="flex flex-col space-y-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleResendCode}
                      disabled={isLoading}
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                    >
                      {isLoading ? "Reenviando..." : "Reenviar código"}
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
                  <p className="text-sm text-blue-400 font-medium">Código de teste</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Para fins de demonstração, use o código: <span className="font-mono text-blue-300">1234</span>
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