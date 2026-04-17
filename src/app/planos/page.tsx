import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Planos e Preços — NaviClin",
  description: "Conheça os planos NaviClin: Solo R$97, Starter R$297 e Pro R$597. Comece grátis por 14 dias.",
}

const plans = [
  {
    id: "solo",
    icon: "bolt",
    iconCls: "bg-surface-container text-on-surface-variant",
    name: "Solo",
    price: 97,
    description: "Para profissionais autônomos que querem organizar a agenda e o prontuário.",
    borderCls: "border-outline-variant",
    highlight: false,
    badge: null,
    badgeCls: "",
    ctaCls: "border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary",
    features: [
      { label: "1 profissional", included: true },
      { label: "Até 50 pacientes ativos", included: true },
      { label: "Agenda e agendamento online", included: true },
      { label: "Prontuário digital básico", included: true },
      { label: "Odontograma interativo", included: true },
      { label: "Portal do paciente (básico)", included: true },
      { label: "Confirmação por email", included: true },
      { label: "App mobile", included: true },
      { label: "Múltiplos profissionais", included: false },
      { label: "WhatsApp automático", included: false },
      { label: "Financeiro completo", included: false },
      { label: "Comissões e split", included: false },
      { label: "Estoque", included: false },
      { label: "NF-e", included: false },
      { label: "Multi-unidade", included: false },
      { label: "API", included: false },
    ],
  },
  {
    id: "starter",
    icon: "business",
    iconCls: "surgical-gradient text-white",
    name: "Clínica Starter",
    price: 297,
    description: "Para clínicas com equipe pequena que precisam de gestão completa.",
    borderCls: "border-primary",
    highlight: true,
    badge: "Mais popular",
    badgeCls: "surgical-gradient text-white",
    ctaCls: "surgical-gradient text-white shadow-premium-sm hover:opacity-90",
    features: [
      { label: "Até 5 profissionais", included: true },
      { label: "Até 500 pacientes ativos", included: true },
      { label: "Agenda e agendamento online", included: true },
      { label: "Prontuário digital completo", included: true },
      { label: "Odontograma interativo", included: true },
      { label: "Portal do paciente completo", included: true },
      { label: "Confirmação por email", included: true },
      { label: "App mobile", included: true },
      { label: "Múltiplos profissionais", included: true },
      { label: "WhatsApp automático", included: true },
      { label: "Financeiro completo", included: true },
      { label: "Comissões e split", included: false },
      { label: "Estoque", included: true },
      { label: "NF-e", included: false },
      { label: "Multi-unidade", included: false },
      { label: "API", included: false },
    ],
  },
  {
    id: "pro",
    icon: "workspace_premium",
    iconCls: "bg-nc-secondary/20 text-nc-secondary",
    name: "Clínica Pro",
    price: 597,
    description: "Para clínicas que precisam de tudo, incluindo NF-e, API e multi-unidade.",
    borderCls: "border-nc-secondary",
    highlight: false,
    badge: "Completo",
    badgeCls: "bg-nc-secondary text-primary",
    ctaCls: "bg-nc-secondary text-primary hover:opacity-90",
    features: [
      { label: "Profissionais ilimitados", included: true },
      { label: "Pacientes ilimitados", included: true },
      { label: "Agenda e agendamento online", included: true },
      { label: "Prontuário digital completo", included: true },
      { label: "Odontograma interativo", included: true },
      { label: "Portal do paciente completo", included: true },
      { label: "Confirmação por email", included: true },
      { label: "App mobile", included: true },
      { label: "Múltiplos profissionais", included: true },
      { label: "WhatsApp automático", included: true },
      { label: "Financeiro completo", included: true },
      { label: "Comissões e split", included: true },
      { label: "Estoque", included: true },
      { label: "NF-e", included: true },
      { label: "Multi-unidade", included: true },
      { label: "API", included: true },
    ],
  },
]

const faq = [
  { q: "Posso testar grátis?", a: "Sim! Todos os planos têm 14 dias de teste gratuito, sem cartão de crédito necessário." },
  { q: "Posso mudar de plano depois?", a: "Sim, você pode fazer upgrade ou downgrade a qualquer momento. O valor é ajustado proporcionalmente." },
  { q: "Como funciona o desconto anual?", a: "Ao escolher o plano anual, você ganha 2 meses grátis — equivale a 20% de desconto." },
  { q: "Os dados ficam seguros?", a: "Sim. Utilizamos criptografia em repouso e em trânsito, backups diários e estamos em conformidade com a LGPD." },
  { q: "Preciso instalar algo?", a: "Não. O NaviClin é 100% web e funciona em qualquer navegador moderno. Também temos app para iOS e Android." },
  { q: "Posso cancelar quando quiser?", a: "Sim. Sem multa, sem fidelidade. Cancele a qualquer momento pelo painel de configurações." },
]

export default function PlanosPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-20">
        <section className="bg-primary/5 border-b border-primary/10 py-16 px-6 text-center">
          <h1 className="font-headline font-extrabold text-4xl md:text-5xl text-primary mb-4">Planos transparentes</h1>
          <p className="text-lg text-on-surface-variant max-w-xl mx-auto mb-6">
            Comece grátis por 14 dias. Sem cartão de crédito. Cancele quando quiser.
          </p>
          <div className="inline-flex items-center gap-2 bg-white border border-outline-variant rounded-full px-4 py-2 text-sm shadow-premium-sm">
            <span className="text-on-surface-variant">Plano anual disponível</span>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-200">20% off</span>
          </div>
        </section>

        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`border-2 ${plan.borderCls} rounded-2xl p-8 relative bg-surface-container-lowest shadow-premium-sm ${plan.highlight ? "scale-[1.02]" : ""}`}
              >
                {plan.badge && (
                  <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full ${plan.badgeCls}`}>
                    {plan.badge}
                  </span>
                )}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${plan.iconCls}`}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{plan.icon}</span>
                </div>
                <h3 className="font-headline font-extrabold text-xl text-primary mb-1">{plan.name}</h3>
                <p className="text-sm text-on-surface-variant mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-black text-primary">R${plan.price}</span>
                  <span className="text-on-surface-variant text-sm">/mês</span>
                </div>
                <a
                  href="/cadastro"
                  className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all mb-6 ${plan.ctaCls}`}
                >
                  Começar teste grátis
                </a>
                <ul className="space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f.label} className={`flex items-center gap-2 text-sm ${f.included ? "text-on-surface" : "text-outline"}`}>
                      <span className={`material-symbols-outlined shrink-0 ${f.included ? "text-emerald-600" : "text-outline"}`} style={{ fontSize: 16, fontVariationSettings: f.included ? "'FILL' 1" : "'FILL' 0" }}>
                        {f.included ? "check_circle" : "cancel"}
                      </span>
                      {f.label}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 px-6 bg-surface-container-low">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-headline font-extrabold text-2xl text-primary text-center mb-10">Perguntas frequentes</h2>
            <div className="space-y-4">
              {faq.map((item) => (
                <div key={item.q} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-premium-sm">
                  <h3 className="font-semibold text-on-surface mb-1.5">{item.q}</h3>
                  <p className="text-sm text-on-surface-variant">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="surgical-gradient py-16 px-6">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="font-headline font-extrabold text-3xl mb-3">Pronto para começar?</h2>
            <p className="text-white/70 mb-8">14 dias grátis. Sem cartão. Cancele quando quiser.</p>
            <a
              href="/cadastro"
              className="inline-flex items-center gap-2 bg-nc-secondary hover:opacity-90 text-primary font-bold px-8 py-4 rounded-xl transition-opacity shadow-premium"
            >
              Começar agora
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
