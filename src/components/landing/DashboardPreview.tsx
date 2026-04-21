"use client"

import { useState } from "react"

const tabs = [
  { id: "agenda",  label: "Agenda"      },
  { id: "chart",   label: "Prontuário"  },
  { id: "fin",     label: "Financeiro"  },
]

const urlMap: Record<string, string> = {
  agenda: "app.naviclin.com.br/agenda",
  chart:  "app.naviclin.com.br/prontuario",
  fin:    "app.naviclin.com.br/financeiro",
}

function AgendaSlide() {
  const appts = [
    { time: "09:00", name: "Ana Lopes",     proc: "Limpeza",        col: "#4B5A95" },
    { time: "10:30", name: "João Prado",    proc: "Implante",       col: "#C9943A" },
    { time: "11:15", name: "Carla Mendes",  proc: "Canal — 2ª sessão", col: "#1C2D6E" },
    { time: "14:00", name: "Marcelo Viana", proc: "Implante — 1ª sessão", col: "#C9943A" },
    { time: "14:45", name: "Clara Sousa",   proc: "Ortodontia",     col: "#4B5A95" },
    { time: "15:30", name: "Olívia Matos",  proc: "Prótese",        col: "#1A8A5A" },
  ]
  const miniStats = [
    { l: "Agendados", n: "87", d: "+12 vs semana anterior", up: true },
    { l: "Confirmados", n: "72", d: "83% da agenda", up: true },
    { l: "Encaixes", n: "9", d: "+3 hoje", up: true },
    { l: "Faltas", n: "4", d: "-38% vs média", up: false },
  ]
  return (
    <div style={{ padding: "24px 28px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {miniStats.map((s) => (
          <div key={s.l} style={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, color: "var(--nc-on-surface-variant)", marginBottom: 4 }}>{s.l}</div>
            <div style={{ fontFamily: "var(--font-headline)", fontSize: 24, fontWeight: 500, color: "var(--nc-on-surface)", letterSpacing: "-0.02em" }}>{s.n}</div>
            <div style={{ fontSize: 11, color: s.up ? "#1A8A5A" : "#B94646", marginTop: 2 }}>{s.d}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {appts.map((a) => (
          <div key={a.time} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 14px", borderRadius: 10,
            border: "1px solid var(--border)",
            background: "var(--background)",
            cursor: "pointer",
            transition: "background .2s",
          }}>
            <div style={{ width: 3, height: 32, borderRadius: 2, background: a.col, flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--nc-secondary)", fontFamily: "ui-monospace, monospace", width: 40, flexShrink: 0 }}>{a.time}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--nc-on-surface)" }}>{a.name}</div>
              <div style={{ fontSize: 11, color: "var(--nc-on-surface-variant)" }}>{a.proc}</div>
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, padding: "4px 10px", borderRadius: 999, background: "rgba(28,45,110,0.08)", color: "var(--nc-primary-container)" }}>Confirmado</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ChartSlide() {
  return (
    <div style={{ padding: "24px 28px", display: "grid", gridTemplateColumns: "280px 1fr", gap: 24 }}>
      {/* Patient card */}
      <div style={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(201,148,58,0.14)", color: "var(--nc-secondary)", display: "grid", placeItems: "center", fontFamily: "var(--font-headline)", fontWeight: 500, fontSize: 16 }}>CS</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--nc-on-surface)" }}>Clara Sousa</div>
            <div style={{ fontSize: 11, color: "var(--nc-on-surface-variant)" }}>ID #04821 · desde Mar/2022</div>
          </div>
        </div>
        {[["Convênio","Particular"],["Última visita","02 abr 2026"],["Próxima","22 abr 2026"],["Profissional","Dra. Juliana"]].map(([l,v]) => (
          <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
            <span style={{ fontSize: 11, color: "var(--nc-on-surface-variant)" }}>{l}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--nc-on-surface)" }}>{v}</span>
          </div>
        ))}
        <div style={{ marginTop: 12, padding: 10, background: "rgba(201,148,58,0.08)", borderRadius: 8, fontSize: 12, color: "var(--nc-secondary)", fontWeight: 500 }}>
          ⚠ Alergia a penicilina
        </div>
      </div>
      {/* Timeline */}
      <div>
        <h4 style={{ fontFamily: "var(--font-headline)", fontSize: 18, fontWeight: 500, color: "var(--nc-on-surface)", marginBottom: 16 }}>Histórico clínico</h4>
        {[
          { date: "02 abr 2026", title: "Ajuste ortodôntico", desc: "Troca de fio 014 → 016. Próxima visita em 20 dias." },
          { date: "15 mar 2026", title: "Restauração dente 27", desc: "Resina composta. Anestesia local 1,8ml." },
          { date: "28 fev 2026", title: "Profilaxia completa", desc: "Limpeza + aplicação de flúor. Orientação de higiene." },
          { date: "10 fev 2026", title: "Radiografia panorâmica", desc: "Anexada ao prontuário. Sem alterações relevantes." },
        ].map((e, i) => (
          <div key={i} style={{ display: "flex", gap: 16, paddingBottom: 16, marginBottom: 16, borderBottom: "1px solid var(--border)" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(201,148,58,0.14)", color: "var(--nc-secondary)", display: "grid", placeItems: "center", fontSize: 14, flexShrink: 0 }}>✦</div>
            <div>
              <div style={{ fontSize: 11, color: "var(--nc-on-surface-variant)", marginBottom: 2 }}>{e.date}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--nc-on-surface)", marginBottom: 2 }}>{e.title}</div>
              <div style={{ fontSize: 13, color: "var(--nc-on-surface-variant)" }}>{e.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FinSlide() {
  const miniStats = [
    { l: "Faturamento",  n: "R$ 184.720", d: "+18,4%",  up: true  },
    { l: "Despesas",     n: "R$ 72.130",  d: "+4,1%",   up: false },
    { l: "Lucro líq.",   n: "R$ 112.590", d: "+24,7%",  up: true  },
    { l: "Ticket médio", n: "R$ 412",     d: "+R$28",   up: true  },
  ]
  const transactions = [
    { icon: "+", label: "Ana Lopes · Limpeza",       detail: "Pix · hoje 09:42",     val: "R$ 220",   pos: true },
    { icon: "+", label: "Marcelo Viana · Implante",  detail: "Cartão · hoje 11:15",  val: "R$ 3.800", pos: true },
    { icon: "–", label: "Fornecedor Dental · NF",    detail: "Boleto · ontem",       val: "R$ 1.240", pos: false },
    { icon: "+", label: "Clara Sousa · Ortodontia",  detail: "Pix · ontem 16:30",    val: "R$ 580",   pos: true },
  ]
  return (
    <div style={{ padding: "24px 28px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {miniStats.map((s) => (
          <div key={s.l} style={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, color: "var(--nc-on-surface-variant)", marginBottom: 4 }}>{s.l}</div>
            <div style={{ fontFamily: "var(--font-headline)", fontSize: 20, fontWeight: 500, color: "var(--nc-on-surface)", letterSpacing: "-0.02em" }}>{s.n}</div>
            <div style={{ fontSize: 11, color: s.up ? "#1A8A5A" : "#B94646", marginTop: 2 }}>{s.d}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <h4 style={{ fontFamily: "var(--font-headline)", fontSize: 16, fontWeight: 500, color: "var(--nc-on-surface)" }}>Movimentações recentes</h4>
            <div style={{ fontSize: 12, color: "var(--nc-on-surface-variant)" }}>Últimas 4 entradas</div>
          </div>
        </div>
        {transactions.map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", borderBottom: i < transactions.length - 1 ? "1px solid var(--border)" : "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: t.pos ? "rgba(26,138,90,0.1)" : "rgba(185,70,70,0.1)", color: t.pos ? "#1A8A5A" : "#B94646", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>{t.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--nc-on-surface)" }}>{t.label}</div>
              <div style={{ fontSize: 11, color: "var(--nc-on-surface-variant)" }}>{t.detail}</div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: t.pos ? "#1A8A5A" : "#B94646" }}>{t.pos ? "+" : ""}{t.val}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DashboardPreview() {
  const [active, setActive] = useState("agenda")

  return (
    <section id="produto" style={{ padding: "96px 0", background: "var(--background)", position: "relative" }}>
      <div style={{ width: "100%", maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
        {/* Head */}
        <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
          <span className="eyebrow">Produto em uso</span>
          <h2 style={{
            fontFamily: "var(--font-headline)",
            fontSize: "clamp(32px, 3.6vw, 56px)",
            fontWeight: 400,
            color: "var(--nc-on-surface)",
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            margin: "12px auto 18px",
            maxWidth: "18ch",
          }}>
            Uma ferramenta que você <em style={{ fontStyle: "italic", color: "var(--nc-secondary)" }}>quer</em> abrir pela manhã.
          </h2>
          <p style={{ fontSize: "clamp(17px, 1.25vw, 20px)", color: "var(--nc-on-surface-variant)", margin: "0 auto", maxWidth: "60ch", lineHeight: 1.5 }}>
            Interface limpa, decisões rápidas. Troque entre os módulos abaixo para explorar.
          </p>
        </div>

        {/* Tabs */}
        <div className="reveal" style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <div style={{
            display: "inline-flex",
            gap: 8,
            padding: 6,
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 999,
          }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                style={{
                  padding: "10px 22px",
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 500,
                  border: "none",
                  cursor: "pointer",
                  transition: "background .2s, color .2s",
                  background: active === tab.id ? "var(--nc-primary-container)" : "transparent",
                  color: active === tab.id ? "#fff" : "var(--nc-on-surface-variant)",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stage */}
        <div className="reveal" style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 22,
          boxShadow: "0 24px 60px rgba(15,26,68,.14), 0 6px 18px rgba(15,26,68,.08)",
          overflow: "hidden",
          minHeight: 480,
        }}>
          {/* Browser bar */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "12px 18px",
            borderBottom: "1px solid var(--border)",
            background: "var(--background)",
          }}>
            <div style={{ display: "flex", gap: 6 }}>
              {["#E26762","#E4B33D","#5EAC5A"].map((c, i) => (
                <span key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, display: "block" }} />
              ))}
            </div>
            <div style={{
              marginLeft: 16, padding: "4px 12px",
              background: "var(--card)", border: "1px solid var(--border)",
              borderRadius: 6, fontFamily: "ui-monospace, monospace",
              fontSize: 12, color: "var(--nc-on-surface-variant)",
            }}>
              {urlMap[active]}
            </div>
          </div>

          {/* Slide content */}
          {active === "agenda" && <AgendaSlide />}
          {active === "chart"  && <ChartSlide />}
          {active === "fin"    && <FinSlide />}
        </div>
      </div>
    </section>
  )
}
