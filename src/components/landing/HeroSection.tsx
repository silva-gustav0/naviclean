"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"

function CountUp({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) {
  const [n, setN] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const ran = useRef(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !ran.current) {
        ran.current = true
        const t0 = Date.now()
        const run = () => {
          const p = Math.min((Date.now() - t0) / 1600, 1)
          setN(Math.round(end * (1 - Math.pow(1 - p, 3))))
          if (p < 1) requestAnimationFrame(run)
        }
        requestAnimationFrame(run)
      }
    }, { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [end])
  return <span ref={ref}>{prefix}{n}{suffix}</span>
}

export function HeroSection() {
  return (
    <section className="hero-section" style={{ paddingTop: 128, paddingBottom: 64, position: "relative", overflow: "hidden" }}>
      <div style={{ width: "100%", maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
        <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 72, alignItems: "center" }}>

          {/* Left: copy */}
          <div className="reveal-hero">
            <span className="eyebrow" style={{ marginBottom: 24, display: "inline-flex" }}>
              Gestão clínica de alto padrão
            </span>

            <h1 style={{
              fontFamily: "var(--font-headline)",
              fontSize: "clamp(44px, 5.5vw, 84px)",
              fontWeight: 400,
              color: "var(--nc-on-surface)",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              marginBottom: 28,
            }}>
              A operação da sua clínica,{" "}
              <em style={{ fontStyle: "italic", color: "var(--nc-secondary)", fontWeight: 400 }}>
                em um só lugar.
              </em>
            </h1>

            <p style={{
              fontSize: "clamp(17px, 1.25vw, 20px)",
              color: "var(--nc-on-surface-variant)",
              lineHeight: 1.5,
              maxWidth: "60ch",
              marginBottom: 36,
            }}>
              Agenda inteligente, prontuário digital e financeiro em tempo real — desenhados para clínicas odontológicas que não aceitam menos do que excelência.
            </p>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center", marginBottom: 32 }}>
              <button
                className="hero-btn-primary"
                onClick={() => document.getElementById("demoModal")?.classList.add("open")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "14px 22px",
                  borderRadius: 999,
                  fontWeight: 500,
                  fontSize: 15,
                  background: "var(--nc-primary-container)",
                  color: "#fff",
                  boxShadow: "0 1px 2px rgba(15,26,68,.06), 0 2px 8px rgba(15,26,68,.04)",
                  border: "none",
                  cursor: "pointer",
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
                href="#produto"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "14px 22px",
                  borderRadius: 999,
                  fontWeight: 500,
                  fontSize: 15,
                  border: "1px solid var(--nc-outline-variant)",
                  color: "var(--nc-on-surface)",
                  transition: "border-color .2s",
                  letterSpacing: "-0.005em",
                }}
              >
                Ver o produto
              </a>
            </div>

            {/* Meta stats */}
            <div style={{
              display: "flex",
              gap: 28,
              flexWrap: "wrap",
              paddingTop: 24,
              borderTop: "1px solid var(--nc-outline-variant)",
            }}>
              {[
                { end: 1200, suffix: "+", label: "Clínicas ativas" },
                { end: 4, suffix: ".9/5", label: "Avaliação média" },
                { end: 99, suffix: ".9%", label: "Uptime" },
              ].map((s) => (
                <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{
                    fontFamily: "var(--font-headline)",
                    fontSize: 28,
                    color: "var(--nc-on-surface)",
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                  }}>
                    <CountUp end={s.end} suffix={s.suffix} />
                  </span>
                  <span style={{
                    fontSize: 12,
                    color: "var(--nc-on-surface-variant)",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: visual */}
          <div className="hero-visual" style={{ position: "relative", aspectRatio: "5 / 6" }}>
            <div style={{
              position: "absolute",
              inset: 0,
              borderRadius: 22,
              background: "linear-gradient(160deg, var(--nc-primary-container), var(--nc-primary))",
              boxShadow: "0 24px 60px rgba(15,26,68,.14), 0 6px 18px rgba(15,26,68,.08)",
              overflow: "hidden",
            }}>
              {/* gold radial glows */}
              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: "radial-gradient(600px 400px at 90% 0%, rgba(201,148,58,0.25), transparent 60%), radial-gradient(400px 500px at 0% 100%, rgba(201,148,58,0.10), transparent 70%)",
              }} />

              {/* Card A — Agenda */}
              <div className="hv-card-a" style={{
                position: "absolute", left: "6%", top: "8%", width: "58%",
                background: "var(--card)", border: "1px solid var(--border)",
                borderRadius: 14, boxShadow: "0 8px 24px rgba(15,26,68,.08)",
                padding: "14px 16px",
                animation: "hv-float 8s ease-in-out infinite",
              }}>
                <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--nc-on-surface-variant)", marginBottom: 6 }}>Agenda · Hoje</div>
                {[
                  { dot: "var(--nc-secondary)", text: "14h00 · Ana Lopes" },
                  { dot: "var(--nc-primary-container)", text: "14h45 · Marcelo Viana" },
                  { dot: "#1A8A5A", text: "15h30 · Clara Sousa" },
                ].map((row) => (
                  <div key={row.text} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: row.dot, flexShrink: 0 }} />
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--nc-on-surface)" }}>{row.text}</div>
                  </div>
                ))}
              </div>

              {/* Card B — Receita */}
              <div style={{
                position: "absolute", right: "5%", top: "34%", width: "62%",
                background: "var(--card)", border: "1px solid var(--border)",
                borderRadius: 14, boxShadow: "0 8px 24px rgba(15,26,68,.08)",
                padding: "14px 16px",
                animation: "hv-float 9s ease-in-out -2s infinite",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--nc-on-surface-variant)" }}>Receita do mês</div>
                  <div style={{ fontSize: 11, color: "#1A8A5A", fontWeight: 600 }}>+18,4%</div>
                </div>
                <div style={{ fontFamily: "var(--font-headline)", fontSize: 28, fontWeight: 500, color: "var(--nc-on-surface)", letterSpacing: "-0.02em" }}>R$ 184.720</div>
                <svg viewBox="0 0 200 40" style={{ width: "100%", height: 40, marginTop: 8 }}>
                  <polyline fill="none" stroke="#C9943A" strokeWidth="2" points="0,30 20,25 40,28 60,18 80,22 100,14 120,18 140,8 160,12 180,6 200,4"/>
                  <polyline fill="rgba(201,148,58,0.15)" stroke="none" points="0,30 20,25 40,28 60,18 80,22 100,14 120,18 140,8 160,12 180,6 200,4 200,40 0,40"/>
                </svg>
              </div>

              {/* Card C — Patient */}
              <div style={{
                position: "absolute", left: "10%", bottom: "7%", width: "54%",
                background: "var(--card)", border: "1px solid var(--border)",
                borderRadius: 14, boxShadow: "0 8px 24px rgba(15,26,68,.08)",
                padding: "14px 16px",
                animation: "hv-float 10s ease-in-out -4s infinite",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--nc-primary-container), var(--nc-secondary))",
                    color: "#fff", display: "grid", placeItems: "center",
                    fontFamily: "var(--font-headline)", fontWeight: 500, fontSize: 14,
                  }}>JR</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--nc-on-surface)" }}>Julia Rocha</div>
                    <div style={{ fontSize: 10, color: "var(--nc-on-surface-variant)" }}>Último atendimento · 12/03</div>
                  </div>
                </div>
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 11, color: "var(--nc-on-surface-variant)" }}>Próximo retorno</span>
                  <span style={{ fontSize: 11, color: "var(--nc-on-surface)", fontWeight: 600 }}>22/04</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div style={{ marginTop: 80, paddingTop: 40, paddingBottom: 20, borderTop: "1px solid var(--nc-outline-variant)", borderBottom: "1px solid var(--nc-outline-variant)" }}>
          <div style={{ textAlign: "center", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--nc-on-surface-variant)", marginBottom: 24 }}>
            Confiado por clínicas em todo o Brasil
          </div>
          <div className="trust-grid" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 24, opacity: 0.75 }}>
            {[
              { name: "Odonto Prime",  initials: "OP" },
              { name: "Sorriso&Co",    initials: "SC" },
              { name: "Clínica Avanço",initials: "CA" },
              { name: "Dentari",       initials: "DN" },
              { name: "Viva Odonto",   initials: "VO" },
              { name: "Studio Smile",  initials: "SS" },
            ].map(({ name, initials }) => (
              <div key={name} style={{
                height: 44, display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                color: "var(--nc-on-surface-variant)", fontFamily: "var(--font-headline)", fontSize: 14, fontWeight: 500,
                border: "1px solid var(--nc-outline-variant)", borderRadius: 10,
                padding: "0 14px",
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: "50%",
                  background: "var(--nc-primary-container)",
                  color: "#fff",
                  display: "grid", placeItems: "center",
                  fontSize: 10, fontWeight: 700, flexShrink: 0,
                  letterSpacing: "0.02em",
                }}>
                  {initials}
                </div>
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes hv-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .hero-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(15,26,68,.18) !important; }
        @media (max-width: 1024px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .hero-visual { aspect-ratio: 4/3 !important; }
          .trust-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .trust-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        .reveal-hero {
          opacity: 0;
          transform: translateY(18px);
          animation: nc-fade-up 0.8s ease-out 0.1s both;
        }
      `}</style>
    </section>
  )
}
