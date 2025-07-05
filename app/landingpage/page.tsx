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
import Light from "@/components/light"
import Header2 from "@/components/Header2"
import dynamic from "next/dynamic"
import type { ComponentProps } from "react"
import type { RotatingTextProps } from '@/components/landingpage/RotatingText'
import Image from 'next/image'

const RotatingText = dynamic<RotatingTextProps>(() => import('@/components/landingpage/RotatingText'), { ssr: false })

// Dados dos depoimentos
const testimonials = [
  {
    name: "Eduardo Diniz",
    role: "Presidente, Sicoob Empresas RJ",
    content:
      "Com a CorpLink, o sistema cooperativo e corporativo se transforma em uma elite construtora: distribui, investe e ativa novas fronteiras de desenvolvimento. É hora de transformar.",
    avatar: "/edu.jpeg",
    rating: 5,
    logo: "/logos/sicoob.avif",
  },
  {
    name: "Rafael Amaral",
    role: "Sócio, Brewteco",
    content:
      "Participamos no networking gerado pelos eventos da CorpLink. Foi uma excelente iniciativa e apoiamos a evolução do projeto indicando novos empresários para fazer parte.",
    avatar: "/rafaelAmaral.avif",
    rating: 5,
    logo: "/logos/brewteco.avif",
  },
  {
    name: "Márlyson Silva",
    role: "Sócio, Transfero Group",
    content:
      " Portal exclusivo de membros é uma oportunidade incrível para conexão com os membros, ampliando a carteira de clientes da nossa empresa e ao mesmo tempo ampliar a rede de contatos.",
    avatar: "/marlyson.avif",
    rating: 5,
    logo: "/logos/transfero.avif",
  },
  {
    name: "Felippe Bastos",
    role: "Sócio, Solve Energies",
    content:
      "Os relacionamentos criados pelos membros da CorpLink geraram, além de grandes parceiros de negócios, novos amigos. Indico a todos a conhecerem esse grupo.",
    avatar: "/fellipe.avif",
    rating: 5,
    logo: "/logos/solves.svg",
  },
]

// Dados das empresas parceiras
const partners = [
  { name: "Sicoob", logo: "/logos/sicoob.avif" },
  { name: "Transfero", logo: "/logos/transfero.avif" },
  { name: "Brewteco", logo: "/logos/brewteco.avif" },
  { name: "Solves", logo: "/logos/solves.svg" },
  { name: "Maravalley", logo: "/logos/maravalley.avif" },
]

// Dados do FAQ
const faqData = [
  {
    question: "O que é a CorpLink?",
    answer:
      "Somos uma plataforma de conexão corporativa, voltada para convidados selecionados, que se encontram em eventos e interagem pelas redes sociais para ampliar seus relacionamentos e gerar novos negócios estratégicos. Nossa missão é promover parcerias sólidas e confiáveis entre nossos membros.",
  },
  {
    question: "Como se tornar membro?",
    answer:
      "A CorpLink é exclusiva para convidados por membros atuais. É necessário passar por um processo de indicação e avaliação, no qual o seu perfil será analisado para garantir sinergia com os demais membros.",
  },
  {
    question: "Quais os benefícios do membro?",
    answer:
      "Acesso a um grupo exclusivo em uma área restrita do site, com informações de contato e links para suas redes sociais. A rede também oferecerá uma agenda de eventos fechados, proporcionando oportunidades de networking para parcerias e novos negócios.",
  },
  {
    question: "Existe algum valor de adesão?",
    answer:
      "Durante a fase de pré-lançamento, não há investimento para fazer parte da CorpLink. Após o lançamento, novos membros estarão sujeitos a um valor de adesão e anuidade para acesso a todos os benefícios exclusivos nas verticais de Educação, Lifestyle, Viagens, Eventos e Networking.",
  },
  {
    question: "Posso indicar novos membros?",
    answer:
      "Como membro, você terá direito de indicar novos membros. Os indicados passarão pelo mesmo processode seleção aplicado a todos os demais. O link de envio do convite está na área restrita à membros.",
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

const StatsItem = ({ end, suffix, label }: { end: number; suffix: string; label: string }) => {
  const { count, ref } = useCountUp(end)

  return (
    <div ref={ref} className="text-center">
      <div className="text-2xl md:text-3xl font-bold text-gray-300">
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
      <Light />
      <Header2/>

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
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight flex">
                  <span className="text-6xl font-goldman-sans font-bold bg-gradient-to-r from-[#F8F8F8] to-[#71717A] text-transparent bg-clip-text">
                  Conexões que
                    <div className="flex items-center">
                      <span className="flex items-center flex-wrap text-6xl font-goldman-sans font-bold bg-gradient-to-r from-[#F8F8F8] to-[#71717A] text-transparent bg-clip-text">geram
                      <RotatingText
                        texts={['valor.', 'negócios.', 'resultados.', 'progresso.']}
                        mainClassName="text-6xl px-2 sm:px-2 md:px-3 text-white overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center"
                        staggerFrom={"last"}
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-120%" }}
                        staggerDuration={0.025}
                        splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                        transition={{ type: "spring", damping: 30, stiffness: 400 }}
                        rotationInterval={3000}
                      />
                      </span>
                    </div>
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
                  className="bg-[#000014] hover:bg-[#000029] border text-white font-medium p-6 text-lg transition-all duration-300 hover:scale-105 rounded-full relative overflow-hidden"
                >
                  <span className="shiny-text relative z-10">Quero fazer parte</span>
                  <ArrowRight className="ml-2 h-5 w-5 relative z-10" />
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 ">
                <StatsItem end={500} suffix="+" label="Membros ativos"/>
                <StatsItem end={50} suffix="+" label="Eventos/ano" />
                <StatsItem end={100} suffix="%" label="Networking" />
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
                {/* Main Image com glow/shadow branco */}
                <div className="relative rounded-2xl bg-gradient-to-br from-blue-900/20 to-indigo-900/20 backdrop-blur-sm border border-white/10">
                  {/* Glow branco atrás da imagem */}
                  <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    aria-hidden="true"
                  >
                    <div className="w-[90%] h-[90%] rounded-2xl shadow-[0_0_80px_30px_rgba(255,255,255,0.25)]"></div>
                  </div>
                  <Image
                    src="/empresarios.png"
                    alt="Empresários da CorpLink"
                    width={600}
                    height={400}
                    priority
                    className="w-full h-auto object-cover relative z-10 rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-20 rounded-2xl" />
                </div>

                {/* Floating Avatars */}
                <div className="absolute -top-4 -left-4 animate-float">
                  <Avatar className="w-24 h-24 border-4 border-white/20 shadow-xl">
                    <Image src="/edu.jpeg" alt="ED" width={96} height={96} className="w-24 h-24 rounded-full" />
                    <AvatarFallback>ED</AvatarFallback>
                  </Avatar>
                </div>
                <div className="absolute top-8 -right-6 animate-float" style={{ animationDelay: "1s" }}>
                  <Avatar className="w-16 h-16 border-4 border-white/20 shadow-xl">
                    <Image src="/joao.png" alt="JO" width={64} height={64} className="w-16 h-16 rounded-full" />
                    <AvatarFallback>JO</AvatarFallback>
                  </Avatar>
                </div>
                <div className="absolute -bottom-6 right-8 animate-float" style={{ animationDelay: "2s" }}>
                  <Avatar className="w-24 h-24 border-4 border-white/20 shadow-xl">
                    <Image src="/rodrigo.jpg" alt="RO" width={96} height={96} className="w-24 h-24 rounded-full" />
                    <AvatarFallback>RO</AvatarFallback>
                  </Avatar>
                </div>
                <div className="absolute bottom-12 -left-8 animate-float" style={{ animationDelay: "0.5s" }}>
                  <Avatar className="w-20 h-20 border-4 border-white/20 shadow-xl">
                    <Image src="/grossi.jpg" alt="GR" width={80} height={80} className="w-20 h-20 rounded-full" />
                    <AvatarFallback>GR</AvatarFallback>
                  </Avatar>
                </div>
                <div className="absolute top-1/2 -left-12 animate-float" style={{ animationDelay: "1.5s" }}>
                  <Avatar className="w-16 h-16 border-4 border-white/20 shadow-xl">
                    <Image src="/suzana.jpg" alt="SU" width={64} height={64} className="w-16 h-16 rounded-full" />
                    <AvatarFallback>SU</AvatarFallback>
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
            <h2 className="text-sm font-bold mb-4 text-gray-300">EMPRESAS PARCEIRAS</h2>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center justify-items-center">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 hover:scale-110"
              >
                <Image
                  src={partner.logo || "/placeholder.svg"}
                  alt={partner.name}
                  width={120}
                  height={48}
                  className={`w-auto object-contain filter brightness-0 invert ${
                    partner.name === "Brewteco" 
                      ? "h-24 md:h-24" 
                      : "h-24 md:h-10"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section (Redesign) */}
      <section id="depoimentos" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          {/* Título */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="bg-gradient-to-r from-[#F8F8F8] to-[#71717A] text-transparent bg-clip-text">
                O que dizem nossos membros
              </span>
            </h2>
          </div>

          {/* Fades laterais */}
          <div className="relative group testimonials-container">
            <div className="absolute left-0 top-0 bottom-0 w-32 z-20 pointer-events-none testimonials-fade-left" />
            <div className="absolute right-0 top-0 bottom-0 w-32 z-20 pointer-events-none testimonials-fade-right" />

            {/* Carrossel com estilo aprimorado */}
            <div className="testimonial-track space-x-6">
              {[...testimonials, ...testimonials].map((item, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-80 md:w-96 bg-gradient-to-br from-[#0f172a] to-[#1e293b] border border-gray-700/30 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-blue-500/10 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Avaliação */}
                  <div className="flex justify-center space-x-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Conteúdo */}
                  <blockquote className="text-gray-300 leading-relaxed text-sm text-center italic mb-6">
                    “{item.content}”
                  </blockquote>

                  {/* Rodapé com avatar e logo */}
                  <div className="flex items-center justify-between border-t border-gray-700/30 pt-4 mt-auto">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={item.avatar}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full border-2 border-blue-500/30 object-cover"
                      />
                      <div>
                        <div className="text-white font-semibold text-sm">{item.name}</div>
                        <div className="text-blue-400 text-xs">{item.role}</div>
                      </div>
                    </div>
                    <div className="w-16 h-8 rounded flex items-center justify-center p-1">
                      <Image
                        src={item.logo}
                        alt={`${item.name} logo`}
                        width={64}
                        height={32}
                        className="object-contain max-h-full"
                      />
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
              <span className="bg-gradient-to-r from-[#F8F8F8] to-[#71717A] text-transparent bg-clip-text">
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
            <span className="bg-gradient-to-r from-[#F8F8F8] to-[#71717A] text-transparent bg-clip-text">
              Perguntas frequentes
            </span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqData.map((faq, index) => {
            const isOpen = openFaq === index;
            const contentRef = useRef<HTMLDivElement>(null);
            const [height, setHeight] = useState("0px");

            useEffect(() => {
              if (isOpen && contentRef.current) {
                const scrollHeight = contentRef.current.scrollHeight;
                setHeight(`${scrollHeight}px`);
              } else {
                setHeight("0px");
              }
            }, [isOpen]);

            return (
              <div
                key={index}
                className="bg-gradient-to-br from-[#1a2332] to-[#131b2c] rounded-xl border border-gray-800/50 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <span className="font-medium text-white">{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-blue-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                <div
                  style={{ height, transition: "height 0.4s ease" }}
                  className="px-6 overflow-hidden"
                >
                  <div ref={contentRef}>
                    <div className="pt-2 pb-5 border-t border-gray-700/50 mt-2">
                      <p className="text-gray-300 leading-relaxed py-2">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
                  <span className="bg-gradient-to-r from-[#F8F8F8] to-[#71717A] text-transparent bg-clip-text">
                    Pronto para transformar
                  </span>
                  <br />
                  <span className="bg-gradient-to-r to-[#F8F8F8] from-[#71717A] text-transparent bg-clip-text">
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
                    className="bg-[#000014] hover:bg-[#000029] border text-white font-medium px-8 py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25"
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
    </div>
  )
}
