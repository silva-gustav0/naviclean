"use client"

import Link from "next/link"
import { useState } from "react"

const plans = [
  {
    name: "Básico",
    monthlyPrice: 97,
    annualPrice: 77,
    description: "Para clínicas com 1 dentista iniciando a transformação digital.",
    features: [
      { text: "1 dentista",                 ok: true  },
      { text: "Agenda digital",              ok: true  },
      { text: "Prontuário básico",           ok: true  },
      { text: "Até 100 pacientes",           ok: true  },
      { text: "Controle financeiro",         ok: false },
      { text: "WhatsApp automático",         ok: false },
    ],
    cta: "Testar grátis",
    href: "/cadastro?plano=basic",
    highlighted: false,
  },
  {
    name: "Profissional",
    monthlyPrice: 197,
    annualPrice: 157,
    description: "Para clínicas em crescimento que precisam de controle total.",
    features: [
      { text: "Até 5 dentistas",                      ok: true },
      { text: "Pacientes ilimitados",                  ok: true },
      { text: "Prontuário + Odontograma completo",     ok: true },
      { text: "Financeiro, comissões e DRE",           ok: true },
      { text: "WhatsApp automatizado",                 ok: true },
      { text: "Repasse de profissionais",              ok: true },
    ],
    cta: "Testar grátis",
    href: "/cadastro?plano=professional",
    highlighted: true,
    badge: "Mais popular",
  },
  {
    name: "Enterprise",
    monthlyPrice: 397,
    annualPrice: 317,
    description: "Para redes de clínicas com necessidade de escala e suporte dedicado.",
    features: [
      { text: "Dentistas ilimitados",         ok: true },
      { text: "Multi-clínica ilimitado",      ok: true },
      { text: "Todos os módulos",             ok: true },
      { text: "API REST aberta",              ok: true },
      { text: "Relatórios avançados",         ok: true },
      { text: "Suporte premium 24/7",         ok: true },
    ],
    cta: "Falar com consultor",
    href: "/contato?origem=enterprise",
    highlighted: false,
  },
]

export function PricingSection() {
  const [annual, setAnnual] = useState(false)

  return (
    <section id="planos" className="py-24 lg:py-32 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-primary/8 text-primary text-xs font-bold px-4 py-2 rounded-full mb-5">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>local_offer</span>
            Planos
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-primary font-headline mb-4">
            Planos que crescem<br />com sua clínica
          </h2>
          <p className="text-on-surface-variant mb-8">Sem taxas de implantação, sem multas, cancele quando quiser.</p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-4 bg-surface-container-lowest rounded-full px-2 py-2 border border-outline-variant/30 shadow-premium-sm">
            <button
              onClick={() => setAnnual(false)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-200 ${!annual ? "surgical-gradient text-white shadow-premium-sm" : "text-on-surface-variant hover:text-primary"}`}
            >
              Mensal
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-200 flex items-center gap-2 ${annual ? "surgical-gradient text-white shadow-premium-sm" : "text-on-surface-variant hover:text-primary"}`}
            >
              Anual
              <span className="text-[10px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-full">-20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-3xl p-9 transition-all duration-300 ${
                plan.highlighted
                  ? "surgical-gradient text-white shadow-[0_16px_64px_rgba(0,36,74,0.35)] scale-[1.03] z-10"
                  : "bg-surface-container-lowest border border-outline-variant/30 shadow-premium-sm hover:shadow-premium hover:-translate-y-0.5"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-nc-secondary text-white text-[10px] font-black px-5 py-1.5 rounded-full uppercase tracking-widest shadow-glow-gold">
                  {plan.badge}
                </div>
              )}

              <div className="mb-7">
                <h3 className={`text-xl font-extrabold mb-1 font-headline ${plan.highlighted ? "text-white" : "text-primary"}`}>{plan.name}</h3>
                <p className={`text-sm mb-5 ${plan.highlighted ? "text-white/65" : "text-on-surface-variant"}`}>{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-sm font-bold ${plan.highlighted ? "text-white/60" : "text-outline"}`}>R$</span>
                  <span className={`text-5xl font-extrabold font-headline transition-all duration-300 ${plan.highlighted ? "text-white" : "text-primary"}`}>
                    {annual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span className={`text-sm ${plan.highlighted ? "text-white/50" : "text-outline"}`}>/mês</span>
                </div>
                {annual && (
                  <p className={`text-xs mt-1 font-semibold ${plan.highlighted ? "text-white/60" : "text-emerald-600"}`}>
                    Cobrado anualmente · você economiza R${(plan.monthlyPrice - plan.annualPrice) * 12}/ano
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((f) => (
                  <li key={f.text} className="flex items-center gap-3 text-sm">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      f.ok
                        ? plan.highlighted ? "bg-white/20" : "bg-primary/8"
                        : plan.highlighted ? "bg-white/5" : "bg-outline-variant/20"
                    }`}>
                      <span className={`material-symbols-outlined ${
                        f.ok
                          ? plan.highlighted ? "text-white" : "text-primary"
                          : plan.highlighted ? "text-white/20" : "text-outline/30"
                      }`} style={{ fontSize: 12, fontVariationSettings: f.ok ? "'FILL' 1" : "'FILL' 0" }}>
                        {f.ok ? "check" : "close"}
                      </span>
                    </div>
                    <span className={`${
                      f.ok
                        ? plan.highlighted ? "text-white" : "text-on-surface"
                        : plan.highlighted ? "text-white/25" : "text-outline/40"
                    }`}>{f.text}</span>
                  </li>
                ))}
              </ul>

              <Link href={plan.href}>
                <button className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-[0.97] font-headline ${
                  plan.highlighted
                    ? "bg-white text-primary hover:bg-surface-container-low shadow-premium-sm"
                    : "border-2 border-primary/20 text-primary hover:bg-primary hover:text-white hover:border-primary"
                }`}>
                  {plan.cta}
                </button>
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-on-surface-variant text-sm mt-10">
          Todos os planos incluem <strong>14 dias grátis</strong> e suporte em português. Sem cartão de crédito.
        </p>
      </div>
    </section>
  )
}
