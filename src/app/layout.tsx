import type { Metadata } from "next"
import { Manrope, Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: {
    default: "NaviClin - Plataforma para Clinicas Odontologicas",
    template: "%s | NaviClin",
  },
  description:
    "Gerencie sua clinica odontologica com facilidade. Agendamentos, prontuarios, financeiro e muito mais em uma so plataforma.",
  keywords: ["odontologia", "clinica odontologica", "agendamento", "prontuario", "gestao clinica"],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "NaviClin",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${manrope.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
