"use client"

import { useEffect, useRef, useState } from "react"

function CountUp({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const [n, setN] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const ran = useRef(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !ran.current) {
        ran.current = true
        const t0 = performance.now()
        const dur = 1600
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / dur)
          const eased = 1 - Math.pow(1 - p, 3)
          setN(Math.round(target * eased))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [target])
  return <span ref={ref}>{prefix}{n.toLocaleString("pt-BR")}{suffix}</span>
}

const stats = [
  { target: 1200, suffix: "+", prefix: "",  label: "Clínicas ativas" },
  { target: 42,   suffix: "%", prefix: "",  label: "Menos faltas com lembretes" },
  { target: 99,   suffix: "%", prefix: "",  label: "Uptime garantido" },
  { target: 14,   suffix: "",  prefix: "",  label: "Dias de teste grátis" },
]

export function SocialProof() {
  return (
    <section style={{ background: "var(--card)" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        borderTop: "1px solid var(--nc-outline-variant)",
        borderBottom: "1px solid var(--nc-outline-variant)",
        maxWidth: 1280,
        margin: "0 auto",
      }}
        className="stats-grid"
      >
        {stats.map((s, i) => (
          <div key={s.label} style={{
            padding: "48px 32px",
            borderRight: i < stats.length - 1 ? "1px solid var(--nc-outline-variant)" : "none",
            textAlign: "left",
          }}
            className="stat-cell"
          >
            <span style={{
              fontFamily: "var(--font-headline)",
              fontSize: "clamp(44px, 4.5vw, 72px)",
              fontWeight: 400,
              letterSpacing: "-0.03em",
              color: "var(--nc-primary-container)",
              display: "block",
              marginBottom: 8,
            }}>
              <CountUp target={s.target} suffix={s.suffix} prefix={s.prefix} />
            </span>
            <span style={{ fontSize: 14, color: "var(--nc-on-surface-variant)", maxWidth: "24ch", display: "block" }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .stat-cell { border-right: none !important; border-bottom: 1px solid var(--nc-outline-variant); }
        }
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
        .dark .stat-cell span:first-child { color: var(--nc-secondary) !important; }
      `}</style>
    </section>
  )
}
