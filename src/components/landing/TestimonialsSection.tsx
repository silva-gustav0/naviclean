"use client"

const testimonials = [
  {
    quote: "A transição para o NaviClin foi o divisor de águas da minha clínica. O prontuário digital economiza pelo menos 1 hora de burocracia por dia.",
    name: "Dra. Camila Santos",
    role: "CEO, SmileCare Clinic — São Paulo",
    initials: "CS",
    rating: 5,
  },
  {
    quote: "O controle financeiro é incomparável. Finalmente tenho clareza sobre meus repasses e a lucratividade real de cada procedimento.",
    name: "Dr. Ricardo Menezes",
    role: "Diretor Clínico, Menezes Odontologia — Curitiba",
    initials: "RM",
    rating: 5,
  },
  {
    quote: "O agendamento online reduziu 40% as faltas na nossa clínica. Os lembretes automáticos pelo WhatsApp foram um game changer.",
    name: "Dra. Marina Oliveira",
    role: "Ortodontista, OrtoCenter — Belo Horizonte",
    initials: "MO",
    rating: 5,
  },
  {
    quote: "Gerenciar 3 unidades ao mesmo tempo parecia impossível. Com o NaviClin tenho visão consolidada de tudo em tempo real.",
    name: "Dr. Felipe Andrade",
    role: "Diretor, Grupo DentalPro — São Paulo",
    initials: "FA",
    rating: 5,
  },
  {
    quote: "Interface limpa, intuitiva e a equipe de suporte responde em minutos. É o melhor sistema que já usei em 15 anos de carreira.",
    name: "Dra. Luciana Freitas",
    role: "Implantodontista, Clínica Freitas — Brasília",
    initials: "LF",
    rating: 5,
  },
  {
    quote: "O módulo de estoque com importação de NF-e me economiza horas toda semana. E o odontograma interativo é simplesmente perfeito.",
    name: "Dr. André Pereira",
    role: "Cirurgião-Dentista, André Pereira Odonto — Porto Alegre",
    initials: "AP",
    rating: 5,
  },
]

const row1 = testimonials.slice(0, 3)
const row2 = testimonials.slice(3)

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div className="flex-none w-80 lg:w-96 bg-surface-container-lowest rounded-3xl p-7 border border-outline-variant/30 shadow-premium-sm mx-3">
      <div className="flex gap-0.5 mb-5">
        {[...Array(t.rating)].map((_, i) => (
          <span key={i} className="material-symbols-outlined text-nc-secondary" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>star</span>
        ))}
      </div>
      <p className="text-on-surface text-base leading-relaxed mb-6 font-sans">
        &ldquo;{t.quote}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl surgical-gradient flex items-center justify-center text-white text-xs font-extrabold shrink-0 font-headline">
          {t.initials}
        </div>
        <div>
          <p className="font-bold text-primary text-sm font-headline">{t.name}</p>
          <p className="text-outline text-xs font-sans">{t.role}</p>
        </div>
      </div>
    </div>
  )
}

const row1doubled = [...row1, ...row1]
const row2doubled = [...row2, ...row2]

export function TestimonialsSection() {
  return (
    <section className="py-24 lg:py-32 bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-14">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-nc-secondary/10 text-nc-secondary text-xs font-bold px-4 py-2 rounded-full mb-5">
              <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>format_quote</span>
              Depoimentos
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-primary font-headline leading-tight">
              Dentistas que<br />transformaram sua gestão
            </h2>
          </div>
          <div className="flex flex-col items-center bg-surface-container-lowest rounded-3xl px-8 py-5 border border-outline-variant/30 shadow-premium-sm shrink-0">
            <div className="flex gap-0.5 mb-1">
              {[...Array(5)].map((_, i) => <span key={i} className="material-symbols-outlined text-nc-secondary" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>star</span>)}
            </div>
            <span className="text-4xl font-extrabold text-primary font-headline">4.9<span className="text-2xl text-on-surface-variant">/5</span></span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-outline mt-1">Capterra & G2</span>
          </div>
        </div>
      </div>

      {/* Row 1 — scrolls left */}
      <div className="flex mb-4 relative">
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none" />
        <div className="flex nc-marquee" style={{ animationDuration: "36s" }}>
          {row1doubled.map((t, i) => <TestimonialCard key={i} t={t} />)}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div className="flex relative">
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none" />
        <div className="flex" style={{ animation: "nc-slide-left 40s linear infinite reverse" }}>
          {row2doubled.map((t, i) => <TestimonialCard key={i} t={t} />)}
        </div>
      </div>
    </section>
  )
}
