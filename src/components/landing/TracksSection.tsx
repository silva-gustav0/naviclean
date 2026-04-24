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
    visual: {
      title: "Faturamento do mês",
      value: "R$ 112.590",
      badge: "+24,7%",
      stats: [
        { l: "Valor do NFS", v: "R$ 413" },
        { l: "Cobrança", v: "97%" },
        { l: "Inadimplentes", v: "3,3%" },
      ],
    },
  },
  medicos: {
    label: "Médicos",
    points: [
      { num: "1", title: "Prontuário médico completo", desc: "Anamnese digital, evoluções com assinatura eletrônica e prescrições em PDF prontas em segundos." },
      { num: "2", title: "Integração com odontologia", desc: "Visão 360° do paciente. O médico e o dentista compartilham o mesmo histórico, sem duplicidade." },
      { num: "3", title: "Telemedicina integrada", desc: "Realize consultas remotas com prontuário em tempo real. Conformidade com CFM." },
      { num: "4", title: "Gestão de especialidades", desc: "Suporte a mais de 20 especialidades médicas. Configuração de procedimentos, tabelas e convênios por especialidade." },
    ],
    visual: {
      title: "Excelência clínica",
      subtitle: "Mais de 20 especialidades médicas unidas à odontologia avançada.",
      nextPatient: { name: "Clara Sousa", specialty: "Ortopedia", time: "14h30" },
    },
  },
  dentistas: {
    label: "Dentistas",
    points: [
      { num: "1", title: "Agenda inteligente", desc: "Visualize sua semana completa, gerencie encaixes e receba confirmações automáticas — sem ligar para nenhum paciente." },
      { num: "2", title: "Prontuário em segundos", desc: "Odontograma interativo, evoluções com assinatura digital e prescrições em PDF — tudo em menos de 1 minuto." },
      { num: "3", title: "Menos burocracia", desc: "Ateste presença, registre evoluções e envie receitas do consultório. O NaviClin elimina o papel do dia a dia clínico." },
      { num: "4", title: "Seus dados, seu crescimento", desc: "Acompanhe sua produção, procedimentos mais realizados e taxa de retorno dos seus pacientes." },
    ],
    visual: {
      title: "Próximo paciente",
      nextPatient: { name: "Clara Sousa", specialty: "Ortodontia", time: "14h30", initials: "CS" },
      note: "Clínica Aventura",
    },
  },
}

type TrackKey = "gestores" | "medicos" | "dentistas"

function GestoresVisual({ data }: { data: typeof tracks.gestores.visual }) {
  const v = data as typeof tracks.gestores.visual & { stats: { l: string; v: string }[] }
  return (
    <div style={{ padding: 28 }}>
      <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
        {v.title}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
        <div style={{ fontFamily: "var(--font-headline)", fontSize: 36, fontWeight: 500, color: "#fff", letterSpacing: "-0.02em" }}>
          {v.value}
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#4ade80", background: "rgba(74,222,128,0.15)", padding: "2px 8px", borderRadius: 999 }}>
          {v.badge}
        </div>
      </div>
      <svg viewBox="0 0 260 60" style={{ width: "100%", height: 60, marginBottom: 20 }}>
        <polyline fill="none" stroke="#C9943A" strokeWidth="2.5" strokeLinejoin="round"
          points="0,50 30,42 60,46 90,28 120,34 150,18 180,24 210,10 240,14 260,6"/>
        <polyline fill="rgba(201,148,58,0.18)" stroke="none"
          points="0,50 30,42 60,46 90,28 120,34 150,18 180,24 210,10 240,14 260,6 260,60 0,60"/>
      </svg>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {v.stats.map((s) => (
          <div key={s.l} style={{
            background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "12px 14px",
            border: "1px solid rgba(255,255,255,0.08)",
          }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>{s.l}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{s.v}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MedicosVisual() {
  return (
    <div style={{ padding: 28 }}>
      <div style={{
        width: 52, height: 52, borderRadius: 14,
        background: "rgba(201,148,58,0.2)", color: "var(--nc-secondary)",
        display: "grid", placeItems: "center", marginBottom: 16, fontSize: 26,
      }}>
        🩺
      </div>
      <div style={{ fontFamily: "var(--font-headline)", fontSize: 22, fontWeight: 500, color: "#fff", marginBottom: 8 }}>
        Excelência clínica
      </div>
      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.55, marginBottom: 20 }}>
        Mais de 20 especialidades médicas unidas à odontologia avançada. A saúde do seu corpo e do seu sorriso num só lugar.
      </div>
      <div style={{
        background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: 16,
        border: "1px solid rgba(255,255,255,0.1)",
      }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Próxima consulta
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(201,148,58,0.3)", color: "var(--nc-secondary)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 12 }}>CS</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Clara Sousa</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Ortopedia · 14h30</div>
          </div>
        </div>
        <div style={{ marginTop: 12, padding: "8px 14px", background: "var(--nc-secondary)", borderRadius: 8, textAlign: "center", fontSize: 13, fontWeight: 500, color: "#fff", cursor: "pointer" }}>
          Abrir prontuário
        </div>
      </div>
    </div>
  )
}

function DentistasVisual() {
  return (
    <div style={{ padding: 28 }}>
      <div style={{
        width: 52, height: 52, borderRadius: 14,
        background: "rgba(201,148,58,0.2)", color: "var(--nc-secondary)",
        display: "grid", placeItems: "center", marginBottom: 16, fontSize: 26,
      }}>
        🦷
      </div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
        Clínica Aventura
      </div>
      <div style={{
        background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: 16,
        border: "1px solid rgba(255,255,255,0.1)",
      }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Próximo paciente
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(201,148,58,0.3)", color: "var(--nc-secondary)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 12 }}>CS</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Clara Sousa</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Ortodontia · 14h30</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          {["saúde", "retorno"].map((tag) => (
            <span key={tag} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 999, background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}>{tag}</span>
          ))}
        </div>
        <div style={{ marginTop: 4, padding: "8px 14px", background: "var(--nc-secondary)", borderRadius: 8, textAlign: "center", fontSize: 13, fontWeight: 500, color: "#fff", cursor: "pointer" }}>
          Abrir prontuário
        </div>
      </div>
    </div>
  )
}

export function TracksSection() {
  const [active, setActive] = useState<TrackKey>("gestores")
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
            Três perfis, uma plataforma. Encontre seu caminho.
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
            {(["gestores", "medicos", "dentistas"] as const).map((key) => (
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
                  color: active === key ? "#fff" : "rgba(255,255,255,0.7)",
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
                  width: 40, height: 40, borderRadius: "50%",
                  background: "var(--nc-secondary)",
                  color: "#fff",
                  display: "grid", placeItems: "center",
                  fontFamily: "var(--font-headline)",
                  fontWeight: 700, fontSize: 16,
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
            position: "relative",
            background: "rgba(255,255,255,0.04)",
            borderRadius: 22,
            border: "1px solid rgba(255,255,255,0.1)",
            overflow: "hidden",
            minHeight: 340,
          }}>
            {active === "gestores" && <GestoresVisual data={tracks.gestores.visual} />}
            {active === "medicos"  && <MedicosVisual />}
            {active === "dentistas" && <DentistasVisual />}
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
