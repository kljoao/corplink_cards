"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  ArrowRight,
  Users,
  TrendingUp,
  Award,
  Star,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Instagram,
  Linkedin,
  CheckCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Header from "@/components/Header"

// Dados dos depoimentos
const testimonials = [
  {
    name: "Maria Silva",
    role: "CEO, TechStart",
    content:
      "A CorpLink transformou minha rede de contatos. Em 6 meses, fechei 3 parcerias estratégicas que mudaram o rumo da minha empresa.",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
  {
    name: "João Santos",
    role: "Diretor, InvestCorp",
    content:
      "Os eventos da CorpLink são únicos. Cada encontro é uma oportunidade real de crescimento pessoal e profissional.",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
  {
    name: "Ana Costa",
    role: "Fundadora, GreenTech",
    content:
      "Encontrei meus principais investidores através da rede CorpLink. A qualidade das conexões é incomparável.",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
  {
    name: "Carlos Oliveira",
    role: "VP, FinanceGroup",
    content:
      "A CorpLink não é apenas networking, é uma comunidade que realmente se importa com o sucesso de cada membro.",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
]

// Dados das empresas parceiras
const partners = [
  { name: "Microsoft", logo: "/placeholder.svg?height=40&width=120" },
  { name: "Google", logo: "/placeholder.svg?height=40&width=120" },
  { name: "Amazon", logo: "/placeholder.svg?height=40&width=120" },
  { name: "Meta", logo: "/placeholder.svg?height=40&width=120" },
  { name: "Apple", logo: "/placeholder.svg?height=40&width=120" },
  { name: "Tesla", logo: "/placeholder.svg?height=40&width=120" },
]

// Dados do FAQ
const faqData = [
  {
    question: "Como funciona o processo de seleção?",
    answer:
      "Nosso processo é cuidadoso e personalizado. Após a inscrição, realizamos uma entrevista para entender seu perfil e objetivos, garantindo que você se conecte com pessoas alinhadas aos seus valores e metas de negócio.",
  },
  {
    question: "Qual é o investimento para fazer parte?",
    answer:
      "Oferecemos diferentes planos de associação para atender diversos perfis de empresários. Entre em contato conosco para conhecer as opções e encontrar a que melhor se adequa ao seu momento e objetivos.",
  },
  {
    question: "Quantos eventos acontecem por mês?",
    answer:
      "Realizamos em média 4-6 eventos por mês, incluindo encontros presenciais, webinars exclusivos, workshops e experiências diferenciadas. Todos os eventos são planejados para maximizar as oportunidades de networking e aprendizado.",
  },
  {
    question: "Posso participar dos eventos online?",
    answer:
      "Sim! Oferecemos eventos híbridos e exclusivamente online para garantir que você possa participar independente da sua localização. Nossa plataforma digital facilita as conexões mesmo à distância.",
  },
  {
    question: "Como são selecionados os membros?",
    answer:
      "Priorizamos qualidade sobre quantidade. Buscamos empresários e executivos que compartilhem nossos valores de ética, inovação e crescimento mútuo. O processo inclui análise de perfil, entrevista e referências.",
  },
]

// Hook para count up animation com easing
const useCountUp = (end: number, duration = 2000) => {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      // Easing function - ease out cubic para desaceleração suave
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)

      setCount(Math.floor(easeOutCubic * end))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  return { count, ref }
}

// Componente para stats com count up
const StatsItem = ({ end, suffix, label }: { end: number; suffix: string; label: string }) => {
  const { count, ref } = useCountUp(end)

  return (
    <div ref={ref} className="text-center">
      <div className="text-2xl md:text-3xl font-bold text-blue-400">
        {count}
        {suffix}
      </div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  )
}

export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  // Intersection Observer for animations
  useEffect(() => {
    setIsVisible(true)
  }, [])

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
    setIsMenuOpen(false)
  }

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset
      const parallaxElements = document.querySelectorAll(".parallax")

      parallaxElements.forEach((element) => {
        const speed = element.getAttribute("data-speed") || "0.5"
        const yPos = -(scrolled * Number.parseFloat(speed))
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b bg-[#000015] text-white overflow-x-hidden">
      {/* Header */}
      <Header/>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center pt-16">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
                linear-gradient(45deg, transparent 30%, rgba(59, 130, 246, 0.05) 50%, transparent 70%)
              `,
            }}
          />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse parallax"
            data-speed="0.3"
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse parallax"
            data-speed="0.5"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div
              className={cn(
                "space-y-8 transition-all duration-1000",
                isVisible ? "animate-in slide-in-from-left-8 fade-in-0" : "opacity-0",
              )}
            >
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="text-6xl font-goldman-sans font-bold bg-gradient-to-r from-[#F8F8F8] to-[#71717A] text-transparent bg-clip-text">
                  Conexões que <br></br>geram valor.
                  </span>
                </h1>

                <div className="space-y-4 text-lg text-gray-300 leading-relaxed max-w-2xl">
                  <p>
                    Na <span className="text-white font-semibold">CorpLink</span>, acreditamos que conexões
                    verdadeiras movem negócios sólidos. Por isso, construímos um ecossistema onde relações pessoais e
                    profissionais se encontram com propósito, ética e visão de futuro.
                  </p>
                  <p>
                    Em nossos eventos e redes, cada encontro é uma oportunidade — de aprender, crescer e construir
                    juntos.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => scrollToSection("beneficios")}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-8 py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 rounded"
                >
                  Quero fazer parte
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <StatsItem end={500} suffix="+" label="Membros ativos" />
                <StatsItem end={50} suffix="+" label="Eventos/ano" />
                <StatsItem end={95} suffix="%" label="Satisfação" />
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div
              className={cn(
                "relative transition-all duration-1000 delay-300",
                isVisible ? "animate-in slide-in-from-right-8 fade-in-0" : "opacity-0",
              )}
            >
              <div className="relative">
                {/* Main Image */}
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-900/20 to-indigo-900/20 backdrop-blur-sm border border-white/10">
                  <img src="/empresarios.png" alt="Empresários da CorpLink" className="w-full h-auto object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Floating Avatars */}
                <div className="absolute -top-4 -left-4 animate-float">
                  <Avatar className="w-16 h-16 border-4 border-white/20 shadow-xl">
                    <AvatarImage src="/placeholder.svg?height=64&width=64" />
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                </div>
                <div className="absolute top-8 -right-6 animate-float" style={{ animationDelay: "1s" }}>
                  <Avatar className="w-12 h-12 border-4 border-white/20 shadow-xl">
                    <AvatarImage src="/placeholder.svg?height=48&width=48" />
                    <AvatarFallback>MC</AvatarFallback>
                  </Avatar>
                </div>
                <div className="absolute -bottom-6 right-8 animate-float" style={{ animationDelay: "2s" }}>
                  <Avatar className="w-14 h-14 border-4 border-white/20 shadow-xl">
                    <AvatarImage src="/placeholder.svg?height=56&width=56" />
                    <AvatarFallback>AS</AvatarFallback>
                  </Avatar>
                </div>
                <div className="absolute bottom-12 -left-8 animate-float" style={{ animationDelay: "0.5s" }}>
                  <Avatar className="w-10 h-10 border-4 border-white/20 shadow-xl">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback>RO</AvatarFallback>
                  </Avatar>
                </div>
                <div className="absolute top-1/2 -left-12 animate-float" style={{ animationDelay: "1.5s" }}>
                  <Avatar className="w-12 h-12 border-4 border-white/20 shadow-xl">
                    <AvatarImage src="/placeholder.svg?height=48&width=48" />
                    <AvatarFallback>LM</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-300">Empresas que confiam na CorpLink</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Grandes organizações escolhem nossa plataforma para conectar seus executivos e expandir suas redes de
              negócios.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 hover:scale-110"
              >
                <img
                  src={partner.logo || "/placeholder.svg"}
                  alt={partner.name}
                  className="h-8 md:h-10 w-auto object-contain filter brightness-0 invert"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="depoimentos" className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-400">
                O que nossos membros dizem
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Histórias reais de transformação e crescimento através das conexões da CorpLink.
            </p>
          </div>

          <div className="relative">
            {/* Blur gradients nas bordas - versão mais intensa */}
            <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-[#0d1326] via-[#0d1326]/80 to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-[#0d1326] via-[#0d1326]/80 to-transparent z-20 pointer-events-none" />

            <div className="flex animate-testimonial-scroll space-x-6 items-stretch">
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-80 md:w-96 h-64 bg-gradient-to-br from-[#1a2332] to-[#131b2c] rounded-2xl p-6 border border-gray-800/50 backdrop-blur-sm flex flex-col justify-between"
                >
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-center space-x-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    <blockquote className="text-gray-200 leading-relaxed italic text-center flex-1 flex items-center justify-center text-sm">
                      "{testimonial.content}"
                    </blockquote>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-700/30">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12 border-2 border-blue-500/30">
                          <AvatarImage src={testimonial.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <div className="font-semibold text-white text-sm">{testimonial.name}</div>
                          <div className="text-blue-400 text-xs">{testimonial.role}</div>
                        </div>
                      </div>

                      {/* Logo da empresa (placeholder) */}
                      <div className="w-16 h-8 bg-gray-700/30 rounded flex items-center justify-center">
                        <div className="w-12 h-6 bg-gray-600/50 rounded text-xs text-gray-400 flex items-center justify-center">
                          LOGO
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-400">
                Benefícios exclusivos
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Descubra as vantagens de fazer parte da maior rede de empresários do Brasil.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Eventos e Conexões */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-gradient-to-br from-[#1a2332] to-[#131b2c] rounded-2xl p-8 border border-gray-800/50 h-full hover:border-blue-500/30 transition-all duration-300">
                <div className="text-center space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
                    <div className="relative bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-full p-4 w-20 h-20 mx-auto flex items-center justify-center">
                      <Users className="h-10 w-10 text-blue-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white">Eventos e Conexões</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Participe de eventos exclusivos, workshops e encontros presenciais com empresários de alto nível.
                    Cada evento é uma oportunidade única de expandir sua rede.
                  </p>
                  <ul className="text-sm text-gray-300 space-y-2 text-left">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                      Eventos mensais presenciais
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                      Workshops especializados
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                      Networking direcionado
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Investimentos e Aprendizado */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-gradient-to-br from-[#1a2332] to-[#131b2c] rounded-2xl p-8 border border-gray-800/50 h-full hover:border-indigo-500/30 transition-all duration-300">
                <div className="text-center space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
                    <div className="relative bg-indigo-500/10 backdrop-blur-sm border border-indigo-500/20 rounded-full p-4 w-20 h-20 mx-auto flex items-center justify-center">
                      <TrendingUp className="h-10 w-10 text-indigo-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white">Investimentos e Aprendizado</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Acesse oportunidades de investimento exclusivas e conteúdos educacionais de alta qualidade para
                    acelerar seu crescimento.
                  </p>
                  <ul className="text-sm text-gray-300 space-y-2 text-left">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                      Deal flow exclusivo
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                      Masterclasses mensais
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                      Mentoria especializada
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Experiência e Lifestyle */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-gradient-to-br from-[#1a2332] to-[#131b2c] rounded-2xl p-8 border border-gray-800/50 h-full hover:border-purple-500/30 transition-all duration-300">
                <div className="text-center space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
                    <div className="relative bg-purple-500/10 backdrop-blur-sm border border-purple-500/20 rounded-full p-4 w-20 h-20 mx-auto flex items-center justify-center">
                      <Award className="h-10 w-10 text-purple-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white">Experiência e Lifestyle</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Viva experiências únicas em locais exclusivos, viagens de negócios e eventos de lifestyle premium
                    para membros.
                  </p>
                  <ul className="text-sm text-gray-300 space-y-2 text-left">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                      Viagens de negócios
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                      Eventos premium
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                      Acesso VIP
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-400">
                Perguntas frequentes
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Tire suas dúvidas sobre como fazer parte da CorpLink e aproveitar todos os benefícios.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#1a2332] to-[#131b2c] rounded-xl border border-gray-800/50 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <span className="font-medium text-white">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-blue-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 animate-in slide-in-from-top-4 duration-500 ease-out">
                    <div className="pt-2 border-t border-gray-700/50 mt-2">
                      <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-[#1a2332] to-[#131b2c] rounded-3xl p-12 md:p-16 border border-gray-800/50 text-center">
              <div className="max-w-3xl mx-auto space-y-8">
                <h2 className="text-3xl md:text-5xl font-bold">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-400">
                    Pronto para transformar
                  </span>
                  <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                    suas conexões?
                  </span>
                </h2>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Junte-se a mais de 500 empresários que já descobriram o poder das conexões verdadeiras. Sua próxima
                  grande oportunidade está a um clique de distância.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-8 py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25"
                  >
                    Começar agora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:border-white/30 px-8 py-4 text-lg"
                  >
                    Agendar conversa
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0f1c] border-t border-gray-800/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Logo and Description */}
            <div className="md:col-span-2 space-y-6">
              <div className="flex items-center space-x-2">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-sm opacity-50"></div>
                  <div className="relative w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <div className="w-7 h-7 bg-[#0a0f1c] rounded-full flex items-center justify-center">
                      <div className="w-3.5 h-3.5 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">CORPLINK</span>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                Conectando empresários visionários para construir o futuro dos negócios. Cada conexão é uma oportunidade
                de crescimento mútuo.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 transform"
                  aria-label="Instagram"
                >
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-3 rounded-full hover:from-pink-600 hover:to-purple-600">
                    <Instagram className="w-5 h-5" />
                  </div>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 transform"
                  aria-label="LinkedIn"
                >
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-3 rounded-full hover:from-blue-600 hover:to-blue-700">
                    <Linkedin className="w-5 h-5" />
                  </div>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold">Links rápidos</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button onClick={() => scrollToSection("depoimentos")} className="hover:text-white transition-colors">
                    Depoimentos
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("beneficios")} className="hover:text-white transition-colors">
                    Benefícios
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("faq")} className="hover:text-white transition-colors">
                    FAQ
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contato
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold">Contato</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>contato@corplink.com.br</li>
                <li>(11) 9999-9999</li>
                <li>
                  Av. das Américas, 3500
                  <br />
                  Barra da Tijuca, Rio de Janeiro - RJ
                </li>
              </ul>
            </div>
          </div>

          <Separator className="bg-gray-800/50 mb-8" />

          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">© 2025 CorpLink & Co. Todos os direitos reservados.</p>
            <div className="flex space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
