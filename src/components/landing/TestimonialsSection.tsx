const testimonials = [
  {
    quote: "A transição para o NaviClin foi o divisor de águas da minha clínica. O prontuário digital economiza pelo menos 1 hora de burocracia por dia.",
    name: "Dra. Camila Santos",
    role: "CEO, SmileCare Clinic — São Paulo",
    initials: "CS",
    wide: true,
  },
  {
    quote: "O controle financeiro é incomparável. Finalmente tenho clareza sobre meus repasses e a lucratividade real de cada procedimento.",
    name: "Dr. Ricardo Menezes",
    role: "Diretor Clínico, Menezes Odontologia — Curitiba",
    initials: "RM",
  },
  {
    quote: "O agendamento online reduziu 40% as faltas. Os lembretes pelo WhatsApp foram um game changer.",
    name: "Dra. Marina Oliveira",
    role: "Ortodontista, OrtoCenter — BH",
    initials: "MO",
  },
  {
    quote: "Gerenciar 3 unidades ao mesmo tempo parecia impossível. Com o NaviClin tenho visão consolidada de tudo em tempo real.",
    name: "Dr. Felipe Andrade",
    role: "Diretor, Grupo DentalPro — São Paulo",
    initials: "FA",
  },
  {
    quote: "Interface limpa, intuitiva e a equipe de suporte responde em minutos. É o melhor sistema que já usei em 15 anos.",
    name: "Dra. Luciana Freitas",
    role: "Implantodontista, Clínica Freitas — Brasília",
    initials: "LF",
  },
]

export function TestimonialsSection() {
  return (
    <section
      style={{ padding: "96px 0", background: "var(--background)" }}
    >
      <div style={{ width: "100%", maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
        {/* Head */}
        <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
          <span className="eyebrow">O que dizem</span>
          <h2 style={{
            fontFamily: "var(--font-headline)",
            fontSize: "clamp(32px, 3.6vw, 56px)",
            fontWeight: 400,
            color: "var(--nc-on-surface)",
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            margin: "12px auto 0",
            maxWidth: "22ch",
          }}>
            Dentistas que transformaram sua gestão
          </h2>
        </div>

        {/* Grid */}
        <div
          className="reveal test-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.3fr 1fr 1fr",
            gridTemplateRows: "auto auto",
            gap: 16,
          }}
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`test-card${t.wide ? " test-card-wide" : ""}`}
              style={{
                background: t.wide ? "linear-gradient(135deg, var(--nc-primary-container), var(--nc-primary))" : "var(--card)",
                border: t.wide ? "none" : "1px solid var(--nc-outline-variant)",
                borderRadius: 22,
                padding: 32,
                display: "flex",
                flexDirection: "column",
                gap: 20,
                gridColumn: t.wide ? "span 1" : undefined,
                gridRow: t.wide ? "span 2" : undefined,
                transition: "transform .25s, box-shadow .25s",
                cursor: "pointer",
              }}
            >
              {/* Quote */}
              <p style={{
                fontFamily: "var(--font-headline)",
                fontSize: t.wide ? 28 : 20,
                lineHeight: 1.35,
                color: t.wide ? "#fff" : "var(--nc-on-surface)",
                fontWeight: 400,
                letterSpacing: "-0.01em",
                position: "relative",
                paddingTop: 18,
                borderTop: `2px solid var(--nc-secondary)`,
                flex: 1,
              }}>
                {t.quote}
              </p>

              {/* Author */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: "auto" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: "rgba(201,148,58,0.14)",
                  color: "var(--nc-secondary)",
                  display: "grid", placeItems: "center",
                  fontFamily: "var(--font-headline)",
                  fontWeight: 500, fontSize: 16,
                  flexShrink: 0,
                }}>
                  {t.initials}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: t.wide ? "#fff" : "var(--nc-on-surface)" }}>{t.name}</div>
                  <div style={{ fontSize: 13, color: t.wide ? "rgba(255,255,255,0.65)" : "var(--nc-on-surface-variant)" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .test-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(15,26,68,.08); }
        @media (max-width: 1024px) {
          .test-grid { grid-template-columns: 1fr 1fr !important; }
          .test-card-wide { grid-row: span 1 !important; grid-column: span 2 !important; }
        }
        @media (max-width: 640px) {
          .test-grid { grid-template-columns: 1fr !important; }
          .test-card-wide { grid-column: span 1 !important; }
        }
      `}</style>
    </section>
  )
}
