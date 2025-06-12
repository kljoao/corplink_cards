interface User {
    id: number
    name: string
    email: string
    phone: string
    instagram: string
    linkedin: string
    avatar: string | null
    bio: string | null
    created_at: string
    updated_at: string
  }
  
  export async function fetchUserData(handle: string): Promise<User> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/by-instagram/${handle}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Disable caching to always get fresh data
    })
  
    if (!response.ok) {
      throw new Error(`Failed to fetch user data: ${response.statusText}`)
    }
  
    return response.json()
  }