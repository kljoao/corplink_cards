import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // If the path is the root, redirect to the default member
  if (path === "/") {
    return NextResponse.redirect(new URL("/eduardo.diniz", request.url))
  }

  // Protected routes that require authentication
  const protectedRoutes = ["/perfil"]
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))

  if (isProtectedRoute) {
    // Check if user is authenticated by looking for auth token in cookies
    const authToken = request.cookies.get("auth_token")?.value
    
    if (!authToken) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // If user is on login page and already authenticated, redirect to profile
  if (path === "/login") {
    const authToken = request.cookies.get("auth_token")?.value
    
    if (authToken) {
      return NextResponse.redirect(new URL("/perfil", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
