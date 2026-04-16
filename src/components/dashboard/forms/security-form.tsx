"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { Loader2, Eye, EyeOff } from "lucide-react"

export function SecurityForm() {
  const [isPending, startTransition] = useTransition()
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [form, setForm] = useState({ current: "", newPass: "", confirm: "" })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.newPass.length < 8) {
      toast.error("Nova senha deve ter pelo menos 8 caracteres")
      return
    }
    if (form.newPass !== form.confirm) {
      toast.error("As senhas não coincidem")
      return
    }

    startTransition(async () => {
      const supabase = createClient()
      // Re-authenticate with current password first
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.email) { toast.error("Usuário não encontrado"); return }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: form.current,
      })
      if (signInError) {
        toast.error("Senha atual incorreta")
        return
      }

      const { error } = await supabase.auth.updateUser({ password: form.newPass })
      if (error) {
        toast.error("Erro ao alterar senha", { description: error.message })
      } else {
        toast.success("Senha alterada com sucesso!")
        setForm({ current: "", newPass: "", confirm: "" })
      }
    })
  }

  const inputClass = "w-full px-4 py-2.5 pr-10 text-sm border rounded-xl bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Senha atual</label>
        <div className="relative">
          <input
            type={showCurrent ? "text" : "password"}
            placeholder="••••••••"
            value={form.current}
            onChange={(e) => setForm((f) => ({ ...f, current: e.target.value }))}
            required
            className={inputClass}
          />
          <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Nova senha</label>
        <div className="relative">
          <input
            type={showNew ? "text" : "password"}
            placeholder="Mínimo 8 caracteres"
            value={form.newPass}
            onChange={(e) => setForm((f) => ({ ...f, newPass: e.target.value }))}
            required
            minLength={8}
            className={inputClass}
          />
          <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Confirmar nova senha</label>
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Repita a nova senha"
            value={form.confirm}
            onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
            required
            className={inputClass}
          />
          <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-60 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Alterar senha
      </button>
    </form>
  )
}
