'use client'
import { useEffect, useState } from 'react'
import UserCard from '@/components/user-card'
import Header from '@/components/Header'
import { Toaster } from 'sonner'
import Image from 'next/image'
import Light from '@/public/7AfGia7in1mhxc8qYNT9wvedPU.png'

export default function UserPageClient({ slug }: { slug: string }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API}/v1/users/${slug}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setUser({
            avatar: data.avatar,
            name: data.name,
            occupation: data.info?.occupation ?? '',
            company: data.info?.company ?? '',
            sector: data.info?.sector ?? '',
            phone: data.info?.phone ?? null,
            social_links: {
              instagram: data.info?.social_links?.instagram ?? '',
              linkedin: data.info?.social_links?.linkedin ?? ''
            }
          })
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug])

  if (loading) return <div>Carregando...</div>
  if (!user) return <div>Usuário não encontrado</div>

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