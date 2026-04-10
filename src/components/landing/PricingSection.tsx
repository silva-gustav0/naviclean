import Link from "next/link"
import { Check, X } from "lucide-react"

const plans = [
  {
    name: "Básico",
    price: "97",
    description: "Ideal para clínicas com 1 dentista iniciando a transformação digital.",
    features: [
      { text: "1 dentista", included: true },
      { text: "Agenda digital", included: true },
      { text: "Prontuário básico", included: true },
      { text: "Até 100 pacientes", included: true },
      { text: "Controle financeiro", included: false },
      { text: "WhatsApp automático", included: false },
    ],
    cta: "Assinar Básico",
    highlighted: false,
    href: "/cadastro?plano=basic",
  },
  {
    name: "Profissional",
    price: "197",
    description: "Para clínicas em crescimento que precisam de controle total.",
    features: [
      { text: "Até 5 dentistas", included: true },
      { text: "Pacientes ilimitados", included: true },
      { text: "Prontuário completo + Odontograma", included: true },
      { text: "Controle financeiro completo", included: true },
      { text: "WhatsApp automatizado", included: true },
      { text: "Repasse de profissionais", included: true },
    ],
    cta: "Assinar Profissional",
    highlighted: true,
    badge: "Mais popular",
    href: "/cadastro?plano=professional",
  },
  {
    name: "Enterprise",
    price: "397",
    description: "Para redes de clínicas que precisam de escala e suporte dedicado.",
    features: [
      { text: "Dentistas ilimitados", included: true },
      { text: "Multi-clínica ilimitado", included: true },
      { text: "Todos os módulos", included: true },
      { text: "API para integrações", included: true },
      { text: "Relatórios avançados", included: true },
      { text: "Suporte premium 24/7", included: true },
    ],
    cta: "Falar com Consultor",
    highlighted: false,
    href: "/contato?origem=enterprise",
  },
]

export function PricingSection() {
  return (
    <section id="planos" className="py-24 lg:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-bold tracking-widest text-xs uppercase">Planos</span>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 mt-3">
            Planos que acompanham seu crescimento
          </h2>
          <p className="text-slate-500 mt-4">
            Sem taxas de implantação, sem multas, cancele quando quiser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl p-10 ${
                plan.highlighted
                  ? "bg-white border-2 border-blue-600 shadow-2xl shadow-blue-500/10 scale-105 z-10"
                  : "bg-white border border-slate-100 shadow-sm"
              }`}
            >
              {plan.badge && (
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest"
                  style={{ background: "linear-gradient(135deg, #004ac6 0%, #2563eb 100%)" }}
                >
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h3>
                <p className="text-slate-500 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold text-slate-700">R$</span>
                  <span className="text-5xl font-black text-slate-900">{plan.price}</span>
                  <span className="text-slate-400 text-sm">/mês</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((f) => (
                  <li key={f.text} className="flex items-start gap-3 text-sm">
                    {f.included ? (
                      <Check size={16} className="text-blue-600 mt-0.5 shrink-0" />
                    ) : (
                      <X size={16} className="text-slate-300 mt-0.5 shrink-0" />
                    )}
                    <span className={f.included ? "text-slate-700" : "text-slate-400"}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Link href={plan.href}>
                <button
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.98] ${
                    plan.highlighted
                      ? "text-white shadow-lg shadow-blue-500/30"
                      : "border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                  }`}
                  style={
                    plan.highlighted
                      ? { background: "linear-gradient(135deg, #004ac6 0%, #2563eb 100%)" }
                      : {}
                  }
                >
                  {plan.cta}
                </button>
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-slate-400 text-sm mt-10">
          Todos os planos incluem 14 dias grátis. Sem necessidade de cartão de crédito.
        </p>
      </div>
    </section>
  )
}
