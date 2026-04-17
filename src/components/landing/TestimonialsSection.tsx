const testimonials = [
  {
    quote:
      "A transição para o NaviClin foi o divisor de águas na minha clínica. O prontuário digital é intuitivo e me economiza pelo menos 1 hora de burocracia por dia.",
    name: "Dra. Camila Santos",
    role: "CEO, SmileCare Clinic — São Paulo",
    initials: "CS",
    rating: 5,
  },
  {
    quote:
      "O controle financeiro do NaviClin é incomparável. Finalmente tenho clareza sobre meus repasses e lucratividade real de cada procedimento.",
    name: "Dr. Ricardo Menezes",
    role: "Diretor Clínico, Menezes Odontologia — Curitiba",
    initials: "RM",
    rating: 5,
  },
  {
    quote:
      "O agendamento online reduziu em 40% as faltas na nossa clínica. Os lembretes automáticos pelo WhatsApp foram um game changer para a nossa equipe.",
    name: "Dra. Marina Oliveira",
    role: "Ortodontista, Clínica OrtoCenter — Belo Horizonte",
    initials: "MO",
    rating: 5,
  },
  {
    quote:
      "Gerenciar 3 unidades ao mesmo tempo parecia impossível. Com o NaviClin, tenho uma visão consolidada de tudo em tempo real. Recomendo para qualquer rede.",
    name: "Dr. Felipe Andrade",
    role: "Diretor, Grupo DentalPro — São Paulo",
    initials: "FA",
    rating: 5,
  },
]

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="material-symbols-outlined text-nc-secondary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
          star
        </span>
      ))}
    </div>
  )
}

export function TestimonialsSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
        <div className="max-w-2xl">
          <span className="text-nc-secondary font-bold tracking-widest text-xs uppercase font-sans">
            Depoimentos
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-primary mt-3 leading-tight font-headline">
            Histórias de sucesso com precisão digital
          </h2>
        </div>
        <div className="flex flex-col items-center bg-surface-container-low rounded-2xl px-6 py-4 border border-outline-variant/10">
          <span className="text-3xl font-extrabold text-primary font-headline">4.9/5</span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-outline mt-1 font-sans">
            Nota no Capterra
          </span>
          <StarRating count={5} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="bg-surface-container-lowest p-8 lg:p-10 rounded-2xl border border-outline-variant/10 shadow-premium-sm hover:shadow-premium hover:-translate-y-0.5 transition-all"
          >
            <StarRating count={t.rating} />
            <p className="text-on-surface text-lg font-medium leading-relaxed my-6 italic font-sans">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm surgical-gradient shrink-0">
                {t.initials}
              </div>
              <div>
                <p className="font-bold text-primary text-sm font-headline">{t.name}</p>
                <p className="text-outline text-xs font-sans">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
