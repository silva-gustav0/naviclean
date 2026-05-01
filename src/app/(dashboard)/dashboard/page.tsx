import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

const quickActions = [
  { href: "/agenda", icon: "calendar_month", label: "Nova consulta" },
  { href: "/pacientes", icon: "person_add", label: "Novo paciente" },
  { href: "/financeiro", icon: "payments", label: "Lançamento" },
  { href: "/tratamentos", icon: "stethoscope", label: "Tratamentos" },
  { href: "/equipe", icon: "groups", label: "Equipe" },
  { href: "/treinamento", icon: "school", label: "Treinamento" },
]

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return "Bom dia"
  if (h < 18) return "Boa tarde"
  return "Boa noite"
}

function getStatusColor(status: string) {
  switch (status) {
    case "confirmed": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
    case "pending": return "bg-nc-secondary/10 text-nc-secondary"
    case "cancelled": return "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
    default: return "bg-surface-container text-on-surface-variant"
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "confirmed": return "Confirmado"
    case "pending": return "Pendente"
    case "cancelled": return "Cancelado"
    default: return "Agendado"
  }
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const [{ data: clinic }, { data: profile }] = await Promise.all([
    supabase.from("clinics").select("*").eq("owner_id", user.id).single(),
    supabase.from("profiles").select("full_name").eq("id", user.id).single(),
  ])

  if (!clinic) redirect("/onboarding")

  const fullName = (
    (profile?.full_name as string) ?? (user.user_metadata?.full_name as string) ?? ""
  ).trim()
  const firstName = fullName.split(" ")[0] || "Doutor(a)"
  const greeting = getGreeting()

  const today = new Date().toISOString().split("T")[0]
  const dateLabel = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
  const monthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59).toISOString()

  const [
    { count: horariosCount },
    { count: servicesCount },
    { count: membersCount },
    { count: patientsCount },
    { count: todayCount },
    { data: upcomingRaw },
    { data: monthIncomeTx },
  ] = await Promise.all([
    supabase.from("working_hours").select("*", { count: "exact", head: true }).eq("clinic_id", clinic.id),
    supabase.from("services").select("*", { count: "exact", head: true }).eq("clinic_id", clinic.id),
    supabase.from("clinic_members").select("*", { count: "exact", head: true }).eq("clinic_id", clinic.id),
    supabase.from("patients").select("*", { count: "exact", head: true }).eq("clinic_id", clinic.id),
    supabase.from("appointments").select("*", { count: "exact", head: true }).eq("clinic_id", clinic.id).eq("date", today),
    supabase
      .from("appointments")
      .select("id, date, start_time, status, patients(full_name), services(name), clinic_members(full_name)")
      .eq("clinic_id", clinic.id)
      .gte("date", today)
      .order("date")
      .order("start_time")
      .limit(5),
    supabase
      .from("transactions")
      .select("amount")
      .eq("clinic_id", clinic.id)
      .eq("type", "income")
      .gte("created_at", monthStart)
      .lte("created_at", monthEnd),
  ])

  const monthIncome = (monthIncomeTx ?? []).reduce((a, t) => a + Number(t.amount), 0)
  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  const setupSteps = [
    {
      href: "/configuracoes/horarios",
      icon: "schedule",
      title: "Configure os horários",
      description: "Defina quando sua clínica atende",
      done: (horariosCount ?? 0) > 0,
    },
    {
      href: "/tratamentos",
      icon: "stethoscope",
      title: "Adicione tratamentos",
      description: "Cadastre os serviços oferecidos",
      done: (servicesCount ?? 0) > 0,
    },
    {
      href: "/equipe",
      icon: "groups",
      title: "Cadastre sua equipe",
      description: "Adicione profissionais e recepcionistas",
      done: (membersCount ?? 0) > 0,
    },
    {
      href: "/pacientes",
      icon: "person_add",
      title: "Primeiro paciente",
      description: "Cadastre o primeiro paciente",
      done: (patientsCount ?? 0) > 0,
    },
  ]

  const completedCount = setupSteps.filter((s) => s.done).length
  const setupProgress = Math.round((completedCount / setupSteps.length) * 100)

  type UpcomingAppointment = {
    id: string
    date: string
    start_time: string
    status: string
    patients: { full_name: string } | null
    services: { name: string } | null
    clinic_members: { full_name: string } | null
  }

  const upcoming = (upcomingRaw ?? []) as UpcomingAppointment[]

  return (
    <div className="space-y-5 w-full">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className="relative rounded-2xl overflow-hidden"
        style={{ background: "linear-gradient(135deg, #001630 0%, #00244a 50%, #001a38 100%)" }}
      >
        {/* Subtle dot grid overlay */}
        <div className="absolute inset-0 bg-dot-grid opacity-[0.4] pointer-events-none" />

        <div className="relative z-10 px-7 py-8 flex items-end justify-between gap-6 flex-wrap">
          {/* Left: Greeting */}
          <div>
            <p className="text-white/40 text-[11px] uppercase tracking-[0.18em] font-sans mb-2 capitalize">
              {greeting} — {dateLabel}
            </p>
            <h1 className="font-headline font-black text-white leading-none" style={{ fontSize: "clamp(28px, 4vw, 42px)", letterSpacing: "-0.03em" }}>
              {firstName}
              <span className="text-nc-secondary">.</span>
            </h1>
            <p className="text-white/40 text-sm font-sans mt-2">{clinic.name as string}</p>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2 pb-1">
            <Link
              href="/configuracoes"
              className="text-white/55 border border-white/15 px-3.5 py-2 rounded-xl text-[12px] font-medium font-sans hover:bg-white/10 hover:text-white/80 transition-colors"
            >
              Configurações
            </Link>
            <Link
              href="/agenda"
              className="px-4 py-2 rounded-xl text-white text-[12px] font-semibold font-sans flex items-center gap-1.5 hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg, #c9943a 0%, #daa840 100%)" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>add</span>
              Nova Consulta
            </Link>
          </div>
        </div>
      </section>

      {/* ── KPI strip ────────────────────────────────────────── */}
      <section className="bg-card rounded-2xl overflow-hidden shadow-card">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 divide-x divide-outline-variant/15">
          {/* Featured: Receita do Mês */}
          <div className="p-5 lg:border-l-2 lg:border-l-nc-secondary/40">
            <p className="nc-section-label text-outline/70">Receita do Mês</p>
            <p className="nc-kpi-value text-primary mt-3 mb-1" style={{ fontSize: "1.7rem" }}>{fmt(monthIncome)}</p>
            <p className="text-[11px] text-on-surface-variant font-sans">Movimentações do mês</p>
          </div>

          <div className="p-5">
            <p className="nc-section-label text-outline/70">Agendamentos Hoje</p>
            <p className="nc-kpi-value text-primary mt-3 mb-1" style={{ fontSize: "1.7rem" }}>{todayCount ?? 0}</p>
            <p className="text-[11px] text-on-surface-variant font-sans">
              {(todayCount ?? 0) === 0 ? "Nenhum para hoje" : `consulta${(todayCount ?? 0) !== 1 ? "s" : ""} marcada${(todayCount ?? 0) !== 1 ? "s" : ""}`}
            </p>
          </div>

          <div className="p-5">
            <p className="nc-section-label text-outline/70">Pacientes Ativos</p>
            <p className="nc-kpi-value text-primary mt-3 mb-1" style={{ fontSize: "1.7rem" }}>{patientsCount ?? 0}</p>
            <p className="text-[11px] text-on-surface-variant font-sans">
              {(patientsCount ?? 0) === 0 ? "Cadastre o primeiro" : "pacientes cadastrados"}
            </p>
          </div>

          <div className="p-5">
            <p className="nc-section-label text-outline/70">Trial Gratuito</p>
            <p className="nc-kpi-value text-primary mt-3 mb-1" style={{ fontSize: "1.7rem" }}>14 dias</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="nc-stat-chip bg-emerald-100 text-emerald-700">Ativo</span>
              <span className="text-[11px] text-on-surface-variant font-sans">sem limites</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ações rápidas ────────────────────────────────────── */}
      <section>
        <p className="nc-section-label text-outline/60 mb-3 px-0.5">Ações rápidas</p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="bg-card rounded-xl px-3 py-4 flex flex-col items-center gap-2.5 hover:bg-surface-container-low transition-colors shadow-card group"
            >
              <span
                className="material-symbols-outlined text-nc-secondary/70 group-hover:text-nc-secondary transition-colors"
                style={{ fontSize: 20, fontVariationSettings: "'FILL' 0" }}
              >
                {action.icon}
              </span>
              <span className="text-[11px] font-semibold text-primary/80 text-center leading-tight font-sans">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Próximos atendimentos + Configure ────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Próximos atendimentos (2/3) */}
        <div className="lg:col-span-2 bg-card rounded-2xl overflow-hidden shadow-card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/15">
            <div>
              <h3 className="font-sans font-semibold text-[14px] text-primary">Próximos atendimentos</h3>
            </div>
            <Link
              href="/agenda"
              className="text-[12px] text-nc-secondary font-semibold font-sans hover:opacity-75 transition-opacity"
            >
              Ver agenda →
            </Link>
          </div>

          {upcoming.length > 0 ? (
            <div>
              {upcoming.map((apt, idx) => {
                const patient = apt.patients
                const service = apt.services
                const member = apt.clinic_members
                const initials = (patient?.full_name ?? "?").split(" ").slice(0, 2).map((n: string) => n[0]).join("").toUpperCase()
                return (
                  <div
                    key={apt.id}
                    className={`flex items-center gap-4 px-5 py-3.5 hover:bg-surface-container-low/40 transition-colors ${idx < upcoming.length - 1 ? "border-b border-outline-variant/10" : ""}`}
                  >
                    <div className="text-center shrink-0 w-11">
                      <p className="text-[13px] font-bold text-nc-secondary font-headline tabular-nums">{apt.start_time?.slice(0, 5)}</p>
                      <p className="text-[10px] text-outline/60 font-sans capitalize">
                        {new Date(apt.date + "T00:00:00").toLocaleDateString("pt-BR", { weekday: "short" })}
                      </p>
                    </div>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0 font-headline"
                      style={{ background: "linear-gradient(135deg, #00244a 0%, #0d3a6b 100%)" }}
                    >
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[13px] text-primary truncate font-sans">
                        {patient?.full_name ?? "Paciente"}
                      </p>
                      <p className="text-[11px] text-on-surface-variant truncate font-sans">
                        {service?.name ?? "Consulta"}
                        {member?.full_name ? ` · ${member.full_name}` : ""}
                      </p>
                    </div>
                    <span className={`nc-stat-chip shrink-0 ${getStatusColor(apt.status)}`}>
                      {getStatusLabel(apt.status)}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="py-12 text-center">
              <span
                className="material-symbols-outlined text-outline/30 mb-3 block"
                style={{ fontSize: 32, fontVariationSettings: "'FILL' 0" }}
              >
                calendar_today
              </span>
              <p className="text-on-surface-variant text-[13px] font-sans">Nenhum agendamento próximo</p>
              <Link
                href="/agenda"
                className="mt-3 inline-block text-[12px] text-nc-secondary font-semibold font-sans hover:opacity-75 transition-opacity"
              >
                Agendar consulta →
              </Link>
            </div>
          )}
        </div>

        {/* Configure sua clínica (1/3) */}
        <div className="bg-card rounded-2xl overflow-hidden shadow-card">
          <div className="px-5 py-4 border-b border-outline-variant/15">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-sans font-semibold text-[14px] text-primary">Configure a clínica</h3>
              <span className="text-[11px] text-on-surface-variant font-sans tabular-nums">
                {completedCount}/{setupSteps.length}
              </span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-1">
              <div
                className="h-1 rounded-full transition-all duration-500"
                style={{ width: `${setupProgress}%`, background: "linear-gradient(90deg, #c9943a 0%, #daa840 100%)" }}
              />
            </div>
          </div>
          <div>
            {setupSteps.map((step, idx) => (
              <Link
                key={step.href}
                href={step.href}
                className={`flex items-center gap-3 px-5 py-3.5 transition-colors group ${step.done ? "opacity-50 pointer-events-none" : "hover:bg-surface-container-low/40"} ${idx < setupSteps.length - 1 ? "border-b border-outline-variant/10" : ""}`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${step.done ? "bg-emerald-100 dark:bg-emerald-900/40" : "bg-surface-container-high"}`}
                >
                  {step.done ? (
                    <span
                      className="material-symbols-outlined text-emerald-600 dark:text-emerald-400"
                      style={{ fontSize: 12, fontVariationSettings: "'FILL' 1" }}
                    >
                      check
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-outline/50" style={{ fontSize: 12 }}>
                      {step.icon}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[12px] font-semibold font-sans truncate ${step.done ? "text-emerald-700 line-through" : "text-primary"}`}>
                    {step.title}
                  </p>
                  <p className="text-[10px] text-on-surface-variant font-sans truncate">{step.description}</p>
                </div>
                {!step.done && (
                  <span
                    className="material-symbols-outlined text-outline/30 group-hover:text-nc-secondary group-hover:translate-x-0.5 transition-all"
                    style={{ fontSize: 14 }}
                  >
                    arrow_forward
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
