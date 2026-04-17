"use client"

import { useState } from "react"
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
      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
        <span className="material-symbols-outlined text-primary" style={{ fontSize: 40, fontVariationSettings: "'FILL' 1" }}>mark_email_unread</span>
      </div>
      <div className="space-y-2">
        <h1 className="font-headline font-extrabold text-2xl text-primary tracking-tight">Verifique seu email</h1>
        <p className="text-on-surface-variant text-sm leading-relaxed">
          Enviamos um link de confirmação para o seu email.<br />
          Clique no link para ativar sua conta.
        </p>
      </div>
      <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 text-left space-y-2">
        <p className="text-sm font-semibold text-primary">Não recebeu o email?</p>
        <ul className="text-xs text-on-surface-variant space-y-1 list-disc list-inside">
          <li>Verifique a pasta de spam ou lixo eletrônico</li>
          <li>Aguarde alguns minutos</li>
          <li>O remetente é no-reply@naviclin.com</li>
        </ul>
      </div>
      <button
        onClick={resend}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary font-medium py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{loading ? "autorenew" : "refresh"}</span>
        Reenviar email de confirmação
      </button>
      <p className="text-xs text-on-surface-variant">
        Email errado?{" "}
        <a href="/cadastro" className="text-primary font-semibold hover:underline underline-offset-4">Fazer novo cadastro</a>
      </p>
    </div>
  )
}
