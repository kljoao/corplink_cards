import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#000015] text-white p-4">
      <h1 className="text-4xl font-goldman bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent mb-6">
        Membro não encontrado
      </h1>
      <p className="text-white/70 mb-8">O perfil que você está procurando não existe ou foi removido.</p>
      <Link
        href="https://corplink.co/u/members"
        className="px-6 py-3 bg-gradient-to-b from-white/10 via-white/25 to-white/10 rounded-full hover:opacity-90 transition"
      >
        Voltar para membros
      </Link>
    </div>
  )
}
