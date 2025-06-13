import { notFound } from "next/navigation"
import Image from "next/image"
import type { Metadata } from "next"
import UserCard from "@/components/user-card"
import Light from "@/public/7AfGia7in1mhxc8qYNT9wvedPU.png"
import Header from "@/components/Header"

// Define the User type based on the API response
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

type ApiResponse = {
  data: User
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: { handle: string }
}): Promise<Metadata> {
  const handle = await Promise.resolve(params.handle)

  try {
    const user = await fetchUserData(handle)

    return {
      title: `${user.name} – CorpLink`,
      openGraph: {
        title: `${user.name} – CorpLink`,
        description: `${user.occupation} at ${user.company}`,
        images: [{ url: user.avatar, width: 1200, height: 630, alt: `Foto de ${user.name}` }],
      },
    }
  } catch (error) {
    return {
      title: "Membro – CorpLink",
    }
  }
}

// Fetch user data from API
async function fetchUserData(handle: string): Promise<User> {
  // Sanitiza o handle
  const sanitizedHandle = handle.toLowerCase().replace('@', '').trim()
  
  const apiUrl = `${process.env.NEXT_PUBLIC_API}/v1/users/by-instagram/${sanitizedHandle}`

  const res = await fetch(apiUrl, {
    next: { revalidate: 600 }, // Revalidate every 10 minutes
    headers: {
      'Accept': 'application/json',
    },
  })

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("User not found")
    }
    throw new Error("Failed to fetch user data")
  }

  const response: ApiResponse = await res.json()
  return response.data
}

export default async function UserPage({
  params,
}: {
  params: { handle: string }
}) {
  const handle = await Promise.resolve(params.handle)

  try {
    const user = await fetchUserData(handle)

    return (
      <div className="min-h-screen items-center justify-center overflow-hidden">
        <Image
          src={Light}
          alt="Background Light Effect"
          width={1440}
          height={800}
          className="absolute top-0 left-1/2 -translate-x-1/2 opacity-60 blur-2xl z-0 pointer-events-none"
          priority
        />
        <div className="flex flex-col items-center justify-center gap-10">
          <Header />
          <div className="flex flex-col items-center justify-center gap-2">
            <h1 className="text-4xl font-goldman-sans font-bold bg-gradient-to-r from-[#F8F8F8] to-[#71717A] text-transparent bg-clip-text">Membros</h1>
            <p className="text-white/50">Perfil do usuário</p>
          </div>
          <UserCard user={user}/>
        </div>
      </div>
    )
  } catch (error) {
    if (error instanceof Error && error.message === "User not found") {
      notFound()
    }
    throw error
  }
}