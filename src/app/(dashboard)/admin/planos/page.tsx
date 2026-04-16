import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DollarSign, Check, X, Edit } from "lucide-react"

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
        <h1 className="text-2xl font-bold">Planos</h1>
        <p className="text-muted-foreground text-sm">Gestão dos planos de assinatura</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {DEFAULT_PLANS.map((plan) => (
          <div key={plan.name} className="bg-white dark:bg-slate-900 border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#E8F0F9] flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-[#0D3A6B]" />
              </div>
              <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <Edit className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
            <h3 className="font-bold text-lg">{plan.name}</h3>
            <p className="text-3xl font-black text-[#0D3A6B] mt-1">R${plan.price}<span className="text-sm font-normal text-muted-foreground">/mês</span></p>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                {plan.max_professionals
                  ? <><Check className="h-4 w-4 text-emerald-500 shrink-0" /> Até {plan.max_professionals} profissional(is)</>
                  : <><Check className="h-4 w-4 text-emerald-500 shrink-0" /> Profissionais ilimitados</>
                }
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                {plan.max_patients
                  ? <><Check className="h-4 w-4 text-emerald-500 shrink-0" /> Até {plan.max_patients} pacientes</>
                  : <><Check className="h-4 w-4 text-emerald-500 shrink-0" /> Pacientes ilimitados</>
                }
              </div>
              {plan.features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
