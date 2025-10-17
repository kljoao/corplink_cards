"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Check } from "lucide-react"

const features = [
  "Limite de crédito personalizado",
  "Programa de pontos Coopera",
  "Seguro viagem internacional",
  "Proteção de compras",
  "Assistência 24 horas",
  "Parcelamento inteligente",
]

export default function Exclusive() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const x = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"])

  return (
    <section ref={containerRef} className="relative overflow-hidden py-16 sm:py-24 md:py-32">
      <motion.div style={{ x }} className="absolute inset-0 opacity-5">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px w-full bg-gradient-to-r from-transparent via-gold to-transparent"
            style={{ top: `${20 + i * 20}%` }}
            animate={{
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.5,
            }}
          />
        ))}
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="grid items-center gap-10 sm:gap-12 md:gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="px-4 sm:px-0"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-5 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 sm:px-5 py-2"
            >
              <span className="text-xs font-medium uppercase tracking-widest text-gold">Exclusivo</span>
            </motion.div>

            <h2
              className="mb-5 sm:mb-6 text-balance leading-tight"
              style={{ fontSize: "clamp(1.75rem, 6vw, 3.5rem)", fontWeight: 400 }}
            >
              Feito para quem
              <br />
              <span className="text-gold" style={{ fontWeight: 500 }}>
                não aceita limites
              </span>
            </h2>

            <p
              className="mb-8 sm:mb-10 text-balance leading-relaxed text-marfim"
              style={{ fontSize: "clamp(0.9375rem, 2.5vw, 1.0625rem)" }}
            >
              O Sicoob Visa Zenith é mais do que um cartão de crédito. É uma declaração de que você chegou ao topo e
              está pronto para ir além.
            </p>

            <div className="space-y-3 sm:space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-3 sm:gap-4"
                >
                  <div className="flex h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0 items-center justify-center rounded-full bg-gold/10">
                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gold" strokeWidth={2.5} />
                  </div>
                  <span className="font-medium text-clarity" style={{ fontSize: "clamp(0.875rem, 2vw, 0.9375rem)" }}>
                    {feature}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid gap-4 sm:gap-6 px-4 sm:px-0"
          >
            {[
              { value: "1.300+", label: "Salas VIP no mundo" },
              { value: "4x", label: "Pontos por dólar" },
              { value: "24/7", label: "Concierge disponível" },
              { value: "0%", label: "Taxa internacional" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-royal/20 bg-gradient-to-br from-titanium/40 to-royal/20 p-6 sm:p-8 backdrop-blur-sm transition-all hover:border-gold/30"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gold/0 to-gold/0 opacity-0 transition-opacity duration-300 group-hover:from-gold/5 group-hover:to-transparent group-hover:opacity-100" />

                <div className="relative z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.8,
                      delay: 0.2 + index * 0.1,
                      type: "spring",
                    }}
                    className="mb-2 font-medium text-gold"
                    style={{ fontSize: "clamp(2rem, 7vw, 3.5rem)" }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="font-medium text-marfim" style={{ fontSize: "clamp(0.875rem, 2vw, 0.9375rem)" }}>
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
