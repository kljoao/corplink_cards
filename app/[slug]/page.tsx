import { notFound } from "next/navigation"
import UserPageClient from './UserPageClient'
import type { Metadata } from "next"

// Tipo de dados completo que vem da API
type ApiUser = {
  id: string
  name: string
  avatar: string
  email: string
  info: {
    company: string
    occupation: string
    sector: string
    phone: string | null
    bio?: string
    social_links: {
      instagram: string
      linkedin: string
      whatsapp?: '0' | '1'
    }
  }
}

// Busca os dados de um único usuário pelo slug
async function fetchUserBySlug(slug: string): Promise<ApiUser | null> {
  const sanitizedSlug = slug.toLowerCase().trim()
  const apiUrl = `${process.env.NEXT_PUBLIC_API}/v1/users/${sanitizedSlug}`

  try {
    const res = await fetch(apiUrl, {
      headers: { Accept: "application/json" },
      // Garante que os dados sejam buscados a cada requisição, sem cache.
      cache: 'no-store',
      next: { revalidate: 0 },
    })

    if (!res.ok) {
      console.error(`Falha ao buscar usuário com slug ${sanitizedSlug}. Status: ${res.status}`)
      return null
    }

    const user: ApiUser = await res.json()
    return user
  } catch (error) {
    console.error(`Erro ao buscar usuário com slug ${sanitizedSlug}:`, error)
    return null
  }
}

export default async function UserPage({ params }: { params: { slug:string } }) {
  const user = await fetchUserBySlug(params.slug)

  // Se o usuário não for encontrado, exibe a página 404
  if (!user) {
    notFound()
  }

  // Mapeia os dados da API para o formato que o UserCard espera teste
  const cardUser = {
    avatar: user.avatar,
    name: user.name,
    email: user.email,
    occupation: user.info?.occupation ?? '',
    company: user.info?.company ?? '',
    sector: user.info?.sector ?? '',
    phone: user.info?.phone ?? null,
    bio: user.info?.bio ?? '',
    social_links: {
      instagram: user.info?.social_links?.instagram ?? '',
      linkedin: user.info?.social_links?.linkedin ?? '',
      whatsapp: String(user.info?.social_links?.whatsapp) === '1'
    }
  }

  return <UserPageClient user={cardUser} />
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const user = await fetchUserBySlug(params.slug);

  if (!user) {
    return {
      title: " – CorpLink",
      openGraph: {
        title: "Membro – CorpLink",
        images: [],
      },
    };
  }

  return {
    title: `${user.name} – CorpLink`,
    openGraph: {
      title: `${user.name} – CorpLink`,
      description: user.info?.occupation ? `${user.info.occupation} na ${user.info.company}` : undefined,
      images: user.avatar ? [
        {
          url: user.avatar,
          width: 1200,
          height: 630,
          alt: `Foto de ${user.name}`,
        },
      ] : [],
    },
  };
} 