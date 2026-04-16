import Link from "next/link"
import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6 py-20 pt-32">
        <div className="text-center max-w-md">
          <div className="relative mb-8 inline-block">
            <span className="text-[120px] font-black text-[#E8F0F9] leading-none select-none">404</span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-[#0D3A6B] flex items-center justify-center shadow-xl">
                <span className="text-[#DBB47A] font-black text-2xl">N</span>
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Página não encontrada</h1>
          <p className="text-slate-500 mb-8">
            Ops! A página que você está procurando não existe ou foi movida.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#0D3A6B] hover:bg-[#1A5599] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
            >
              <Home className="h-4 w-4" />
              Início
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 border border-slate-200 hover:border-[#0D3A6B] text-slate-600 hover:text-[#0D3A6B] font-medium px-5 py-2.5 rounded-xl transition-colors text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
