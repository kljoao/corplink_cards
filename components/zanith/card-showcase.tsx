"use client"

import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { Award, Plane, Globe, type LucideIcon } from "lucide-react"
import { useRef } from "react"

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
            >
              <Image
                src="/visa_logo.png"
                alt="VISA"
                width={120}
                height={40}
                className="h-8 sm:h-10 md:h-12 w-auto"
                priority
              />
            </motion.div>

            {/* Título principal */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="leading-none"
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
          className="mt-8 sm:mt-12 md:mt-16"
        >
          <div className="grid gap-3 sm:gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isCardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="group relative"
    >
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl p-5 sm:p-6 md:p-8 h-full backdrop-blur-sm cursor-pointer"
        style={{
          border: `1px solid ${COLORS.royal}40`,
          background: `linear-gradient(135deg, ${COLORS.titanium}80 0%, ${COLORS.royal}40 100%)`,
          boxShadow: `0 4px 20px ${COLORS.vipBlue}40`,
        }}
      >
        {/* Hover overlay com efeito gradiente */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            background: `linear-gradient(135deg, ${COLORS.gold}15 0%, ${COLORS.gold}05 100%)`,
          }}
        />

        {/* Border glow no hover */}
        <motion.div
          className="absolute inset-0 rounded-lg sm:rounded-xl md:rounded-2xl"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            border: `1px solid ${COLORS.gold}60`,
            boxShadow: `0 0 30px ${COLORS.gold}20, inset 0 0 30px ${COLORS.gold}10`,
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Ícone centralizado com animação pulsante */}
          <motion.div
            className="mb-4 sm:mb-5 inline-flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-lg sm:rounded-xl"
            style={{
              background: `${COLORS.gold}20`,
              color: COLORS.gold,
              boxShadow: `0 0 20px ${COLORS.gold}20`,
            }}
            whileHover={{
              scale: 1.15,
              rotate: [0, -8, 8, 0],
              boxShadow: `0 0 40px ${COLORS.gold}40`,
            }}
            animate={{
              boxShadow: [
                `0 0 20px ${COLORS.gold}20`,
                `0 0 30px ${COLORS.gold}30`,
                `0 0 20px ${COLORS.gold}20`,
              ],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <benefit.icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" strokeWidth={1.5} />
          </motion.div>

          <motion.h3
            className="mb-1.5 sm:mb-2 text-sm sm:text-base md:text-lg lg:text-xl font-semibold leading-snug"
            style={{ color: COLORS.clarity }}
            whileHover={{ color: COLORS.gold }}
            transition={{ duration: 0.3 }}
          >
            {benefit.title}
          </motion.h3>
        </div>

        {/* Efeito de brilho no canto */}
        <motion.div
          className="absolute -right-6 -top-6 sm:-right-8 sm:-top-8 h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-full"
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1.2 }}
          transition={{ duration: 0.4 }}
          style={{
            background: `radial-gradient(circle, ${COLORS.gold}25 0%, transparent 70%)`,
            filter: "blur(20px)",
          }}
        />
      </motion.div>
    </motion.div>
  )
}
