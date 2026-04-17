import Link from "next/link"
import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6 py-20 pt-32">
        <div className="text-center max-w-md">
          <div className="relative mb-8 inline-block">
            <span className="text-[120px] font-black text-primary/10 leading-none select-none">404</span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl surgical-gradient flex items-center justify-center shadow-premium">
                <span className="text-nc-secondary font-black text-2xl">N</span>
              </div>
            </div>
          </div>
          <h1 className="font-headline font-extrabold text-2xl text-primary mb-2">Página não encontrada</h1>
          <p className="text-on-surface-variant mb-8">
            Ops! A página que você está procurando não existe ou foi movida.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 surgical-gradient text-white font-semibold px-5 py-2.5 rounded-xl shadow-premium-sm hover:opacity-90 transition-opacity text-sm"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>home</span>
              Início
            </Link>
            <Link
              href="javascript:history.back()"
              className="inline-flex items-center gap-2 border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary font-medium px-5 py-2.5 rounded-xl transition-colors text-sm"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
              Voltar
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
