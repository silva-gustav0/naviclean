import Link from "next/link"
import { ThemeToggle } from "@/components/ui/ThemeToggle"

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-container-low">
      <header className="border-b border-outline-variant bg-surface-container-lowest sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-primary">
            <div className="w-7 h-7 rounded-lg surgical-gradient flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            NaviClin
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/buscar" className="text-on-surface-variant hover:text-on-surface transition-colors">
              Encontrar clínica
            </Link>
            <Link href="/meus-agendamentos" className="text-on-surface-variant hover:text-on-surface transition-colors">
              Meus agendamentos
            </Link>
            <ThemeToggle />
            <Link href="/login" className="px-3 py-1.5 surgical-gradient text-white rounded-lg text-xs font-semibold shadow-premium-sm hover:opacity-90 transition-opacity">
              Entrar
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-outline-variant bg-surface-container-lowest mt-12">
        <div className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between text-xs text-on-surface-variant">
          <p>© {new Date().getFullYear()} NaviClin. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Feito com
            <span className="material-symbols-outlined text-red-500" style={{ fontSize: 12, fontVariationSettings: "'FILL' 1" }}>favorite</span>
            para a saúde
          </p>
        </div>
      </footer>
    </div>
  )
}
