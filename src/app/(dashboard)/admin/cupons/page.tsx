import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Ticket, Plus, Tag } from "lucide-react"

export default async function AdminCuponsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "super_admin") redirect("/dashboard")

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cupons Promocionais</h1>
          <p className="text-muted-foreground text-sm">Gerencie cupons de desconto via Stripe</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0D3A6B] hover:bg-[#1A5599] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
          <Plus className="h-4 w-4" />
          Novo cupom no Stripe
        </button>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 flex items-start gap-3">
        <Tag className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm text-amber-800 dark:text-amber-200">Cupons gerenciados pelo Stripe</p>
          <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
            Cupons promocionais são criados e gerenciados diretamente no painel do Stripe.
            Acesse o <a href="https://dashboard.stripe.com/coupons" target="_blank" rel="noopener" className="underline font-medium">Dashboard Stripe → Cupons</a> para criar, ativar ou desativar cupons.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border py-16 text-center">
        <Ticket className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <p className="font-semibold">Integração com Stripe</p>
        <p className="text-muted-foreground text-sm mt-1 max-w-xs mx-auto">
          Configure a integração com Stripe em Configurações → Integrações para gerenciar cupons aqui.
        </p>
      </div>
    </div>
  )
}
