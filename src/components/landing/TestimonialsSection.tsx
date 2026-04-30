const testimonials = [
  {
    quote: "Migramos de três sistemas diferentes para o NaviClin e, em 90 dias, nosso faturamento cresceu 31%. Mais do que o número, foi a tranquilidade da equipe — todo mundo olhando os mesmos dados.",
    name: "Dra. Renata Monteiro",
    role: "CEO · Odonto Prime · São Paulo",
    initials: "RM",
    wide: true,
  },
  {
    quote: "Cortou minha semana em 6 horas. Agora chego mais cedo em casa.",
    name: "Lucas Ferrari",
    role: "Dentista · Studio Smile",
    initials: "LF",
  },
  {
    quote: "O odontograma é melhor que qualquer um que testei em 15 anos de clínica.",
    name: "Dra. Juliana Serra",
    role: "Viva Odonto · Curitiba",
    initials: "JS",
  },
  {
    quote: "Finalmente enxergo o dinheiro entrando. O dashboard financeiro é divisor de águas.",
    name: "Marcos Aguiar",
    role: "Sócio · Clínica Avanço",
    initials: "MA",
  },
  {
    quote: "A confirmação automática pelo WhatsApp reduziu nossas faltas quase pela metade.",
    name: "Bianca Aoki",
    role: "Coord. · Sorriso&Co",
    initials: "BA",
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
          <span className="eyebrow">Quem já usa</span>
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
            Histórias de clínicas que pararam de apagar incêndio.
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
