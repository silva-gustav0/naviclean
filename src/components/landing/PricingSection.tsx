"use client"

import Link from "next/link"
import { useState } from "react"

const plans = [
  {
    name: "Essencial",
    sub: "Para consultórios solo começando a digitalizar",
    monthly: 169,
    annual: 142,
    features: ["1 profissional", "Agenda com lembretes", "Prontuário digital e odontograma", "Financeiro básico", "Suporte por email"],
    cta: "Começar",
    href: "/cadastro?plano=essencial",
  },
  {
    name: "Profissional",
    sub: "Para clínicas com múltiplos profissionais",
    monthly: 369,
    annual: 309,
    features: ["Até 5 profissionais", "Agenda multi-sala", "Comissões e repasses", "Relatórios gerenciais", "Integração WhatsApp", "Suporte prioritário"],
    cta: "Agendar demonstração",
    href: "/cadastro?plano=profissional",
    openDemo: true,
    featured: true,
    badge: "Mais escolhido",
  },
  {
    name: "Grupos",
    sub: "Redes e franquias com múltiplas unidades",
    monthly: null,
    annual: null,
    features: ["Profissionais ilimitados", "Múltiplas unidades", "BI consolidado", "API e integrações", "Gerente de conta dedicado", "SLA garantido"],
    cta: "Falar com consultor",
    href: "/contato?origem=grupos",
  },
]

export function PricingSection() {
  const [annual, setAnnual] = useState(false)

  return (
    <section id="planos" style={{ padding: "96px 0", background: "var(--card)" }}>
      <div style={{ width: "100%", maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
        {/* Head */}
        <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
          <span className="eyebrow">Planos</span>
          <h2 style={{
            fontFamily: "var(--font-headline)",
            fontSize: "clamp(32px, 3.6vw, 56px)",
            fontWeight: 400,
            color: "var(--nc-on-surface)",
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            margin: "12px auto 16px",
            maxWidth: "20ch",
          }}>
            Preço justo. <em style={{ fontStyle: "italic", color: "var(--nc-secondary)" }}>Sem surpresa.</em>
          </h2>
          <p style={{ fontSize: "clamp(17px, 1.25vw, 20px)", color: "var(--nc-on-surface-variant)", margin: "0 auto", maxWidth: "60ch", lineHeight: 1.5 }}>
            Sem setup. Sem fidelidade. Cancele quando quiser.
          </p>

          {/* Billing toggle */}
          <div style={{
            display: "inline-flex",
            marginTop: 24,
            padding: 6,
            background: "var(--background)",
            border: "1px solid var(--nc-outline-variant)",
            borderRadius: 999,
          }}>
            {[
              { id: false, label: "Mensal" },
              { id: true,  label: "Anual",  save: "-2 meses" },
            ].map((opt) => (
              <button
                key={String(opt.id)}
                onClick={() => setAnnual(opt.id)}
                style={{
                  padding: "10px 22px",
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 500,
                  border: "none",
                  cursor: "pointer",
                  transition: "background .2s, color .2s",
                  background: annual === opt.id ? "var(--nc-primary-container)" : "transparent",
                  color: annual === opt.id ? "#fff" : "var(--nc-on-surface-variant)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {opt.label}
                {opt.save && (
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 999, background: "var(--nc-secondary)", color: "var(--nc-on-secondary)", fontWeight: 600 }}>
                    {opt.save}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Plans */}
        <div
          className="reveal plans-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, alignItems: "stretch" }}
        >
          {plans.map((plan) => (
            <div
              key={plan.name}
              style={{
                background: plan.featured
                  ? "linear-gradient(160deg, var(--nc-primary-container), var(--nc-primary))"
                  : "var(--background)",
                border: plan.featured ? "none" : "1px solid var(--nc-outline-variant)",
                borderRadius: 22,
                padding: "36px 32px",
                display: "flex",
                flexDirection: "column",
                gap: 20,
                position: "relative",
                transform: plan.featured ? "translateY(-8px)" : undefined,
                boxShadow: plan.featured ? "0 24px 60px rgba(15,26,68,.14), 0 6px 18px rgba(15,26,68,.08)" : undefined,
              }}
            >
              {plan.badge && (
                <div style={{
                  position: "absolute", top: -12, left: 32,
                  background: "var(--nc-secondary)", color: "var(--nc-on-secondary)",
                  padding: "5px 12px", borderRadius: 999,
                  fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
                }}>
                  {plan.badge}
                </div>
              )}

              <div>
                <h3 style={{
                  fontFamily: "var(--font-headline)",
                  fontSize: 22, fontWeight: 500,
                  color: plan.featured ? "#fff" : "var(--nc-on-surface)",
                  letterSpacing: "-0.02em",
                  marginBottom: 4,
                }}>
                  {plan.name}
                </h3>
                <p style={{ fontSize: 14, color: plan.featured ? "rgba(255,255,255,0.7)" : "var(--nc-on-surface-variant)" }}>
                  {plan.sub}
                </p>
              </div>

              {/* Price */}
              {plan.monthly === null ? (
                <div style={{
                  fontFamily: "var(--font-headline)",
                  fontSize: 28, fontWeight: 500,
                  letterSpacing: "-0.02em",
                  color: plan.featured ? "#fff" : "var(--nc-on-surface)",
                  paddingTop: 8, paddingBottom: 8,
                  fontStyle: "italic",
                }}>
                  Sob medida
                </div>
              ) : (
                <div style={{
                  fontFamily: "var(--font-headline)",
                  fontSize: 52, fontWeight: 400,
                  letterSpacing: "-0.03em",
                  color: plan.featured ? "#fff" : "var(--nc-on-surface)",
                  display: "flex", alignItems: "baseline", gap: 6,
                }}>
                  <span style={{ fontSize: 22, alignSelf: "flex-start", marginTop: 8, color: plan.featured ? "rgba(255,255,255,0.7)" : "var(--nc-on-surface-variant)" }}>R$</span>
                  <span>{annual ? plan.annual : plan.monthly}</span>
                  <span style={{ fontSize: 14, fontFamily: "var(--font-sans)", fontWeight: 400, color: plan.featured ? "rgba(255,255,255,0.65)" : "var(--nc-on-surface-variant)" }}>/mês</span>
                </div>
              )}

              {/* Features */}
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                {plan.features.map((f) => (
                  <li key={f} style={{
                    fontSize: 14,
                    color: plan.featured ? "rgba(255,255,255,0.85)" : "var(--nc-on-surface-variant)",
                    display: "grid",
                    gridTemplateColumns: "18px 1fr",
                    gap: 10,
                    alignItems: "flex-start",
                    lineHeight: 1.45,
                  }}>
                    <span style={{ marginTop: 6, width: 6, height: 6, borderRadius: "50%", background: "var(--nc-secondary)", display: "block" }} />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {plan.openDemo ? (
                <button
                  onClick={() => document.getElementById("demoModal")?.classList.add("open")}
                  style={{
                    width: "100%",
                    padding: "14px 22px",
                    borderRadius: 999,
                    fontWeight: 500,
                    fontSize: 15,
                    border: "none",
                    cursor: "pointer",
                    transition: "transform .15s, box-shadow .2s",
                    background: "var(--nc-secondary)",
                    color: "var(--nc-on-secondary)",
                    letterSpacing: "-0.005em",
                  }}
                  className="plan-btn"
                >
                  {plan.cta}
                </button>
              ) : (
                <Link href={plan.href} style={{ display: "block" }}>
                  <button style={{
                    width: "100%",
                    padding: "14px 22px",
                    borderRadius: 999,
                    fontWeight: 500,
                    fontSize: 15,
                    border: "1px solid var(--nc-outline-variant)",
                    cursor: "pointer",
                    transition: "transform .15s, background .2s, box-shadow .2s",
                    background: "transparent",
                    color: "var(--nc-on-surface)",
                    letterSpacing: "-0.005em",
                  }}
                    className="plan-btn"
                  >
                    {plan.cta}
                  </button>
                </Link>
              )}
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", color: "var(--nc-on-surface-variant)", fontSize: 14, marginTop: 32 }}>
          Todos os planos incluem suporte em português. Sem cartão de crédito para começar.
        </p>
      </div>

      <style>{`
        .plan-btn:hover { transform: translateY(-1px); }
        @media (max-width: 1024px) {
          .plans-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
