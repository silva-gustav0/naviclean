import { Navbar } from "@/components/landing/Navbar"
import { HeroSection } from "@/components/landing/HeroSection"
import { SocialProof } from "@/components/landing/SocialProof"
import { FeaturesSection } from "@/components/landing/FeaturesSection"
import { PricingSection } from "@/components/landing/PricingSection"
import { TestimonialsSection } from "@/components/landing/TestimonialsSection"
import { CTASection } from "@/components/landing/CTASection"
import { Footer } from "@/components/landing/Footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "NaviClin — Gestão Odontológica com Precisão Clínica",
  description:
    "Plataforma SaaS completa para clínicas odontológicas. Agendamento online, prontuário digital, controle financeiro e muito mais. Comece grátis por 14 dias.",
  openGraph: {
    title: "NaviClin — Gestão Odontológica com Precisão Clínica",
    description:
      "A plataforma definitiva para dentistas de alta performance. +500 clínicas confiam no NaviClin.",
    type: "website",
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="pt-20">
        <HeroSection />
        <SocialProof />
        <FeaturesSection />
        <PricingSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
