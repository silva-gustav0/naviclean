import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ArrowLeft, Shield, Key } from "lucide-react"
import Link from "next/link"
import { SecurityForm } from "@/components/dashboard/forms/security-form"

export default async function SegurancaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/configuracoes" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Segurança</h1>
          <p className="text-muted-foreground text-sm">Proteja sua conta</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center gap-2">
          <Shield className="h-4 w-4 text-slate-600" />
          <span className="font-semibold text-sm">Alterar senha</span>
        </div>
        <SecurityForm />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center gap-2">
          <Key className="h-4 w-4 text-amber-600" />
          <span className="font-semibold text-sm">Sessões ativas</span>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium">Sessão atual</p>
              <p className="text-xs text-muted-foreground">Navegador Web · {user.email}</p>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 px-2 py-0.5 rounded-full font-medium">
              Ativa
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
