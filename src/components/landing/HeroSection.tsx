import Link from "next/link"

export function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20 lg:pt-40 lg:pb-28 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      {/* Text */}
      <div className="space-y-8">
        <div className="inline-flex items-center gap-2 bg-nc-secondary/10 text-nc-secondary text-xs font-bold px-4 py-2 rounded-full border border-nc-secondary/20 font-sans">
          <span className="w-2 h-2 bg-nc-secondary rounded-full animate-pulse" />
          14 dias grátis · Sem cartão de crédito
        </div>

        <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-primary leading-[1.1] font-headline">
          O software que transforma sua clínica em um{" "}
          <span className="text-nc-secondary">negócio de verdade</span>
        </h1>

        <p className="text-lg text-on-surface-variant leading-relaxed max-w-lg font-sans">
          A plataforma definitiva para dentistas de alta performance. Agendamento online,
          prontuário digital e controle financeiro em uma interface de precisão clínica.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/cadastro">
            <button className="px-8 py-4 rounded-xl font-bold text-white text-lg shadow-premium hover:opacity-90 active:scale-[0.98] transition-all duration-200 surgical-gradient font-headline">
              Começar 14 dias grátis
            </button>
          </Link>
          <Link href="#planos">
            <button className="px-8 py-4 rounded-xl font-bold text-primary text-lg border-2 border-primary/20 hover:bg-surface-container-low active:scale-[0.98] transition-all duration-200 font-headline">
              Ver planos
            </button>
          </Link>
        </div>

        <div className="flex items-center gap-6 pt-2">
          <div className="flex -space-x-2">
            {["AP", "RM", "CS", "FA"].map((initials, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-full border-2 border-surface flex items-center justify-center text-white text-[10px] font-bold surgical-gradient"
              >
                {initials}
              </div>
            ))}
          </div>
          <p className="text-sm text-on-surface-variant font-sans">
            <span className="font-bold text-primary">+500 dentistas</span> já usam o NaviClin
          </p>
        </div>
      </div>

      {/* Visual mockup */}
      <div className="relative">
        <div className="absolute -inset-6 bg-primary/5 rounded-[2.5rem] blur-3xl" />
        <div className="relative bg-surface-container-lowest rounded-2xl shadow-premium border border-outline-variant/10 overflow-hidden">
          {/* Fake dashboard header */}
          <div className="surgical-gradient px-6 py-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                dashboard
              </span>
            </div>
            <span className="text-white font-headline font-bold">NaviClin — Dashboard</span>
            <div className="ml-auto flex gap-1.5">
              {["bg-white/20", "bg-white/20", "bg-white/20"].map((cls, i) => (
                <div key={i} className={`w-3 h-3 rounded-full ${cls}`} />
              ))}
            </div>
          </div>

          {/* Fake KPI row */}
          <div className="p-6 grid grid-cols-2 gap-4">
            {[
              { icon: "calendar_month", label: "Agendamentos Hoje", value: "24", color: "text-nc-secondary" },
              { icon: "groups", label: "Pacientes Ativos", value: "348", color: "text-primary" },
              { icon: "payments", label: "Receita do Mês", value: "R$ 28.4k", color: "text-emerald-600" },
              { icon: "trending_up", label: "Taxa de Retorno", value: "87%", color: "text-primary" },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">
                <span className={`material-symbols-outlined text-2xl ${kpi.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                  {kpi.icon}
                </span>
                <p className="text-outline text-[10px] font-bold uppercase tracking-widest mt-2 font-sans">{kpi.label}</p>
                <p className="text-primary font-headline font-extrabold text-2xl mt-1">{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Fake agenda list */}
          <div className="px-6 pb-6 space-y-2">
            {[
              { time: "09:00", name: "Dra. Ana Paula", proc: "Implante", status: "Confirmado" },
              { time: "10:30", name: "Carlos Eduardo", proc: "Clareamento", status: "Aguardando" },
              { time: "11:15", name: "Mariana Silva", proc: "Ortodontia", status: "Confirmado" },
            ].map((item) => (
              <div key={item.time} className="flex items-center gap-3 py-2.5 px-3 rounded-lg bg-surface-container-low border border-outline-variant/10">
                <span className="text-xs font-bold text-nc-secondary font-sans w-10">{item.time}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-primary truncate font-headline">{item.name}</p>
                  <p className="text-[10px] text-on-surface-variant font-sans">{item.proc}</p>
                </div>
                <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded font-sans ${
                  item.status === "Confirmado" ? "bg-emerald-50 text-emerald-700" : "bg-nc-secondary/10 text-nc-secondary"
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
