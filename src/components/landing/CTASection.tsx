"use client"

export function CTASection() {
  return (
    <section style={{
      background: "var(--nc-primary)",
      color: "#fff",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Gold glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(1000px 600px at 50% 120%, rgba(201,148,58,0.25), transparent 60%)",
      }} />

      <div style={{
        position: "relative",
        textAlign: "center",
        padding: "96px 32px",
        width: "100%",
        maxWidth: 1280,
        margin: "0 auto",
      }}>
        <span className="eyebrow" style={{ color: "#E6C78E" }}>
          Pronto para começar
        </span>

        <h2 style={{
          fontFamily: "var(--font-headline)",
          fontSize: "clamp(32px, 3.6vw, 56px)",
          fontWeight: 400,
          color: "#fff",
          letterSpacing: "-0.02em",
          lineHeight: 1.05,
          margin: "20px auto 20px",
          maxWidth: "20ch",
        }}>
          Sua clínica merece uma{" "}
          <em style={{ fontStyle: "italic", color: "var(--nc-secondary)" }}>gestão à altura.</em>
        </h2>

        <p style={{ fontSize: "clamp(17px, 1.25vw, 20px)", color: "rgba(255,255,255,0.72)", margin: "0 auto 32px", maxWidth: "60ch", lineHeight: 1.5 }}>
          Veja o NaviClin rodando com os dados da sua clínica em uma demonstração de 30 minutos. Sem compromisso.
        </p>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            className="cta-btn-gold"
            onClick={() => document.getElementById("demoModal")?.classList.add("open")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "14px 28px", borderRadius: 999,
              fontWeight: 500, fontSize: 15,
              background: "var(--nc-secondary)", color: "var(--nc-on-secondary)",
              boxShadow: "0 8px 32px rgba(201,148,58,0.22)",
              border: "none", cursor: "pointer",
              transition: "transform .15s, box-shadow .2s",
              letterSpacing: "-0.005em",
            }}
          >
            Agendar demonstração
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 5l7 7-7 7"/>
            </svg>
          </button>

          <a
            href="#planos"
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "14px 28px", borderRadius: 999,
              fontWeight: 500, fontSize: 15,
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              transition: "border-color .2s",
              letterSpacing: "-0.005em",
            }}
            className="cta-btn-ghost"
          >
            Ver planos
          </a>
        </div>
      </div>

      <style>{`
        .cta-btn-gold:hover { transform: translateY(-1px); box-shadow: 0 12px 40px rgba(201,148,58,0.35) !important; }
        .cta-btn-ghost:hover { border-color: #fff !important; }
        .eyebrow::before { background: #E6C78E !important; }
      `}</style>
    </section>
  )
}
