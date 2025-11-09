import Hero from "@/components/zanith/hero"
import CardShowcase from "@/components/zanith/card-showcase"
import CTA from "@/components/zanith/cta"
import FAQ from "@/components/zanith/faq"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <CardShowcase />
      <FAQ />
      <CTA />
    </main>
  )
}
