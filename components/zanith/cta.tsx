"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

const COLORS = {
  vipBlue: "#000016",
  titanium: "#17313c",
  royal: "#26425e",
  marfim: "#bebdb2",
  clarity: "#f8f8f8",
  gold: "#D4AF37",
}

export default function CTA() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 md:py-32">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              `radial-gradient(circle at 20% 50%, ${COLORS.gold}26, transparent 50%)`,
              `radial-gradient(circle at 80% 50%, ${COLORS.gold}26, transparent 50%)`,
              `radial-gradient(circle at 20% 50%, ${COLORS.gold}26, transparent 50%)`,
            ],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16"
          style={{
            border: `1px solid ${COLORS.gold}4D`,
            background: `linear-gradient(135deg, ${COLORS.titanium}E6, ${COLORS.royal}E6)`,
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Decorative elements */}
          <div
            className="absolute -right-32 -top-32 h-80 w-80 rounded-full blur-3xl"
            style={{ backgroundColor: `${COLORS.gold}33` }}
          />
          <div
            className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full blur-3xl"
            style={{ backgroundColor: `${COLORS.gold}33` }}
          />

          {/* Animated particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 rounded-full"
              style={{ 
                backgroundColor: COLORS.gold,
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.5,
              }}
            />
          ))}

          <div className="relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-5 sm:mb-6 inline-flex items-center gap-2 rounded-full px-4 sm:px-5 py-2"
              style={{
                border: `1px solid ${COLORS.gold}4D`,
                backgroundColor: `${COLORS.gold}1A`,
              }}
            >
              <Sparkles className="h-4 w-4" style={{ color: COLORS.gold }} />
              <span className="text-xs sm:text-sm font-medium uppercase tracking-wider" style={{ color: COLORS.gold }}>
                Solicite agora
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-5 sm:mb-6 text-balance leading-tight px-2"
              style={{
                fontSize: "clamp(1.75rem, 6vw, 3.5rem)",
                fontWeight: 400,
                color: COLORS.clarity,
              }}
            >
              Pronto para alcançar <span style={{ fontWeight: 500, color: COLORS.gold }}>novos patamares?</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-8 sm:mb-10 mx-auto max-w-2xl text-balance leading-relaxed px-2"
              style={{
                fontSize: "clamp(0.9375rem, 2.5vw, 1.0625rem)",
                color: COLORS.marfim,
              }}
            >
              Deixe seus dados e nossa equipe entrará em contato para apresentar as condições exclusivas do Zenith
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="group h-14 sm:h-16 px-8 sm:px-12 text-base sm:text-lg font-medium transition-all hover:shadow-2xl"
                  style={{
                    backgroundColor: COLORS.gold,
                    color: COLORS.vipBlue,
                  }}
                  onClick={() => {
                    console.log("Redirect to form")
                  }}
                >
                  <span className="flex items-center gap-3">
                    Solicitar cartão Zenith
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                  </span>
                </Button>
              </motion.div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-6 sm:mt-8 text-xs sm:text-sm px-4"
              style={{ color: `${COLORS.marfim}B3` }}
            >
              Ao solicitar, você concorda com nossos termos de uso e política de privacidade
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
