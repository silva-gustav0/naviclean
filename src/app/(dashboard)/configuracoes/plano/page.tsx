import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
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
    highlight: false,
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
    highlight: true,
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
    highlight: false,
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
  trialing: "Trial Gratuito", active: "Ativo",
  past_due: "Pagamento em atraso", cancelled: "Cancelado",
}

const PLAN_LABELS: Record<string, string> = {
  trial: "Trial", basic: "Solo",
  professional: "Clínica Starter", enterprise: "Clínica Pro",
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

  const priceIds = {
    solo: process.env.STRIPE_PRICE_SOLO ?? "",
    clinic_starter: process.env.STRIPE_PRICE_CLINIC_STARTER ?? "",
    clinic_pro: process.env.STRIPE_PRICE_CLINIC_PRO ?? "",
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/configuracoes" className="p-2 hover:bg-surface-container rounded-xl transition-colors">
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>arrow_back</span>
        </Link>
        <div>
          <h1 className="font-headline font-extrabold text-2xl text-primary">Plano e Cobrança</h1>
          <p className="text-on-surface-variant text-sm">Gerencie sua assinatura NaviClin</p>
        </div>
      </div>

      {isPastDue && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-800">
          <span className="material-symbols-outlined text-red-500 shrink-0" style={{ fontSize: 20 }}>error</span>
          <div>
            <p className="font-semibold">Pagamento em atraso</p>
            <p className="text-xs mt-0.5">Regularize o pagamento para continuar usando todas as funcionalidades.</p>
          </div>
        </div>
      )}

      {/* Current plan */}
      <div className={`rounded-2xl p-5 text-white flex items-center gap-5 ${
        isCancelled ? "bg-on-surface-variant" : isPastDue ? "bg-red-700" : ""
      } ${!isCancelled && !isPastDue ? "surgical-gradient" : ""}`}>
        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-nc-secondary" style={{ fontSize: 24, fontVariationSettings: "'FILL' 1" }}>bolt</span>
        </div>
        <div className="flex-1">
          <p className="font-bold text-lg">
            {PLAN_LABELS[clinic.subscription_plan as string] ?? "Trial Gratuito"}
          </p>
          <p className="text-white/70 text-sm">
            Status: {STATUS_LABELS[status] ?? status}
          </p>
        </div>
        {hasSubscription && <BillingPortalButton />}
      </div>

      {/* Plans grid */}
      <div>
        <h2 className="font-semibold text-on-surface mb-4">
          {hasSubscription ? "Mudar de plano" : "Escolha seu plano"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const priceId = priceIds[plan.id as keyof typeof priceIds]
            const isConfigured = !!priceId
            return (
              <div
                key={plan.name}
                className={`bg-surface-container-lowest rounded-2xl border-2 p-5 flex flex-col gap-4 relative shadow-premium-sm ${
                  plan.highlight ? "border-primary" : "border-outline-variant"
                }`}
              >
                {plan.badge && (
                  <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full ${plan.highlight ? "surgical-gradient text-white" : "bg-on-surface-variant text-white"}`}>
                    {plan.badge}
                  </span>
                )}
                <div>
                  <p className="font-bold text-base text-on-surface">{plan.name}</p>
                  <p className="text-xs text-on-surface-variant">{plan.description}</p>
                </div>
                <div className="flex items-end gap-1">
                  <span className="font-headline font-extrabold text-3xl text-primary">{plan.priceLabel}</span>
                  <span className="text-on-surface-variant text-sm pb-0.5">{plan.period}</span>
                </div>
                <ul className="space-y-2 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-on-surface">
                      <span className="material-symbols-outlined text-emerald-600 shrink-0" style={{ fontSize: 16 }}>check_circle</span>
                      {f}
                    </li>
                  ))}
                </ul>
                {isConfigured ? (
                  <CheckoutButton
                    priceId={priceId}
                    highlight={plan.highlight}
                    label={`Assinar ${plan.name}`}
                  />
                ) : (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl text-sm font-semibold border-2 border-outline-variant text-on-surface-variant cursor-not-allowed opacity-50"
                  >
                    Em breve
                  </button>
                )}
              </div>
            )
          })}
        </div>
        <p className="text-xs text-on-surface-variant mt-3">
          14 dias grátis em qualquer plano. Cancele a qualquer momento.
        </p>
      </div>
    </div>
  )
}
