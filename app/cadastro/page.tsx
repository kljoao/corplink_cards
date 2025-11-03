"use client"

import type React from "react"
import { useState } from "react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, ArrowRight, Check, Upload, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

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
  revenue: z.string().min(1, "Faturamento anual é obrigatório"),
})

const step3Schema = z.object({
  profilePhoto: z.string().optional(),
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
  const [profileImage, setProfileImage] = useState<string>("")

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

  // Format CPF
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    }
    return value
  }

  // Format Date
  const formatDate = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 8) {
      return numbers.replace(/(\d{2})(\d)/, "$1/$2").replace(/(\d{2})(\d)/, "$1/$2")
    }
    return value
  }

  const onSubmit = (data: any) => {
    setFormData({ ...formData, ...data })

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      // Final submission
      console.log("Form submitted:", { ...formData, ...data })
      // Here you would send to your backend
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
        setValue("profilePhoto", reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const steps = [
    { number: 1, title: "Informações Pessoais" },
    { number: 2, title: "Empresa & Faturamento" },
    { number: 3, title: "Redes Sociais" },
  ]

  return (
    <div className="min-h-screen font-sans relative" style={{ backgroundColor: COLORS.clarity }}>
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${COLORS.vipBlue} 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="border-b relative z-10"
        style={{ borderColor: `${COLORS.marfim}40`, backgroundColor: COLORS.clarity }}
      >
        <div className="container mx-auto px-6 lg:px-12 py-8">
          <Link href="/" className="inline-block">
            <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }}>
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_5378.PNG-NSuNb3cDcr6PjNNtk10dND9DadBSQW.png"
                alt="CorpLink"
                width={200}
                height={45}
                className="h-10 w-auto"
              />
            </motion.div>
          </Link>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 lg:px-12 py-12 md:py-20 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Step Indicator - Minimalist Design */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16 md:mb-24"
          >
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center w-full">
                    {/* Step Circle */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 200 }}
                      className="relative"
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-medium text-base transition-all duration-500 relative ${
                          currentStep === step.number ? "shadow-lg" : ""
                        }`}
                        style={{
                          backgroundColor: currentStep >= step.number ? COLORS.vipBlue : "transparent",
                          color: currentStep >= step.number ? COLORS.gold : COLORS.marfim,
                          border: `2px solid ${currentStep >= step.number ? COLORS.vipBlue : COLORS.marfim}`,
                        }}
                      >
                        {currentStep > step.number ? (
                          <motion.div
                            initial={{ scale: 0, rotate: -90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Check className="w-5 h-5" />
                          </motion.div>
                        ) : (
                          step.number
                        )}
                      </motion.div>
                    </motion.div>

                    {/* Step Label */}
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="mt-4 text-xs md:text-sm font-medium text-center max-w-[120px] leading-tight"
                      style={{
                        color: currentStep >= step.number ? COLORS.vipBlue : COLORS.marfim,
                      }}
                    >
                      {step.title}
                    </motion.span>
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-[2px] mx-4 md:mx-8 relative -mt-12">
                      <div className="absolute inset-0" style={{ backgroundColor: COLORS.marfim }} />
                      <motion.div
                        className="absolute inset-0"
                        style={{ backgroundColor: COLORS.vipBlue }}
                        initial={{ scaleX: 0 }}
                        animate={{
                          scaleX: currentStep > step.number ? 1 : 0,
                        }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        style={{ transformOrigin: "left" }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form Container - Clean and Spacious */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-none md:rounded-sm p-8 md:p-16 lg:p-20 relative"
            style={{
              boxShadow: `0 1px 3px ${COLORS.vipBlue}10`,
            }}
          >
            {/* Minimal corner accent */}
            <div className="absolute top-0 left-0 w-1 h-20" style={{ backgroundColor: COLORS.gold }} />

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
                    className="space-y-10"
                  >
                    {/* Title */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-3"
                    >
                      <h2
                        className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-tight"
                        style={{ color: COLORS.vipBlue }}
                      >
                        Informações
                        <br />
                        Pessoais
                      </h2>
                      <p className="text-base md:text-lg font-light" style={{ color: COLORS.titanium }}>
                        Preencha seus dados para começar
                      </p>
                    </motion.div>

                    {/* Form Fields */}
                    <div className="space-y-8 pt-8">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Label
                          htmlFor="fullName"
                          className="text-sm font-medium mb-3 block uppercase tracking-wider"
                          style={{ color: COLORS.titanium }}
                        >
                          Nome Completo *
                        </Label>
                        <Input
                          id="fullName"
                          {...register("fullName")}
                          className="h-14 text-base border-0 border-b-2 rounded-none px-0 focus-visible:ring-0 transition-all duration-300"
                          style={{
                            backgroundColor: "transparent",
                            borderColor: COLORS.marfim,
                            color: COLORS.vipBlue,
                          }}
                          onFocus={(e) => (e.target.style.borderColor = COLORS.vipBlue)}
                          onBlur={(e) => (e.target.style.borderColor = COLORS.marfim)}
                          placeholder="Digite seu nome completo"
                        />
                        {errors.fullName && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-600 text-sm mt-2 font-light"
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
                          className="text-sm font-medium mb-3 block uppercase tracking-wider"
                          style={{ color: COLORS.titanium }}
                        >
                          Email *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          {...register("email")}
                          className="h-14 text-base border-0 border-b-2 rounded-none px-0 focus-visible:ring-0 transition-all duration-300"
                          style={{
                            backgroundColor: "transparent",
                            borderColor: COLORS.marfim,
                            color: COLORS.vipBlue,
                          }}
                          onFocus={(e) => (e.target.style.borderColor = COLORS.vipBlue)}
                          onBlur={(e) => (e.target.style.borderColor = COLORS.marfim)}
                          placeholder="seu@email.com"
                        />
                        {errors.email && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-600 text-sm mt-2 font-light"
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
                          className="text-sm font-medium mb-3 block uppercase tracking-wider"
                          style={{ color: COLORS.titanium }}
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
                              className="phone-input-minimal"
                              numberInputProps={{
                                className:
                                  "h-14 text-base border-0 border-b-2 rounded-none px-0 focus:outline-none transition-all duration-300 w-full",
                                style: {
                                  backgroundColor: "transparent",
                                  borderColor: COLORS.marfim,
                                  color: COLORS.vipBlue,
                                },
                              }}
                            />
                          )}
                        />
                        {errors.phone && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-600 text-sm mt-2 font-light"
                          >
                            {errors.phone.message as string}
                          </motion.p>
                        )}
                      </motion.div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.35 }}
                        >
                          <Label
                            htmlFor="birthDate"
                            className="text-sm font-medium mb-3 block uppercase tracking-wider"
                            style={{ color: COLORS.titanium }}
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
                            className="h-14 text-base border-0 border-b-2 rounded-none px-0 focus-visible:ring-0 transition-all duration-300"
                            style={{
                              backgroundColor: "transparent",
                              borderColor: COLORS.marfim,
                              color: COLORS.vipBlue,
                            }}
                            onFocus={(e) => (e.target.style.borderColor = COLORS.vipBlue)}
                            onBlur={(e) => (e.target.style.borderColor = COLORS.marfim)}
                            placeholder="DD/MM/AAAA"
                            maxLength={10}
                          />
                          {errors.birthDate && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-red-600 text-sm mt-2 font-light"
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
                            className="text-sm font-medium mb-3 block uppercase tracking-wider"
                            style={{ color: COLORS.titanium }}
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
                            className="h-14 text-base border-0 border-b-2 rounded-none px-0 focus-visible:ring-0 transition-all duration-300"
                            style={{
                              backgroundColor: "transparent",
                              borderColor: COLORS.marfim,
                              color: COLORS.vipBlue,
                            }}
                            onFocus={(e) => (e.target.style.borderColor = COLORS.vipBlue)}
                            onBlur={(e) => (e.target.style.borderColor = COLORS.marfim)}
                            placeholder="000.000.000-00"
                            maxLength={14}
                          />
                          {errors.cpf && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-red-600 text-sm mt-2 font-light"
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
                    className="space-y-10"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-3"
                    >
                      <h2
                        className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-tight"
                        style={{ color: COLORS.vipBlue }}
                      >
                        Empresa &<br />
                        Faturamento
                      </h2>
                      <p className="text-base md:text-lg font-light" style={{ color: COLORS.titanium }}>
                        Informações sobre sua atuação profissional
                      </p>
                    </motion.div>

                    <div className="space-y-8 pt-8">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Label
                          htmlFor="position"
                          className="text-sm font-medium mb-3 block uppercase tracking-wider"
                          style={{ color: COLORS.titanium }}
                        >
                          Cargo na Empresa *
                        </Label>
                        <Input
                          id="position"
                          {...register("position")}
                          className="h-14 text-base border-0 border-b-2 rounded-none px-0 focus-visible:ring-0 transition-all duration-300"
                          style={{
                            backgroundColor: "transparent",
                            borderColor: COLORS.marfim,
                            color: COLORS.vipBlue,
                          }}
                          onFocus={(e) => (e.target.style.borderColor = COLORS.vipBlue)}
                          onBlur={(e) => (e.target.style.borderColor = COLORS.marfim)}
                          placeholder="Ex: CEO, Diretor, Gerente"
                        />
                        {errors.position && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-600 text-sm mt-2 font-light"
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
                          className="text-sm font-medium mb-3 block uppercase tracking-wider"
                          style={{ color: COLORS.titanium }}
                        >
                          Segmento da Empresa *
                        </Label>
                        <Controller
                          name="segment"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger
                                className="h-14 text-base border-0 border-b-2 rounded-none px-0 focus:ring-0"
                                style={{
                                  backgroundColor: "transparent",
                                  borderColor: COLORS.marfim,
                                  color: COLORS.vipBlue,
                                }}
                              >
                                <SelectValue placeholder="Selecione o segmento" />
                              </SelectTrigger>
                              <SelectContent style={{ backgroundColor: "white" }}>
                                <SelectItem value="automotivo" style={{ color: COLORS.vipBlue }}>
                                  Automotivo
                                </SelectItem>
                                <SelectItem value="financeiro" style={{ color: COLORS.vipBlue }}>
                                  Financeiro
                                </SelectItem>
                                <SelectItem value="pecuario" style={{ color: COLORS.vipBlue }}>
                                  Pecuário
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.segment && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-600 text-sm mt-2 font-light"
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
                          className="text-sm font-medium mb-3 block uppercase tracking-wider"
                          style={{ color: COLORS.titanium }}
                        >
                          Nome da Empresa *
                        </Label>
                        <Input
                          id="company"
                          {...register("company")}
                          className="h-14 text-base border-0 border-b-2 rounded-none px-0 focus-visible:ring-0 transition-all duration-300"
                          style={{
                            backgroundColor: "transparent",
                            borderColor: COLORS.marfim,
                            color: COLORS.vipBlue,
                          }}
                          onFocus={(e) => (e.target.style.borderColor = COLORS.vipBlue)}
                          onBlur={(e) => (e.target.style.borderColor = COLORS.marfim)}
                          placeholder="Digite o nome da empresa"
                        />
                        {errors.company && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-600 text-sm mt-2 font-light"
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
                          className="text-sm font-medium mb-3 block uppercase tracking-wider"
                          style={{ color: COLORS.titanium }}
                        >
                          Faturamento Anual *
                        </Label>
                        <Input
                          id="revenue"
                          {...register("revenue")}
                          className="h-14 text-base border-0 border-b-2 rounded-none px-0 focus-visible:ring-0 transition-all duration-300"
                          style={{
                            backgroundColor: "transparent",
                            borderColor: COLORS.marfim,
                            color: COLORS.vipBlue,
                          }}
                          onFocus={(e) => (e.target.style.borderColor = COLORS.vipBlue)}
                          onBlur={(e) => (e.target.style.borderColor = COLORS.marfim)}
                          placeholder="Ex: R$ 5.000.000"
                        />
                        {errors.revenue && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-600 text-sm mt-2 font-light"
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
                    className="space-y-10"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-3"
                    >
                      <h2
                        className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-tight"
                        style={{ color: COLORS.vipBlue }}
                      >
                        Redes
                        <br />
                        Sociais
                      </h2>
                      <p className="text-base md:text-lg font-light" style={{ color: COLORS.titanium }}>
                        Complete seu perfil profissional
                      </p>
                    </motion.div>

                    <div className="space-y-10 pt-8">
                      {/* Profile Photo */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-start"
                      >
                        <Label
                          className="text-sm font-medium mb-6 block uppercase tracking-wider"
                          style={{ color: COLORS.titanium }}
                        >
                          Foto de Perfil
                        </Label>
                        <div className="relative group">
                          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }}>
                            <Avatar
                              className="w-28 h-28 md:w-32 md:h-32 border-2"
                              style={{ borderColor: COLORS.vipBlue }}
                            >
                              <AvatarImage src={profileImage || "/placeholder.svg"} />
                              <AvatarFallback style={{ backgroundColor: COLORS.clarity }}>
                                <User className="w-12 h-12 md:w-14 md:h-14" style={{ color: COLORS.marfim }} />
                              </AvatarFallback>
                            </Avatar>
                          </motion.div>
                          <label
                            htmlFor="photo-upload"
                            className="absolute bottom-0 right-0 p-2.5 rounded-full cursor-pointer transition-all duration-300 hover:scale-110"
                            style={{ backgroundColor: COLORS.vipBlue }}
                          >
                            <Upload className="w-4 h-4" style={{ color: COLORS.gold }} />
                            <input
                              id="photo-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageUpload}
                            />
                          </label>
                        </div>
                      </motion.div>

                      {/* Instagram */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Label
                          htmlFor="instagram"
                          className="text-sm font-medium mb-3 block uppercase tracking-wider"
                          style={{ color: COLORS.titanium }}
                        >
                          Instagram
                        </Label>
                        <div className="flex items-center border-b-2" style={{ borderColor: COLORS.marfim }}>
                          <span className="text-sm font-light pr-2" style={{ color: COLORS.titanium }}>
                            https://instagram.com/
                          </span>
                          <Input
                            id="instagram"
                            {...register("instagram")}
                            className="h-14 text-base border-0 rounded-none px-0 focus-visible:ring-0 flex-1"
                            style={{
                              backgroundColor: "transparent",
                              color: COLORS.vipBlue,
                            }}
                            placeholder="seu_usuario"
                          />
                        </div>
                      </motion.div>

                      {/* LinkedIn */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                      >
                        <Label
                          htmlFor="linkedin"
                          className="text-sm font-medium mb-3 block uppercase tracking-wider"
                          style={{ color: COLORS.titanium }}
                        >
                          LinkedIn
                        </Label>
                        <div className="flex items-center border-b-2" style={{ borderColor: COLORS.marfim }}>
                          <span className="text-sm font-light pr-2" style={{ color: COLORS.titanium }}>
                            https://www.linkedin.com/in/
                          </span>
                          <Input
                            id="linkedin"
                            {...register("linkedin")}
                            className="h-14 text-base border-0 rounded-none px-0 focus-visible:ring-0 flex-1"
                            style={{
                              backgroundColor: "transparent",
                              color: COLORS.vipBlue,
                            }}
                            placeholder="seu-perfil"
                          />
                        </div>
                      </motion.div>

                      {/* Bio */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Label
                          htmlFor="bio"
                          className="text-sm font-medium mb-3 block uppercase tracking-wider"
                          style={{ color: COLORS.titanium }}
                        >
                          Mini Bio
                        </Label>
                        <Textarea
                          id="bio"
                          {...register("bio")}
                          rows={6}
                          maxLength={1000}
                          className="text-base border-2 rounded-none p-4 focus-visible:ring-0 resize-none transition-all duration-300"
                          style={{
                            backgroundColor: "transparent",
                            borderColor: COLORS.marfim,
                            color: COLORS.vipBlue,
                          }}
                          onFocus={(e) => (e.target.style.borderColor = COLORS.vipBlue)}
                          onBlur={(e) => (e.target.style.borderColor = COLORS.marfim)}
                          placeholder="Conte sobre sua experiência profissional, interesses e objetivos..."
                        />
                        <p className="text-xs mt-2 font-light" style={{ color: COLORS.titanium }}>
                          {watch("bio")?.length || 0}/1000 caracteres
                        </p>
                        {errors.bio && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-600 text-sm mt-2 font-light"
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
                className="flex justify-between items-center mt-16 pt-12 border-t gap-6"
                style={{ borderColor: `${COLORS.marfim}40` }}
              >
                <motion.div
                  whileHover={{ x: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Button
                    type="button"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    variant="ghost"
                    className="h-12 px-0 font-medium text-base hover:bg-transparent"
                    style={{
                      color: currentStep === 1 ? COLORS.marfim : COLORS.vipBlue,
                      opacity: currentStep === 1 ? 0.4 : 1,
                    }}
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Voltar
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Button
                    type="submit"
                    className="h-12 px-8 font-medium text-base rounded-none transition-all duration-300"
                    style={{
                      backgroundColor: COLORS.vipBlue,
                      color: COLORS.gold,
                    }}
                  >
                    {currentStep === 3 ? (
                      <>
                        Finalizar
                        <Check className="w-5 h-5 ml-2" />
                      </>
                    ) : (
                      <>
                        Próximo
                        <ArrowRight className="w-5 h-5 ml-2" />
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
