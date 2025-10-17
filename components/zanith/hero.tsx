"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRef } from "react"

const COLORS = {
  vipBlue: "#000016",
  titanium: "#17313c",
  royal: "#26425e",
  marfim: "#bebdb2",
  clarity: "#f8f8f8",
  gold: "#d4af37",
  goldLight: "#f4e5b8",
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden" style={{ background: COLORS.vipBlue }}>
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${COLORS.gold}1A, transparent 60%)`,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(${COLORS.gold}0D 1px, transparent 1px),
                           linear-gradient(90deg, ${COLORS.gold}0D 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 sm:mb-16"
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_5378.PNG-NSuNb3cDcr6PjNNtk10dND9DadBSQW.png"
            alt="CorpLink"
            width={240}
            height={80}
            className="mx-auto mb-[-60px] sm:w-[280px]"
            priority
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 sm:mb-10 inline-flex items-center gap-2 rounded-full px-5 py-3 sm:px-6 sm:py-2.5 backdrop-blur-sm"
          style={{
            border: `1px solid ${COLORS.gold}33`,
            background: `${COLORS.gold}0D`,
          }}
        >
          <Sparkles className="h-4 w-4 sm:h-4 sm:w-4" style={{ color: COLORS.gold }} />
          <span className="text-xs sm:text-sm font-medium tracking-wide" style={{ color: COLORS.gold }}>
            Exclusivo para membros CorpLink
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-6 sm:mb-8 max-w-5xl font-sans text-balance leading-[1.05] sm:leading-[0.95] tracking-tight px-2"
          style={{
            fontSize: "clamp(2.75rem, 11vw, 8rem)",
            fontWeight: 500,
            color: COLORS.clarity,
          }}
        >
          Você no ponto
          <br />
          <span style={{ fontWeight: 600, color: COLORS.gold }}>mais alto.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-10 sm:mb-14 max-w-2xl text-balance leading-relaxed px-4"
          style={{
            fontSize: "clamp(1rem, 3vw, 1.125rem)",
            fontWeight: 400,
            color: COLORS.marfim,
          }}
        >
          O cartão Sicoob Visa Zenith oferece benefícios incomparáveis para quem acredita que o céu é o limite.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col gap-3 sm:gap-4 w-full max-w-md px-4 sm:max-w-none sm:w-auto sm:flex-row"
        >
          <Button
            size="lg"
            className="group relative overflow-hidden px-8 sm:px-10 py-6 sm:py-6 text-base font-medium transition-all hover:shadow-xl w-full sm:w-auto"
            style={{
              background: COLORS.gold,
              color: COLORS.vipBlue,
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Solicitar agora
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="px-8 sm:px-10 py-6 sm:py-6 text-base font-medium transition-all bg-transparent w-full sm:w-auto"
            style={{
              border: `1px solid ${COLORS.gold}4D`,
              background: "transparent",
              color: COLORS.gold,
            }}
          >
            Conheça os benefícios
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: `${COLORS.marfim}99` }}>
              Role para descobrir
            </span>
            <div className="h-10 w-5 rounded-full" style={{ border: `1px solid ${COLORS.gold}4D` }}>
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                className="mx-auto mt-1.5 h-1.5 w-1.5 rounded-full"
                style={{ background: COLORS.gold }}
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
