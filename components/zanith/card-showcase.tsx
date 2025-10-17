"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Wifi } from "lucide-react"

const COLORS = {
  vipBlue: "#000016",
  titanium: "#17313c",
  royal: "#26425e",
  marfim: "#bebdb2",
  clarity: "#f8f8f8",
  gold: "#d4af37",
  goldLight: "#f4e5b8",
}

export default function CardShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-8, 0, 8])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1, 0.92])
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0])

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden sm:py-[-150px] md:py-32"
      style={{ background: COLORS.vipBlue }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          style={{ scale, background: `${COLORS.gold}0D` }}
          className="h-[300px] w-[300px] sm:h-[500px] sm:w-[500px] rounded-full blur-[120px] sm:blur-[180px]"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <motion.div style={{ opacity }} className="mb-12 sm:mb-16 md:mb-24 text-center px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-balance font-sans leading-[1.15] sm:leading-[1.1]"
            style={{
              fontSize: "clamp(1.75rem, 6vw, 3.5rem)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: COLORS.clarity,
            }}
          >
            Exclusividade em
            <br />
            <span style={{ fontWeight: 500, color: COLORS.gold }}>cada detalhe</span>
          </motion.h2>
        </motion.div>

        <motion.div style={{ rotateY, scale, opacity }} className="mx-auto max-w-4xl perspective-[2000px] px-4 sm:px-0">
          <motion.div
            className="relative aspect-[1.586/1] w-full"
            initial={{ rotateX: 3 }}
            whileHover={{
              scale: 1.02,
              rotateX: 0,
              transition: { duration: 0.5, ease: "easeOut" },
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="absolute inset-0 rounded-2xl sm:rounded-3xl blur-2xl sm:blur-3xl"
              style={{ background: `${COLORS.gold}1A` }}
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            <div className="relative h-full w-full overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl bg-gradient-to-br from-[#1a1a1a] via-[#0a0a0a] to-[#000000] shadow-2xl">
              <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="absolute left-4 top-4 sm:left-6 sm:top-6 md:left-10 md:top-10"
              >
                <div
                  className="font-sans tracking-[0.35em]"
                  style={{
                    fontSize: "clamp(0.75rem, 2vw, 1.25rem)",
                    fontWeight: 300,
                    color: `${COLORS.clarity}E6`,
                  }}
                >
                  ZENITH
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="absolute right-4 top-4 sm:right-6 sm:top-6 md:right-10 md:top-10"
              >
                <Wifi
                  className="h-6 w-6 sm:h-7 sm:w-7 md:h-9 md:w-9 rotate-90"
                  strokeWidth={1.5}
                  style={{ color: `${COLORS.clarity}B3` }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
                className="absolute left-4 sm:left-6 md:left-10"
                style={{ top: "22%" }}
              >
                <div
                  className="relative h-10 w-12 sm:h-11 sm:w-14 md:h-12 md:w-16 overflow-hidden rounded-md sm:rounded-lg bg-gradient-to-br shadow-lg"
                  style={{
                    backgroundImage: `linear-gradient(to bottom right, ${COLORS.gold}, ${COLORS.goldLight}, ${COLORS.gold})`,
                  }}
                >
                  <div className="absolute inset-1.5 sm:inset-2 grid grid-cols-4 gap-[1.5px] sm:gap-[2px]">
                    {[...Array(16)].map((_, i) => (
                      <div key={i} className="rounded-[1px]" style={{ background: "#b8941f" }} />
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <div className="flex items-center gap-[2px]">
                    <div
                      className="h-0 w-0 border-b-[12px] border-l-[7px] border-r-[7px] border-l-transparent border-r-transparent sm:border-b-[14px] sm:border-l-[8px] sm:border-r-[8px] md:border-b-[18px] md:border-l-[10px] md:border-r-[10px]"
                      style={{ borderBottomColor: `${COLORS.clarity}CC` }}
                    />
                    <div
                      className="h-0 w-0 border-b-[12px] border-l-[7px] border-r-[7px] border-l-transparent border-r-transparent sm:border-b-[14px] sm:border-l-[8px] sm:border-r-[8px] md:border-b-[18px] md:border-l-[10px] md:border-r-[10px]"
                      style={{ borderBottomColor: `${COLORS.clarity}CC` }}
                    />
                  </div>
                  <span
                    className="font-sans font-bold tracking-wide"
                    style={{
                      fontSize: "clamp(1.25rem, 3.5vw, 2.25rem)",
                      color: `${COLORS.clarity}CC`,
                    }}
                  >
                    SICOOB
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="absolute bottom-0 left-0 h-32 w-32 sm:h-40 sm:w-40 md:h-52 md:w-52 opacity-20"
              >
                <svg viewBox="0 0 200 200" className="h-full w-full">
                  <defs>
                    <linearGradient id="triangleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#666666" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#333333" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>
                  <polygon points="0,200 100,100 0,100" fill="url(#triangleGrad)" />
                  <polygon points="0,200 100,200 100,100" fill="url(#triangleGrad)" opacity="0.6" />
                  <polygon points="100,100 200,0 100,0" fill="url(#triangleGrad)" opacity="0.3" />
                </svg>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="absolute left-4 sm:left-6 md:left-10 font-mono tracking-[0.2em] sm:tracking-[0.25em]"
                style={{
                  bottom: "28%",
                  fontSize: "clamp(0.7rem, 1.8vw, 1rem)",
                  color: `${COLORS.clarity}CC`,
                }}
              >
                •••• •••• •••• 8888
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute left-4 sm:left-6 md:left-10"
                style={{ bottom: "12%" }}
              >
                <div
                  className="mb-0.5 sm:mb-1 text-[0.5rem] sm:text-[0.625rem] md:text-xs uppercase tracking-wider"
                  style={{ color: `${COLORS.marfim}99` }}
                >
                  Titular
                </div>
                <div
                  className="font-sans uppercase tracking-wide"
                  style={{
                    fontSize: "clamp(0.625rem, 1.5vw, 0.875rem)",
                    fontWeight: 500,
                    color: COLORS.clarity,
                  }}
                >
                  Membro CorpLink
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="absolute text-right"
                style={{ bottom: "12%", right: "35%" }}
              >
                <div
                  className="mb-0.5 sm:mb-1 text-[0.5rem] sm:text-[0.625rem] md:text-xs uppercase tracking-wider"
                  style={{ color: `${COLORS.marfim}99` }}
                >
                  Validade
                </div>
                <div
                  className="font-sans"
                  style={{
                    fontSize: "clamp(0.625rem, 1.5vw, 0.875rem)",
                    fontWeight: 500,
                    color: COLORS.clarity,
                  }}
                >
                  12/28
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1, duration: 0.6 }}
                className="absolute right-4 sm:right-6 md:right-10 text-right"
                style={{ bottom: "10%" }}
              >
                <div
                  className="mb-0.5 font-sans font-bold italic"
                  style={{
                    fontSize: "clamp(1rem, 2.5vw, 1.75rem)",
                    color: COLORS.clarity,
                  }}
                >
                  VISA
                </div>
                <div
                  className="font-sans tracking-wider"
                  style={{
                    fontSize: "clamp(0.5rem, 1.2vw, 0.75rem)",
                    fontWeight: 300,
                    color: `${COLORS.marfim}B3`,
                  }}
                >
                  Infinite
                </div>
              </motion.div>

              {/* Subtle sparkle effects */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-1 w-1 rounded-full"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                    background: `${COLORS.gold}66`,
                  }}
                  animate={{
                    opacity: [0, 0.6, 0],
                    scale: [0, 1.2, 0],
                  }}
                  transition={{
                    duration: 4 + Math.random() * 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: Math.random() * 4,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
