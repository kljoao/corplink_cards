import { notFound } from "next/navigation"
import UserPageClient from './UserPageClient'

// Tipo de dados completo que vem da API
type ApiUser = {
  id: string
  name: string
  avatar: string
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
    occupation: user.info?.occupation ?? '',
    company: user.info?.company ?? '',
    sector: user.info?.sector ?? '',
    phone: user.info?.phone ?? null,
    social_links: {
      instagram: user.info?.social_links?.instagram ?? '',
      linkedin: user.info?.social_links?.linkedin ?? ''
    }
  }

  return <UserPageClient user={cardUser} />
} 