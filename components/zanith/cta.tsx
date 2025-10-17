"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function CTA() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 md:py-32">
      {/* Animated background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.15), transparent 50%)",
            "radial-gradient(circle at 80% 50%, rgba(212, 175, 55, 0.15), transparent 50%)",
            "radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.15), transparent 50%)",
          ],
        }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="overflow-hidden rounded-2xl sm:rounded-3xl border border-gold/30 bg-gradient-to-br from-titanium/80 to-royal/80 p-8 sm:p-10 md:p-16 backdrop-blur-xl"
        >
          {/* Decorative elements */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />

          <div className="relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-5 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 sm:px-5 py-2"
            >
              <span className="text-xs sm:text-sm font-medium uppercase tracking-wider text-gold">Solicite agora</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-5 sm:mb-6 text-balance leading-tight px-2"
              style={{ fontSize: "clamp(1.75rem, 6vw, 3.5rem)", fontWeight: 400 }}
            >
              Pronto para alcançar
              <br />
              <span className="text-gold" style={{ fontWeight: 500 }}>
                novos patamares?
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-8 sm:mb-10 text-balance leading-relaxed text-marfim px-2"
              style={{ fontSize: "clamp(0.9375rem, 2.5vw, 1.0625rem)" }}
            >
              Deixe seus dados e nossa equipe entrará em contato para apresentar as condições exclusivas do Zenith
            </motion.p>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mx-auto flex max-w-md flex-col gap-3 sm:gap-4 sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-marfim/60" />
                <Input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  className="h-14 sm:h-14 border-gold/30 bg-vip-blue/50 pl-12 text-base text-clarity placeholder:text-marfim/60 focus:border-gold"
                />
              </div>
              <Button
                size="lg"
                className="group h-14 sm:h-14 bg-gold px-8 text-base font-medium text-vip-blue transition-all hover:bg-gold/90 hover:shadow-xl hover:shadow-gold/30 w-full sm:w-auto"
              >
                <span className="flex items-center justify-center gap-2">
                  Solicitar
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            </motion.form>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-5 sm:mt-6 text-xs sm:text-sm text-marfim/70 px-4"
            >
              Ao solicitar, você concorda com nossos termos de uso e política de privacidade
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
