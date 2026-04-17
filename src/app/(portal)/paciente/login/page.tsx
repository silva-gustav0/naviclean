"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

const inputCls = "w-full pl-10 pr-4 py-2.5 border border-outline-variant rounded-xl text-sm bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"

export default function PacienteLoginPage() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      toast.error("Erro ao entrar", { description: "Email ou senha incorretos." })
      return
    }
    router.push("/paciente")
  }

  return (
    <div className="min-h-screen bg-surface-container-low flex items-center justify-center px-4">
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-premium p-8 w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg surgical-gradient flex items-center justify-center">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="font-bold text-primary">NaviClin</span>
        </Link>
        <h1 className="font-headline font-extrabold text-xl text-primary mb-1">Portal do Paciente</h1>
        <p className="text-sm text-on-surface-variant mb-6">Entre para ver seus agendamentos e documentos</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5">Email ou CPF</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline" style={{ fontSize: 16 }}>mail</span>
              <input
                required
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
                placeholder="seu@email.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5">Senha</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline" style={{ fontSize: 16 }}>lock</span>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputCls}
                placeholder="••••••••"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 surgical-gradient text-white font-semibold py-2.5 rounded-xl shadow-premium-sm hover:opacity-90 disabled:opacity-50 transition-opacity text-sm"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{loading ? "autorenew" : "login"}</span>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/recuperar-senha" className="text-xs text-primary hover:underline underline-offset-4">Esqueceu sua senha?</Link>
        </div>

        <div className="mt-6 pt-6 border-t border-outline-variant text-center">
          <p className="text-xs text-on-surface-variant">
            É profissional de saúde?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">Entrar na clínica</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
