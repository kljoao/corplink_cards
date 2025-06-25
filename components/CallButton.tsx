"use client"
import { usePathname } from "next/navigation"

// components/CallButton.tsx
export default function CallToActionButton() {
  const pathname = usePathname();
  // Esconde o botão se estiver na rota de perfil (ex: /joao, /maria, etc)
  const isProfile = /^\/[a-zA-Z0-9_.-]+$/.test(pathname) && pathname !== "/";
  if (isProfile) return null;

  return (
    <div className="flex justify-center items-center mt-12">
        <a
        href="https://corplink.co"
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-3 rounded-full border border-white/20 text-white text-base font-medium tracking-wide hover:bg-white/10 transition-colors duration-300"
        >
        Faça Parte →
        </a>
    </div>
  );
}