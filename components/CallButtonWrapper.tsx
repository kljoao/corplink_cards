"use client"

import { usePathname } from "next/navigation"
import CallButton from "./CallButton"

export default function CallButtonWrapper() {
  const pathname = usePathname()
  
  // Esconder CallButton nas páginas de login e perfil
  const shouldHideCallButton = pathname === "/login" || pathname === "/perfil"

  if (shouldHideCallButton) {
    return null
  }

  return <CallButton />
} 