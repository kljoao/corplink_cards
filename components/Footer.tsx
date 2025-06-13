import Image from "next/image"
import Link from "next/link"
import logo from "@/public/icons/jcGJc8N66ozFfkVDcgmYwvoVeA.svg"
import { FaInstagram, FaLinkedin } from "react-icons/fa"

export default function Footer() {
  return (
    <footer className="w-full flex flex-col items-center justify-center p-8 mt-12 mb-4 relative z-10">
        
      <Image src={logo} alt="CorpLink Logo" width={100} height={26} className="mb-4" />
      <div className="flex gap-4">
        <Link href="https://www.instagram.com/corplink.co/" aria-label="Instagram" className="text-gray-400 hover:text-gray-200 transition-colors">
          <FaInstagram className="text-2xl" />
        </Link>
        <Link href="https://www.linkedin.com/company/corplink-co/" aria-label="LinkedIn" className="text-gray-400 hover:text-gray-200 transition-colors">
          <FaLinkedin className="text-2xl" />
        </Link>
      </div>
    </footer>
  )
} 