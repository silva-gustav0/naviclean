import Link from "next/link"
import { Star, Shield, Zap, Users } from "lucide-react"

const features = [
  { icon: Zap, text: "Agendamento online 24/7" },
  { icon: Users, text: "Gestão completa de pacientes" },
  { icon: Shield, text: "Dados seguros e protegidos" },
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: form */}
      <div className="flex flex-col items-center justify-center px-6 py-12 bg-white dark:bg-slate-950">
        <div className="w-full max-w-sm">
          <Link href="/" className="flex items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-bold text-xl">NaviClin</span>
          </Link>
          {children}
        </div>
      </div>

      {/* Right: visual */}
      <div className="hidden lg:flex flex-col bg-gradient-to-br from-blue-600 via-blue-700 to-violet-800 text-white p-12 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-20 left-10 w-72 h-72 rounded-full bg-violet-500/20 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col h-full">
          {/* Stars */}
          <div className="flex gap-1 mb-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <blockquote className="space-y-6">
              <p className="text-2xl font-medium leading-relaxed">
                &ldquo;O NaviClin transformou a gestão da nossa clínica. Economizamos horas por semana e os pacientes adoram o agendamento online.&rdquo;
              </p>
              <footer className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                  AP
                </div>
                <div>
                  <p className="font-semibold">Dra. Ana Paula Ferreira</p>
                  <p className="text-blue-200 text-sm">Clínica Sorriso Perfeito, São Paulo</p>
                </div>
              </footer>
            </blockquote>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-8">
            {features.map((f) => (
              <div key={f.text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <f.icon className="h-4 w-4 text-blue-200" />
                </div>
                <span className="text-blue-100 text-sm">{f.text}</span>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-white/20">
            <p className="text-blue-200 text-sm font-medium">+500 clínicas já confiam no NaviClin</p>
          </div>
        </div>
      </div>
    </div>
  )
}
