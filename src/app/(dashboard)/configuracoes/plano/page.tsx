import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ArrowLeft, Check, Zap, AlertCircle } from "lucide-react"
import Link from "next/link"
import { CheckoutButton, BillingPortalButton } from "@/components/dashboard/billing/BillingButtons"

const plans = [
  {
    id: "solo",
    name: "Solo",
    priceEnv: "STRIPE_PRICE_SOLO",
    priceLabel: "R$ 97",
    period: "/mês",
    description: "Profissional independente",
    color: "border-slate-200",
    badge: null,
    features: [
      "1 profissional",
      "Até 150 pacientes",
      "Agendamento online",
      "Prontuário digital",
      "Odontograma",
      "Prescrições digitais",
    ],
  },
  {
    id: "clinic_starter",
    name: "Clínica Starter",
    priceEnv: "STRIPE_PRICE_CLINIC_STARTER",
    priceLabel: "R$ 297",
    period: "/mês",
    description: "O mais popular",
    color: "border-blue-500",
    badge: "Mais popular",
    features: [
      "Até 5 profissionais",
      "Pacientes ilimitados",
      "Estoque básico",
      "Financeiro + comissões",
      "Convênios e tabelas de preço",
      "WhatsApp automático",
    ],
  },
  {
    id: "clinic_pro",
    name: "Clínica Pro",
    priceEnv: "STRIPE_PRICE_CLINIC_PRO",
    priceLabel: "R$ 597",
    period: "/mês",
    description: "Clínicas maiores",
    color: "border-violet-500",
    badge: "Completo",
    features: [
      "Até 15 profissionais",
      "Estoque avançado + NF-e",
      "Relatórios completos",
      "Importação NF-e",
      "Portal público + agendamento",
      "Suporte prioritário",
    ],
  },
]

const STATUS_LABELS: Record<string, string> = {
  trialing: "Trial Gratuito",
  active: "Ativo",
  past_due: "Pagamento em atraso",
  cancelled: "Cancelado",
}

const PLAN_LABELS: Record<string, string> = {
  trial: "Trial",
  basic: "Solo",
  professional: "Clínica Starter",
  enterprise: "Clínica Pro",
}

export default async function PlanoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase
    .from("clinics")
    .select("id, name, subscription_plan, subscription_status, stripe_subscription_id, stripe_customer_id")
    .eq("owner_id", user.id)
    .single()

  if (!clinic) redirect("/onboarding")

  const hasSubscription = !!clinic.stripe_customer_id
  const status = clinic.subscription_status as string ?? "trialing"
  const isPastDue = status === "past_due"
  const isCancelled = status === "cancelled"

  // Get price IDs from env
  const priceIds = {
    solo: process.env.STRIPE_PRICE_SOLO ?? "",
    clinic_starter: process.env.STRIPE_PRICE_CLINIC_STARTER ?? "",
    clinic_pro: process.env.STRIPE_PRICE_CLINIC_PRO ?? "",
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/configuracoes" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Plano e Cobrança</h1>
          <p className="text-muted-foreground text-sm">Gerencie sua assinatura NaviClin</p>
        </div>
      </div>

      {/* Alerts */}
      {isPastDue && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-800">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div>
            <p className="font-medium">Pagamento em atraso</p>
            <p className="text-xs mt-0.5">Regularize o pagamento para continuar usando todas as funcionalidades.</p>
          </div>
        </div>
      )}

      {/* Current plan */}
      <div className={`rounded-2xl p-5 text-white flex items-center gap-5 ${
        isCancelled ? "bg-slate-800" : isPastDue ? "bg-red-700" : "bg-gradient-to-br from-[#0D3A6B] to-[#1A5599]"
      }`}>
        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <Zap className="h-6 w-6 text-yellow-300" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-lg">
            {PLAN_LABELS[clinic.subscription_plan as string] ?? "Trial Gratuito"}
          </p>
          <p className="text-blue-200 text-sm">
            Status: {STATUS_LABELS[status] ?? status}
          </p>
        </div>
        {hasSubscription && (
          <BillingPortalButton />
        )}
      </div>

      {/* Plans */}
      <div>
        <h2 className="font-semibold mb-4">
          {hasSubscription ? "Mudar de plano" : "Escolha seu plano"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const priceId = priceIds[plan.id as keyof typeof priceIds]
            const isConfigured = !!priceId

            return (
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
                  <span className="text-3xl font-bold">{plan.priceLabel}</span>
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
                {isConfigured ? (
                  <CheckoutButton
                    priceId={priceId}
                    highlight={!!plan.badge}
                    label={`Assinar ${plan.name}`}
                  />
                ) : (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl text-sm font-semibold border-2 text-muted-foreground cursor-not-allowed opacity-50"
                  >
                    Em breve
                  </button>
                )}
              </div>
            )
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          14 dias grátis em qualquer plano. Cancele a qualquer momento.
        </p>
      </div>
    </div>
  )
}
