const features = [
  {
    icon: "calendar_month",
    title: "Agendamento Online",
    description:
      "Reduza faltas com confirmações automáticas via WhatsApp e permita que seus pacientes agendem 24/7.",
    accent: false,
  },
  {
    icon: "assignment_ind",
    title: "Prontuário Digital",
    description:
      "Fichas clínicas completas, odontograma digital e histórico de tratamentos com assinatura eletrônica.",
    accent: false,
  },
  {
    icon: "payments",
    title: "Controle Financeiro",
    description:
      "Fluxo de caixa, controle de inadimplência e repasses para dentistas em tempo real.",
    accent: true,
  },
  {
    icon: "groups",
    title: "Gestão de Equipe",
    description:
      "Controle de acessos, metas de produtividade e agenda individual para cada profissional.",
    accent: false,
  },
  {
    icon: "campaign",
    title: "Marketing Digital",
    description:
      "Ferramentas de CRM para fidelização e recuperação de pacientes ausentes via campanhas inteligentes.",
    accent: false,
  },
  {
    icon: "business",
    title: "Multi-clínica",
    description:
      "Gerencie múltiplas unidades de forma centralizada com relatórios consolidados em tempo real.",
    accent: false,
  },
]

export function FeaturesSection() {
  return (
    <section id="funcionalidades" className="max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
      <div className="text-center mb-16">
        <span className="text-nc-secondary font-bold tracking-widest text-xs uppercase font-sans">
          Funcionalidades
        </span>
        <h2 className="text-4xl font-extrabold tracking-tight text-primary mt-3 font-headline">
          Tudo o que sua clínica precisa em um só lugar
        </h2>
        <p className="text-on-surface-variant mt-4 max-w-xl mx-auto font-sans">
          Cada módulo foi desenvolvido com dentistas para resolver os problemas reais
          da gestão clínica.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="group bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10 shadow-premium-sm hover:bg-primary hover:border-primary hover:-translate-y-1 transition-all duration-300 cursor-default"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 surgical-gradient group-hover:bg-white/10 group-hover:[background:none] transition-all">
              <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                {feature.icon}
              </span>
            </div>
            <h3 className="text-lg font-bold mb-3 text-primary group-hover:text-white tracking-tight font-headline transition-colors">
              {feature.title}
            </h3>
            <p className="text-on-surface-variant group-hover:text-white/70 text-sm leading-relaxed font-sans transition-colors">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
