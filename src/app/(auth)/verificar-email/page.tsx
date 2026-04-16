"use client"

import { useState } from "react"
import { Mail, Loader2, RefreshCw } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export default function VerificarEmailPage() {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function resend() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) {
      toast.error("Sessão expirada. Faça o cadastro novamente.")
      setLoading(false)
      return
    }
    const { error } = await supabase.auth.resend({ type: "signup", email: user.email })
    setLoading(false)
    if (error) {
      toast.error("Erro ao reenviar", { description: error.message })
    } else {
      toast.success("Email reenviado!", { description: "Verifique sua caixa de entrada e spam." })
    }
  }

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center">
          <Mail className="h-10 w-10 text-[#0D3A6B]" />
        </div>
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Verifique seu email</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Enviamos um link de confirmação para o seu email.<br />
          Clique no link para ativar sua conta.
        </p>
      </div>
      <div className="bg-blue-50 rounded-xl p-4 text-left space-y-2">
        <p className="text-sm font-medium text-blue-800">Não recebeu o email?</p>
        <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
          <li>Verifique a pasta de spam ou lixo eletrônico</li>
          <li>Aguarde alguns minutos</li>
          <li>O remetente é no-reply@naviclin.com</li>
        </ul>
      </div>
      <button
        onClick={resend}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 border border-slate-200 hover:border-[#0D3A6B] text-slate-600 hover:text-[#0D3A6B] font-medium py-2.5 rounded-xl text-sm transition-colors"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        Reenviar email de confirmação
      </button>
      <p className="text-xs text-muted-foreground">
        Email errado?{" "}
        <a href="/cadastro" className="text-blue-600 hover:underline">Fazer novo cadastro</a>
      </p>
    </div>
  )
}
