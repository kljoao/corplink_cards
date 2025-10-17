"use client"

import { motion } from "framer-motion"
import { Plane, Award, Globe, Sparkles, CreditCard, Shield } from "lucide-react"

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
  return (
    <section className="relative overflow-hidden">
      <div className="absolute left-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-gold/5 blur-[120px]" />
      <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-royal/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 sm:mb-16 md:mb-20 text-center px-4"
        >
          <h2
            className="mb-4 sm:mb-6 text-balance leading-tight"
            style={{ fontSize: "clamp(1.75rem, 6vw, 3.5rem)", fontWeight: 400 }}
          >
            Benefícios que
            <br />
            <span className="text-gold" style={{ fontWeight: 500 }}>
              elevam seu padrão
            </span>
          </h2>
          <p
            className="mx-auto max-w-2xl text-balance leading-relaxed text-marfim"
            style={{ fontSize: "clamp(0.9375rem, 2.5vw, 1.0625rem)" }}
          >
            Desfrute de vantagens exclusivas pensadas para quem busca o melhor em cada experiência
          </p>
        </motion.div>

        <div className="grid gap-4 sm:gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-royal/20 bg-gradient-to-br from-titanium/40 to-royal/20 p-6 sm:p-8 backdrop-blur-sm transition-all hover:border-gold/30 hover:shadow-xl hover:shadow-gold/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gold/0 to-gold/0 opacity-0 transition-opacity duration-300 group-hover:from-gold/5 group-hover:to-transparent group-hover:opacity-100" />

              <div className="relative z-10">
                <div className="mb-5 sm:mb-6 inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-gold/10 text-gold transition-all group-hover:bg-gold/20 group-hover:scale-110">
                  <benefit.icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.5} />
                </div>

                <h3 className="mb-2 sm:mb-3 text-lg sm:text-xl font-medium text-clarity">{benefit.title}</h3>
                <p className="leading-relaxed text-marfim/80" style={{ fontSize: "clamp(0.875rem, 2vw, 0.9375rem)" }}>
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
