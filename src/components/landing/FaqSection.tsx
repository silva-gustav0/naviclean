"use client"

import { useState } from "react"

const faqs = [
  { q: "Quanto tempo leva para a clínica estar no ar?", a: "Em média 3 a 5 dias úteis. Importamos sua base de pacientes, configuramos profissionais, agenda e tabela de preços. Você entra na plataforma já operando." },
  { q: "Meus dados são seguros?", a: "Sim. Dados hospedados no Brasil, criptografia em trânsito e em repouso, backups a cada 4 horas, e conformidade com LGPD e CFM. Você é o proprietário de todos os dados." },
  { q: "Posso migrar do sistema que uso hoje?", a: "Sim. Importamos pacientes, histórico clínico, agenda e financeiro dos principais sistemas do mercado. Nossa equipe cuida disso sem custo adicional nos planos Profissional e Grupos." },
  { q: "Funciona no celular?", a: "Funciona. Plataforma 100% responsiva e apps nativos para iOS e Android para agenda, prontuário e consulta rápida." },
  { q: "Existe fidelidade?", a: "Não. Cancele a qualquer momento sem multa. Acreditamos que você fica porque quer, não porque precisa." },
  { q: "Emite nota fiscal de serviço?", a: "Sim, com integração direta com as prefeituras suportadas e emissão em lote. Configuração incluída na ativação." },
]

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" style={{ padding: "96px 0", background: "var(--background)" }}>
      <div style={{ width: "100%", maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
        <div
          className="faq-grid"
          style={{ display: "grid", gridTemplateColumns: "0.8fr 1.2fr", gap: 64, alignItems: "start" }}
        >
          {/* Left */}
          <div className="reveal">
            <span className="eyebrow">Perguntas frequentes</span>
            <h2 style={{
              fontFamily: "var(--font-headline)",
              fontSize: "clamp(32px, 3.6vw, 56px)",
              fontWeight: 400,
              color: "var(--nc-on-surface)",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              marginTop: 16,
            }}>
              Respostas <em style={{ fontStyle: "italic", color: "var(--nc-secondary)" }}>diretas</em>, sem letra miúda.
            </h2>
            <p style={{ fontSize: 16, color: "var(--nc-on-surface-variant)", lineHeight: 1.6, marginTop: 20 }}>
              Não achou o que procurava?{" "}
              <a href="/contato" style={{ color: "var(--nc-secondary)", borderBottom: "1px solid var(--nc-secondary)", paddingBottom: 2 }}>
                Fale com um especialista.
              </a>
            </p>
          </div>

          {/* Right: accordion */}
          <div className="reveal" style={{ borderTop: "1px solid var(--nc-outline-variant)" }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ borderBottom: "1px solid var(--nc-outline-variant)" }}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 24,
                    width: "100%",
                    padding: "22px 0",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <h4 style={{
                    fontFamily: "var(--font-headline)",
                    fontSize: 20, fontWeight: 500,
                    color: "var(--nc-on-surface)",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.2,
                  }}>
                    {faq.q}
                  </h4>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                    background: open === i ? "var(--nc-secondary)" : "var(--card)",
                    border: open === i ? "none" : "1px solid var(--nc-outline-variant)",
                    display: "grid", placeItems: "center",
                    color: open === i ? "var(--nc-on-secondary)" : "var(--nc-on-surface-variant)",
                    transition: "background .2s, transform .3s, color .2s",
                    transform: open === i ? "rotate(45deg)" : "none",
                    fontSize: 20, fontWeight: 300,
                  }}>
                    +
                  </div>
                </button>

                <div style={{
                  maxHeight: open === i ? 300 : 0,
                  overflow: "hidden",
                  transition: "max-height .4s ease",
                }}>
                  <p style={{
                    paddingBottom: 22,
                    color: "var(--nc-on-surface-variant)",
                    fontSize: 15,
                    lineHeight: 1.6,
                    maxWidth: "60ch",
                  }}>
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .faq-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </section>
  )
}
