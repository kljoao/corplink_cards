import Image from "next/image"
import { FaWhatsapp, FaLinkedin } from "react-icons/fa"
import InstagramIcon from "../public/icons/Instagram_icon.png"
import Linkedin from "@/public/icons/linkedin.png"
import Whatsapp from "@/public/icons/WhatsApp.svg"

type User = {
  avatar: string
  name: string
  occupation: string
  company: string
  sector: string
  phone: string
  social_links: {
    instagram: string
    linkedin: string
  }
}

export default function UserCard({ user }: { user: User }) {
  // Format phone number for WhatsApp link with null check
  const whatsappNumber = user.phone ? user.phone.replace(/\D/g, "") : ""

  // Create initials for avatar fallback
  const getInitials = (name: string | undefined) => {
    if (!name) return "?"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className= "bg-gradient-to-b from-white/10 via-white/25 to-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/10 max-w-sm w-full mx-auto overflow-hidden border-2 rounded-[24px]">
      {/* Avatar Section - Top */}
      <div className="relative w-full h-[334px] rounded-t-2xl overflow-hidden">
        {user.avatar && user.avatar.trim() !== "" ? (
          <Image
            src={user.avatar}
            alt={`Foto de ${user.name}`}
            fill
            className="object-cover"
            sizes="w-full h-[334]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold bg-gray-700">
            {getInitials(user.name)}
          </div>
        )}
      </div>

      {/* User Info Section */}
      <div className="p-6 space-y-4">
        <h2 className="text-[24px] font-goldman-sans font-bold bg-gradient-to-r from-[#F8F8F8] to-[#71717A] text-transparent bg-clip-text">
          {user.name}
        </h2>

        <div className="text-gray-300">
          <p className="font-medium">{user.occupation} | {user.company}</p>
          {user.sector && (
            <p className="font-medium">{user.sector}</p>
          )}
        </div>

        {/* Social Links */}
        <hr className="border-t border-white/20" />
        <div className="flex flex-wrap gap-4 pt-2">
          {user.social_links?.instagram && (
            <a
              href={`https://instagram.com/${user.social_links.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Perfil do Instagram de ${user.name}`}
              className="flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors"
            >
              <Image src={InstagramIcon} alt="Instagram Icon" width={30} height={30} />
            </a>
          )}

          {user.social_links?.linkedin && (
            <a
              href={`https://linkedin.com/in/${user.social_links.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Perfil do LinkedIn de ${user.name}`}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Image src={Linkedin} alt="Instagram Icon" width={30} height={30} />
            </a>
          )}
          
          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Enviar mensagem no WhatsApp para ${user.name}`}
              className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
            >
              <Image src={Whatsapp} alt="Instagram Icon" width={30} height={30} />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}