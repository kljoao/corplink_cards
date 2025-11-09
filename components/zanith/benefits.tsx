"use client"

import { motion, useInView } from "framer-motion"
import { Plane, Award, Globe, Sparkles, CreditCard, Shield } from "lucide-react"
import { useRef } from "react"

const COLORS = {
  vipBlue: "#000016",
  titanium: "#17313c",
  royal: "#26425e",
  marfim: "#bebdb2",
  clarity: "#f8f8f8",
  gold: "#d4af37",
}

const benefits = [
  {
    icon: Award,
    title: "4 pontos por dólar",
    description: "Acumule pontos Coopera em todas as suas compras e troque por experiências exclusivas",
  },
  {
    icon: Plane,
    title: "Acesso ilimitado a salas VIP",
    description: "Você + 2 convidados em mais de 1.300 salas VIP ao redor do mundo",
  },
  {
    icon: Globe,
    title: "Compras internacionais",
    description: "Zero taxa extra em compras no exterior e IOF reduzido",
  },
  {
    icon: Sparkles,
    title: "Visa Concierge 24h",
    description: "Assistente pessoal disponível 24/7 para realizar suas solicitações",
  },
  {
    icon: CreditCard,
    title: "Fast Pass",
    description: "Embarque prioritário para você e até 5 acompanhantes em aeroportos selecionados",
  },
  {
    icon: Shield,
    title: "Visa Luxury Hotel Collection",
    description: "Acesso a hotéis de luxo com upgrades e benefícios exclusivos",
  },
]

export default function Benefits() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-12 sm:py-20 md:py-32">
      {/* Background gradients - animados e otimizados */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute left-0 top-1/3 h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] md:h-[500px] md:w-[500px] -translate-x-1/2 rounded-full opacity-20 sm:opacity-30 blur-[80px] sm:blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          style={{
            background: `radial-gradient(circle, ${COLORS.gold} 0%, transparent 70%)`,
          }}
        />
        <motion.div
          className="absolute right-0 top-2/3 h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] md:h-[500px] md:w-[500px] translate-x-1/2 rounded-full opacity-15 sm:opacity-20 blur-[80px] sm:blur-[120px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
          style={{
            background: `radial-gradient(circle, ${COLORS.royal} 0%, transparent 70%)`,
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        {/* Header com animação melhorada */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 sm:mb-12 md:mb-16 text-center"
        >
          <motion.h2
            className="mb-3 sm:mb-4 md:mb-6 leading-tight px-2"
            style={{ fontSize: "clamp(1.5rem, 5vw, 3.5rem)", fontWeight: 400, color: COLORS.clarity }}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Benefícios que
            <br />
            <span style={{ fontWeight: 600, color: COLORS.gold }}>elevam seu padrão</span>
          </motion.h2>
          <motion.p
            className="mx-auto max-w-2xl text-balance leading-relaxed px-4"
            style={{ fontSize: "clamp(0.875rem, 2.5vw, 1.0625rem)", color: COLORS.marfim }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Desfrute de vantagens exclusivas pensadas para quem busca o melhor em cada experiência
          </motion.p>
        </motion.div>

        {/* Grid de benefícios - otimizado para mobile */}
        <div className="grid gap-3 sm:gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} benefit={benefit} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  )
}

function BenefitCard({
  benefit,
  index,
  isInView,
}: {
  benefit: (typeof benefits)[0]
  index: number
  isInView: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isCardInView = useInView(cardRef, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isCardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
      className="group relative"
    >
      <motion.div
        whileHover={{ y: -6, scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
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

        <div className="relative z-10">
          {/* Ícone com animação pulsante */}
          <motion.div
            className="mb-4 sm:mb-5 md:mb-6 inline-flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-lg sm:rounded-xl md:rounded-2xl"
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

          {/* Título com efeito hover */}
          <motion.h3
            className="mb-2 sm:mb-2.5 md:mb-3 text-base sm:text-lg md:text-xl font-semibold"
            style={{ color: COLORS.clarity }}
            whileHover={{ color: COLORS.gold }}
            transition={{ duration: 0.3 }}
          >
            {benefit.title}
          </motion.h3>

          {/* Descrição */}
          <p
            className="leading-relaxed"
            style={{
              fontSize: "clamp(0.8125rem, 2vw, 0.9375rem)",
              color: `${COLORS.marfim}dd`,
            }}
          >
            {benefit.description}
          </p>
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
  