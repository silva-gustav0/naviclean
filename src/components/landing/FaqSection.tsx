"use client"

import { useState } from "react"

const faqs = [
  { q: "Preciso instalar alguma coisa?", a: "Não. O NaviClin é 100% web — funciona em qualquer dispositivo com navegador. Sem instalação, sem atualizações manuais." },
  { q: "Posso migrar meus dados atuais?", a: "Sim. Nossa equipe faz a migração gratuita de qualquer sistema. Importamos pacientes, prontuários e histórico financeiro em até 5 dias úteis." },
  { q: "Como funciona o período de teste?", a: "14 dias completos, com todos os recursos do plano Profissional. Sem cartão de crédito, sem compromisso. Basta criar sua conta." },
  { q: "O sistema é seguro e atende à LGPD?", a: "Sim. Usamos criptografia AES-256, backups automáticos a cada 6 horas, hospedagem em nuvem brasileira certificada ISO 27001 e DPA completo." },
  { q: "Quantos usuários posso ter?", a: "Depende do seu plano. O Básico suporta 1 profissional, o Profissional até 5, e o Enterprise é ilimitado. Usuários administrativos (recepção, financeiro) não contam no limite." },
  { q: "E se eu precisar cancelar?", a: "Cancele quando quiser, sem multa. Seus dados ficam disponíveis por 30 dias após o cancelamento, e você pode exportar tudo em formato aberto." },
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
            <span className="eyebrow">Dúvidas</span>
            <h2 style={{
              fontFamily: "var(--font-headline)",
              fontSize: "clamp(32px, 3.6vw, 56px)",
              fontWeight: 400,
              color: "var(--nc-on-surface)",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              marginTop: 16,
            }}>
              Perguntas <em style={{ fontStyle: "italic", color: "var(--nc-secondary)" }}>frequentes.</em>
            </h2>
            <p style={{ fontSize: 16, color: "var(--nc-on-surface-variant)", lineHeight: 1.6, marginTop: 20 }}>
              Não encontrou o que procura?{" "}
              <a href="/contato" style={{ color: "var(--nc-secondary)", borderBottom: "1px solid var(--nc-secondary)", paddingBottom: 2 }}>
                Fale com a gente
              </a>
              .
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
