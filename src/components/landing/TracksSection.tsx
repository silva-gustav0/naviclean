"use client"

import { useState } from "react"

const tracks = {
  gestores: {
    label: "Gestores",
    points: [
      { num: "1", title: "Visão financeira completa", desc: "DRE, fluxo de caixa, repasses por profissional e ticket médio — atualizados em tempo real, sem planilhas." },
      { num: "2", title: "Multi-clínica em um painel", desc: "Gerencie todas as unidades em uma única tela. Compare desempenho, consolide relatórios e tome decisões com dados." },
      { num: "3", title: "KPIs que importam", desc: "Taxa de retorno, NPS, conversão de leads, custo por procedimento. Métricas que gestores precisam ver todo dia." },
      { num: "4", title: "Controle de equipe", desc: "Metas de produção, comissões automáticas, auditoria de acesso e controle fino de permissões por função." },
    ],
  },
  dentistas: {
    label: "Dentistas",
    points: [
      { num: "1", title: "Agenda inteligente", desc: "Visualize sua semana completa, gerencie encaixes e receba confirmações automáticas — sem ligar para nenhum paciente." },
      { num: "2", title: "Prontuário em segundos", desc: "Odontograma interativo, evoluções com assinatura digital e prescrições em PDF — tudo em menos de 1 minuto." },
      { num: "3", title: "Menos burocracia", desc: "Ateste presença, registre evoluções e envie receitas do consultório. O NaviClin elimina o papel do dia a dia clínico." },
      { num: "4", title: "Seus dados, seu crescimento", desc: "Acompanhe sua produção, procedimentos mais realizados e taxa de retorno dos seus pacientes." },
    ],
  },
}

export function TracksSection() {
  const [active, setActive] = useState<"gestores" | "dentistas">("gestores")
  const track = tracks[active]

  return (
    <section
      id="para-quem"
      style={{
        padding: "96px 0",
        background: "linear-gradient(160deg, var(--nc-primary-container), var(--nc-primary))",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Radial glows */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(800px 400px at 10% 10%, rgba(201,148,58,0.18), transparent 60%), radial-gradient(700px 500px at 90% 90%, rgba(201,148,58,0.12), transparent 65%)",
      }} />

      <div style={{ width: "100%", maxWidth: 1280, margin: "0 auto", padding: "0 32px", position: "relative" }}>
        {/* Head */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span className="eyebrow" style={{ color: "#E6C78E" }}>
            Para quem é o NaviClin
          </span>
          <h2 style={{
            fontFamily: "var(--font-headline)",
            fontSize: "clamp(32px, 3.6vw, 56px)",
            fontWeight: 400,
            color: "#fff",
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            margin: "12px auto 16px",
            maxWidth: "20ch",
          }}>
            Feito para quem vive <em style={{ fontStyle: "italic", color: "var(--nc-secondary)" }}>a clínica.</em>
          </h2>
          <p style={{ fontSize: "clamp(17px, 1.25vw, 20px)", color: "rgba(255,255,255,0.72)", margin: "0 auto", maxWidth: "60ch", lineHeight: 1.5 }}>
            Dois perfis, uma plataforma. Encontre seu caminho.
          </p>

          {/* Toggle */}
          <div style={{
            display: "inline-flex",
            padding: 6,
            borderRadius: 999,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            marginTop: 24,
          }}>
            {(["gestores", "dentistas"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                style={{
                  padding: "10px 22px",
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 500,
                  border: "none",
                  cursor: "pointer",
                  transition: "background .2s, color .2s",
                  background: active === key ? "var(--nc-secondary)" : "transparent",
                  color: active === key ? "var(--nc-on-secondary)" : "rgba(255,255,255,0.7)",
                }}
              >
                {tracks[key].label}
              </button>
            ))}
          </div>
        </div>

        {/* Panel */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 48,
          alignItems: "center",
        }}
          className="tracks-panel"
        >
          {/* Points */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {track.points.map((p) => (
              <div key={p.num} style={{
                display: "grid",
                gridTemplateColumns: "48px 1fr",
                gap: 16,
                padding: 20,
                borderRadius: 14,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "var(--nc-secondary)",
                  color: "var(--nc-on-secondary)",
                  display: "grid", placeItems: "center",
                  fontFamily: "var(--font-headline)",
                  fontWeight: 600, fontSize: 18,
                }}>
                  {p.num}
                </div>
                <div>
                  <h4 style={{ fontFamily: "var(--font-headline)", fontSize: 18, fontWeight: 500, color: "#fff", marginBottom: 6, letterSpacing: "-0.01em" }}>
                    {p.title}
                  </h4>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.55 }}>
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Visual */}
          <div style={{
            aspectRatio: "4/5",
            position: "relative",
            background: "rgba(255,255,255,0.04)",
            borderRadius: 22,
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <div style={{ textAlign: "center", padding: 40 }}>
              <div style={{
                width: 80, height: 80, borderRadius: 20,
                background: "rgba(201,148,58,0.2)",
                color: "var(--nc-secondary)",
                display: "grid", placeItems: "center",
                margin: "0 auto 20px",
                fontSize: 36,
              }}>
                {active === "gestores" ? "📊" : "🦷"}
              </div>
              <div style={{ fontFamily: "var(--font-headline)", fontSize: 28, fontWeight: 400, color: "#fff", marginBottom: 8 }}>
                {active === "gestores" ? "Gestão estratégica" : "Excelência clínica"}
              </div>
              <div style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.5, maxWidth: "28ch", margin: "0 auto" }}>
                {active === "gestores"
                  ? "Tome decisões com base em dados reais, não em intuição."
                  : "Foque no que você faz de melhor — cuidar dos pacientes."}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .tracks-panel { grid-template-columns: 1fr !important; }
        }
        .eyebrow::before { background: #E6C78E !important; }
      `}</style>
    </section>
  )
}
