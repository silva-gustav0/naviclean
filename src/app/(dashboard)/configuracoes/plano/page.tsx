import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ArrowLeft, CreditCard, Check, Zap, Star } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Starter",
    price: "R$ 97",
    period: "/mês",
    description: "Para clínicas pequenas",
    color: "border-slate-200",
    badge: null,
    features: ["1 dentista", "Até 100 pacientes", "Agendamento online", "Prontuário digital"],
  },
  {
    name: "Professional",
    price: "R$ 197",
    period: "/mês",
    description: "O mais popular",
    color: "border-blue-500",
    badge: "Mais popular",
    features: ["Até 5 dentistas", "Pacientes ilimitados", "WhatsApp automático", "Financeiro completo", "Relatórios avançados"],
  },
  {
    name: "Enterprise",
    price: "R$ 397",
    period: "/mês",
    description: "Para redes de clínicas",
    color: "border-violet-500",
    badge: "Completo",
    features: ["Dentistas ilimitados", "Multi-clínica", "API access", "Suporte prioritário", "Onboarding dedicado"],
  },
]

export default async function PlanoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/configuracoes" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Plano e Cobrança</h1>
          <p className="text-muted-foreground text-sm">Gerencie sua assinatura</p>
        </div>
      </div>

      {/* Current plan */}
      <div className="bg-gradient-to-br from-blue-600 to-violet-700 rounded-2xl p-5 text-white flex items-center gap-5">
        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <Zap className="h-6 w-6 text-yellow-300" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-lg">Trial Gratuito</p>
          <p className="text-blue-200 text-sm">Você tem 14 dias para experimentar tudo gratuitamente.</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-2xl font-bold">14</p>
          <p className="text-blue-200 text-xs">dias restantes</p>
        </div>
      </div>

      {/* Plans */}
      <div>
        <h2 className="font-semibold mb-4">Escolha seu plano</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white dark:bg-slate-900 border-2 ${plan.color} rounded-2xl p-5 flex flex-col gap-4 relative`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {plan.badge}
                </span>
              )}
              <div>
                <p className="font-bold text-base">{plan.name}</p>
                <p className="text-xs text-muted-foreground">{plan.description}</p>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground text-sm pb-0.5">{plan.period}</span>
              </div>
              <ul className="space-y-2 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                plan.badge
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "border-2 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}>
                Escolher {plan.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
