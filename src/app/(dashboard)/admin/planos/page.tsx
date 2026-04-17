import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

const DEFAULT_PLANS = [
  { name: "Solo", price: 97, max_professionals: 1, max_patients: 50, features: ["Agenda", "Prontuário básico", "Portal paciente básico"] },
  { name: "Clínica Starter", price: 297, max_professionals: 5, max_patients: 500, features: ["Tudo do Solo", "WhatsApp automático", "Financeiro completo", "Estoque"] },
  { name: "Clínica Pro", price: 597, max_professionals: null, max_patients: null, features: ["Tudo do Starter", "Comissões e split", "NF-e", "Multi-unidade", "API"] },
]

export default async function AdminPlanosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "super_admin") redirect("/dashboard")

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-headline font-extrabold text-2xl text-primary">Planos</h1>
        <p className="text-on-surface-variant text-sm mt-0.5">Gestão dos planos de assinatura</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {DEFAULT_PLANS.map((plan) => (
          <div key={plan.name} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-premium-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>payments</span>
              </div>
              <button className="p-1.5 hover:bg-surface-container rounded-lg transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 14 }}>edit</span>
              </button>
            </div>
            <h3 className="font-headline font-bold text-lg text-on-surface">{plan.name}</h3>
            <p className="text-3xl font-extrabold text-primary mt-1">
              R${plan.price}<span className="text-sm font-normal text-on-surface-variant">/mês</span>
            </p>

            <div className="mt-4 space-y-2 text-sm">
              <p className="text-xs text-on-surface-variant font-medium">
                {plan.max_professionals ? `Até ${plan.max_professionals} profissional${plan.max_professionals > 1 ? "is" : ""}` : "Profissionais ilimitados"} ·{" "}
                {plan.max_patients ? `${plan.max_patients} pacientes` : "Pacientes ilimitados"}
              </p>
              {plan.features.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 shrink-0" style={{ fontSize: 14 }}>check_circle</span>
                  <span className="text-on-surface-variant text-xs">{f}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
