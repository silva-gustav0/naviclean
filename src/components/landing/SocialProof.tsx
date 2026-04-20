"use client"

import { useEffect, useRef, useState } from "react"

const tickers = [
  { icon: "event_available",  label: "Agenda inteligente"    },
  { icon: "description",      label: "Prontuário digital"    },
  { icon: "payments",         label: "Financeiro em tempo real" },
  { icon: "smart_toy",        label: "WhatsApp automatizado" },
  { icon: "inventory_2",      label: "Estoque com NF-e"      },
  { icon: "campaign",         label: "Marketing & CRM"       },
  { icon: "shield",           label: "LGPD & segurança"      },
  { icon: "business",         label: "Multi-clínica"         },
  { icon: "star",             label: "4.9/5 no Capterra"     },
  { icon: "verified",         label: "Suporte em português"  },
]

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
    }, { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [end])
  return <span ref={ref}>{prefix}{n}{suffix}</span>
}

const stats = [
  { end: 500, suffix: "+",  prefix: "", label: "Clínicas ativas",     icon: "store" },
  { end: 40,  suffix: "%",  prefix: "", label: "Menos faltas",        icon: "event_busy" },
  { end: 99,  suffix: ".9", prefix: "", label: "de satisfação (NPS)", icon: "thumb_up" },
  { end: 14,  suffix: "",   prefix: "", label: "dias de teste grátis", icon: "free_cancellation" },
]

const doubled = [...tickers, ...tickers]

export function SocialProof() {
  return (
    <div className="bg-primary overflow-hidden">
      {/* Ticker */}
      <div className="py-4 flex items-center gap-0 relative">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-primary to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-primary to-transparent z-10 pointer-events-none" />
        <div className="flex nc-marquee whitespace-nowrap">
          {doubled.map((item, i) => (
            <div key={i} className="inline-flex items-center gap-2.5 px-6 text-white/60 text-sm font-medium">
              <span className="material-symbols-outlined text-nc-secondary" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
              {item.label}
              <span className="w-1 h-1 rounded-full bg-white/20 ml-2" />
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 grid grid-cols-2 md:grid-cols-4 gap-10 border-t border-white/10">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-nc-secondary" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
            </div>
            <p className="text-4xl font-extrabold text-white font-headline">
              <CountUp end={s.end} suffix={s.suffix} prefix={s.prefix} />
            </p>
            <p className="text-xs text-white/40 font-semibold uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
