'use client'

import Image from "next/image"
import InstagramIcon from "../public/icons/Instagram_icon.png"
import Linkedin from "@/public/icons/linkedin.png"
import Whatsapp from "@/public/zap.png"
import Email from "@/public/mail.png"
import { toast } from 'sonner'
import { Mail } from 'lucide-react'

type User = {
  avatar: string
  name: string
  occupation: string
  company: string
  sector: string
  phone: string | null
  email: string
  social_links: {
    instagram: string
    linkedin: string
    whatsapp: boolean
  }
}

export default function UserCard({ user }: { user: User }) {
  const whatsappNumber = user.phone ? user.phone.replace(/\D/g, "") : ""
  const isWhatsAppEnabled = Boolean(user.social_links?.whatsapp)

  const getInitials = (name: string | undefined) => {
    if (!name) return "?"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleNoInstagram = () => {
    toast.info("Usuário não possui o Instagram cadastrado")
  }

  const handleNoWhatsapp = () => {
    toast.info("O contato do usuário não está disponível")
  }

  const handleNoLinkedin = () => {
    toast.info("Usuário não possui o LinkedIn cadastrado")
  }

  const handleEmail = () => {
    if (user.email) {
      window.open(`mailto:${user.email}`, '_blank')
    } else {
      toast.info("E-mail não disponível")
    }
  }

  return (
    <div className= "bg-gradient-to-b from-white/5 via-white/15 to-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/10 max-w-sm w-full mx-auto overflow-hidden border-2 rounded-[24px]">
      <div className="relative w-full h-[334px] rounded-t-2xl overflow-hidden">
        {user.avatar && user.avatar.trim() !== "" ? (
          <Image
            src={user.avatar}
            alt={`Foto de ${user.name}`}
            fill
            className="object-cover object-[50%_35%]"
            sizes="w-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold bg-gray-700">
            {getInitials(user.name)}
          </div>
        )}
      </div>

      <div className="p-6 space-y-4 z-10">
        <h2 className="text-[24px] font-goldman-sans font-bold bg-gradient-to-r from-[#F8F8F8] to-[#71717A] text-transparent bg-clip-text">
          {user.name}
        </h2>

        <div className="text-gray-300">
          <p className="font-medium">{user.occupation} | {user.company}</p>
          {user.sector && (
            <p className="font-medium">{user.sector}</p>
          )}
        </div>

        <hr className="border-t border-white/20" />
        <div className="flex flex-wrap gap-4 pt-2">
          {user.social_links?.instagram ? (
            <a
              href={`https://instagram.com/${user.social_links.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Perfil do Instagram de ${user.name}`}
              className="flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors"
            >
              <Image src={InstagramIcon} alt="Instagram Icon" width={30} height={30} />
            </a>
          ) : (
            <span
              onClick={handleNoInstagram}
              aria-label="Instagram não cadastrado"
              className="flex items-center gap-2 text-gray-500 cursor-pointer"
            >
              <Image src={InstagramIcon} alt="Instagram Icon" width={30} height={30} />
            </span>
          )}
          
          {user.social_links?.linkedin ? (
            <a
              href={`https://linkedin.com/in/${user.social_links.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Perfil do LinkedIn de ${user.name}`}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Image src={Linkedin} alt="LinkedIn Icon" width={30} height={30} />
            </a>
          ) : (
            <span
              onClick={handleNoLinkedin}
              aria-label="LinkedIn não cadastrado"
              className="flex items-center gap-2 text-gray-500 cursor-pointer"
            >
              <Image src={Linkedin} alt="LinkedIn Icon" width={30} height={30} />
            </span>
          )}

          {whatsappNumber && user.social_links?.whatsapp === true ? (
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Enviar mensagem no WhatsApp para ${user.name}`}
              className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
            >
              <Image src={Whatsapp} alt="WhatsApp Icon" width={30} height={30} />
            </a>
          ) : (
            <span
              onClick={handleNoWhatsapp}
              aria-label="WhatsApp não disponível"
              className="flex items-center gap-2 text-gray-500 cursor-pointer"
            >
              <Image src={Whatsapp} alt="WhatsApp Icon" width={30} height={30} />
            </span>
          )}

          {user.email ? (
            <button
              onClick={handleEmail}
              aria-label={`Enviar e-mail para ${user.name}`}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Image src={Email} alt="Email Icon" width={39} height={39}/>
            </button>
          ) : (
            <span
              onClick={() => toast.info("E-mail não disponível")}
              aria-label="E-mail não disponível"
              className="flex items-center gap-2 text-gray-500 cursor-pointer bg-white rounded p-1"
            >
              <Mail size={30} />
            </span>
          )}
        </div>
      </div>
    </div>
  )
}