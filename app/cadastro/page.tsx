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
                                className="border rounded-sm"
                                style={{
                                  backgroundColor: COLORS.clarity,
                                  borderColor: COLORS.marfim,
                                }}
                              >
                                <SelectItem
                                  value="automotivo"
                                  className="cursor-pointer focus:bg-gold/10 transition-colors"
                                  style={{
                                    color: COLORS.vipBlue,
                                  }}
                                >
                                  Automotivo
                                </SelectItem>
                                <SelectItem
                                  value="financeiro"
                                  className="cursor-pointer focus:bg-gold/10 transition-colors"
                                  style={{
                                    color: COLORS.vipBlue,
                                  }}
                                >
                                  Financeiro
                                </SelectItem>
                                <SelectItem
                                  value="pecuario"
                                  className="cursor-pointer focus:bg-gold/10 transition-colors"
                                  style={{
                                    color: COLORS.vipBlue,
                                  }}
                                >
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
                        <Input
                          id="revenue"
                          {...register("revenue")}
                          onChange={(e) => {
                            const formatted = formatBRL(e.target.value)
                            setValue("revenue", formatted)
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
                          placeholder="R$ 0,00"
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
                      {/* Profile Photo */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-start"
                      >
                        <Label
                          className="text-xs md:text-sm font-medium mb-4 md:mb-6 block uppercase tracking-wider"
                          style={{ color: COLORS.marfim }}
                        >
                          Foto de Perfil
                        </Label>
                        <div className="relative group">
                          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }}>
                            <Avatar className="w-24 h-24 md:w-28 md:h-28 border-2" style={{ borderColor: COLORS.gold }}>
                              <AvatarImage src={profileImage || "/placeholder.svg"} />
                              <AvatarFallback style={{ backgroundColor: COLORS.royal }}>
                                <User className="w-10 h-10 md:w-12 md:h-12" style={{ color: COLORS.marfim }} />
                              </AvatarFallback>
                            </Avatar>
                          </motion.div>
                          <label
                            htmlFor="photo-upload"
                            className="absolute bottom-0 right-0 p-2 md:p-2.5 rounded-full cursor-pointer transition-all duration-300 hover:scale-110"
                            style={{ backgroundColor: COLORS.gold }}
                          >
                            <Upload className="w-4 h-4" style={{ color: COLORS.vipBlue }} />
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
                        transition={{ delay: 0.35 }}
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
                        transition={{ delay: 0.4 }}
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
                    disabled={currentStep === 1}
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
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Button
                    type="submit"
                    className="h-11 md:h-12 px-6 md:px-8 font-light text-sm md:text-base rounded-sm transition-all duration-300 shadow-lg shadow-gold/20 hover:shadow-gold/30"
                    style={{
                      backgroundColor: COLORS.gold,
                      color: COLORS.vipBlue,
                    }}
                  >
                    {currentStep === 3 ? (
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
