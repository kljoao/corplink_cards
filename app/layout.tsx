import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import CallButtonWrapper from "@/components/CallButtonWrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CorpLink",
  description: "Plataforma de networking para profissionais",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="min-h-screen">
      <body className={`${inter.className} bg-[#000015]`}>
        {/* <Header /> */}
        {children}
        <CallButtonWrapper />
        <hr className="border-white/10 mt-12"/>
        <Footer />
        <hr className="border-white/10 mt-12"/>
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left p-10">
        <p className="text-sm text-[rgb(161,161,170)]">© 2025 CorpLink & Co. Todos os direitos reservados.</p>
        <p className="text-sm text-[rgb(161,161,170)]">CNPJ: 36.192.284/0001-02 - Av. das Américas, 3500 - Barra da Tijuca, Rio de Janeiro - RJ</p>
      </div>
      </body>
    </html>
  )
}
