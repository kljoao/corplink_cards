import Hero from "@/components/zanith/hero"
import Benefits from "@/components/zanith/benefits"
import CardShowcase from "@/components/zanith/card-showcase"
import Exclusive from "@/components/zanith/exclusive"
import CTA from "@/components/zanith/cta"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <CardShowcase />
      <Benefits />
      <Exclusive />
      <CTA />
    </main>
  )
}
