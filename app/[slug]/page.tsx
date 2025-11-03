import { notFound } from "next/navigation"
import UserPageClient from './UserPageClient'
import type { Metadata } from "next"

// Tipo de dados completo que vem da API
type ApiUser = {
  id: string
  name: string
  avatar: string
  email: string
  corplinkurl?: string
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

// Cache em memória para evitar requisições duplicadas durante o build/render
const userCache = new Map<string, { data: ApiUser | null; timestamp: number }>()
const CACHE_TTL = 5000 // 5 segundos de cache

// Busca os dados de um único usuário pelo slug com retry logic
async function fetchUserBySlug(slug: string, retries = 3): Promise<ApiUser | null> {
  const sanitizedSlug = slug.toLowerCase().trim()
  
  // Verifica cache
  const cached = userCache.get(sanitizedSlug)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }

  const apiUrl = `${process.env.NEXT_PUBLIC_API}/v1/users/${sanitizedSlug}`

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // AbortController com timeout de 15 segundos
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      const res = await fetch(apiUrl, {
        headers: { 
          Accept: "application/json",
          'Content-Type': 'application/json'
        },
        signal: controller.signal,
        // Configurações de cache otimizadas
        cache: 'no-store',
        next: { revalidate: 0 },
      })

      clearTimeout(timeoutId)

      if (!res.ok) {
        console.error(`Falha ao buscar usuário com slug ${sanitizedSlug}. Status: ${res.status} (Tentativa ${attempt}/${retries})`)
        
        // Se for 404, não precisa tentar novamente
        if (res.status === 404) {
          userCache.set(sanitizedSlug, { data: null, timestamp: Date.now() })
          return null
        }
        
        // Para outros erros, tenta novamente
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt)) // Backoff exponencial
          continue
        }
        return null
      }

      const user: ApiUser = await res.json()
      
      // Armazena no cache
      userCache.set(sanitizedSlug, { data: user, timestamp: Date.now() })
      
      return user
    } catch (error) {
      const isTimeout = error instanceof Error && error.name === 'AbortError'
      const isConnectionError = error instanceof Error && 'cause' in error
      
      console.error(
        `Erro ao buscar usuário com slug ${sanitizedSlug} (Tentativa ${attempt}/${retries}):`,
        isTimeout ? 'Timeout - API demorou mais de 15s para responder' : error
      )

      // Se for timeout ou erro de conexão e ainda temos tentativas, tenta novamente
      if ((isTimeout || isConnectionError) && attempt < retries) {
        console.log(`Tentando novamente em ${attempt} segundo(s)...`)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
        continue
      }

      // Se esgotou as tentativas, retorna null
      if (attempt === retries) {
        userCache.set(sanitizedSlug, { data: null, timestamp: Date.now() })
        return null
      }
    }
  }

  return null
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
    corplinkurl: user.corplinkurl ?? '',
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