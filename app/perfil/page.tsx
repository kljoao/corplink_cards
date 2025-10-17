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
import { Textarea } from "@/components/ui/textarea"
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
  Share,
  UserX,
  AlertTriangle,
  X,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Crop,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Header from "@/components/Header"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { UpdateProfileData } from "@/lib/auth"
import DebugPanel from "@/components/DebugPanel"
import { authService } from "@/lib/auth"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { toast, Toaster } from "sonner"
import dynamic from "next/dynamic"

// Importar AvatarEditor dinamicamente para evitar problemas de SSR
const AvatarEditor = dynamic(() => import('react-avatar-editor'), {
  ssr: false,
  loading: () => <div className="w-40 h-40 bg-gray-800 rounded-full animate-pulse" />
})

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
    whatsapp: false,
    bio: "",
  })

  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [activeTab, setActiveTab] = useState("pessoal")
  const [showSuccessIndicator, setShowSuccessIndicator] = useState(false)
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false)
  const [isDeactivating, setIsDeactivating] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  
  // Estados para o editor de avatar
  const [showAvatarEditor, setShowAvatarEditor] = useState(false)
  const [avatarEditorScale, setAvatarEditorScale] = useState(1)
  const [avatarEditorRotation, setAvatarEditorRotation] = useState(0)
  const [tempImageFile, setTempImageFile] = useState<File | null>(null)
  const avatarEditorRef = useRef<any>(null)
  const router = useRouter()
  const { user, isLoading: authLoading, logout, updateProfile } = useAuth()

  // Estado para erro do delete
  const [deleteError, setDeleteError] = useState("")

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
        const phoneStr = phone.toString()
        
        // Se já tem prefixo internacional, manter como está
        if (phoneStr.startsWith('+')) {
          return phoneStr
        }
        
        const cleanPhone = phoneStr.replace(/\D/g, '');
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
          ? `${user.info.phone_prefix ?? ''}${user.info.phone}`
          : prev.telefone,
        dataNascimento: user.info?.birthday || prev.dataNascimento,
        nomeEmpresa: user.info?.company || prev.nomeEmpresa,
        segmentoEmpresa: user.info?.sector || prev.segmentoEmpresa,
        faturamentoAnual: user.info?.revenue ? convertRevenueToFaturamento(user.info.revenue) : prev.faturamentoAnual,
        occupation: user.info?.occupation || prev.occupation,
        instagram: user.info?.social_links?.instagram ? `@${user.info.social_links.instagram}` : prev.instagram,
        linkedin: user.info?.social_links?.linkedin || prev.linkedin,
        whatsapp: String(user.info?.social_links?.whatsapp) === '1' || prev.whatsapp,
        cpfCnpj: user.info?.numid || prev.cpfCnpj,
        bio: user.info?.bio || prev.bio,
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

  const handleTestUpload = async () => {
    if (!selectedPhotoFile) {
      alert('Selecione uma foto primeiro!')
      return
    }

    try {
      console.log('=== INICIANDO TESTE SIMPLES ===')
      const response = await authService.testSimpleUpload(selectedPhotoFile)
      
      if (response.error) {
        alert('Erro no teste: ' + response.error)
      } else {
        alert('Teste realizado com sucesso! Verifique os logs.')
      }
    } catch (error) {
      console.error('Erro no teste:', error)
      alert('Erro no teste: ' + error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: field === 'whatsapp' ? value === 'true' : value,
    }))
    setIsDirty(true)
    setError("")
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione apenas arquivos de imagem.')
        return
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 5MB.')
        return
      }

      setTempImageFile(file)
      setShowAvatarEditor(true)
      console.log('Arquivo selecionado para edição')
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
      
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione apenas arquivos de imagem.')
        return
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 5MB.')
        return
      }

      setTempImageFile(file)
      setShowAvatarEditor(true)
    }
  }

  // Funções para controlar o editor de avatar
  const handleAvatarEditorSave = () => {
    if (avatarEditorRef.current) {
      const canvas = avatarEditorRef.current.getImageScaledToCanvas()
      
      // Converter canvas para blob
      canvas.toBlob((blob: Blob | null) => {
        if (blob) {
          // Criar um novo arquivo a partir do blob
          const editedFile = new File([blob], tempImageFile?.name || 'avatar.jpg', {
            type: 'image/jpeg',
            lastModified: Date.now(),
          })

          // Criar URL para preview
          const imageUrl = URL.createObjectURL(blob)
          
          setProfileData((prev) => ({
            ...prev,
            foto: imageUrl,
          }))
          setSelectedPhotoFile(editedFile)
          setIsDirty(true)
          setShowAvatarEditor(false)
          setTempImageFile(null)
          setAvatarEditorScale(1)
          setAvatarEditorRotation(0)
          
          toast.success('Foto editada com sucesso!')
        }
      }, 'image/jpeg', 0.9)
    }
  }

  const handleAvatarEditorCancel = () => {
    setShowAvatarEditor(false)
    setTempImageFile(null)
    setAvatarEditorScale(1)
    setAvatarEditorRotation(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleAvatarEditorRotate = () => {
    setAvatarEditorRotation((prev) => (prev + 90) % 360)
  }

  const handleAvatarEditorZoomIn = () => {
    setAvatarEditorScale((prev) => Math.min(prev + 0.1, 3))
  }

  const handleAvatarEditorZoomOut = () => {
    setAvatarEditorScale((prev) => Math.max(prev - 0.1, 0.5))
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError("")
    
    try {
      // Preparar dados para envio usando a função utilitária
      const updateData = prepareProfileData()

      // Logs detalhados para debug
      console.log('=== DADOS SENDO ENVIADOS ===')
      console.log('updateData completo:', updateData)
      console.log('selectedPhotoFile:', selectedPhotoFile)
      if (selectedPhotoFile) {
        console.log('Detalhes do arquivo selecionado:')
        console.log('- Nome:', selectedPhotoFile.name)
        console.log('- Tamanho:', selectedPhotoFile.size)
        console.log('- Tipo:', selectedPhotoFile.type)
        console.log('- Última modificação:', selectedPhotoFile.lastModified)
      }
      console.log('=== FIM LOGS ENVIO ===')

      const response = await updateProfile(updateData)
      
      if (response.error) {
        setError(response.error)
      } else {
        setIsDirty(false)
        setShowSuccessIndicator(true)
        // Limpar arquivo selecionado após sucesso
        setSelectedPhotoFile(null)
        // Atualizar foto se backend retornar avatar_url
        if (response.avatar_url) {
          setProfileData(prev => ({
            ...prev,
            foto: response.avatar_url ?? prev.foto
          }))
        }
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

  const handleDeactivateAccount = async () => {
    setIsDeactivating(true)
    setDeleteError("")
    try {
      const response = await authService.deleteAccount()
      if (response.error) {
        setDeleteError(response.error)
      } else {
        toast.success(response.message || "Conta inativada com sucesso.", {
          position: 'top-right',
        })
        setIsDeactivateDialogOpen(false)
        setTimeout(() => {
          router.push("/login")
        }, 1500)
      }
    } catch (err: any) {
      setDeleteError(err.message || "Erro inesperado ao inativar conta.")
    } finally {
      setIsDeactivating(false)
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
    
    // Se o usuário digitou um + no início, permitir prefixo internacional
    if (value.startsWith('+')) {
      // Manter o + e formatar o resto
      const withoutPlus = value.slice(1)
      const numbersWithoutPlus = withoutPlus.replace(/\D/g, '')
      
      if (numbersWithoutPlus.length <= 2) {
        return `+${numbersWithoutPlus}`
      } else if (numbersWithoutPlus.length <= 6) {
        return `+${numbersWithoutPlus.slice(0, 2)} (${numbersWithoutPlus.slice(2)}`
      } else if (numbersWithoutPlus.length <= 10) {
        return `+${numbersWithoutPlus.slice(0, 2)} (${numbersWithoutPlus.slice(2, 6)}) ${numbersWithoutPlus.slice(6)}`
      } else {
        return `+${numbersWithoutPlus.slice(0, 2)} (${numbersWithoutPlus.slice(2, 4)}) ${numbersWithoutPlus.slice(4, 5)} ${numbersWithoutPlus.slice(5, 9)}-${numbersWithoutPlus.slice(9, 13)}`
      }
    }
    
    // Formatação padrão brasileira
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
    
    // Se tem prefixo internacional (mais de 10 dígitos)
    if (numbers.length > 10) {
      // Assumir que os primeiros dígitos são o código do país
      const countryCode = numbers.slice(0, numbers.length - 10)
      const localNumber = numbers.slice(countryCode.length)
      const ddd = localNumber.slice(0, 2)
      const phone = localNumber.slice(2)
      return { ddd, phone }
    }
    
    // Formato brasileiro padrão
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
        whatsapp: profileData.whatsapp ? '1' : '0',
      },
      bio: String(profileData.bio || "").trim(),
    }

    // Processar telefone se for uma string válida
    if (typeof profileData.telefone === 'string' && profileData.telefone.trim()) {
      const tel = profileData.telefone.trim()
      if (tel.startsWith('+')) {
        // Internacional: separar código do país e número local
        const numbers = tel.replace(/\D/g, '')
        // Tenta pegar até 3 dígitos de código do país
        let countryCode = ''
        let rest = ''
        for (let i = 1; i <= 3; i++) {
          countryCode = numbers.slice(0, i)
          rest = numbers.slice(i)
          // Considera número local válido se rest >= 8 dígitos
          if (rest.length >= 8) break
        }
        updateData.phone_prefix = `+${countryCode}`
        updateData.phone = rest
      } else {
        // Nacional: extrair DDD e número
        const { ddd, phone } = extractPhoneData(profileData.telefone)
        let phoneNumber = ddd + phone
        updateData.phone_prefix = '+55'
        updateData.phone = phoneNumber
      }
    }

    // Adicionar foto se foi selecionada
    if (selectedPhotoFile) {
      console.log('=== ADICIONANDO FOTO AOS DADOS ===')
      console.log('selectedPhotoFile encontrado:', selectedPhotoFile)
      console.log('Nome do arquivo:', selectedPhotoFile.name)
      console.log('Tamanho do arquivo:', selectedPhotoFile.size)
      console.log('Tipo do arquivo:', selectedPhotoFile.type)
      updateData.foto = selectedPhotoFile
      console.log('Foto adicionada ao updateData')
      console.log('=== FIM LOGS FOTO ===')
    } else {
      console.log('Nenhum arquivo selecionado para upload')
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
      if (key === 'foto') return // Não remover foto
      if (updateData[key as keyof UpdateProfileData] === "") {
        delete updateData[key as keyof UpdateProfileData]
      }
    })

    if (updateData.social_links) {
      Object.keys(updateData.social_links).forEach(key => {
        if (key === 'whatsapp') return // Não remover whatsapp
        if (updateData.social_links![key as keyof typeof updateData.social_links] === "") {
          delete updateData.social_links![key as keyof typeof updateData.social_links]
        }
      })
      
      // Se social_links ficou vazio, removê-lo
      if (Object.keys(updateData.social_links).length === 0) {
        delete updateData.social_links
      }
    }

    console.log('=== DADOS FINAIS PREPARADOS ===')
    console.log('updateData final:', updateData)
    console.log('Tem foto no final?', !!updateData.foto)
    console.log('=== FIM LOGS PREPARAÇÃO ===')

    return updateData
  }

  const requiredFields = [
    "nomeCompleto",
    "email",
    "telefone",
    "dataNascimento",
    "nomeEmpresa",
    "segmentoEmpresa",
    "faturamentoAnual",
    "occupation",
    "instagram",
    "linkedin",
    "bio",
  ];

  const getProfileCompletion = () => {
    let filled = 0;
    requiredFields.forEach((field) => {
      const value = profileData[field as keyof typeof profileData];
      if (typeof value === "string") {
        if (value.trim() !== "") filled++;
      } else if (typeof value === "boolean") {
        // Se quiser considerar booleanos, ajuste aqui
        filled++;
      }
    });
    return Math.round((filled / requiredFields.length) * 100);
  };

  const profileCompletion = getProfileCompletion();

  function formatMaskedCpfCnpj(value: string) {
    if (!value) return "";
    const digits = value.replace(/\D/g, "");
    if (digits.length === 11) {
      // CPF: 123.456.789-00 → 123.xxx.xxx-xx
      return `${digits.slice(0, 3)}.xxx.xxx-xx`;
    }
    if (digits.length === 14) {
      // CNPJ: 12.345.678/0001-00 → 123.xxx.xxx/xxxx-xx
      return `${digits.slice(0, 3)}.xxx.xxx/xxxx-xx`;
    }
    // fallback: mostra só os 3 primeiros e mascara o resto
    return `${digits.slice(0, 3)}.${"x".repeat(digits.length - 3)}`;
  }



  // Função para compartilhar perfil
  const handleShareProfile = () => {
    console.log('Botão compartilhar clicado');
    if (!user) {
      console.log('Usuário não encontrado');
      return;
    }
    const slug = [user.firstname, user.lastname].filter(Boolean).join('.').toLowerCase();
    const url = `https://corplink.me/${slug}`;
    console.log('URL gerada:', url);

    if (!navigator.clipboard) {
      toast.error('Clipboard API não disponível. Copie manualmente: ' + url, {
        position: 'top-right',
      });
      return;
    }

    navigator.clipboard.writeText(url)
      .then(() => {
        toast.success('O link do seu perfil foi copiado para a área de transferência!', {
          position: 'top-right',
        });
      })
      .catch((err) => {
        console.error('Erro ao copiar:', err);
        toast.error('Não foi possível copiar o link. Copie manualmente: ' + url, {
          position: 'top-right',
        });
      });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0f1c] to-[#0d1326] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br bg-[#000015] text-white overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30 z-0 pointer-events-none">
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
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
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

      {/* Conteúdo principal acima do background animado */}
      <div className="relative z-10">
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
                    Arraste uma imagem ou clique no ícone da câmera para editar sua foto
                  </p>
                  {selectedPhotoFile && (
                    <div className="mt-2 p-2 bg-blue-900/20 border border-blue-500/30 rounded-md">
                      <p className="text-xs text-blue-400 text-center">
                        Nova foto selecionada: {selectedPhotoFile.name}
                      </p>
                    </div>
                  )}
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
                    <span className="text-blue-400 font-medium">{profileCompletion}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-800 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                      style={{ width: `${profileCompletion}%` }}
                    ></div>
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
                                placeholder="+XX (XX) XXXXX-XXXX"
                                maxLength={20}
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
                                onChange={(e) => handleInputChange("dataNascimento", e.target.value)}
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
                                value={formatMaskedCpfCnpj(profileData.cpfCnpj)}
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

                          {/* Bio Field */}
                          <div className="space-y-2 md:col-span-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="bio" className="text-gray-300 font-medium flex items-center">
                                Bio
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Info className="w-3.5 h-3.5 ml-1.5 text-gray-500" />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gray-900 border-gray-800">
                                      <p>Conte um pouco sobre você (máximo 500 caracteres)</p>
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
                              <Textarea
                                id="bio"
                                value={profileData.bio}
                                onChange={(e) => handleInputChange("bio", e.target.value)}
                                placeholder="Conte um pouco sobre você, sua experiência, interesses..."
                                maxLength={1000}
                                className="bg-[#0d1326] border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500/20 min-h-[120px] resize-none"
                              />
                              <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                                {profileData.bio.length}/1000
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Botão Inativar Conta */}
                    <div className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                          <Button
                            variant="outline"
                            onClick={handleShareProfile}
                            className="bg-blue-600/10 border-blue-600/30 text-blue-400 hover:bg-blue-600/20 hover:border-blue-600/50 transition-all duration-300 hover:text-white"
                          >
                            <Share className="w-4 h-4 mr-2" />
                            Compartilhar Perfil
                          </Button>

                          <Button
                            variant="outline"
                            onClick={() => setIsDeactivateDialogOpen(true)}
                            className="bg-red-600/10 border-red-600/30 text-red-400 hover:bg-red-600/20 hover:border-red-600/50 transition-all duration-300 hover:text-white"
                          >
                            <UserX className="w-4 h-4 mr-2" />
                            Inativar Conta
                          </Button>

                          {/* Modal de Inativação */}
                          {isDeactivateDialogOpen && (
                            <>
                              {/* Backdrop */}
                              <div
                                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
                                onClick={() => setIsDeactivateDialogOpen(false)}
                              />

                              {/* Modal Content */}
                              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in-0 zoom-in-95 duration-300">
                                <div className="relative bg-gradient-to-br from-[#1a2332] to-[#131b2c] border border-gray-800 rounded-xl shadow-2xl max-w-lg w-full">
                                  {/* Close Button */}
                                  <button
                                    onClick={() => setIsDeactivateDialogOpen(false)}
                                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                  >
                                    <X className="h-4 w-4 text-gray-400 hover:text-white" />
                                  </button>

                                  {/* Header */}
                                  <div className="flex flex-col space-y-1.5 text-center sm:text-left p-6 pb-4">
                                    <div className="flex items-center space-x-3 mb-2">
                                      <div className="relative">
                                        <div className="absolute inset-0 bg-red-500/20 rounded-full blur-lg animate-pulse" />
                                        <div className="relative bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-full p-2">
                                          <AlertTriangle className="h-6 w-6 text-red-400" />
                                        </div>
                                      </div>
                                      <h2 className="text-lg font-semibold leading-none tracking-tight text-white">
                                        Inativar Conta
                                      </h2>
                                    </div>
                                    <p className="text-sm text-gray-400 text-left">
                                      Tem certeza de que deseja inativar sua conta? Esta ação terá as seguintes
                                      consequências:
                                    </p>
                                  </div>

                                  {/* Content */}
                                  <div className="px-6 py-4">
                                    <div className="space-y-3 text-sm text-gray-300">
                                      <div className="flex items-start space-x-2">
                                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                                        <p>Seu perfil ficará invisível para outros membros</p>
                                      </div>
                                      <div className="flex items-start space-x-2">
                                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                                        <p>Você perderá acesso a eventos e benefícios exclusivos</p>
                                      </div>
                                      <div className="flex items-start space-x-2">
                                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                                        <p>Suas conexões e histórico de networking serão suspensos</p>
                                      </div>
                                      <div className="flex items-start space-x-2">
                                        <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                                        <p className="text-amber-400">
                                          <strong>Você pode reativar sua conta a qualquer momento</strong> solicitando ao suporte
                                        </p>
                                      </div>
                                    </div>

                                    {deleteError && (
                                      <div className="mb-4 p-2 bg-red-900/20 border border-red-800/30 rounded text-red-300 text-sm text-center">
                                        {deleteError}
                                      </div>
                                    )}
                                  </div>

                                  {/* Footer */}
                                  <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-4">
                                    <Button
                                      variant="outline"
                                      onClick={() => setIsDeactivateDialogOpen(false)}
                                      disabled={isDeactivating}
                                      className="bg-gray-600/10 border-gray-600/30 text-gray-300 hover:bg-gray-600/20 hover:border-gray-600/50 mb-2 sm:mb-0"
                                    >
                                      Cancelar
                                    </Button>
                                    <Button
                                      onClick={handleDeactivateAccount}
                                      disabled={isDeactivating}
                                      className="bg-red-600 hover:bg-red-700 text-white"
                                    >
                                      {isDeactivating ? (
                                        <>
                                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                                          Inativando...
                                        </>
                                      ) : (
                                        <>
                                          <UserX className="w-4 h-4 mr-2" />
                                          Confirmar Inativação
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                        {/* Card do link do perfil */}
                        {user && (
                          <div className="col-span-2 mt-6">
                            <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-br from-[#1a2332] to-[#131b2c] border border-blue-900/30 rounded-xl p-4 shadow-lg">
                              <div className="flex items-center gap-3">
                                <span className="text-gray-400 text-sm">Seu link público:</span>
                                <a
                                  href={`https://corplink.me/${[user.firstname, user.lastname].filter(Boolean).join('.').toLowerCase()}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:underline font-mono text-sm break-all"
                                >
                                  {`corplink.me/${[user.firstname, user.lastname].filter(Boolean).join('.').toLowerCase()}`}
                                </a>
                              </div>
                            </div>
                          </div>
                        )}
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

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="whatsapp" className="text-gray-300 font-medium flex items-center">
                                <img src="/icons/WhatsApp.svg" alt="WhatsApp" className="w-4 h-4 mr-2" />
                                WhatsApp
                              </Label>
                              <Badge
                                variant="outline"
                                className="text-xs font-normal text-blue-400 border-blue-800 bg-blue-950/30"
                              >
                                Editável
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-3 p-3 bg-[#0d1326] border border-gray-700 rounded-md">
                              <Switch
                                id="whatsapp"
                                checked={profileData.whatsapp}
                                onCheckedChange={(checked) => handleInputChange("whatsapp", checked.toString())}
                                className="data-[state=checked]:bg-green-500"
                              />
                              <Label htmlFor="whatsapp" className="text-sm text-gray-300">
                                {profileData.whatsapp ? "Ativado" : "Desativado"}
                              </Label>
                              <span className="text-xs text-gray-500 ml-auto">
                                {profileData.whatsapp 
                                  ? "Seu WhatsApp será exibido no seu cartão" 
                                  : "Seu WhatsApp não será exibido no seu cartão"}
                              </span>
                            </div>
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
        <Toaster position="top-right" />
        {/* Debug Panel - apenas em desenvolvimento */}
        <DebugPanel />

        {/* Modal do Editor de Avatar */}
        {showAvatarEditor && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-in fade-in-0 duration-300"
              onClick={handleAvatarEditorCancel}
            />

            {/* Modal Content */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 animate-in fade-in-0 zoom-in-95 duration-300">
              <div className="relative bg-gradient-to-br from-[#1a2332] to-[#131b2c] border border-gray-800 rounded-none sm:rounded-xl shadow-2xl w-full h-full sm:max-w-2xl sm:w-full sm:h-auto max-h-screen overflow-y-auto flex flex-col">
                {/* Close Button */}
                <button
                  onClick={handleAvatarEditorCancel}
                  className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 z-10"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-white" />
                </button>

                {/* Header */}
                <div className="flex flex-col space-y-1.5 p-6 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg animate-pulse" />
                      <div className="relative bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-full p-2">
                        <Crop className="h-6 w-6 text-blue-400" />
                      </div>
                    </div>
                    <h2 className="text-lg font-semibold leading-none tracking-tight text-white">
                      Editar Foto do Perfil
                    </h2>
                  </div>
                  <p className="text-sm text-gray-400">
                    Ajuste, recorte e rotacione sua foto para o melhor resultado
                  </p>
                </div>

                {/* Editor Content */}
                <div className="px-6 pb-6 flex-1 flex flex-col items-center overflow-y-auto">
                  <div className="flex flex-col items-center space-y-6 w-full">
                    {/* Avatar Editor */}
                    <div className="relative">
                      <AvatarEditor
                        ref={avatarEditorRef}
                        image={tempImageFile || undefined}
                        width={300}
                        height={300}
                        border={50}
                        borderRadius={150}
                        color={[59, 130, 246, 0.6]}
                        scale={avatarEditorScale}
                        rotate={avatarEditorRotation}
                        className="rounded-full"
                      />
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col space-y-4 w-full max-w-md">
                      {/* Zoom Controls */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Zoom</span>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleAvatarEditorZoomOut}
                            disabled={avatarEditorScale <= 0.5}
                            className="w-8 h-8 p-0 border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            <ZoomOut className="w-4 h-4" />
                          </Button>
                          <span className="text-sm text-gray-400 min-w-[3rem] text-center">
                            {Math.round(avatarEditorScale * 100)}%
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleAvatarEditorZoomIn}
                            disabled={avatarEditorScale >= 3}
                            className="w-8 h-8 p-0 border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            <ZoomIn className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Rotation Control */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Rotação</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleAvatarEditorRotate}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <RotateCw className="w-4 h-4 mr-2" />
                          Rotacionar
                        </Button>
                      </div>

                      {/* Instructions */}
                      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                        <p className="text-xs text-blue-300 text-center">
                          💡 Arraste a imagem para posicioná-la, use os controles para ajustar o zoom e rotação
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons - sempre visíveis no mobile */}
                <div className="flex space-x-3 w-full max-w-md mx-auto px-6 pb-6 pt-2 bg-[#1a2332] sm:bg-transparent sticky bottom-0 sm:static z-10">
                  <Button
                    variant="outline"
                    onClick={handleAvatarEditorCancel}
                    className="flex-1 bg-gray-600/10 border-gray-600/30 text-gray-300 hover:bg-gray-600/20"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleAvatarEditorSave}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white transition hover:from-blue-700 hover:to-indigo-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Foto
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
