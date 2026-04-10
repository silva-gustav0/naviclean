import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Lado esquerdo: formulario */}
      <div className="flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">N</span>
            </div>
            <span className="font-bold text-xl">NaviClean</span>
          </Link>
          {children}
        </div>
      </div>

      {/* Lado direito: visual */}
      <div className="hidden lg:flex flex-col bg-primary text-primary-foreground p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-blue-700" />
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex-1 flex flex-col justify-center">
            <blockquote className="space-y-4">
              <p className="text-2xl font-medium leading-relaxed">
                &ldquo;O NaviClean transformou a gestao da nossa clinica. Economizamos horas por semana e os pacientes adoram o agendamento online.&rdquo;
              </p>
              <footer className="text-primary-foreground/80">
                <p className="font-medium">Dra. Ana Paula Ferreira</p>
                <p className="text-sm">Clinica Sorriso Perfeito, Sao Paulo</p>
              </footer>
            </blockquote>
          </div>
          <div className="space-y-2 text-primary-foreground/70 text-sm">
            <p>+500 clinicas ja confiam no NaviClean</p>
          </div>
        </div>
      </div>
    </div>
  )
}
