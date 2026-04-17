import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { SecurityForm } from "@/components/dashboard/forms/security-form"

export default async function SegurancaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/configuracoes" className="p-2 hover:bg-surface-container rounded-xl transition-colors">
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>arrow_back</span>
        </Link>
        <div>
          <h1 className="font-headline font-extrabold text-2xl text-primary">Segurança</h1>
          <p className="text-on-surface-variant text-sm">Proteja sua conta</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-premium-sm">
        <div className="px-6 py-4 border-b border-outline-variant bg-surface-container flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: 16 }}>shield</span>
          <span className="font-semibold text-sm text-on-surface">Alterar senha</span>
        </div>
        <SecurityForm />
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-premium-sm">
        <div className="px-6 py-4 border-b border-outline-variant bg-surface-container flex items-center gap-2">
          <span className="material-symbols-outlined text-nc-secondary" style={{ fontSize: 16 }}>key</span>
          <span className="font-semibold text-sm text-on-surface">Sessões ativas</span>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-semibold text-on-surface">Sessão atual</p>
              <p className="text-xs text-on-surface-variant">Navegador Web · {user.email}</p>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-medium">
              Ativa
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
