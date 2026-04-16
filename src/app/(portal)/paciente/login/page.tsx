"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Mail, Lock } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

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
    <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border shadow-sm p-8 w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#0D3A6B] flex items-center justify-center">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="font-bold text-[#0D3A6B]">NaviClin</span>
        </Link>
        <h1 className="text-xl font-bold mb-1">Portal do Paciente</h1>
        <p className="text-sm text-slate-500 mb-6">Entre para ver seus agendamentos e documentos</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Email ou CPF</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                required
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-[#0D3A6B] focus:ring-1 focus:ring-[#0D3A6B]/20"
                placeholder="seu@email.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-[#0D3A6B] focus:ring-1 focus:ring-[#0D3A6B]/20"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#0D3A6B] hover:bg-[#1A5599] text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/recuperar-senha" className="text-xs text-blue-600 hover:underline">Esqueceu sua senha?</Link>
        </div>

        <div className="mt-6 pt-6 border-t text-center">
          <p className="text-xs text-slate-500">
            É profissional de saúde?{" "}
            <Link href="/login" className="text-[#0D3A6B] font-medium hover:underline">Entrar na clínica</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
