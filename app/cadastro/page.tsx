"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import PhoneInput from "react-phone-number-input"
import "react-phone-number-input/style.css"
import "./phone-input.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, Check, Loader2, CheckCircle, XCircle } from "lucide-react"
import Header from "@/components/Header"

const COLORS = {
  vipBlue: "#000016",
  titanium: "#17313c",
  royal: "#26425e",
  marfim: "#bebdb2",
  clarity: "#f8f8f8",
  gold: "#D4AF37",
}

const step1Schema = z.object({
  fullName: z.string().min(3, "Nome completo é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  birthDate: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Data deve estar no formato dd/mm/aaaa"),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido"),
})

const step2Schema = z.object({
  position: z.string().min(2, "Cargo é obrigatório"),
  segment: z.string().min(1, "Selecione um segmento"),
  company: z.string().min(2, "Nome da empresa é obrigatório"),
  revenue: z.string().min(1, "Selecione uma faixa de faturamento"),
})

const step3Schema = z.object({
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
  bio: z.string().max(1000, "Bio deve ter no máximo 1000 caracteres").optional(),
})

type Step1Data = z.infer<typeof step1Schema>
type Step2Data = z.infer<typeof step2Schema>
type Step3Data = z.infer<typeof step3Schema>

export default function CadastroPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<Step1Data & Step2Data & Step3Data>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  // Injeta estilos ULTRA agressivos e observer para corrigir dropdown de países
  useEffect(() => {
    const styleId = 'phone-input-dropdown-ultimate-fix'
    
    // Remove estilo anterior se existir
    const existingStyle = document.getElementById(styleId)
    if (existingStyle) {
      existingStyle.remove()
    }

    // Cria estilo ULTRA agressivo
    const style = document.createElement('style')
    style.id = styleId
    style.textContent = `
      /* FORÇA MÁXIMA nos estilos do dropdown */
      .PhoneInputCountrySelectDropdown,
      .PhoneInputCountrySelect option,
      select.PhoneInputCountrySelect option {
        background-color: #17313c !important;
        background: #17313c !important;
        color: #f8f8f8 !important;
      }
      
      .PhoneInputCountrySelect {
        background-color: transparent !important;
        color: #f8f8f8 !important;
      }
      
      /* Força cor em TODAS as options do select */
      .PhoneInputCountrySelect option,
      select.PhoneInputCountrySelect option,
      .PhoneInputCountry select option {
        background-color: #17313c !important;
        color: #f8f8f8 !important;
        padding: 0.5rem !important;
      }
      
      .PhoneInputCountrySelect option:hover,
      select.PhoneInputCountrySelect option:hover {
        background-color: rgba(212, 175, 55, 0.2) !important;
        color: #f8f8f8 !important;
      }
      
      .PhoneInputCountrySelect option:checked,
      select.PhoneInputCountrySelect option:checked {
        background-color: #d4af37 !important;
        color: #000016 !important;
        font-weight: 600 !important;
      }
    `
    
    document.head.appendChild(style)

    // Observer para aplicar estilos inline diretos quando o select abrir
    const applyStylesToSelect = () => {
      const selects = document.querySelectorAll('.PhoneInputCountrySelect, select.PhoneInputCountrySelect')
      selects.forEach((select) => {
        const selectElement = select as HTMLSelectElement
        selectElement.style.backgroundColor = 'transparent'
        selectElement.style.color = '#f8f8f8'
        
        // Aplica estilos em cada option
        const options = selectElement.querySelectorAll('option')
        options.forEach((option) => {
          option.style.backgroundColor = '#17313c'
          option.style.color = '#f8f8f8'
          option.style.padding = '0.5rem'
        })
      })
    }

    // Aplica imediatamente
    applyStylesToSelect()

    // Observa mudanças no DOM
    const observer = new MutationObserver(() => {
      applyStylesToSelect()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    })

    // Aplica também quando o usuário interagir
    const handleFocus = () => {
      setTimeout(applyStylesToSelect, 50)
    }

    document.addEventListener('focusin', handleFocus)
    document.addEventListener('click', handleFocus)

    return () => {
      observer.disconnect()
      document.removeEventListener('focusin', handleFocus)
      document.removeEventListener('click', handleFocus)
      const styleToRemove = document.getElementById(styleId)
      if (styleToRemove) {
        styleToRemove.remove()
      }
    }
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm({
    resolver: zodResolver(currentStep === 1 ? step1Schema : currentStep === 2 ? step2Schema : step3Schema),
    defaultValues: formData,
  })

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 11)
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
  }

  const formatDate = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 8)
    return numbers.replace(/(\d{2})(\d)/, "$1/$2").replace(/(\d{2})(\d)/, "$1/$2")
  }

  const formatBRL = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    const amount = Number.parseInt(numbers) / 100
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount)
  }

  // Converte data de DD/MM/AAAA para AAAA-MM-DD
  const convertDateToAPI = (dateStr: string): string => {
    const [day, month, year] = dateStr.split('/')
    return `${year}-${month}-${day}`
  }

  const submitToAPI = async (allData: Step1Data & Step2Data & Step3Data) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      // Prepara o payload para a API
      const payload = {
        nome_completo: allData.fullName,
        e_mail: allData.email,
        celular_1: allData.phone,
        data_de_nascimento_1: convertDateToAPI(allData.birthDate),
        cpf_1: allData.cpf,
        instagram_1: allData.instagram ? `https://instagram.com/${allData.instagram}` : '',
        linkedin_1: allData.linkedin ? `https://www.linkedin.com/in/${allData.linkedin}` : '',
        cargo_1: allData.position,
        segmento_1: allData.segment,
        empresa_1: allData.company,
        faturamento_anual_1: allData.revenue,
        mini_bio_1: allData.bio || '',
      }

      console.log('Enviando dados:', payload)

      const response = await fetch('https://admin.corplink.co/api/v1/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (response.ok) {
        console.log('Cadastro realizado com sucesso:', result)
        setSubmitStatus('success')
      } else {
        console.error('Erro no cadastro:', result)
        setErrorMessage(result.message || 'Erro ao cadastrar. Tente novamente.')
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Erro na requisição:', error)
      setErrorMessage('Erro de conexão. Verifique sua internet e tente novamente.')
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmit = (data: any) => {
    const updatedFormData = { ...formData, ...data }
    setFormData(updatedFormData)

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      // Final submission - enviar para API
      submitToAPI(updatedFormData as Step1Data & Step2Data & Step3Data)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const steps = [
    { number: 1, title: "Informações Pessoais" },
    { number: 2, title: "Empresa & Faturamento" },
    { number: 3, title: "Redes Sociais" },
  ]

  // Modal de Sucesso/Erro
  if (submitStatus !== 'idle') {
    return (
      <div className="min-h-screen font-sans relative overflow-x-hidden flex items-center justify-center" style={{ backgroundColor: COLORS.vipBlue }}>
        <Header />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-4 p-8 rounded-sm text-center"
          style={{
            backgroundColor: `${COLORS.titanium}40`,
            backdropFilter: "blur(20px)",
            border: `1px solid ${COLORS.royal}60`,
          }}
        >
          {submitStatus === 'success' ? (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <CheckCircle className="w-20 h-20 mx-auto mb-6" style={{ color: COLORS.gold }} />
              </motion.div>
              <h2 className="text-3xl font-light mb-4" style={{ color: COLORS.clarity }}>
                Cadastro Realizado!
              </h2>
              <p className="text-base mb-8 font-light" style={{ color: COLORS.marfim }}>
                Seu cadastro foi enviado com sucesso. Em breve entraremos em contato.
              </p>
              <Button
                onClick={() => window.location.href = '/'}
                className="h-12 px-8 font-light rounded-sm"
                style={{
                  backgroundColor: COLORS.gold,
                  color: COLORS.vipBlue,
                }}
              >
                Voltar ao Início
              </Button>
            </>
          ) : (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <XCircle className="w-20 h-20 mx-auto mb-6" style={{ color: '#ef4444' }} />
              </motion.div>
              <h2 className="text-3xl font-light mb-4" style={{ color: COLORS.clarity }}>
                Erro no Cadastro
              </h2>
              <p className="text-base mb-8 font-light" style={{ color: COLORS.marfim }}>
                {errorMessage}
              </p>
              <Button
                onClick={() => {
                  setSubmitStatus('idle')
                  setCurrentStep(3)
                }}
                className="h-12 px-8 font-light rounded-sm"
                style={{
                  backgroundColor: COLORS.gold,
                  color: COLORS.vipBlue,
                }}
              >
                Tentar Novamente
              </Button>
            </>
          )}
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen font-sans relative overflow-x-hidden" style={{ backgroundColor: COLORS.vipBlue }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(${COLORS.gold}40 1px, transparent 1px), linear-gradient(90deg, ${COLORS.gold}40 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />

        {/* Animated floating shapes */}
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 rounded-full blur-3xl"
          style={{ backgroundColor: `${COLORS.royal}15` }}
          animate={{
            y: [0, 30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-40 right-20 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: `${COLORS.titanium}15` }}
          animate={{
            y: [0, -40, 0],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-72 h-72 rounded-full blur-3xl"
          style={{ backgroundColor: `${COLORS.gold}08` }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <Header />

      <div className="container mx-auto px-4 md:px-6 lg:px-12 py-8 md:py-16 lg:py-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 md:mb-20 mt-20"
          >
            <div className="flex items-center justify-center">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center gap-4">
                    {/* Step Circle */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 200 }}
                      whileHover={{ scale: 1.05 }}
                      className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center font-light text-base md:text-lg transition-all duration-500 relative ${
                        currentStep === step.number ? "shadow-lg shadow-gold/30" : ""
                      }`}
                      style={{
                        backgroundColor: currentStep >= step.number ? COLORS.gold : "transparent",
                        color: currentStep >= step.number ? COLORS.vipBlue : COLORS.marfim,
                        border: `2px solid ${currentStep >= step.number ? COLORS.gold : `${COLORS.titanium}80`}`,
                      }}
                    >
                      {currentStep > step.number ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Check className="w-5 h-5 md:w-6 md:h-6" />
                        </motion.div>
                      ) : (
                        step.number
                      )}
                    </motion.div>

                    {/* Step Label */}
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="text-xs md:text-sm font-light text-center max-w-[110px] md:max-w-[150px] leading-tight"
                      style={{
                        color: currentStep >= step.number ? COLORS.gold : COLORS.marfim,
                      }}
                    >
                      {step.title}
                    </motion.span>
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="w-16 md:w-24 lg:w-32 h-[2px] mx-3 md:mx-6 relative -mt-12">
                      <div className="absolute inset-0" style={{ backgroundColor: `${COLORS.titanium}60` }} />
                      <motion.div
                        className="absolute inset-0"
                        style={{ backgroundColor: COLORS.gold, transformOrigin: "left" }}
                        initial={{ scaleX: 0 }}
                        animate={{
                          scaleX: currentStep > step.number ? 1 : 0,
                        }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-sm p-6 md:p-12 lg:p-16 relative overflow-hidden"
            style={{
              backgroundColor: `${COLORS.titanium}40`,
              backdropFilter: "blur(20px)",
              border: `1px solid ${COLORS.royal}60`,
              boxShadow: `0 8px 32px ${COLORS.vipBlue}80`,
            }}
          >
            {/* Elegant corner accent */}
            <div
              className="absolute top-0 left-0 w-32 h-1"
              style={{
                background: `linear-gradient(90deg, ${COLORS.gold} 0%, transparent 100%)`,
              }}
            />
            <div
              className="absolute top-0 left-0 w-1 h-32"
              style={{
                background: `linear-gradient(180deg, ${COLORS.gold} 0%, transparent 100%)`,
              }}
            />

            <form onSubmit={handleSubmit(onSubmit)} className="relative">
              <AnimatePresence mode="wait">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-8 md:space-y-10"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-2 md:space-y-3"
                    >
                      <h2
                        className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight leading-tight"
                        style={{ color: COLORS.clarity }}
                      >
                        Informações Pessoais
                      </h2>
                      <p className="text-sm md:text-base font-light" style={{ color: COLORS.marfim }}>
                        Preencha seus dados para começar
                      </p>
                    </motion.div>

                    {/* Form Fields */}
                    <div className="space-y-6 md:space-y-8 pt-4 md:pt-8">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Label
                          htmlFor="fullName"
                          className="text-xs md:text-sm font-medium mb-2 md:mb-3 block uppercase tracking-wider"
                          style={{ color: COLORS.marfim }}
                        >
                          Nome Completo *
                        </Label>
                        <Input
                          id="fullName"
                          {...register("fullName")}
                          className="h-12 md:h-14 text-sm md:text-base border-0 border-b-2 rounded-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-300 bg-transparent placeholder:text-royal"
                          style={{
                            borderColor: `${COLORS.royal}80`,
                            color: COLORS.clarity,
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = COLORS.gold
                            e.target.style.boxShadow = `0 1px 0 0 ${COLORS.gold}`
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = `${COLORS.royal}80`
                            e.target.style.boxShadow = "none"
                          }}
                          placeholder="Digite seu nome completo"
                        />
                        {errors.fullName && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-xs md:text-sm mt-2 font-light"
                          >
                            {errors.fullName.message as string}
                          </motion.p>
                        )}
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                      >
                        <Label
                          htmlFor="email"
                          className="text-xs md:text-sm font-medium mb-2 md:mb-3 block uppercase tracking-wider"
                          style={{ color: COLORS.marfim }}
                        >
                          Email *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          {...register("email")}
                          className="h-12 md:h-14 text-sm md:text-base border-0 border-b-2 rounded-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-300 bg-transparent placeholder:text-royal"
                          style={{
                            borderColor: `${COLORS.royal}80`,
                            color: COLORS.clarity,
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = COLORS.gold
                            e.target.style.boxShadow = `0 1px 0 0 ${COLORS.gold}`
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = `${COLORS.royal}80`
                            e.target.style.boxShadow = "none"
                          }}
                          placeholder="seu@email.com"
                        />
                        {errors.email && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-xs md:text-sm mt-2 font-light"
                          >
                            {errors.email.message as string}
                          </motion.p>
                        )}
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Label
                          htmlFor="phone"
                          className="text-xs md:text-sm font-medium mb-2 md:mb-3 block uppercase tracking-wider"
                          style={{ color: COLORS.marfim }}
                        >
                          Celular *
                        </Label>
                        <Controller
                          name="phone"
                          control={control}
                          render={({ field }) => (
                            <PhoneInput
                              {...field}
                              international
                              defaultCountry="BR"
                              className="phone-input-dark"
                              limitMaxLength
                            />
                          )}
                        />
                        {errors.phone && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-xs md:text-sm mt-2 font-light"
                          >
                            {errors.phone.message as string}
                          </motion.p>
                        )}
                      </motion.div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.35 }}
                        >
                          <Label
                            htmlFor="birthDate"
                            className="text-xs md:text-sm font-medium mb-2 md:mb-3 block uppercase tracking-wider"
                            style={{ color: COLORS.marfim }}
                          >
                            Data de Nascimento *
                          </Label>
                          <Input
                            id="birthDate"
                            {...register("birthDate")}
                            onChange={(e) => {
                              const formatted = formatDate(e.target.value)
                              setValue("birthDate", formatted)
                            }}
                            className="h-12 md:h-14 text-sm md:text-base border-0 border-b-2 rounded-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-300 bg-transparent placeholder:text-royal"
                            style={{
                              borderColor: `${COLORS.royal}80`,
                              color: COLORS.clarity,
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = COLORS.gold
                              e.target.style.boxShadow = `0 1px 0 0 ${COLORS.gold}`
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = `${COLORS.royal}80`
                              e.target.style.boxShadow = "none"
                            }}
                            placeholder="DD/MM/AAAA"
                            maxLength={10}
                          />
                          {errors.birthDate && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-red-400 text-xs md:text-sm mt-2 font-light"
                            >
                              {errors.birthDate.message as string}
                            </motion.p>
                          )}
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <Label
                            htmlFor="cpf"
                            className="text-xs md:text-sm font-medium mb-2 md:mb-3 block uppercase tracking-wider"
                            style={{ color: COLORS.marfim }}
                          >
                            CPF *
                          </Label>
                          <Input
                            id="cpf"
                            {...register("cpf")}
                            onChange={(e) => {
                              const formatted = formatCPF(e.target.value)
                              setValue("cpf", formatted)
                            }}
                            className="h-12 md:h-14 text-sm md:text-base border-0 border-b-2 rounded-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-300 bg-transparent placeholder:text-royal"
                            style={{
                              borderColor: `${COLORS.royal}80`,
                              color: COLORS.clarity,
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = COLORS.gold
                              e.target.style.boxShadow = `0 1px 0 0 ${COLORS.gold}`
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = `${COLORS.royal}80`
                              e.target.style.boxShadow = "none"
                            }}
                            placeholder="000.000.000-00"
                            maxLength={14}
                          />
                          {errors.cpf && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-red-400 text-xs md:text-sm mt-2 font-light"
                            >
                              {errors.cpf.message as string}
                            </motion.p>
                          )}
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Company Information */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-8 md:space-y-10"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-2 md:space-y-3"
                    >
                      <h2
                        className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight leading-tight"
                        style={{ color: COLORS.clarity }}
                      >
                        Empresa & Faturamento
                      </h2>
                      <p className="text-sm md:text-base font-light" style={{ color: COLORS.marfim }}>
                        Informações sobre sua atuação profissional
                      </p>
                    </motion.div>

                    <div className="space-y-6 md:space-y-8 pt-4 md:pt-8">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Label
                          htmlFor="position"
                          className="text-xs md:text-sm font-medium mb-2 md:mb-3 block uppercase tracking-wider"
                          style={{ color: COLORS.marfim }}
                        >
                          Cargo na Empresa *
                        </Label>
                        <Input
                          id="position"
                          {...register("position")}
                          className="h-12 md:h-14 text-sm md:text-base border-0 border-b-2 rounded-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-300 bg-transparent placeholder:text-royal"
                          style={{
                            borderColor: `${COLORS.royal}80`,
                            color: COLORS.clarity,
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = COLORS.gold
                            e.target.style.boxShadow = `0 1px 0 0 ${COLORS.gold}`
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = `${COLORS.royal}80`
                            e.target.style.boxShadow = "none"
                          }}
                          placeholder="Ex: CEO, Diretor, Gerente"
                        />
                        {errors.position && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-xs md:text-sm mt-2 font-light"
                          >
                            {errors.position.message as string}
                          </motion.p>
                        )}
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                      >
                        <Label
                          htmlFor="segment"
                          className="text-xs md:text-sm font-medium mb-2 md:mb-3 block uppercase tracking-wider"
                          style={{ color: COLORS.marfim }}
                        >
                          Segmento da Empresa *
                        </Label>
                        <Controller
                          name="segment"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger
                                className="h-12 md:h-14 text-sm md:text-base border-0 border-b-2 rounded-none px-0 focus:ring-0 focus:ring-offset-0 bg-transparent transition-all duration-300"
                                style={{
                                  borderColor: `${COLORS.royal}80`,
                                  color: field.value ? COLORS.clarity : COLORS.marfim,
                                }}
                                onFocus={(e) => {
                                  e.currentTarget.style.borderColor = COLORS.gold
                                  e.currentTarget.style.boxShadow = `0 1px 0 0 ${COLORS.gold}`
                                }}
                                onBlur={(e) => {
                                  e.currentTarget.style.borderColor = `${COLORS.royal}80`
                                  e.currentTarget.style.boxShadow = "none"
                                }}
                              >
                                <SelectValue placeholder="Selecione o segmento" />
                              </SelectTrigger>
                              <SelectContent
                                className="border rounded-sm max-h-[300px] overflow-y-auto"
                                style={{
                                  backgroundColor: COLORS.clarity,
                                  borderColor: COLORS.marfim,
                                }}
                              >
                                <SelectItem
                                  value="Agricultura e Pecuária"
                                  className="cursor-pointer hover:bg-gold/20 focus:bg-gold/10 transition-colors duration-200"
                                  style={{
                                    color: COLORS.vipBlue,
                                  }}
                                >
                                  Agricultura e Pecuária
                                </SelectItem>
                                <SelectItem
                                  value="Alimentício e Bebidas"
                                  className="cursor-pointer hover:bg-gold/20 focus:bg-gold/10 transition-colors duration-200"
                                  style={{
                                    color: COLORS.vipBlue,
                                  }}
                                >
                                  Alimentício e Bebidas
                                </SelectItem>
                                <SelectItem
                                  value="Automotivo"
                                  className="cursor-pointer hover:bg-gold/20 focus:bg-gold/10 transition-colors duration-200"
                                  style={{
                                    color: COLORS.vipBlue,
                                  }}
                                >
                                  Automotivo
                                </SelectItem>
                                <SelectItem
                                  value="Beleza e Estética"
                                  className="cursor-pointer hover:bg-gold/20 focus:bg-gold/10 transition-colors duration-200"
                                  style={{
                                    color: COLORS.vipBlue,
                                  }}
                                >
                                  Beleza e Estética
                                </SelectItem>
                                <SelectItem
                                  value="Comunicação e Mídia"
                                  className="cursor-pointer hover:bg-gold/20 focus:bg-gold/10 transition-colors duration-200"
                                  style={{
                                    color: COLORS.vipBlue,
                                  }}
                                >
                                  Comunicação e Mídia
                                </SelectItem>
                                <SelectItem
                                  value="Comércio Varejista"
                                  className="cursor-pointer hover:bg-gold/20 focus:bg-gold/10 transition-colors duration-200"
                                  style={{
                                    color: COLORS.vipBlue,
                                  }}
                                >
                                  Comércio Varejista
                                </SelectItem>
                                <SelectItem
                                  value="Construção Civil"
                                  className="cursor-pointer hover:bg-gold/20 focus:bg-gold/10 transition-colors duration-200"
                                  style={{
                                    color: COLORS.vipBlue,
                                  }}
                                >
                                  Construção Civil
                                </SelectItem>
                                <SelectItem
                                  value="Consultoria de Negócios"
                                  className="cursor-pointer hover:bg-gold/20 focus:bg-gold/10 transition-colors duration-200"
                                  style={{
                                    color: COLORS.vipBlue,
                                  }}
                                >
                                  Consultoria de Negócios
                                </SelectItem>
                                <SelectItem
                                  value="Cultura e Lazer"
                                  className="cursor-pointer hover:bg-gold/20 focus:bg-gold/10 transition-colors duration-200"
                                  style={{
                                    color: COLORS.vipBlue,
                                  }}
                                >
                                  Cultura e Lazer
                                </SelectItem>
                                <SelectItem
                                  value="Educação e Cursos"
                                  className="cursor-pointer hover:bg-gold/20 focus:bg-gold/10 transition-colors duration-200"
                                  style={{
                                    color: COLORS.vipBlue,
                                  }}
                                >
                                  Educação e Cursos
                                </SelectItem>
                                <SelectItem
                                  value="Energia e Mineração"
                                  className="cursor-pointer hover:bg-gold/20 focus:bg-gold/10 transition-colors duration-200"
                                  style={{
                                    color: COLORS.vipBlue,
                                  }}
                                >
                                  Energia e Mineração
                                </SelectItem>
                                <SelectItem
                                  value="Entretenimento e Esportes"
                                  className="cursor-pointer hover:bg-gold/20 focus:bg-gold/10 transition-colors duration-200"
                                  style={{
                                    color: COLORS.vipBlue,
                                  }}
                                >
                                  Entretenimento e Esportes
                                </SelectItem>
                                <SelectItem
                                  value="Farmacêutico e Biotec"
                                  className="cursor-pointer hover:bg-gold/20 focus:bg-gold/10 transition-colors duration-200"
                                  style={{
                                    color: COLORS.vipBlue,
                                  }}
                                >
                                  Farmacêutico e Biotec
                                </SelectItem>
                                <SelectItem
                                  value="Financeiro"
                                  className="cursor-pointer hover:bg-gold/20 focus:bg-gold/10 transition-colors duration-200"
                                  style={{
                                    color: COLORS.vipBlue,
                                  }}
                                >
                                  Financeiro
                                </SelectItem>
                                <SelectItem
                                  value="Imobiliário"
                                  className="cursor-pointer hover:bg-gold/20 focus:bg-gold/10 transition-colors duration-200"
                                  style={{
                                    color: COLORS.vipBlue,
                                  }}
                                >
                                  Imobiliário
                                </SelectItem>
                                <SelectItem
                                  value="Indústria Geral"
                                  className="cursor-pointer hover:bg-gold/20 focus:bg-gold/10 transition-colors duration-200"
                                  style={{
                                    color: COLORS.vipBlue,
                                  }}
                                >
                                  Indústria Geral
                                </SelectItem>
                                <SelectItem
                                  value="Indústria Química"
                                  className="cursor-pointer hover:bg-gold/20 focus:bg-gold/10 transition-colors duration-200"
                                  style={{
                                    color: COLORS.vipBlue,
                                  }}
                                >
                                  Indústria Química
                                </SelectItem>
                                <SelectItem
                                  value="Logística e Transportes"
                                  className="cursor-pointer hover:bg-gold/20 focus:bg-gold/10 transition-colors duration-200"
                                  style={{
                                    color: COLORS.vipBlue,
                                  }}
                                >
                                  Logística e Transportes
                                </SelectItem>
                                <SelectItem
                                  value="Meio Ambiente"
                                  className="cursor-pointer hover:bg-gold/20 focus:bg-gold/10 transition-colors duration-200"
                                  style={{
                                    color: COLORS.vipBlue,
                                  }}
                                >
                                  Meio Ambiente
                                </SelectItem>
                                <SelectItem
                                  value="Moda e Vestuário"
                                  className="cursor-pointer hover:bg-gold/20 focus:bg-gold/10 transition-colors duration-200"
                                  style={{
                                    color: COLORS.vipBlue,
                                  }}
                                >
                                  Moda e Vestuário
                                </SelectItem>
                                <SelectItem
                                  value="Petróleo e Gás"
                                  className="cursor-pointer hover:bg-gold/20 focus:bg-gold/10 transition-colors duration-200"
                                  style={{
                                    color: COLORS.vipBlue,
                                  }}
                                >
                                  Petróleo e Gás
                                </SelectItem>
                                <SelectItem
                                  value="Restaurantes e Bares"
                                  className="cursor-pointer hover:bg-gold/20 focus:bg-gold/10 transition-colors duration-200"
                                  style={{
                                    color: COLORS.vipBlue,
                                  }}
                                >
                                  Restaurantes e Bares
                                </SelectItem>
                                <SelectItem
                                  value="Saúde e Clínicas"
                                  className="cursor-pointer hover:bg-gold/20 focus:bg-gold/10 transition-colors duration-200"
                                  style={{
                                    color: COLORS.vipBlue,
                                  }}
                                >
                                  Saúde e Clínicas
                                </SelectItem>
                                <SelectItem
                                  value="Segurança Patrimonial"
                                  className="cursor-pointer hover:bg-gold/20 focus:bg-gold/10 transition-colors duration-200"
                                  style={{
                                    color: COLORS.vipBlue,
                                  }}
                                >
                                  Segurança Patrimonial
                                </SelectItem>
                                <SelectItem
                                  value="Serviços Gerais"
                                  className="cursor-pointer hover:bg-gold/20 focus:bg-gold/10 transition-colors duration-200"
                                  style={{
                                    color: COLORS.vipBlue,
                                  }}
                                >
                                  Serviços Gerais
                                </SelectItem>
                                <SelectItem
                                  value="Startups e Inovação"
                                  className="cursor-pointer hover:bg-gold/20 focus:bg-gold/10 transition-colors duration-200"
                                  style={{
                                    color: COLORS.vipBlue,
                                  }}
                                >
                                  Startups e Inovação
                                </SelectItem>
                                <SelectItem
                                  value="Tecnologia da Informação"
                                  className="cursor-pointer hover:bg-gold/20 focus:bg-gold/10 transition-colors duration-200"
                                  style={{
                                    color: COLORS.vipBlue,
                                  }}
                                >
                                  Tecnologia da Informação
                                </SelectItem>
                                <SelectItem
                                  value="Turismo e Hotelaria"
                                  className="cursor-pointer hover:bg-gold/20 focus:bg-gold/10 transition-colors duration-200"
                                  style={{
                                    color: COLORS.vipBlue,
                                  }}
                                >
                                  Turismo e Hotelaria
                                </SelectItem>
                                <SelectItem
                                  value="Outros"
                                  className="cursor-pointer hover:bg-gold/20 focus:bg-gold/10 transition-colors duration-200"
                                  style={{
                                    color: COLORS.vipBlue,
                                  }}
                                >
                                  Outros
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.segment && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-xs md:text-sm mt-2 font-light"
                          >
                            {errors.segment.message as string}
                          </motion.p>
                        )}
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Label
                          htmlFor="company"
                          className="text-xs md:text-sm font-medium mb-2 md:mb-3 block uppercase tracking-wider"
                          style={{ color: COLORS.marfim }}
                        >
                          Nome da Empresa *
                        </Label>
                        <Input
                          id="company"
                          {...register("company")}
                          className="h-12 md:h-14 text-sm md:text-base border-0 border-b-2 rounded-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-300 bg-transparent placeholder:text-royal"
                          style={{
                            borderColor: `${COLORS.royal}80`,
                            color: COLORS.clarity,
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = COLORS.gold
                            e.target.style.boxShadow = `0 1px 0 0 ${COLORS.gold}`
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = `${COLORS.royal}80`
                            e.target.style.boxShadow = "none"
                          }}
                          placeholder="Digite o nome da empresa"
                        />
                        {errors.company && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-xs md:text-sm mt-2 font-light"
                          >
                            {errors.company.message as string}
                          </motion.p>
                        )}
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                      >
                        <Label
                          htmlFor="revenue"
                          className="text-xs md:text-sm font-medium mb-2 md:mb-3 block uppercase tracking-wider"
                          style={{ color: COLORS.marfim }}
                        >
                          Faturamento Anual *
                        </Label>
                        <Controller
                          name="revenue"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger
                                className="h-12 md:h-14 text-sm md:text-base border-0 border-b-2 rounded-none px-0 focus:ring-0 focus:ring-offset-0 bg-transparent transition-all duration-300"
                                style={{
                                  borderColor: `${COLORS.royal}80`,
                                  color: field.value ? COLORS.clarity : COLORS.marfim,
                                }}
                                onFocus={(e) => {
                                  e.currentTarget.style.borderColor = COLORS.gold
                                  e.currentTarget.style.boxShadow = `0 1px 0 0 ${COLORS.gold}`
                                }}
                                onBlur={(e) => {
                                  e.currentTarget.style.borderColor = `${COLORS.royal}80`
                                  e.currentTarget.style.boxShadow = "none"
                                }}
                              >
                                <SelectValue placeholder="Selecione uma Opção" />
                              </SelectTrigger>
                              <SelectContent
                                className="border rounded-sm"
                                style={{
                                  backgroundColor: COLORS.clarity,
                                  borderColor: COLORS.marfim,
                                }}
                              >
                                <SelectItem
                                  value="-10MM"
                                  className="cursor-pointer hover:bg-gold/20 focus:bg-gold/10 transition-colors duration-200"
                                  style={{
                                    color: COLORS.vipBlue,
                                  }}
                                >
                                  Até 10 milhões
                                </SelectItem>
                                <SelectItem
                                  value="10MM-30MM"
                                  className="cursor-pointer hover:bg-gold/20 focus:bg-gold/10 transition-colors duration-200"
                                  style={{
                                    color: COLORS.vipBlue,
                                  }}
                                >
                                  De 10 a 30 milhões
                                </SelectItem>
                                <SelectItem
                                  value="30MM-50MM"
                                  className="cursor-pointer hover:bg-gold/20 focus:bg-gold/10 transition-colors duration-200"
                                  style={{
                                    color: COLORS.vipBlue,
                                  }}
                                >
                                  De 30 a 50 milhões
                                </SelectItem>
                                <SelectItem
                                  value="+50MM"
                                  className="cursor-pointer hover:bg-gold/20 focus:bg-gold/10 transition-colors duration-200"
                                  style={{
                                    color: COLORS.vipBlue,
                                  }}
                                >
                                  Mais de 50 milhões
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.revenue && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-xs md:text-sm mt-2 font-light"
                          >
                            {errors.revenue.message as string}
                          </motion.p>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Social Media */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-8 md:space-y-10"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-2 md:space-y-3"
                    >
                      <h2
                        className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight leading-tight"
                        style={{ color: COLORS.clarity }}
                      >
                        Redes Sociais
                      </h2>
                      <p className="text-sm md:text-base font-light" style={{ color: COLORS.marfim }}>
                        Complete seu perfil profissional
                      </p>
                    </motion.div>

                    <div className="space-y-8 md:space-y-10 pt-4 md:pt-8">
                      {/* Instagram */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Label
                          htmlFor="instagram"
                          className="text-xs md:text-sm font-medium mb-2 md:mb-3 block uppercase tracking-wider"
                          style={{ color: COLORS.marfim }}
                        >
                          Instagram
                        </Label>
                        <div
                          className="flex items-center border-b-2 transition-all duration-300"
                          style={{ borderColor: `${COLORS.royal}80` }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = COLORS.gold
                            e.currentTarget.style.boxShadow = `0 1px 0 0 ${COLORS.gold}`
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = `${COLORS.royal}80`
                            e.currentTarget.style.boxShadow = "none"
                          }}
                        >
                          <span className="text-xs md:text-sm font-light pr-2" style={{ color: COLORS.marfim }}>
                            https://instagram.com/
                          </span>
                          <Input
                            id="instagram"
                            {...register("instagram")}
                            className="h-12 md:h-14 text-sm md:text-base border-0 rounded-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 bg-transparent placeholder:text-royal"
                            style={{
                              color: COLORS.clarity,
                            }}
                            placeholder="seu_usuario"
                          />
                        </div>
                      </motion.div>

                      {/* LinkedIn */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                      >
                        <Label
                          htmlFor="linkedin"
                          className="text-xs md:text-sm font-medium mb-2 md:mb-3 block uppercase tracking-wider"
                          style={{ color: COLORS.marfim }}
                        >
                          LinkedIn
                        </Label>
                        <div
                          className="flex items-center border-b-2 transition-all duration-300"
                          style={{ borderColor: `${COLORS.royal}80` }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = COLORS.gold
                            e.currentTarget.style.boxShadow = `0 1px 0 0 ${COLORS.gold}`
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = `${COLORS.royal}80`
                            e.currentTarget.style.boxShadow = "none"
                          }}
                        >
                          <span className="text-xs md:text-sm font-light pr-2" style={{ color: COLORS.marfim }}>
                            https://www.linkedin.com/in/
                          </span>
                          <Input
                            id="linkedin"
                            {...register("linkedin")}
                            className="h-12 md:h-14 text-sm md:text-base border-0 rounded-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 bg-transparent placeholder:text-royal"
                            style={{
                              color: COLORS.clarity,
                            }}
                            placeholder="seu-perfil"
                          />
                        </div>
                      </motion.div>

                      {/* Bio */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Label
                          htmlFor="bio"
                          className="text-xs md:text-sm font-medium mb-2 md:mb-3 block uppercase tracking-wider"
                          style={{ color: COLORS.marfim }}
                        >
                          Mini Bio
                        </Label>
                        <Textarea
                          id="bio"
                          {...register("bio")}
                          rows={6}
                          maxLength={1000}
                          className="text-sm md:text-base border-2 rounded-sm p-4 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none transition-all duration-300 bg-transparent placeholder:text-royal"
                          style={{
                            borderColor: `${COLORS.royal}80`,
                            color: COLORS.clarity,
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = COLORS.gold
                            e.target.style.boxShadow = `0 0 0 1px ${COLORS.gold}`
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = `${COLORS.royal}80`
                            e.target.style.boxShadow = "none"
                          }}
                          placeholder="Conte sobre sua experiência profissional, interesses e objetivos..."
                        />
                        <p className="text-xs mt-2 font-light" style={{ color: COLORS.marfim }}>
                          {watch("bio")?.length || 0}/1000 caracteres
                        </p>
                        {errors.bio && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-xs md:text-sm mt-2 font-light"
                          >
                            {errors.bio.message as string}
                          </motion.p>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-between items-center mt-12 md:mt-16 pt-8 md:pt-12 border-t gap-4"
                style={{ borderColor: `${COLORS.royal}60` }}
              >
                <motion.div
                  whileHover={{ x: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Button
                    type="button"
                    onClick={handleBack}
                    disabled={currentStep === 1 || isSubmitting}
                    variant="ghost"
                    className="h-11 md:h-12 px-0 font-light text-sm md:text-base hover:bg-transparent"
                    style={{
                      color: currentStep === 1 ? `${COLORS.marfim}60` : COLORS.marfim,
                      opacity: currentStep === 1 ? 0.4 : 1,
                    }}
                  >
                    <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    Voltar
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 md:h-12 px-6 md:px-8 font-light text-sm md:text-base rounded-sm transition-all duration-300 shadow-lg shadow-gold/20 hover:shadow-gold/30"
                    style={{
                      backgroundColor: isSubmitting ? COLORS.royal : COLORS.gold,
                      color: COLORS.vipBlue,
                      opacity: isSubmitting ? 0.7 : 1,
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 md:w-5 md:h-5 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : currentStep === 3 ? (
                      <>
                        Finalizar
                        <Check className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                      </>
                    ) : (
                      <>
                        Próximo
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
