import Image from "next/image"
import Link from "next/link"
import logo from "@/public/icons/jcGJc8N66ozFfkVDcgmYwvoVeA.svg"

export default function Header() {
  return (
    <header className="w-full flex justify-center sticky z-50 pt-5">
      <div className="w-[1136px] flex items-center justify-between border border-white/10 rounded-full bg-[#000015BF] py-4 px-8 shadow-lg">
        <Link href="/" className="flex items-center gap-2">
          <Image src={logo} alt="CorpLink Logo" width={180} />
        </Link>

        <Link href="https://www.corplink.co/u/join">
          <button className="flex items-center text-white px-6 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors">
            Login
          </button>
        </Link>
      </div>
    </header>
  )
} 