"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"

function CountUp({ end, suffix = "" }: { end: number; suffix?: string }) {
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
        const dur = 1600
        const run = () => {
          const p = Math.min((Date.now() - t0) / dur, 1)
          setN(Math.round(end * (1 - Math.pow(1 - p, 3))))
          if (p < 1) requestAnimationFrame(run)
        }
        requestAnimationFrame(run)
      }
    }, { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [end])
  return <span ref={ref}>{n}{suffix}</span>
}

const kpis = [
  { icon: "calendar_month", label: "Agendamentos hoje", value: "24", delta: "+3 vs. ontem", color: "bg-blue-50 text-blue-600" },
  { icon: "people",         label: "Pacientes ativos",  value: "348", delta: "+12 este mês", color: "bg-violet-50 text-violet-600" },
  { icon: "payments",       label: "Receita do mês",    value: "R$28k", delta: "↑ 12%",     color: "bg-emerald-50 text-emerald-600" },
  { icon: "show_chart",     label: "Taxa de retorno",   value: "87%",  delta: "+2p",         color: "bg-amber-50 text-amber-600" },
]

const agenda = [
  { time: "09:00", name: "Dra. Ana Paula",   proc: "Implante unitário",      badge: "Concluído",  col: "bg-emerald-400", done: true  },
  { time: "10:30", name: "Carlos Eduardo",   proc: "Clareamento LED",        badge: "Confirmado", col: "bg-blue-500",    done: false },
  { time: "11:15", name: "Mariana Silva",    proc: "Manutenção Ortodôntica", badge: "Confirmado", col: "bg-violet-500",  done: false },
  { time: "14:00", name: "Pedro Henrique",   proc: "Exodontia",              badge: "Aguardando", col: "bg-amber-400",   done: false },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[calc(100vh-80px)] flex items-center">
      {/* Dot grid */}
      <div className="absolute inset-0 bg-dot-grid opacity-50 pointer-events-none" />
      {/* Blobs */}
      <div className="absolute -top-48 -left-48 w-[700px] h-[700px] nc-blob pointer-events-none opacity-25"
        style={{ background: "radial-gradient(circle, rgba(0,36,74,0.14) 0%, transparent 70%)" }} />
      <div className="absolute -bottom-48 -right-24 w-[600px] h-[600px] nc-blob pointer-events-none opacity-20"
        style={{ background: "radial-gradient(circle, rgba(119,89,40,0.12) 0%, transparent 70%)", animationDelay: "5s" }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-20">
        {/* ── Text block ── */}
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 bg-surface-container-lowest border border-outline-variant/40 text-on-surface-variant text-xs font-semibold px-5 py-2.5 rounded-full shadow-premium-sm mb-10 nc-fade-up" style={{ animationDelay: "0.05s" }}>
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            14 dias grátis · sem cartão de crédito
            <span className="h-3 w-px bg-outline-variant/60" />
            <span className="font-bold text-primary">+500 clínicas</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-[80px] font-extrabold tracking-tight leading-[1.02] font-headline mb-6 nc-fade-up" style={{ animationDelay: "0.2s" }}>
            <span className="text-primary">Gestão clínica</span><br />
            <span className="text-gradient-gold">sem limites.</span>
          </h1>

          <p className="text-xl text-on-surface-variant leading-relaxed max-w-2xl mx-auto mb-10 nc-fade-up" style={{ animationDelay: "0.35s" }}>
            A plataforma para dentistas de alta performance. Prontuário, agenda, financeiro
            e WhatsApp automatizado — tudo integrado e pronto para usar.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 nc-fade-up" style={{ animationDelay: "0.5s" }}>
            <Link href="/cadastro">
              <button className="btn-pill-arrow group flex items-center gap-3 surgical-gradient text-white font-bold text-lg px-8 py-4 rounded-full shadow-glow-navy hover:scale-[1.03] hover:shadow-[0_8px_40px_rgba(0,36,74,0.4)] active:scale-[0.97] transition-all duration-200 font-headline">
                Começar grátis agora
                <span className="arrow-circle w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white" style={{ fontSize: 16 }}>arrow_forward</span>
                </span>
              </button>
            </Link>
            <Link href="/contato">
              <button className="flex items-center gap-2.5 text-primary font-semibold text-lg px-8 py-4 rounded-full border-2 border-primary/15 bg-surface-container-lowest hover:border-primary/40 hover:bg-primary/5 active:scale-[0.97] transition-all duration-200 font-headline shadow-premium-sm">
                <span className="material-symbols-outlined text-primary/60" style={{ fontSize: 20 }}>play_circle</span>
                Ver demonstração
              </button>
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex flex-wrap justify-center items-center gap-5 text-sm text-on-surface-variant nc-fade-up" style={{ animationDelay: "0.65s" }}>
            <div className="flex -space-x-2.5">
              {[["AP","#00244a"],["RM","#0d3a6b"],["CS","#1a4f8c"],["FA","#0d3a6b"],["LO","#00244a"]].map(([init, bg], i) => (
                <div key={i} className="w-9 h-9 rounded-full border-2 border-surface flex items-center justify-center text-white text-[10px] font-bold" style={{ background: bg, zIndex: 5 - i }}>
                  {init}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-nc-secondary" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
              </div>
              <span><strong className="text-primary">4.9/5</strong> · mais de <strong className="text-primary">500 clínicas</strong></span>
            </div>
          </div>
        </div>

        {/* ── Dashboard mockup ── */}
        <div className="relative mt-20 nc-fade-up" style={{ animationDelay: "0.8s" }}>
          {/* Glow under mockup */}
          <div className="absolute inset-0 scale-x-[0.92] scale-y-[0.7] translate-y-8 bg-primary/10 blur-3xl rounded-3xl pointer-events-none" />

          {/* Floating card: Revenue */}
          <div className="absolute left-0 lg:-left-6 top-8 z-20 nc-float hidden sm:block">
            <div className="glass-card rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,36,74,0.14)] min-w-[164px]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-emerald-600" style={{ fontSize: 15, fontVariationSettings: "'FILL' 1" }}>payments</span>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">Receita</span>
              </div>
              <p className="text-2xl font-extrabold text-primary font-headline leading-none">R$28.4k</p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-0.5">
                <span className="material-symbols-outlined" style={{ fontSize: 12 }}>trending_up</span>
                +12% vs. mês passado
              </p>
            </div>
          </div>

          {/* Floating card: Agenda */}
          <div className="absolute right-0 lg:-right-6 top-16 z-20 nc-float-alt hidden sm:block">
            <div className="glass-card rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,36,74,0.14)] min-w-[176px]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-600" style={{ fontSize: 15, fontVariationSettings: "'FILL' 1" }}>event_available</span>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">Hoje</span>
              </div>
              <p className="text-2xl font-extrabold text-primary font-headline leading-none">24 consultas</p>
              <div className="flex gap-1 mt-2">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full ${i < 7 ? "bg-primary" : "bg-primary/12"}`} />
                ))}
              </div>
            </div>
          </div>

          {/* Floating card: WhatsApp */}
          <div className="absolute left-[22%] -bottom-4 z-20 hidden sm:block" style={{ animation: "nc-float 7s ease-in-out infinite", animationDelay: "2.5s" }}>
            <div className="glass-card rounded-xl px-4 py-3 shadow-[0_8px_32px_rgba(0,36,74,0.10)] flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-white" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>check</span>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface leading-none">Confirmado via WhatsApp</p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">Mariana Silva · agora mesmo</p>
              </div>
            </div>
          </div>

          {/* Main dashboard */}
          <div className="mx-auto max-w-4xl rounded-2xl border border-outline-variant/20 overflow-hidden shadow-[0_24px_80px_rgba(0,36,74,0.22)]"
            style={{ transform: "perspective(1200px) rotateX(3deg)" }}>
            {/* Chrome */}
            <div className="surgical-gradient px-5 py-3.5 flex items-center gap-4">
              <div className="flex gap-1.5">
                {["bg-white/20", "bg-white/20", "bg-white/20"].map((c, i) => <div key={i} className={`w-3 h-3 rounded-full ${c}`} />)}
              </div>
              <div className="flex-1 mx-4 bg-white/10 rounded-lg px-3 py-1 text-[11px] text-white/60 text-center font-mono">
                app.naviclin.com/dashboard
              </div>
              <div className="flex items-center gap-1.5 ml-auto">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-white/70">Online</span>
              </div>
            </div>

            {/* KPIs */}
            <div className="bg-surface-container-lowest px-6 pt-5 pb-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-outline-variant/10">
              {kpis.map((k) => (
                <div key={k.label} className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${k.color}`}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>{k.icon}</span>
                  </div>
                  <div>
                    <p className="text-xl font-extrabold text-primary font-headline leading-none">{k.value}</p>
                    <p className="text-[9px] text-on-surface-variant mt-0.5 uppercase tracking-wider font-semibold leading-tight">{k.label}</p>
                    <p className="text-[10px] text-emerald-600 font-bold mt-0.5">{k.delta}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Agenda rows */}
            <div className="bg-surface-container-lowest px-6 py-4 space-y-1">
              {agenda.map((a) => (
                <div key={a.time} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${a.done ? "opacity-35" : "hover:bg-surface-container"}`}>
                  <div className={`w-1 h-8 rounded-full shrink-0 ${a.col}`} />
                  <span className="text-[11px] font-bold text-nc-secondary w-10 shrink-0 font-mono">{a.time}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold font-headline truncate ${a.done ? "line-through text-outline" : "text-primary"}`}>{a.name}</p>
                    <p className="text-[10px] text-on-surface-variant truncate">{a.proc}</p>
                  </div>
                  <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                    a.done ? "bg-emerald-100 text-emerald-700" :
                    a.badge === "Confirmado" ? "bg-primary/8 text-primary" :
                    "bg-nc-secondary/10 text-nc-secondary"
                  }`}>{a.badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Animated counters ── */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto text-center nc-fade-up" style={{ animationDelay: "1s" }}>
          {[
            { end: 500, suffix: "+", label: "Clínicas ativas" },
            { end: 40,  suffix: "%", label: "Menos faltas" },
            { end: 28,  suffix: "k", label: "Consultas/mês" },
            { end: 99,  suffix: "%", label: "Uptime garantido" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold text-primary font-headline">
                <CountUp end={s.end} suffix={s.suffix} />
              </p>
              <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
