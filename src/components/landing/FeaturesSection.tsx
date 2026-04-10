import {
  Calendar,
  ClipboardList,
  DollarSign,
  Users,
  TrendingUp,
  Network,
} from "lucide-react"

const features = [
  {
    icon: Calendar,
    title: "Agendamento Online",
    description:
      "Reduza faltas com confirmações automáticas via WhatsApp e permita que seus pacientes agendem 24/7.",
  },
  {
    icon: ClipboardList,
    title: "Prontuário Digital",
    description:
      "Fichas clínicas completas, odontograma digital e histórico de tratamentos com assinatura eletrônica.",
  },
  {
    icon: DollarSign,
    title: "Controle Financeiro",
    description:
      "Fluxo de caixa, controle de inadimplência e repasses para dentistas em tempo real.",
  },
  {
    icon: Users,
    title: "Gestão de Equipe",
    description:
      "Controle de acessos, metas de produtividade e agenda individual para cada profissional.",
  },
  {
    icon: TrendingUp,
    title: "Marketing Digital",
    description:
      "Ferramentas de CRM para fidelização e recuperação de pacientes ausentes via campanhas inteligentes.",
  },
  {
    icon: Network,
    title: "Multi-clínica",
    description:
      "Gerencie múltiplas unidades de forma centralizada com relatórios consolidados em tempo real.",
  },
]

export function FeaturesSection() {
  return (
    <section id="funcionalidades" className="max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
      <div className="text-center mb-16">
        <span className="text-blue-600 font-bold tracking-widest text-xs uppercase">
          Funcionalidades
        </span>
        <h2 className="text-4xl font-black tracking-tight text-slate-900 mt-3">
          Tudo o que sua clínica precisa em um só lugar
        </h2>
        <p className="text-slate-500 mt-4 max-w-xl mx-auto">
          Cada módulo foi desenvolvido com dentistas para resolver os problemas reais
          da gestão clínica.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-6"
              style={{ background: "linear-gradient(135deg, #004ac6 0%, #2563eb 100%)" }}
            >
              <feature.icon size={22} />
            </div>
            <h3 className="text-lg font-bold mb-3 text-slate-900 tracking-tight">
              {feature.title}
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
