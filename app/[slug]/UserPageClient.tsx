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
  email: string
  bio: string
  social_links: {
    instagram: string
    linkedin: string
    whatsapp: boolean
  }
}
// Codigo para UserPageClient
export default function UserPageClient({ user }: { user: User }) {
  return (
    <div className="min-h-screen items-center justify-center overflow-hidden relative">
      {/* Efeito de background animado */}
      <div className="absolute inset-0 opacity-30 z-0 pointer-events-none">
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
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" className="animate-pulse">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(59, 130, 246, 0.1)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>
      {/* Conteúdo principal */}
      <div className="flex flex-col items-center justify-center gap-10 relative z-10 px-4 sm:px-6 lg:px-8">
        <Header />
        <div className="flex flex-col items-center justify-center gap-2 pt-[150px]">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-goldman-sans font-bold bg-gradient-to-r from-[#F8F8F8] to-[#71717A] text-transparent bg-clip-text">
            Membros
          </h1>
          <p className="text-white/50 text-sm sm:text-base">Perfil do usuário</p>
        </div>
        
        
        <UserCard user={user} />
        <Toaster position="top-right" />
      </div>
    </div>
  )
} 