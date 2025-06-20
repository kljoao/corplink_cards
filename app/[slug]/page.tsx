import { notFound } from "next/navigation"
import Image from "next/image"
import type { Metadata } from "next"
import UserCard from "@/components/user-card"
import Light from "@/public/7AfGia7in1mhxc8qYNT9wvedPU.png"
import Header from "@/components/Header"
import { Toaster } from "sonner"
import UserPageClient from './UserPageClient'

// NOTA: Este tipo assume que a resposta da API inclui todos estes campos.
// `firstname` e `lastname` são essenciais para gerar os slugs.
type User = {
  id: string
  name: string
  firstname: string
  lastname: string
  email: string
  avatar: string
  avatar_thumb: string
  info: {
    company: string
    occupation: string
    sector: string
    phone: string | null
    social_links: {
      instagram: string
      linkedin: string
    }
  }
  created_at: string
}

function normalize(str: string) {
  return str
    .normalize('NFD') // Remove acentos
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '') // Remove espaços
    .toLowerCase()
    .trim()
}

// Gera os metadados da página (para o <head>)
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const slug = params.slug

  try {
    const user = await fetchUserBySlug(slug)
    if (!user) throw new Error("User not found")

    return {
      title: `${user.name} – CorpLink`,
      openGraph: {
        title: `${user.name} – CorpLink`,
        description: `${user.info.occupation} at ${user.info.company}`,
        images: [
          {
            url: user.avatar,
            width: 1200,
            height: 630,
            alt: `Foto de ${user.name}`,
          },
        ],
      },
    }
  } catch (error) {
    return {
      title: "Membro – CorpLink",
    }
  }
}

export async function generateStaticParams() {
  const apiUrl = `${process.env.NEXT_PUBLIC_API}/v1/users/all`
  const defaultSlug = { slug: "eduardo.diniz" }

  try {
    const res = await fetch(apiUrl, { headers: { Accept: "application/json" } })
    if (!res.ok) {
      return [defaultSlug]
    }
    const users: any[] = await res.json()

    const dynamicSlugs = users
      .filter((user) => user.name && user.name.split(' ').length > 1)
      .map((user) => {
        const parts = user.name.trim().split(' ')
        const firstname = parts[0]
        const lastname = parts[parts.length - 1]
        return {
          slug: `${normalize(firstname)}.${normalize(lastname)}`
        }
      })

    const allSlugs = [...dynamicSlugs, defaultSlug]
    const uniqueSlugs = Array.from(new Map(allSlugs.map((item) => [item.slug, item])).values())

    return uniqueSlugs
  } catch (error) {
    return [defaultSlug]
  }
}

// Função para buscar o usuário pelo handle
async function fetchUserByHandle(handle: string): Promise<User | null> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API}/v1/users/all`
  const res = await fetch(apiUrl, { headers: { 'Accept': 'application/json' } })
  const users: User[] = await res.json()
  const sanitizedHandle = handle.toLowerCase().replace('@', '').trim()
  return users.find(
    user => user.info?.social_links?.instagram?.toLowerCase().replace('@', '').trim() === sanitizedHandle
  ) || null
}

// Busca os dados de um único usuário pelo slug (nome.sobrenome)
async function fetchUserBySlug(slug: string): Promise<User | null> {
  const sanitizedSlug = slug.toLowerCase().trim()
  const apiUrl = `${process.env.NEXT_PUBLIC_API}/v1/users/${sanitizedSlug}`

  try {
    const res = await fetch(apiUrl, {
      headers: { Accept: "application/json" },
      next: { revalidate: 600 }, // Revalida a cada 10 minutos
    })

    if (!res.ok) {
      console.error(
        `Falha ao buscar usuário com slug ${sanitizedSlug}. Status: ${res.status}`
      )
      return null
    }

    const user: User = await res.json()
    return user
  } catch (error) {
    console.error(`Erro ao buscar usuário com slug ${sanitizedSlug}:`, error)
    return null
  }
}

export default function UserPage({ params }: { params: { slug: string } }) {
  return <UserPageClient slug={params.slug} />
} 