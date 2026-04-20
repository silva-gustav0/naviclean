import Link from "next/link"

const calDays = ["Seg", "Ter", "Qua", "Qui", "Sex"]
const calSlots = [
  [true, false, true, true, false],
  [false, true, true, false, true],
  [true, true, false, true, true],
]

function MiniCalendar() {
  return (
    <div className="mt-6 rounded-xl overflow-hidden border border-white/15">
      <div className="grid grid-cols-5 gap-px bg-white/10">
        {calDays.map((d) => (
          <div key={d} className="bg-white/5 text-center text-[9px] font-bold text-white/50 py-1.5 uppercase tracking-wider">{d}</div>
        ))}
      </div>
      {calSlots.map((row, ri) => (
        <div key={ri} className="grid grid-cols-5 gap-px bg-white/10">
          {row.map((filled, ci) => (
            <div key={ci} className={`py-2.5 flex items-center justify-center ${filled ? "bg-white/15" : "bg-white/5"}`}>
              {filled && <div className="w-5 h-1.5 rounded-full bg-nc-secondary/80" />}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function MiniChart() {
  const bars = [60, 80, 45, 90, 70, 95, 55]
  return (
    <div className="mt-5 flex items-end gap-1.5 h-14">
      {bars.map((h, i) => (
        <div key={i} className="flex-1 rounded-t-md bg-emerald-500/20 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 bg-emerald-500 rounded-t-md transition-all duration-700" style={{ height: `${h}%` }} />
        </div>
      ))}
    </div>
  )
}

function MiniBubbles() {
  return (
    <div className="mt-5 space-y-2">
      {[
        { msg: "🔔 Confirmação: Mariana Silva · amanhã 10h", out: false },
        { msg: "✅ Confirmado! Te esperamos.", out: true },
        { msg: "⭐ Como foi sua consulta? Avalie!", out: false },
      ].map((b, i) => (
        <div key={i} className={`flex ${b.out ? "justify-end" : "justify-start"}`}>
          <div className={`px-3 py-2 rounded-2xl text-[11px] font-medium max-w-[85%] ${b.out ? "bg-emerald-500 text-white" : "bg-surface-container border border-outline-variant/30 text-on-surface-variant"}`}>
            {b.msg}
          </div>
        </div>
      ))}
    </div>
  )
}

const small3 = [
  {
    icon: "group",
    iconColor: "bg-orange-100 text-orange-600",
    title: "Gestão de Equipe",
    desc: "Controle de acessos, metas de produtividade e agenda individual por profissional.",
  },
  {
    icon: "inventory_2",
    iconColor: "bg-sky-100 text-sky-600",
    title: "Estoque com NF-e",
    desc: "Controle por lote e validade FEFO, alertas automáticos e importação de NF-e.",
  },
  {
    icon: "api",
    iconColor: "bg-rose-100 text-rose-600",
    title: "API e Integrações",
    desc: "Stripe, Google Calendar, WhatsApp Business e API REST aberta para customizações.",
  },
]

export function FeaturesSection() {
  return (
    <section id="funcionalidades" className="py-24 lg:py-32 bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/8 text-primary text-xs font-bold px-4 py-2 rounded-full mb-5">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>category</span>
            12 módulos integrados
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-primary font-headline leading-tight mb-4">
            Tudo que sua clínica<br />precisa em um só lugar
          </h2>
          <p className="text-lg text-on-surface-variant">
            Cada módulo foi co-criado com dentistas para resolver os problemas reais da gestão clínica.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* 01 — Agenda (dark, large) */}
          <div className="md:col-span-2 surgical-gradient rounded-3xl p-8 relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-nc-secondary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white" style={{ fontSize: 24, fontVariationSettings: "'FILL' 1" }}>calendar_month</span>
                </div>
                <span className="text-6xl font-black text-white/5 font-headline leading-none select-none">01</span>
              </div>
              <h3 className="text-2xl font-extrabold text-white font-headline mb-2">Agenda Inteligente</h3>
              <p className="text-white/70 text-sm leading-relaxed max-w-sm">
                Visualização em dia, semana e mês. Múltiplos profissionais, drag & drop, confirmações via WhatsApp e sala de espera em tempo real.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {["Multi-profissional", "Drag & drop", "Confirmação automática", "Sala de espera"].map((f) => (
                  <span key={f} className="text-[11px] font-semibold bg-white/10 text-white/80 px-3 py-1 rounded-full">{f}</span>
                ))}
              </div>
              <MiniCalendar />
            </div>
          </div>

          {/* 02 — Prontuário */}
          <div className="bg-surface-container-lowest rounded-3xl p-7 border border-outline-variant/30 relative overflow-hidden group hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-violet-600" style={{ fontSize: 24, fontVariationSettings: "'FILL' 1" }}>description</span>
              </div>
              <span className="text-6xl font-black text-primary/5 font-headline leading-none select-none">02</span>
            </div>
            <h3 className="text-xl font-extrabold text-primary font-headline mb-2">Prontuário Digital</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Evoluções com assinatura eletrônica, odontograma FDI interativo e histórico completo por paciente.
            </p>
            <div className="mt-5 space-y-2 flex-1">
              {["Odontograma interativo FDI", "Assinatura eletrônica", "Receituário em PDF", "Histórico por dente"].map((f) => (
                <div key={f} className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <div className="w-4 h-4 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-violet-600" style={{ fontSize: 10, fontVariationSettings: "'FILL' 1" }}>check</span>
                  </div>
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* 03 — Financeiro */}
          <div className="bg-surface-container-lowest rounded-3xl p-7 border border-outline-variant/30 group hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-emerald-600" style={{ fontSize: 24, fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
              </div>
              <span className="text-6xl font-black text-primary/5 font-headline leading-none select-none">03</span>
            </div>
            <h3 className="text-xl font-extrabold text-primary font-headline mb-2">Financeiro Completo</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              DRE, fluxo de caixa, comissões automáticas e relatórios por procedimento em tempo real.
            </p>
            <MiniChart />
          </div>

          {/* 04 — Marketing (large) */}
          <div className="md:col-span-2 bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/30 group hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-rose-600" style={{ fontSize: 24, fontVariationSettings: "'FILL' 1" }}>mark_email_read</span>
              </div>
              <span className="text-6xl font-black text-primary/5 font-headline leading-none select-none">04</span>
            </div>
            <h3 className="text-xl font-extrabold text-primary font-headline mb-2">Marketing e Automação</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed max-w-lg">
              Campanhas de reativação, lembretes automáticos via WhatsApp e email, avaliações pós-consulta e gestão de leads — tudo integrado.
            </p>
            <MiniBubbles />
          </div>

          {/* Row 3: 3 small cards */}
          {small3.map((s) => (
            <div key={s.title} className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 group hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300">
              <div className={`w-10 h-10 rounded-2xl ${s.iconColor} flex items-center justify-center mb-4`}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
              </div>
              <h3 className="font-extrabold text-primary font-headline mb-2">{s.title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Link href="/recursos">
            <button className="btn-pill-arrow group inline-flex items-center gap-3 border-2 border-primary/20 text-primary font-bold px-8 py-3.5 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 font-headline">
              Ver todos os 12 módulos
              <span className="arrow-circle w-7 h-7 rounded-full bg-primary/8 flex items-center justify-center group-hover:bg-white/20">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
              </span>
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
