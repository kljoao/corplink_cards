import Image from "next/image"
import Link from "next/link"
import logo from "@/public/icons/jcGJc8N66ozFfkVDcgmYwvoVeA.svg"

export default function Header2() {
  return (
    <header className="fixed top-0 left-0 w-full flex justify-center z-50 pt-3 sm:pt-5">
      <div className="w-full max-w-[1136px] flex items-center justify-center sm:justify-between border border-white/10 rounded-full bg-[#000015BF] py-2 sm:py-4 px-4 sm:px-8 shadow-lg mx-2">
        <Link href="/" className="flex items-center gap-2">
          <Image src={logo} alt="CorpLink Logo" width={140} height={40} className="sm:w-[220px] w-[140px] h-auto" />
        </Link>

        <div className="flex gap-5">
          <a href="" className="text-[#FAFAFA] opacity-60 hover:opacity-100 hover:text-white transition-all duration-300 relative group">
            Depoimentos
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white opacity-70 transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="" className="text-[#FAFAFA] opacity-60 hover:opacity-100 hover:text-white transition-all duration-300 relative group">
            Benefícios
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white opacity-70 transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="" className="text-[#FAFAFA] opacity-60 hover:opacity-100 hover:text-white transition-all duration-300 relative group">
            Perguntas Frequentes
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white opacity-70 transition-all duration-300 group-hover:w-full"></span>
          </a>
        </div>

        <Link href="https://corplink.co/u/login" className="hidden sm:flex">
          <button className="flex items-center text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-sm sm:text-base">
            Faça Parte →
          </button>
        </Link>
      </div>
    </header>
  )
} 