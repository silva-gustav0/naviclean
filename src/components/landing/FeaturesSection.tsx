const modules = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/>
      </svg>
    ),
    title: "Agenda inteligente multi-profissional",
    desc: "Encaixes automáticos, lembretes por WhatsApp, bloqueios por equipamento e visão por sala. Reduz faltas em até 42%.",
    foot: "Explorar agenda",
    featured: true,
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
        <path d="M14 3v6h6M9 13h6M9 17h4"/>
      </svg>
    ),
    title: "Prontuário digital",
    desc: "Odontograma interativo, anamnese personalizável e histórico de exames em um só clique.",
    foot: "Ver prontuário",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    title: "Financeiro em tempo real",
    desc: "Contas a pagar e receber, comissões por profissional, conciliação bancária e DRE automático.",
    foot: "Ver financeiro",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title: "Comunicação com paciente",
    desc: "Confirmação automática, aniversários, retornos programados e campanhas segmentadas.",
    foot: "Ver comunicação",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 3v18h18"/><path d="M7 14l4-4 4 4 5-5"/>
      </svg>
    ),
    title: "BI e relatórios gerenciais",
    desc: "Indicadores clínicos e financeiros, comparativos, funil de conversão e forecast.",
    foot: "Ver relatórios",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M20 7l-8-4-8 4 8 4 8-4zM4 12l8 4 8-4M4 17l8 4 8-4"/>
      </svg>
    ),
    title: "Estoque & compras",
    desc: "Controle por cadeira, alerta de mínimo, validade de materiais e integração com fornecedores.",
    foot: "Ver estoque",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
        <path d="M12 8v8M8 12h8" strokeWidth="1.5"/>
      </svg>
    ),
    title: "Medicina e Odontologia de Excelência",
    desc: "Mais de 20 especialidades médicas unidas à odontologia avançada. A saúde do seu corpo e do seu sorriso num só lugar, à distância de um clique.",
    foot: "Conhecer especialidades",
    accent: true,
  },
]

export function FeaturesSection() {
  return (
    <section
      id="modulos"
      style={{
        padding: "96px 0",
        background: "var(--card)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
        {/* Head */}
        <div
          className="modules-head reveal"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            alignItems: "end",
            marginBottom: 56,
          }}
        >
          <div>
            <span className="eyebrow">A plataforma</span>
            <h2 style={{
              fontFamily: "var(--font-headline)",
              fontSize: "clamp(32px, 3.6vw, 56px)",
              fontWeight: 400,
              color: "var(--nc-on-surface)",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              marginTop: 16,
            }}>
              Tudo que sua clínica precisa,{" "}
              <em style={{ fontStyle: "italic", color: "var(--nc-secondary)", fontWeight: 400 }}>
                nada que ela não usa.
              </em>
            </h2>
          </div>
          <p style={{ fontSize: "clamp(17px, 1.25vw, 20px)", color: "var(--nc-on-surface-variant)", lineHeight: 1.5, maxWidth: "60ch" }}>
            Cada módulo foi desenhado com dentistas, recepcionistas e gestores — para funcionar de verdade no dia a dia da sua clínica.
          </p>
        </div>

        {/* Grid */}
        <div
          className="module-grid reveal"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1,
            background: "var(--nc-outline-variant)",
            border: "1px solid var(--nc-outline-variant)",
            borderRadius: 22,
            overflow: "hidden",
          }}
        >
          {modules.map((mod, i) => (
            <div
              key={i}
              className={`module-card${mod.featured ? " module-featured" : ""}`}
              style={{
                background: mod.featured
                  ? "linear-gradient(135deg, var(--nc-primary-container), var(--nc-primary))"
                  : mod.accent
                  ? "linear-gradient(135deg, rgba(201,148,58,0.08), rgba(201,148,58,0.03))"
                  : "var(--card)",
                padding: "36px 32px 32px",
                display: "flex",
                flexDirection: "column",
                minHeight: 320,
                cursor: "pointer",
                gridColumn: mod.featured ? "span 3" : undefined,
                position: "relative",
                transition: "background .25s",
              }}
            >
              {/* Icon */}
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: mod.featured ? "rgba(255,255,255,0.1)" : "rgba(201,148,58,0.14)",
                color: mod.featured ? "#E6C78E" : mod.accent ? "var(--nc-secondary)" : "var(--nc-secondary)",
                display: "grid", placeItems: "center",
                marginBottom: 24,
              }}>
                {mod.icon}
              </div>

              <h3 style={{
                fontFamily: "var(--font-headline)",
                fontSize: "clamp(22px, 1.8vw, 28px)",
                fontWeight: 500,
                color: mod.featured ? "#fff" : "var(--nc-on-surface)",
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
                marginBottom: 10,
              }}>
                {mod.title}
              </h3>

              <p style={{
                color: mod.featured ? "rgba(255,255,255,0.7)" : "var(--nc-on-surface-variant)",
                fontSize: 15,
                lineHeight: 1.55,
                flex: 1,
              }}>
                {mod.desc}
              </p>

              <div className="module-foot" style={{
                marginTop: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: 13,
                color: mod.featured ? "#fff" : "var(--nc-on-surface-variant)",
                fontWeight: 500,
              }}>
                {mod.foot}
                <span className="module-arr" style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: mod.featured ? "rgba(255,255,255,0.14)" : "var(--nc-surface-container-high)",
                  display: "grid", placeItems: "center",
                  fontSize: 16,
                  transition: "transform .25s, background .25s",
                }}>
                  →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .module-card:hover { background: var(--nc-surface-container-low) !important; }
        .module-featured:hover { background: linear-gradient(135deg, var(--nc-primary-container), var(--nc-primary)) !important; }
        .module-card:hover .module-arr {
          background: var(--nc-secondary) !important;
          color: var(--nc-on-secondary) !important;
          transform: translateX(4px) !important;
        }
        .module-featured:hover .module-arr {
          background: var(--nc-secondary) !important;
        }
        @media (max-width: 1024px) {
          .module-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .module-featured { grid-column: span 2 !important; }
          .modules-head { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 1025px) {
          .module-featured { grid-column: span 3 !important; }
        }
        @media (max-width: 640px) {
          .module-grid { grid-template-columns: 1fr !important; }
          .module-featured { grid-column: span 1 !important; }
        }
        .reveal {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity .8s ease, transform .8s ease;
        }
        .reveal.in { opacity: 1; transform: none; }
      `}</style>
    </section>
  )
}
