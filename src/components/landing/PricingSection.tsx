import Link from "next/link"

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
    <section id="planos" className="py-24 lg:py-32 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-nc-secondary font-bold tracking-widest text-xs uppercase font-sans">Planos</span>
          <h2 className="text-4xl font-extrabold tracking-tight text-primary mt-3 font-headline">
            Planos que acompanham seu crescimento
          </h2>
          <p className="text-on-surface-variant mt-4 font-sans">
            Sem taxas de implantação, sem multas, cancele quando quiser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl p-10 transition-all ${
                plan.highlighted
                  ? "surgical-gradient text-white shadow-premium scale-105 z-10"
                  : "bg-surface-container-lowest border border-outline-variant/10 shadow-premium-sm"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-nc-secondary text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest font-sans">
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-xl font-bold mb-1 font-headline ${plan.highlighted ? "text-white" : "text-primary"}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 font-sans ${plan.highlighted ? "text-white/70" : "text-on-surface-variant"}`}>
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-sm font-bold ${plan.highlighted ? "text-white/70" : "text-outline"}`}>R$</span>
                  <span className={`text-5xl font-extrabold font-headline ${plan.highlighted ? "text-white" : "text-primary"}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm font-sans ${plan.highlighted ? "text-white/50" : "text-outline"}`}>/mês</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((f) => (
                  <li key={f.text} className="flex items-start gap-3 text-sm">
                    <span className={`material-symbols-outlined text-lg mt-0.5 shrink-0 ${
                      f.included
                        ? plan.highlighted ? "text-white" : "text-nc-secondary"
                        : plan.highlighted ? "text-white/20" : "text-outline-variant/40"
                    }`} style={{ fontVariationSettings: f.included ? "'FILL' 1" : "'FILL' 0" }}>
                      {f.included ? "check_circle" : "cancel"}
                    </span>
                    <span className={`font-sans ${
                      f.included
                        ? plan.highlighted ? "text-white" : "text-on-surface"
                        : plan.highlighted ? "text-white/30" : "text-outline/50"
                    }`}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Link href={plan.href}>
                <button
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.98] font-headline ${
                    plan.highlighted
                      ? "bg-white text-primary hover:bg-surface-container-low"
                      : "border-2 border-primary/20 text-primary hover:bg-surface-container-low"
                  }`}
                >
                  {plan.cta}
                </button>
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-on-surface-variant text-sm mt-10 font-sans">
          Todos os planos incluem 14 dias grátis. Sem necessidade de cartão de crédito.
        </p>
      </div>
    </section>
  )
}
