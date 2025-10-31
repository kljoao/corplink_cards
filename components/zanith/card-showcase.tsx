"use client"

import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { Award, Plane, Globe, type LucideIcon } from "lucide-react"
import { useRef, useState } from "react"

const COLORS = {
  vipBlue: "#000016",
  titanium: "#17313c",
  royal: "#26425e",
  marfim: "#bebdb2",
  clarity: "#f8f8f8",
  gold: "#d4af37",
} as const

interface HighlightBenefit {
  title: string
  icon: LucideIcon
}

const highlightBenefits: HighlightBenefit[] = [
  { title: "4 pontos Coopera por dólar", icon: Award },
  { title: "Acesso ilimitado a salas VIP (+ 2 convidados por visita)", icon: Plane },
  { title: "Compras internacionais sem taxa extra", icon: Globe },
]

export default function CardShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden py-12 sm:py-16 md:py-24 lg:py-32"
    >
      {/* Background gradients animados */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute left-0 top-1/4 h-[400px] w-[400px] sm:h-[500px] sm:w-[500px] md:h-[600px] md:w-[600px] -translate-x-1/3 rounded-full opacity-20 blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          style={{
            background: `radial-gradient(circle, ${COLORS.gold} 0%, transparent 70%)`,
          }}
        />
        <motion.div
          className="absolute right-0 top-1/2 h-[400px] w-[400px] sm:h-[500px] sm:w-[500px] md:h-[600px] md:w-[600px] translate-x-1/3 rounded-full opacity-15 blur-[100px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 2 }}
          style={{
            background: `radial-gradient(circle, ${COLORS.royal} 0%, transparent 70%)`,
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        {/* Hero Section - Layout responsivo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center mb-12 sm:mb-16 md:mb-20">
          {/* Content - Texto */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-4 sm:gap-6 md:gap-8 order-2 lg:order-1"
          >
            {/* Logo VISA */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-3 sm:space-y-4"
            >
              <Image
                src="/visa_logo.png"
                alt="VISA"
                width={120}
                height={40}
                className="h-6 sm:h-7 md:h-9 lg:h-10 w-auto"
                priority
              />

              <Image
                src="/zenith.svg"
                alt="Zenith"
                width={300}
                height={90}
                className="h-auto w-32 sm:w-40 md:w-52 lg:w-64 xl:w-72"
                priority
               />
            </motion.div>

            {/* Título principal */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="leading-none mt-[-30px]"
              style={{
                fontSize: "clamp(2rem, 8vw, 4.5rem)",
                fontWeight: 700,
                color: COLORS.clarity,
              }}
            >
              Alcance{" "}
              <br className="hidden sm:block" />
              novos lugares{" "}
              <br />
              <span style={{ color: COLORS.gold }}>com Zenith.</span>
            </motion.h1>

            {/* Descrição */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="leading-relaxed max-w-xl"
              style={{
                fontSize: "clamp(1rem, 2.5vw, 1.375rem)",
                color: COLORS.marfim,
              }}
            >
              Um cartão ainda mais{" "}
              <span className="font-bold" style={{ color: COLORS.clarity }}>
                exclusivo
              </span>
              ,{" "}
              <br className="hidden sm:block" />
              com benefícios incomparáveis{" "}
              <br className="hidden sm:block" />
              para quem acredita que{" "}
              <span className="font-bold" style={{ color: COLORS.clarity }}>
                o céu é o limite.
              </span>
            </motion.p>
          </motion.div>

          {/* Card Image */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: -15 }}
            animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : { opacity: 0, x: 50, rotateY: -15 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
            className="relative order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <motion.div
              className="relative w-full max-w-md lg:max-w-lg"
              whileHover={{ scale: 1.05, rotateY: 5 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ perspective: "1000px" }}
            >
              {/* Glow effect atrás do cartão */}
              <motion.div
                className="absolute inset-0 rounded-3xl opacity-40 blur-[60px]"
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                  scale: [0.9, 1, 0.9],
                }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                style={{
                  background: `radial-gradient(circle, ${COLORS.gold} 0%, transparent 70%)`,
                }}
              />

              <Image
                src="/cartao-visa.png"
                alt="Cartão Zenith VISA"
                width={600}
                height={380}
                className="relative z-10 w-full h-auto drop-shadow-2xl"
                priority
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Cards de benefícios resumidos */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 sm:mt-16 md:mt-20"
        >
          {/* Título da seção */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
              style={{
                background: `linear-gradient(135deg, ${COLORS.clarity} 0%, ${COLORS.gold} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Benefícios Exclusivos
            </h2>
            <div 
              className="w-24 h-1 mx-auto rounded-full"
              style={{ background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.royal})` }}
            />
          </motion.div>

          <div className="grid gap-6 sm:gap-8 md:gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {highlightBenefits.map((item, index) => (
              <HighlightBenefitCard key={item.title} benefit={item} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function HighlightBenefitCard({ benefit, index }: { benefit: HighlightBenefit; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isCardInView = useInView(cardRef, { once: true, margin: "-50px" })
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, rotateX: 15 }}
      animate={isCardInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: 15 }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
      className="group relative perspective-1000"
      style={{ perspective: "1000px" }}
    >
      {/* Card principal com glassmorphism */}
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={isHovered ? {
          y: -12,
          scale: 1.03,
          rotateY: 5,
          rotateX: -2
        } : {
          y: 0,
          scale: 1,
          rotateY: 0,
          rotateX: 0
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 h-full cursor-pointer"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(23, 49, 60, 0.4) 0%, 
              rgba(38, 66, 94, 0.3) 50%, 
              rgba(0, 0, 22, 0.2) 100%
            )
          `,
          backdropFilter: "blur(20px)",
          border: `1px solid rgba(212, 175, 55, 0.2)`,
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
        }}
      >
        {/* Gradiente animado de fundo */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              `linear-gradient(45deg, ${COLORS.gold}10, ${COLORS.royal}20, ${COLORS.titanium}10)`,
              `linear-gradient(45deg, ${COLORS.royal}20, ${COLORS.gold}10, ${COLORS.titanium}20)`,
              `linear-gradient(45deg, ${COLORS.titanium}10, ${COLORS.royal}20, ${COLORS.gold}10)`,
            ],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />

        {/* Overlay de hover com efeito neon */}
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: `
              radial-gradient(circle at 50% 50%,
                rgba(212, 175, 55, 0.15) 0%,
                transparent 70%
              )
            `,
            boxShadow: `
              inset 0 0 60px rgba(212, 175, 55, 0.1),
              0 0 40px rgba(212, 175, 55, 0.2)
            `,
          }}
        />

        {/* Border neon no hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl sm:rounded-3xl"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          style={{
            border: `2px solid transparent`,
            background: `
              linear-gradient(135deg,
                rgba(212, 175, 55, 0.6),
                rgba(38, 66, 94, 0.4),
                rgba(212, 175, 55, 0.6)
              ) border-box
            `,
            mask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
            maskComposite: "xor",
            WebkitMaskComposite: "xor",
            boxShadow: `
              0 0 30px rgba(212, 175, 55, 0.4),
              inset 0 0 30px rgba(212, 175, 55, 0.1)
            `,
          }}
        />

        {/* Conteúdo principal */}
        <div className="relative z-10 flex flex-col items-center text-center h-full justify-center">
          {/* Container do ícone com efeito 3D */}
          <motion.div
            className="mb-6 sm:mb-8 relative"
            animate={isHovered ? {
              scale: 1.2,
              rotateY: 360,
              rotateZ: 5,
            } : {
              scale: 1,
              rotateY: 0,
              rotateZ: 0,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Glow effect atrás do ícone */}
            <motion.div
              className="absolute inset-0 rounded-2xl blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              style={{
                background: `radial-gradient(circle, ${COLORS.gold} 0%, transparent 70%)`,
              }}
            />

            {/* Ícone principal */}
            <motion.div
              className="relative inline-flex h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 items-center justify-center rounded-2xl"
              style={{
                background: `
                  linear-gradient(135deg,
                    rgba(212, 175, 55, 0.2) 0%,
                    rgba(212, 175, 55, 0.1) 100%
                  )
                `,
                border: `1px solid rgba(212, 175, 55, 0.3)`,
              }}
              animate={{
                boxShadow: isHovered
                  ? `0 12px 48px rgba(212, 175, 55, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)`
                  : `0 8px 32px rgba(212, 175, 55, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
              }}
              transition={{ duration: 0.4 }}
            >
              <benefit.icon 
                className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" 
                strokeWidth={1.5}
                style={{ color: COLORS.gold }}
              />
            </motion.div>
          </motion.div>

          {/* Título com efeito de gradiente */}
          <motion.h3
            className="text-lg sm:text-xl md:text-2xl font-bold leading-tight mb-2 transition-colors duration-300"
            style={{
              background: `linear-gradient(135deg, ${COLORS.clarity} 0%, ${COLORS.gold} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
            animate={{
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            {benefit.title}
          </motion.h3>

          {/* Linha decorativa */}
          <motion.div
            className="w-12 h-0.5 rounded-full mt-2"
            animate={{
              scaleX: isHovered ? 1.5 : 1,
            }}
            style={{
              background: isHovered
                ? `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.clarity})`
                : `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.royal})`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Partículas flutuantes */}
        <motion.div
          className="absolute top-4 right-4 w-2 h-2 rounded-full"
          style={{ background: COLORS.gold }}
          animate={{
            y: [0, -10, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-6 left-6 w-1 h-1 rounded-full"
          style={{ background: COLORS.royal }}
          animate={{
            y: [0, -8, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.5 }}
        />
      </motion.div>
    </motion.div>
  )
}
