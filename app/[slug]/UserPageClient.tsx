'use client'
import UserCard from '@/components/user-card'
import Header from '@/components/Header'
import { Toaster } from 'sonner'
import Image from 'next/image'
import Light from '@/public/7AfGia7in1mhxc8qYNT9wvedPU.png'

// Este é o tipo de usuário que o UserCard espera
type User = {
  avatar: string
  name: string
  occupation: string
  company: string
  sector: string
  phone: string | null
  social_links: {
    instagram: string
    linkedin: string
  }
}

export default function UserPageClient({ user }: { user: User }) {
  return (
    <div className="min-h-screen items-center justify-center overflow-hidden relative">
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <Image
          src={Light}
          alt="Background Light Effect"
          fill
          className="object-cover opacity-60 blur-2xl"
          priority
        />
      </div>
      <div className="flex flex-col items-center justify-center gap-10 relative z-10">
        <Header />
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="text-4xl font-goldman-sans font-bold bg-gradient-to-r from-[#F8F8F8] to-[#71717A] text-transparent bg-clip-text">
            Membros
          </h1>
          <p className="text-white/50">Perfil do usuário</p>
        </div>
        <UserCard user={user} />
        <Toaster position="top-right" />
      </div>
    </div>
  )
} 