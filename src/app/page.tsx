import { Navbar }            from "@/components/landing/Navbar"
import { HeroSection }       from "@/components/landing/HeroSection"
import { FeaturesSection }   from "@/components/landing/FeaturesSection"
import { DashboardPreview }  from "@/components/landing/DashboardPreview"
import { TracksSection }     from "@/components/landing/TracksSection"
import { SocialProof }       from "@/components/landing/SocialProof"
import { TestimonialsSection } from "@/components/landing/TestimonialsSection"
import { PricingSection }    from "@/components/landing/PricingSection"
import { FaqSection }        from "@/components/landing/FaqSection"
import { CTASection }        from "@/components/landing/CTASection"
import { Footer }            from "@/components/landing/Footer"
import { DemoModal }         from "@/components/landing/DemoModal"
import { RevealOnScroll }    from "@/components/landing/RevealOnScroll"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "NaviClin — Gestão Odontológica com Precisão Clínica",
  description:
    "Plataforma SaaS completa para clínicas odontológicas. Agendamento online, prontuário digital, controle financeiro e muito mais. Comece grátis por 14 dias.",
  openGraph: {
    title: "NaviClin — Gestão Odontológica com Precisão Clínica",
    description:
      "A plataforma definitiva para dentistas de alta performance. +1.200 clínicas confiam no NaviClin.",
    type: "website",
  },
}

export default function HomePage() {
  return (
    <>
      <RevealOnScroll />
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <DashboardPreview />
        <TracksSection />
        <SocialProof />
        <TestimonialsSection />
        <PricingSection />
        <FaqSection />
        <CTASection />
      </main>
      <Footer />
      <DemoModal />
    </>
  )
}
