"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

const COLORS = {
  vipBlue: "#000016",
  titanium: "#17313c",
  royal: "#26425e",
  marfim: "#bebdb2",
  clarity: "#f8f8f8",
  gold: "#D4AF37",
}

const faqs = [
  {
    question: "Onde posso consultar meu saldo do Programa de pontos?",
    answer:
      "Você pode consultar seu saldo de pontos pelo App Sicoob, App Sicoobcard, App Coopera ou pelo site: https://www.shopcoopera.com.br/. Se você preferir, pode solicitar o saldo na nossa Central de Atendimento (Regiões Metropolitanas 3003 3965 ou Demais Regiões 0800 879 0334).",
  },
  {
    question: "Qual programa de sala VIP meu cartão tem acesso?",
    answer: "Seu cartão tem acesso às salas VIPs do programa LoungeKey.",
  },
  {
    question: "Onde troco meus pontos por prêmios?",
    answer:
      "Você pode trocar os seus pontos no programa de fidelidade do Sicoob, o Coopera: https://www.shopcoopera.com.br/. Por lá, você pode escolher passagens aéreas, hotéis, eletrônicos, produtos de beleza, produtos para sua casa, e muito mais!",
  },
  {
    question: "Como consigo localizar as salas VIPs?",
    answer:
      "Você poderá baixar o App do programa LoungeKey ou o APP da respectiva bandeira do seu cartão: App Mastercard Airport Experiences ou App Visa Airport Companion. Todos estão disponíveis para iOS e Android.",
  },
  {
    question: "Meus adicionais também têm acesso ilimitado + 2 convidados por visita?",
    answer: "Sim. Os adicionais têm direito aos mesmos benefícios do titular.",
  },
  {
    question: "Se eu quiser levar mais que dois convidados por visita, as visitas excedentes serão cobradas?",
    answer:
      "Sim. O valor por acesso excedente à sala VIP LoungeKey é de USD 35 para cartões Mastercard e USD 32 para cartões Visa, e será cobrado diretamente em sua fatura.",
  },
  {
    question: "Como funciona o acesso às salas VIP?",
    answer:
      "Para acessar a sala VIP, você deverá apresentar seu cartão físico + o bilhete de viagem. O cartão deverá estar desbloqueado e com limite disponível para pré-autorização. A LoungeKey vai gerar uma pré-autorização no valor de US$ 1.00 para cada acesso. Essa ação é para garantir que o cartão está apto para uso. Esse valor é estornado após a autenticação.",
  },
  {
    question: "Como faço para alterar a senha do meu cartão?",
    answer:
      "Você poderá alterar diretamente no App Sicoob, App Sicoobcard ou entrando em contato com a nossa central de atendimento (Capitais e regiões metropolitanas: 4007 1289 – Demais localidades: 0800 642 0000).",
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 md:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute left-0 top-1/4 h-96 w-96 rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, ${COLORS.gold}, transparent)` }}
        />
        <div
          className="absolute right-0 bottom-1/4 h-96 w-96 rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, ${COLORS.gold}, transparent)` }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 sm:mb-16 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-5 sm:mb-6 inline-flex items-center gap-2 rounded-full px-4 sm:px-5 py-2"
            style={{
              border: `1px solid ${COLORS.gold}33`,
              backgroundColor: `${COLORS.gold}0D`,
            }}
          >
            <span className="text-xs font-medium uppercase tracking-widest" style={{ color: COLORS.gold }}>
              Dúvidas Frequentes
            </span>
          </motion.div>

          <h2
            className="text-balance leading-tight"
            style={{
              fontSize: "clamp(1.75rem, 6vw, 3.5rem)",
              fontWeight: 400,
              color: COLORS.clarity,
            }}
          >
            Tire suas <span style={{ fontWeight: 500, color: COLORS.gold }}>dúvidas</span>
          </h2>
        </motion.div>

        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <motion.button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full rounded-xl sm:rounded-2xl p-5 sm:p-6 text-left transition-all"
                  style={{
                    border: `1px solid ${isOpen ? COLORS.gold : COLORS.royal}33`,
                    backgroundColor: isOpen ? `${COLORS.titanium}CC` : `${COLORS.titanium}66`,
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3
                      className="flex-1 text-balance leading-snug"
                      style={{
                        fontSize: "clamp(0.9375rem, 2.5vw, 1.0625rem)",
                        fontWeight: 500,
                        color: isOpen ? COLORS.gold : COLORS.clarity,
                      }}
                    >
                      {faq.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown
                        className="h-5 w-5 sm:h-6 sm:w-6"
                        style={{ color: isOpen ? COLORS.gold : COLORS.marfim }}
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={false}
                    animate={{
                      height: isOpen ? "auto" : 0,
                      opacity: isOpen ? 1 : 0,
                      marginTop: isOpen ? 16 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p
                      className="leading-relaxed"
                      style={{
                        fontSize: "clamp(0.875rem, 2vw, 0.9375rem)",
                        color: COLORS.marfim,
                      }}
                    >
                      {faq.answer}
                    </p>
                  </motion.div>
                </motion.button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
