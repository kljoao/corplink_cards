"use client"

import type React from "react"

import { useState, useRef } from "react"
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
    instagram: "@techsolutions",
    linkedin: "linkedin.com/company/techsolutions",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [activeTab, setActiveTab] = useState("pessoal")
  const [showSuccessIndicator, setShowSuccessIndicator] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
    setIsDirty(true)
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
    // Simular salvamento
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setIsDirty(false)
    setShowSuccessIndicator(true)

    setTimeout(() => {
      setShowSuccessIndicator(false)
    }, 3000)
  }

  // Formatar data para exibição
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f1c] to-[#0d1326] text-white">
      {/* Header */}
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 pt-24">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-400">
              Meu Perfil
            </h1>
            <p className="text-gray-400">Gerencie suas informações pessoais e empresariais</p>
          </div>

          <div className="mt-4 md:mt-0">
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
          </div>
        </div>

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
                              Nome Completo
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
                              onChange={(e) => handleInputChange("telefone", e.target.value)}
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
                                    <p>A data de nascimento não pode ser alterada</p>
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
                              id="dataNascimento"
                              value={formatDate(profileData.dataNascimento)}
                              disabled
                              className="bg-[#0d1326]/50 border-gray-700 text-gray-400 cursor-not-allowed pl-10"
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <Calendar className="h-4 w-4 text-gray-500" />
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <Lock className="h-3.5 w-3.5 text-gray-500" />
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

                      <div className="pt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Switch id="notifications" />
                            <Label htmlFor="notifications" className="text-sm text-gray-300">
                              Receber notificações por e-mail
                            </Label>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                          >
                            Preferências de notificação
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
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
    </div>
  )
}
