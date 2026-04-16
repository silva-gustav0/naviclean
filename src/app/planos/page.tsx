import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import type { Metadata } from "next"
import { Check, X, ChevronRight, Zap, Building2, Crown } from "lucide-react"

export const metadata: Metadata = {
  title: "Planos e Preços — NaviClin",
  description: "Conheça os planos NaviClin: Solo R$97, Starter R$297 e Pro R$597. Comece grátis por 14 dias.",
}

const plans = [
  {
    id: "solo",
    icon: Zap,
    name: "Solo",
    price: 97,
    description: "Para profissionais autônomos que querem organizar a agenda e o prontuário.",
    color: "border-slate-200",
    highlight: false,
    badge: null,
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
    icon: Building2,
    name: "Clínica Starter",
    price: 297,
    description: "Para clínicas com equipe pequena que precisam de gestão completa.",
    color: "border-[#0D3A6B]",
    highlight: true,
    badge: "Mais popular",
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
    icon: Crown,
    name: "Clínica Pro",
    price: 597,
    description: "Para clínicas que precisam de tudo, incluindo NF-e, API e multi-unidade.",
    color: "border-[#DBB47A]",
    highlight: false,
    badge: "Completo",
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
        {/* Hero */}
        <section className="bg-gradient-to-b from-[#E8F0F9] to-white py-16 px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4">Planos transparentes</h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto mb-6">
            Comece grátis por 14 dias. Sem cartão de crédito. Cancele quando quiser.
          </p>
          <div className="inline-flex items-center gap-2 bg-[#E8F0F9] border border-blue-100 rounded-full px-4 py-2 text-sm">
            <span className="text-slate-600">Anual</span>
            <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-full">20% off</span>
          </div>
        </section>

        {/* Pricing cards */}
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`border-2 ${plan.color} rounded-2xl p-8 relative ${plan.highlight ? "shadow-xl scale-[1.02]" : ""}`}
              >
                {plan.badge && (
                  <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full ${
                    plan.highlight ? "bg-[#0D3A6B] text-white" : "bg-[#DBB47A] text-[#0D3A6B]"
                  }`}>
                    {plan.badge}
                  </span>
                )}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                  plan.highlight ? "bg-[#0D3A6B]" : plan.id === "pro" ? "bg-[#DBB47A]" : "bg-slate-100"
                }`}>
                  <plan.icon className={`h-5 w-5 ${plan.highlight ? "text-white" : plan.id === "pro" ? "text-[#0D3A6B]" : "text-slate-600"}`} />
                </div>
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-black text-[#0F172A]">R${plan.price}</span>
                  <span className="text-slate-500 text-sm">/mês</span>
                </div>
                <a
                  href="/cadastro"
                  className={`block text-center py-3 rounded-xl font-semibold text-sm transition-colors mb-6 ${
                    plan.highlight
                      ? "bg-[#0D3A6B] hover:bg-[#1A5599] text-white"
                      : plan.id === "pro"
                      ? "bg-[#DBB47A] hover:bg-[#C89958] text-[#0D3A6B]"
                      : "border border-slate-200 hover:border-[#0D3A6B] text-slate-700 hover:text-[#0D3A6B]"
                  }`}
                >
                  Começar teste grátis
                </a>
                <ul className="space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f.label} className={`flex items-center gap-2 text-sm ${f.included ? "text-slate-700" : "text-slate-400"}`}>
                      {f.included
                        ? <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                        : <X className="h-4 w-4 text-slate-300 shrink-0" />
                      }
                      {f.label}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-6 bg-[#F7F9FC]">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10">Perguntas frequentes</h2>
            <div className="space-y-4">
              {faq.map((item) => (
                <div key={item.q} className="bg-white border rounded-xl p-5">
                  <h3 className="font-semibold mb-1.5">{item.q}</h3>
                  <p className="text-sm text-slate-600">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#0D3A6B] py-16 px-6">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-3">Pronto para começar?</h2>
            <p className="text-blue-200 mb-8">14 dias grátis. Sem cartão. Cancele quando quiser.</p>
            <a
              href="/cadastro"
              className="inline-flex items-center gap-2 bg-[#DBB47A] hover:bg-[#C89958] text-[#0D3A6B] font-bold px-8 py-4 rounded-xl transition-colors"
            >
              Começar agora
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
