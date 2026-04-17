import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AdminCuponsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "super_admin") redirect("/dashboard")

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-headline font-extrabold text-2xl text-primary">Cupons Promocionais</h1>
          <p className="text-on-surface-variant text-sm mt-0.5">Gerencie cupons de desconto via Stripe</p>
        </div>
        <button className="surgical-gradient text-white text-sm font-semibold flex items-center gap-1.5 px-4 py-2 rounded-xl shadow-premium-sm hover:opacity-90 transition-opacity">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
          Novo cupom no Stripe
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
        <span className="material-symbols-outlined text-amber-600 shrink-0 mt-0.5" style={{ fontSize: 18 }}>local_offer</span>
        <div>
          <p className="font-semibold text-sm text-amber-800">Cupons gerenciados pelo Stripe</p>
          <p className="text-xs text-amber-700 mt-1">
            Cupons promocionais são criados e gerenciados diretamente no painel do Stripe.
            Acesse o <a href="https://dashboard.stripe.com/coupons" target="_blank" rel="noopener" className="underline font-medium">Dashboard Stripe → Cupons</a> para criar, ativar ou desativar cupons.
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant py-16 text-center shadow-premium-sm">
        <span className="material-symbols-outlined text-outline mb-3 block" style={{ fontSize: 40 }}>confirmation_number</span>
        <p className="font-semibold text-on-surface">Integração com Stripe</p>
        <p className="text-on-surface-variant text-sm mt-1 max-w-xs mx-auto">
          Configure a integração com Stripe em Configurações → Integrações para gerenciar cupons aqui.
        </p>
      </div>
    </div>
  )
}
