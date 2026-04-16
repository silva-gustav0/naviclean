import Link from "next/link"
import { Heart } from "lucide-react"

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="border-b bg-white dark:bg-slate-900 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-[#0D3A6B]">
            <div className="w-7 h-7 rounded-lg bg-[#0D3A6B] flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            NaviClin
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/buscar" className="text-muted-foreground hover:text-foreground transition-colors">
              Encontrar clínica
            </Link>
            <Link href="/meus-agendamentos" className="text-muted-foreground hover:text-foreground transition-colors">
              Meus agendamentos
            </Link>
            <Link href="/login" className="px-3 py-1.5 bg-[#0D3A6B] text-white rounded-lg text-xs font-medium hover:bg-[#1A5599] transition-colors">
              Entrar
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="border-t bg-white dark:bg-slate-900 mt-12">
        <div className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} NaviClin. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">Feito com <Heart className="h-3 w-3 text-red-500" /> para a saúde</p>
        </div>
      </footer>
    </div>
  )
}
