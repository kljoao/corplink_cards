import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // If the path is the root, redirect to the default member
  if (path === "/") {
    return NextResponse.redirect(new URL("/eduardo.diniz", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/"],
}
