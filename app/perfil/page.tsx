"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Camera,
  Instagram,
  Linkedin,
  Save,
  User,
  Lock,
  Building,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  ChevronRight,
  Check,
  AlertCircle,
  Info,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Header from "@/components/Header"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { UpdateProfileData } from "@/lib/auth"
import DebugPanel from "@/components/DebugPanel"

const segmentosEmpresa = [
  "Agricultura",
  "Pecuária",
  "Indústria",
  "Construção Civil",
  "Comércio",
  "Serviços",
  "Tecnologia da Informação",
  "Saúde",
  "Educação",
  "Turismo",
  "Transportes e Logística",
  "Energia",
  "Setor Financeiro",
  "Setor Imobiliário",
  "Comunicação",
  "Setor Alimentício",
  "Setor Automotivo",
  "Indústria Química",
  "Setor Farmacêutico",
  "Moda e Vestuário",
  "Entretenimento e Lazer",
  "Mineração",
  "Meio Ambiente",
  "Segurança",
]

const faturamentoOptions = ["Até 10 milhões", "De 10 a 30 milhões", "De 30 a 50 milhões", "Mais de 50 milhões"]

export default function PerfilPage() {
  const [profileData, setProfileData] = useState({
    foto: "/placeholder.svg?height=200&width=200",
    nomeCompleto: "João Silva Santos",
    email: "joao.silva@empresa.com.br",
    telefone: "(21) 99999-9999",
    dataNascimento: "1985-03-15",
    cpfCnpj: "123.456.789-00",
    nomeEmpresa: "Tech Solutions Ltda",
    segmentoEmpresa: "Tecnologia da Informação",
    faturamentoAnual: "De 10 a 30 milhões",
    occupation: "Diretor Executivo",
    instagram: "@techsolutions",
    linkedin: "linkedin.com/company/techsolutions",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [activeTab, setActiveTab] = useState("pessoal")
  const [showSuccessIndicator, setShowSuccessIndicator] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const router = useRouter()
  const { user, isLoading: authLoading, logout, updateProfile } = useAuth()

  // Verificar autenticação e carregar dados do usuário
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }

    if (user) {
      // Construir nome completo a partir de firstname e lastname
      const fullName = [user.firstname, user.lastname].filter(Boolean).join(' ')
      
      // Função para formatar telefone com máscara
      const formatPhone = (phone: string | number) => {
        const cleanPhone = phone.toString().replace(/\D/g, '');
        if (cleanPhone.length < 10) return cleanPhone;

        const ddd = cleanPhone.slice(0, 2);
        const rest = cleanPhone.slice(2);

        if (rest.length === 8) {
          // Fixo: (21) 3333-4444
          return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
        } else if (rest.length === 9) {
          // Celular: (21) 9 9999-9999
          return `(${ddd}) ${rest.slice(0, 1)} ${rest.slice(1, 5)}-${rest.slice(5)}`;
        } else {
          return `(${ddd}) ${rest}`;
        }
      }
      
      // Atualizar dados do perfil com informações reais do usuário
      setProfileData(prev => ({
        ...prev,
        nomeCompleto: fullName || user.name || prev.nomeCompleto,
        email: user.email,
        foto: user.avatar || "/placeholder.svg?height=200&width=200",
        telefone: user.info?.phone
          ? formatPhone(user.info.phone)
          : prev.telefone,
        dataNascimento: user.info?.birthday || prev.dataNascimento,
        nomeEmpresa: user.info?.company || prev.nomeEmpresa,
        segmentoEmpresa: user.info?.sector || prev.segmentoEmpresa,
        faturamentoAnual: user.info?.revenue ? convertRevenueToFaturamento(user.info.revenue) : prev.faturamentoAnual,
        occupation: user.info?.occupation || prev.occupation,
        instagram: user.info?.social_links?.instagram ? `@${user.info.social_links.instagram}` : prev.instagram,
        linkedin: user.info?.social_links?.linkedin || prev.linkedin,
      }))
    }
  }, [user, authLoading, router])

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
      // Forçar redirecionamento mesmo com erro
      router.push("/login")
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
    setIsDirty(true)
    setError("")
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileData((prev) => ({
          ...prev,
          foto: e.target?.result as string,
        }))
        setIsDirty(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileData((prev) => ({
          ...prev,
          foto: e.target?.result as string,
        }))
        setIsDirty(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError("")
    
    try {
      // Preparar dados para envio usando a função utilitária
      const updateData = prepareProfileData()

      console.log('Dados sendo enviados:', updateData) // Debug

      const response = await updateProfile(updateData)
      
      if (response.error) {
        setError(response.error)
      } else {
        setIsDirty(false)
        setShowSuccessIndicator(true)
        setTimeout(() => {
          setShowSuccessIndicator(false)
        }, 3000)
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      setError("Erro inesperado ao salvar. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  // Formatar data para exibição
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR")
  }

  // Função para converter revenue da API para faturamento anual
  const convertRevenueToFaturamento = (revenue: string): string => {
    switch (revenue) {
      case "-10MM":
        return "Até 10 milhões"
      case "10MM-30MM":
        return "De 10 a 30 milhões"
      case "30MM-50MM":
        return "De 30 a 50 milhões"
      case "+50MM":
        return "Mais de 50 milhões"
      default:
        return "Até 10 milhões" // valor padrão
    }
  }

  // Função para converter faturamento anual para revenue da API
  const convertFaturamentoToRevenue = (faturamento: string): string => {
    switch (faturamento) {
      case "Até 10 milhões":
        return "-10MM"
      case "De 10 a 30 milhões":
        return "10MM-30MM"
      case "De 30 a 50 milhões":
        return "30MM-50MM"
      case "Mais de 50 milhões":
        return "+50MM"
      default:
        return "-10MM" // valor padrão
    }
  }

  // Função para validar data de nascimento
  const validateBirthDate = (dateString: string): { isValid: boolean; error?: string } => {
    const date = new Date(dateString)
    const today = new Date()
    const age = today.getFullYear() - date.getFullYear()
    const monthDiff = today.getMonth() - date.getMonth()
    
    // Ajustar idade se ainda não fez aniversário este ano
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate()) 
      ? age - 1 
      : age

    if (actualAge < 16) {
      return { isValid: false, error: "Você deve ter pelo menos 16 anos" }
    }
    
    if (actualAge > 95) {
      return { isValid: false, error: "Data de nascimento inválida" }
    }

    if (date > today) {
      return { isValid: false, error: "Data de nascimento não pode ser no futuro" }
    }

    return { isValid: true }
  }

  // Função para formatar telefone com máscara
  const formatPhoneInput = (value: string): string => {
    const numbers = value.replace(/\D/g, '')
    
    if (numbers.length <= 2) {
      return `(${numbers}`
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
    } else {
      // Celular: (DDD) x xxxx-xxxx
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 3)} ${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
    }
  }

  // Função para extrair DDD e telefone da máscara
  const extractPhoneData = (phoneWithMask: string): { ddd: string; phone: string } => {
    const numbers = phoneWithMask.replace(/\D/g, '')
    const ddd = numbers.slice(0, 2)
    const phone = numbers.slice(2)
    
    return { ddd, phone }
  }

  // Função para validar e limpar dados do perfil
  const prepareProfileData = (): UpdateProfileData => {
    const updateData: UpdateProfileData = {
      fullname: String(profileData.nomeCompleto || "").trim(),
      company: String(profileData.nomeEmpresa || "").trim(),
      sector: String(profileData.segmentoEmpresa || "").trim(),
      revenue: convertFaturamentoToRevenue(profileData.faturamentoAnual),
      occupation: String(profileData.occupation || "").trim(),
      social_links: {
        instagram: typeof profileData.instagram === 'string' 
          ? profileData.instagram.replace("@", "").trim() 
          : "",
        linkedin: String(profileData.linkedin || "").trim(),
      },
    }

    // Processar telefone se for uma string válida
    if (typeof profileData.telefone === 'string' && profileData.telefone.trim()) {
      const { ddd, phone } = extractPhoneData(profileData.telefone)
      if (ddd && phone) {
        updateData.phone_prefix = `+55`
        updateData.phone = ddd + phone
      }
    }

    // Processar data de nascimento se for uma string válida
    if (typeof profileData.dataNascimento === 'string' && profileData.dataNascimento.trim()) {
      const validation = validateBirthDate(profileData.dataNascimento)
      if (validation.isValid) {
        updateData.birthday = profileData.dataNascimento
      } else {
        throw new Error(validation.error)
      }
    }

    // Remover campos vazios para não sobrescrever dados existentes
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof UpdateProfileData] === "") {
        delete updateData[key as keyof UpdateProfileData]
      }
    })

    if (updateData.social_links) {
      Object.keys(updateData.social_links).forEach(key => {
        if (updateData.social_links![key as keyof typeof updateData.social_links] === "") {
          delete updateData.social_links![key as keyof typeof updateData.social_links]
        }
      })
      
      // Se social_links ficou vazio, removê-lo
      if (Object.keys(updateData.social_links).length === 0) {
        delete updateData.social_links
      }
    }

    return updateData
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0f1c] to-[#0d1326] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b bg-[#000015] text-white">
      {/* Header */}
      <Header />

      <main className="container mx-auto px-4 pt-12 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 pt-24">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-400">
              Meu Perfil
            </h1>
            <p className="text-gray-400">Gerencie suas informações pessoais e empresariais</p>
          </div>

          <div className="mt-4 md:mt-0 flex gap-3">
            <Button
              onClick={handleSave}
              disabled={isLoading || !isDirty}
              className={cn(
                "relative overflow-hidden transition-all duration-300",
                isDirty
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  : "bg-gray-800 text-gray-400",
              )}
            >
              {isLoading ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 animate-pulse"></div>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Salvando...
                </>
              ) : showSuccessIndicator ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Salvo!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <div className="flex items-center space-x-2 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-12">
          {/* Coluna da Esquerda - Foto e Navegação */}
          <div className="md:col-span-4 space-y-6">
            {/* Foto do Perfil */}
            <div
              className={cn(
                "bg-gradient-to-br from-[#1a2332] to-[#131b2c] rounded-xl p-6 border border-gray-800 transition-all duration-300",
                dragActive ? "border-blue-500 ring-2 ring-blue-500/20" : "",
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center space-y-6">
                <div className="relative group">
                  <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-30 blur-sm group-hover:opacity-70 transition duration-300"></div>
                  <Avatar className="w-40 h-40 border-4 border-[#131b2c] relative">
                    <AvatarImage
                      src={profileData.foto || "/placeholder.svg"}
                      alt="Foto do perfil"
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-gray-700 to-gray-900 text-white text-4xl">
                      <User className="w-16 h-16" />
                    </AvatarFallback>
                  </Avatar>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-1 right-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-full p-2.5 cursor-pointer transition-all duration-300 shadow-lg"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                  <input
                    ref={fileInputRef}
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>

                <div className="text-center space-y-1">
                  <h3 className="text-xl font-medium">{profileData.nomeCompleto}</h3>
                  <p className="text-gray-400 text-sm">{profileData.nomeEmpresa}</p>
                </div>

                <div className="w-full text-center text-sm text-gray-400">
                  <p className="flex items-center justify-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    {profileData.email}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-800/50">
                <p className="text-xs text-center text-gray-500">
                  Arraste uma imagem ou clique no ícone da câmera para alterar sua foto
                </p>
              </div>
            </div>

            {/* Navegação */}
            <div className="bg-gradient-to-br from-[#1a2332] to-[#131b2c] rounded-xl overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full grid grid-cols-3 bg-[#0d1326]/50 p-0 h-auto">
                  <TabsTrigger
                    value="pessoal"
                    className="py-3 data-[state=active]:bg-gradient-to-b data-[state=active]:from-blue-600/20 data-[state=active]:to-transparent data-[state=active]:text-blue-400 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500"
                  >
                    Pessoal
                  </TabsTrigger>
                  <TabsTrigger
                    value="empresa"
                    className="py-3 data-[state=active]:bg-gradient-to-b data-[state=active]:from-blue-600/20 data-[state=active]:to-transparent data-[state=active]:text-blue-400 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500"
                  >
                    Empresa
                  </TabsTrigger>
                  <TabsTrigger
                    value="redes"
                    className="py-3 data-[state=active]:bg-gradient-to-b data-[state=active]:from-blue-600/20 data-[state=active]:to-transparent data-[state=active]:text-blue-400 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500"
                  >
                    Redes
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Perfil completo</span>
                  <span className="text-blue-400 font-medium">85%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full w-[85%] bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna da Direita - Formulário */}
          <div className="md:col-span-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="bg-gradient-to-br from-[#1a2332] to-[#131b2c] rounded-xl border border-gray-800 overflow-hidden">
                <TabsContent value="pessoal" className="m-0">
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-6">
                      <User className="w-5 h-5 text-blue-400" />
                      <h2 className="text-xl font-medium">Informações Pessoais</h2>
                    </div>

                    <div className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="nomeCompleto" className="text-gray-300 font-medium">
                              Nome
                            </Label>
                            <Badge
                              variant="outline"
                              className="text-xs font-normal text-blue-400 border-blue-800 bg-blue-950/30"
                            >
                              Editável
                            </Badge>
                          </div>
                          <div className="relative">
                            <Input
                              id="nomeCompleto"
                              value={profileData.nomeCompleto}
                              onChange={(e) => handleInputChange("nomeCompleto", e.target.value)}
                              className="bg-[#0d1326] border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500/20"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="email" className="text-gray-300 font-medium flex items-center">
                              E-mail
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="w-3.5 h-3.5 ml-1.5 text-gray-500" />
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-gray-900 border-gray-800">
                                    <p>O e-mail não pode ser alterado</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Label>
                            <Badge
                              variant="outline"
                              className="text-xs font-normal text-gray-400 border-gray-700 bg-gray-800/30"
                            >
                              <Lock className="w-3 h-3 mr-1" />
                              Bloqueado
                            </Badge>
                          </div>
                          <div className="relative">
                            <Input
                              id="email"
                              value={profileData.email}
                              disabled
                              className="bg-[#0d1326]/50 border-gray-700 text-gray-400 cursor-not-allowed"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <Lock className="h-3.5 w-3.5 text-gray-500" />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="telefone" className="text-gray-300 font-medium">
                              Telefone
                            </Label>
                            <Badge
                              variant="outline"
                              className="text-xs font-normal text-blue-400 border-blue-800 bg-blue-950/30"
                            >
                              Editável
                            </Badge>
                          </div>
                          <div className="relative">
                            <Input
                              id="telefone"
                              value={profileData.telefone}
                              onChange={(e) => {
                                const formatted = formatPhoneInput(e.target.value)
                                handleInputChange("telefone", formatted)
                              }}
                              placeholder="(21) 9 9999-9999"
                              maxLength={16}
                              className="bg-[#0d1326] border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500/20 pl-10"
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <Phone className="h-4 w-4 text-gray-500" />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="dataNascimento" className="text-gray-300 font-medium flex items-center">
                              Data de Nascimento
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="w-3.5 h-3.5 ml-1.5 text-gray-500" />
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-gray-900 border-gray-800">
                                    <p>Idade mínima: 16 anos, máxima: 95 anos</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Label>
                            <Badge
                              variant="outline"
                              className="text-xs font-normal text-blue-400 border-blue-800 bg-blue-950/30"
                            >
                              Editável
                            </Badge>
                          </div>
                          <div className="relative">
                            <Input
                              id="dataNascimento"
                              type="date"
                              value={profileData.dataNascimento}
                              max={new Date().toISOString().split('T')[0]}
                              min={new Date(new Date().getFullYear() - 95, 0, 1).toISOString().split('T')[0]}
                              className="bg-[#0d1326] border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500/20 pl-10"
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <Calendar className="h-4 w-4 text-gray-500" />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="cpfCnpj" className="text-gray-300 font-medium flex items-center">
                              CPF/CNPJ
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="w-3.5 h-3.5 ml-1.5 text-gray-500" />
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-gray-900 border-gray-800">
                                    <p>O CPF/CNPJ não pode ser alterado</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Label>
                            <Badge
                              variant="outline"
                              className="text-xs font-normal text-gray-400 border-gray-700 bg-gray-800/30"
                            >
                              <Lock className="w-3 h-3 mr-1" />
                              Bloqueado
                            </Badge>
                          </div>
                          <div className="relative">
                            <Input
                              id="cpfCnpj"
                              value={profileData.cpfCnpj}
                              disabled
                              className="bg-[#0d1326]/50 border-gray-700 text-gray-400 cursor-not-allowed pl-10"
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <CreditCard className="h-4 w-4 text-gray-500" />
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <Lock className="h-3.5 w-3.5 text-gray-500" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="empresa" className="m-0">
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-6">
                      <Building className="w-5 h-5 text-blue-400" />
                      <h2 className="text-xl font-medium">Informações da Empresa</h2>
                    </div>

                    <div className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="nomeEmpresa" className="text-gray-300 font-medium">
                              Nome da Empresa
                            </Label>
                            <Badge
                              variant="outline"
                              className="text-xs font-normal text-blue-400 border-blue-800 bg-blue-950/30"
                            >
                              Editável
                            </Badge>
                          </div>
                          <Input
                            id="nomeEmpresa"
                            value={profileData.nomeEmpresa}
                            onChange={(e) => handleInputChange("nomeEmpresa", e.target.value)}
                            className="bg-[#0d1326] border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500/20"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="occupation" className="text-gray-300 font-medium">
                              Cargo na Empresa
                            </Label>
                            <Badge
                              variant="outline"
                              className="text-xs font-normal text-blue-400 border-blue-800 bg-blue-950/30"
                            >
                              Editável
                            </Badge>
                          </div>
                          <Input
                            id="occupation"
                            value={profileData.occupation}
                            onChange={(e) => handleInputChange("occupation", e.target.value)}
                            placeholder="Ex: Diretor Executivo, Gerente, Analista..."
                            className="bg-[#0d1326] border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500/20"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="segmentoEmpresa" className="text-gray-300 font-medium">
                              Segmento da Empresa
                            </Label>
                            <Badge
                              variant="outline"
                              className="text-xs font-normal text-blue-400 border-blue-800 bg-blue-950/30"
                            >
                              Editável
                            </Badge>
                          </div>
                          <Select
                            value={profileData.segmentoEmpresa}
                            onValueChange={(value) => handleInputChange("segmentoEmpresa", value)}
                          >
                            <SelectTrigger className="bg-[#0d1326] border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500/20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#131b2c] border-gray-700 text-white">
                              {segmentosEmpresa.map((segmento) => (
                                <SelectItem
                                  key={segmento}
                                  value={segmento}
                                  className="text-white focus:bg-blue-900/30 focus:text-blue-100"
                                >
                                  {segmento}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="faturamentoAnual" className="text-gray-300 font-medium">
                              Faturamento Anual
                            </Label>
                            <Badge
                              variant="outline"
                              className="text-xs font-normal text-blue-400 border-blue-800 bg-blue-950/30"
                            >
                              Editável
                            </Badge>
                          </div>
                          <Select
                            value={profileData.faturamentoAnual}
                            onValueChange={(value) => handleInputChange("faturamentoAnual", value)}
                          >
                            <SelectTrigger className="bg-[#0d1326] border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500/20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#131b2c] border-gray-700 text-white">
                              {faturamentoOptions.map((opcao) => (
                                <SelectItem
                                  key={opcao}
                                  value={opcao}
                                  className="text-white focus:bg-blue-900/30 focus:text-blue-100"
                                >
                                  {opcao}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="pt-4 space-y-4">
                        <Separator className="bg-gray-800/50" />

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="w-4 h-4 text-amber-400" />
                            <span className="text-sm text-amber-400">
                              Informações adicionais podem ser solicitadas para verificação
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="redes" className="m-0">
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-6">
                      <Instagram className="w-5 h-5 text-blue-400" />
                      <h2 className="text-xl font-medium">Redes Sociais</h2>
                    </div>

                    <div className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="instagram" className="text-gray-300 font-medium flex items-center">
                              <Instagram className="w-4 h-4 mr-2 text-pink-400" />
                              Instagram
                            </Label>
                            <Badge
                              variant="outline"
                              className="text-xs font-normal text-blue-400 border-blue-800 bg-blue-950/30"
                            >
                              Editável
                            </Badge>
                          </div>
                          <div className="relative">
                            <Input
                              id="instagram"
                              value={profileData.instagram}
                              onChange={(e) => handleInputChange("instagram", e.target.value)}
                              placeholder="@seuusuario"
                              className="bg-[#0d1326] border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500/20 pl-10"
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <span className="text-gray-500">@</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="linkedin" className="text-gray-300 font-medium flex items-center">
                              <Linkedin className="w-4 h-4 mr-2 text-blue-400" />
                              LinkedIn
                            </Label>
                            <Badge
                              variant="outline"
                              className="text-xs font-normal text-blue-400 border-blue-800 bg-blue-950/30"
                            >
                              Editável
                            </Badge>
                          </div>
                          <Input
                            id="linkedin"
                            value={profileData.linkedin}
                            onChange={(e) => handleInputChange("linkedin", e.target.value)}
                            placeholder="linkedin.com/in/seuusuario"
                            className="bg-[#0d1326] border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500/20"
                          />
                        </div>
                      </div>

                      <div className="pt-4 space-y-4">
                        <Separator className="bg-gray-800/50" />

                        <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 rounded-lg p-4 border border-blue-900/30">
                          <div className="flex items-start space-x-3">
                            <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                            <div>
                              <h4 className="text-sm font-medium text-blue-400">Conecte suas redes sociais</h4>
                              <p className="text-xs text-gray-400 mt-1">
                                Conectar suas redes sociais ajuda a aumentar sua visibilidade na plataforma e facilita o
                                networking com outros membros.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </main>
      
      {/* Debug Panel - apenas em desenvolvimento */}
      {/* <DebugPanel /> */}
    </div>
  )
}
