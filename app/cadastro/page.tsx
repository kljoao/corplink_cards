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
import { ArrowLeft, ArrowRight, Check, Upload, User, Sparkles } from "lucide-react"
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
    <div className="min-h-screen font-sans relative overflow-hidden" style={{ backgroundColor: COLORS.vipBlue }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-5"
          style={{ backgroundColor: COLORS.gold }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-5"
          style={{ backgroundColor: COLORS.gold }}
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>

      {/* Header with Logo */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="border-b backdrop-blur-sm relative z-10"
        style={{ borderColor: COLORS.titanium, backgroundColor: `${COLORS.vipBlue}99` }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_5378.PNG-NSuNb3cDcr6PjNNtk10dND9DadBSQW.png"
              alt="CorpLink"
              width={180}
              height={40}
              className="h-8 md:h-10 w-auto hover:opacity-80 transition-opacity"
            />
          </Link>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 md:mb-16"
          >
            <div className="flex items-center justify-between relative">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1 relative z-10">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.15, type: "spring", stiffness: 200 }}
                    className="flex flex-col items-center w-full"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center font-bold text-lg md:text-xl transition-all duration-500 relative ${
                        currentStep > step.number
                          ? "shadow-lg shadow-yellow-500/50"
                          : currentStep === step.number
                            ? "shadow-xl shadow-yellow-500/60 ring-4 ring-offset-4"
                            : ""
                      }`}
                      style={
                        {
                          backgroundColor: currentStep >= step.number ? COLORS.gold : COLORS.titanium,
                          color: currentStep >= step.number ? COLORS.vipBlue : COLORS.marfim,
                          ringColor: currentStep === step.number ? COLORS.gold : "transparent",
                          ringOffsetColor: COLORS.vipBlue,
                        } as any
                      }
                    >
                      {currentStep > step.number ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <Check className="w-6 h-6 md:w-7 md:h-7" />
                        </motion.div>
                      ) : (
                        step.number
                      )}
                      {currentStep === step.number && (
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{ backgroundColor: COLORS.gold }}
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.5, 0, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                        />
                      )}
                    </motion.div>
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.15 + 0.2 }}
                      className="mt-3 text-xs md:text-sm font-semibold text-center max-w-[100px] leading-tight"
                      style={{
                        color: currentStep >= step.number ? COLORS.gold : COLORS.marfim,
                      }}
                    >
                      {step.title}
                    </motion.span>
                  </motion.div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-1 mx-3 md:mx-6 rounded-full relative overflow-hidden">
                      <div className="absolute inset-0 rounded-full" style={{ backgroundColor: COLORS.titanium }} />
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: COLORS.gold, transformOrigin: "left" }}
                        initial={{ scaleX: 0 }}
                        animate={{
                          scaleX: currentStep > step.number ? 1 : 0,
                        }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl relative overflow-hidden backdrop-blur-sm"
            style={{
              backgroundColor: `${COLORS.titanium}dd`,
              boxShadow: `0 25px 50px -12px ${COLORS.vipBlue}80, 0 0 0 1px ${COLORS.royal}40`,
            }}
          >
            {/* Decorative corner accents */}
            <div
              className="absolute top-0 right-0 w-32 h-32 opacity-10"
              style={{
                background: `linear-gradient(135deg, ${COLORS.gold} 0%, transparent 70%)`,
              }}
            />
            <div
              className="absolute bottom-0 left-0 w-32 h-32 opacity-10"
              style={{
                background: `linear-gradient(-45deg, ${COLORS.gold} 0%, transparent 70%)`,
              }}
            />

            <form onSubmit={handleSubmit(onSubmit)} className="relative z-10">
              <AnimatePresence mode="wait">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="space-y-8"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <motion.div
                          animate={{
                            rotate: [0, 10, -10, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                        >
                          <Sparkles className="w-6 h-6 md:w-8 md:h-8" style={{ color: COLORS.gold }} />
                        </motion.div>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight" style={{ color: COLORS.clarity }}>
                          Informações Pessoais
                        </h2>
                      </div>
                      <p className="text-base md:text-lg" style={{ color: COLORS.marfim }}>
                        Preencha seus dados pessoais para começar sua jornada exclusiva
                      </p>
                    </motion.div>

                    <div className="space-y-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Label
                          htmlFor="fullName"
                          className="text-base font-medium mb-3 block"
                          style={{ color: COLORS.clarity }}
                        >
                          Nome Completo *
                        </Label>
                        <Input
                          id="fullName"
                          {...register("fullName")}
                          className="h-14 text-base bg-opacity-50 border-0 focus:ring-2 text-white placeholder:text-gray-400 transition-all duration-300"
                          style={
                            {
                              backgroundColor: COLORS.royal,
                              "--tw-ring-color": COLORS.gold,
                            } as any
                          }
                          placeholder="Digite seu nome completo"
                        />
                        {errors.fullName && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-sm mt-2"
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
                          className="text-base font-medium mb-3 block"
                          style={{ color: COLORS.clarity }}
                        >
                          Email *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          {...register("email")}
                          className="h-14 text-base bg-opacity-50 border-0 focus:ring-2 text-white placeholder:text-gray-400 transition-all duration-300"
                          style={
                            {
                              backgroundColor: COLORS.royal,
                              "--tw-ring-color": COLORS.gold,
                            } as any
                          }
                          placeholder="seu@email.com"
                        />
                        {errors.email && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-sm mt-2"
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
                          className="text-base font-medium mb-3 block"
                          style={{ color: COLORS.clarity }}
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
                              className="phone-input-custom"
                              numberInputProps={{
                                className:
                                  "h-14 text-base bg-opacity-50 border-0 focus:ring-2 text-white placeholder:text-gray-400 px-4 rounded-lg w-full transition-all duration-300",
                                style: {
                                  backgroundColor: COLORS.royal,
                                  outline: "none",
                                },
                              }}
                            />
                          )}
                        />
                        {errors.phone && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-sm mt-2"
                          >
                            {errors.phone.message as string}
                          </motion.p>
                        )}
                      </motion.div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.35 }}
                        >
                          <Label
                            htmlFor="birthDate"
                            className="text-base font-medium mb-3 block"
                            style={{ color: COLORS.clarity }}
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
                            className="h-14 text-base bg-opacity-50 border-0 focus:ring-2 text-white placeholder:text-gray-400 transition-all duration-300"
                            style={
                              {
                                backgroundColor: COLORS.royal,
                                "--tw-ring-color": COLORS.gold,
                              } as any
                            }
                            placeholder="DD/MM/AAAA"
                            maxLength={10}
                          />
                          {errors.birthDate && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-red-400 text-sm mt-2"
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
                            className="text-base font-medium mb-3 block"
                            style={{ color: COLORS.clarity }}
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
                            className="h-14 text-base bg-opacity-50 border-0 focus:ring-2 text-white placeholder:text-gray-400 transition-all duration-300"
                            style={
                              {
                                backgroundColor: COLORS.royal,
                                "--tw-ring-color": COLORS.gold,
                              } as any
                            }
                            placeholder="000.000.000-00"
                            maxLength={14}
                          />
                          {errors.cpf && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-red-400 text-sm mt-2"
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
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="space-y-8"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <motion.div
                          animate={{
                            rotate: [0, 10, -10, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                        >
                          <Sparkles className="w-6 h-6 md:w-8 md:h-8" style={{ color: COLORS.gold }} />
                        </motion.div>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight" style={{ color: COLORS.clarity }}>
                          Empresa & Faturamento
                        </h2>
                      </div>
                      <p className="text-base md:text-lg" style={{ color: COLORS.marfim }}>
                        Conte-nos sobre sua empresa e posição profissional
                      </p>
                    </motion.div>

                    <div className="space-y-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Label
                          htmlFor="position"
                          className="text-base font-medium mb-3 block"
                          style={{ color: COLORS.clarity }}
                        >
                          Cargo na Empresa *
                        </Label>
                        <Input
                          id="position"
                          {...register("position")}
                          className="h-14 text-base bg-opacity-50 border-0 focus:ring-2 text-white placeholder:text-gray-400 transition-all duration-300"
                          style={
                            {
                              backgroundColor: COLORS.royal,
                              "--tw-ring-color": COLORS.gold,
                            } as any
                          }
                          placeholder="Ex: CEO, Diretor, Gerente"
                        />
                        {errors.position && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-sm mt-2"
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
                          className="text-base font-medium mb-3 block"
                          style={{ color: COLORS.clarity }}
                        >
                          Segmento da Empresa *
                        </Label>
                        <Controller
                          name="segment"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger
                                className="h-14 text-base bg-opacity-50 border-0 focus:ring-2 text-white transition-all duration-300"
                                style={
                                  {
                                    backgroundColor: COLORS.royal,
                                    "--tw-ring-color": COLORS.gold,
                                  } as any
                                }
                              >
                                <SelectValue placeholder="Selecione o segmento" />
                              </SelectTrigger>
                              <SelectContent style={{ backgroundColor: COLORS.royal }}>
                                <SelectItem value="automotivo" className="text-white hover:bg-opacity-80">
                                  Automotivo
                                </SelectItem>
                                <SelectItem value="financeiro" className="text-white hover:bg-opacity-80">
                                  Financeiro
                                </SelectItem>
                                <SelectItem value="pecuario" className="text-white hover:bg-opacity-80">
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
                            className="text-red-400 text-sm mt-2"
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
                          className="text-base font-medium mb-3 block"
                          style={{ color: COLORS.clarity }}
                        >
                          Nome da Empresa *
                        </Label>
                        <Input
                          id="company"
                          {...register("company")}
                          className="h-14 text-base bg-opacity-50 border-0 focus:ring-2 text-white placeholder:text-gray-400 transition-all duration-300"
                          style={
                            {
                              backgroundColor: COLORS.royal,
                              "--tw-ring-color": COLORS.gold,
                            } as any
                          }
                          placeholder="Digite o nome da empresa"
                        />
                        {errors.company && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-sm mt-2"
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
                          className="text-base font-medium mb-3 block"
                          style={{ color: COLORS.clarity }}
                        >
                          Faturamento Anual *
                        </Label>
                        <Input
                          id="revenue"
                          {...register("revenue")}
                          className="h-14 text-base bg-opacity-50 border-0 focus:ring-2 text-white placeholder:text-gray-400 transition-all duration-300"
                          style={
                            {
                              backgroundColor: COLORS.royal,
                              "--tw-ring-color": COLORS.gold,
                            } as any
                          }
                          placeholder="Ex: R$ 5.000.000"
                        />
                        {errors.revenue && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-sm mt-2"
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
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="space-y-8"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <motion.div
                          animate={{
                            rotate: [0, 10, -10, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                        >
                          <Sparkles className="w-6 h-6 md:w-8 md:h-8" style={{ color: COLORS.gold }} />
                        </motion.div>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight" style={{ color: COLORS.clarity }}>
                          Redes Sociais
                        </h2>
                      </div>
                      <p className="text-base md:text-lg" style={{ color: COLORS.marfim }}>
                        Complete seu perfil com suas redes sociais e apresentação
                      </p>
                    </motion.div>

                    <div className="space-y-8">
                      {/* Profile Photo */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-center"
                      >
                        <Label className="text-base font-medium mb-6 block" style={{ color: COLORS.clarity }}>
                          Foto de Perfil
                        </Label>
                        <div className="relative group">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Avatar
                              className="w-32 h-32 md:w-40 md:h-40 border-4 shadow-xl"
                              style={{ borderColor: COLORS.gold }}
                            >
                              <AvatarImage src={profileImage || "/placeholder.svg"} />
                              <AvatarFallback style={{ backgroundColor: COLORS.royal }}>
                                <User className="w-16 h-16 md:w-20 md:h-20" style={{ color: COLORS.marfim }} />
                              </AvatarFallback>
                            </Avatar>
                          </motion.div>
                          <label
                            htmlFor="photo-upload"
                            className="absolute bottom-2 right-2 p-3 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 shadow-lg"
                            style={{ backgroundColor: COLORS.gold }}
                          >
                            <Upload className="w-5 h-5 md:w-6 md:h-6" style={{ color: COLORS.vipBlue }} />
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
                          className="text-base font-medium mb-3 block"
                          style={{ color: COLORS.clarity }}
                        >
                          Instagram
                        </Label>
                        <div className="flex rounded-lg overflow-hidden">
                          <div
                            className="px-4 py-4 flex items-center text-sm font-medium whitespace-nowrap"
                            style={{ backgroundColor: COLORS.royal, color: COLORS.marfim }}
                          >
                            https://instagram.com/
                          </div>
                          <Input
                            id="instagram"
                            {...register("instagram")}
                            className="h-14 text-base rounded-l-none border-0 focus:ring-2 text-white placeholder:text-gray-400 transition-all duration-300"
                            style={
                              {
                                backgroundColor: COLORS.royal,
                                "--tw-ring-color": COLORS.gold,
                              } as any
                            }
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
                          className="text-base font-medium mb-3 block"
                          style={{ color: COLORS.clarity }}
                        >
                          LinkedIn
                        </Label>
                        <div className="flex rounded-lg overflow-hidden">
                          <div
                            className="px-4 py-4 flex items-center text-sm font-medium whitespace-nowrap"
                            style={{ backgroundColor: COLORS.royal, color: COLORS.marfim }}
                          >
                            https://www.linkedin.com/in/
                          </div>
                          <Input
                            id="linkedin"
                            {...register("linkedin")}
                            className="h-14 text-base rounded-l-none border-0 focus:ring-2 text-white placeholder:text-gray-400 transition-all duration-300"
                            style={
                              {
                                backgroundColor: COLORS.royal,
                                "--tw-ring-color": COLORS.gold,
                              } as any
                            }
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
                          className="text-base font-medium mb-3 block"
                          style={{ color: COLORS.clarity }}
                        >
                          Mini Bio
                        </Label>
                        <Textarea
                          id="bio"
                          {...register("bio")}
                          rows={6}
                          maxLength={1000}
                          className="text-base bg-opacity-50 border-0 focus:ring-2 text-white placeholder:text-gray-400 resize-none transition-all duration-300"
                          style={
                            {
                              backgroundColor: COLORS.royal,
                              "--tw-ring-color": COLORS.gold,
                            } as any
                          }
                          placeholder="Conte sobre sua experiência profissional, interesses e objetivos..."
                        />
                        <p className="text-sm mt-2" style={{ color: COLORS.marfim }}>
                          {watch("bio")?.length || 0}/1000 caracteres
                        </p>
                        {errors.bio && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-sm mt-2"
                          >
                            {errors.bio.message as string}
                          </motion.p>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-between mt-10 pt-8 border-t gap-4"
                style={{ borderColor: COLORS.royal }}
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    variant="outline"
                    className="h-14 px-8 border-2 font-semibold text-base transition-all duration-300 bg-transparent"
                    style={{
                      borderColor: currentStep === 1 ? COLORS.royal : COLORS.gold,
                      backgroundColor: "transparent",
                      color: currentStep === 1 ? COLORS.marfim : COLORS.gold,
                      opacity: currentStep === 1 ? 0.5 : 1,
                    }}
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Voltar
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="relative">
                  <Button
                    type="submit"
                    className="h-14 px-8 font-bold text-base shadow-lg transition-all duration-300 relative overflow-hidden group"
                    style={{
                      backgroundColor: COLORS.gold,
                      color: COLORS.vipBlue,
                    }}
                  >
                    <span className="relative z-10 flex items-center">
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
                    </span>
                    <motion.div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
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
