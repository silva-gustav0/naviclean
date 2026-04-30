import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

const quickActions = [
  { href: "/agenda", icon: "calendar_month", label: "Novo agendamento", description: "Marcar consulta" },
  { href: "/pacientes", icon: "person_add", label: "Novo paciente", description: "Cadastrar" },
  { href: "/financeiro", icon: "payments", label: "Lançamento", description: "Registrar receita" },
  { href: "/tratamentos", icon: "stethoscope", label: "Tratamentos", description: "Gerenciar serviços" },
  { href: "/equipe", icon: "groups", label: "Equipe", description: "Adicionar membro" },
  { href: "/treinamento", icon: "school", label: "Treinamento", description: "Aprender a usar" },
]

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return "Bom dia"
  if (h < 18) return "Boa tarde"
  return "Boa noite"
}

function getStatusColor(status: string) {
  switch (status) {
    case "confirmed": return "bg-emerald-100 text-emerald-700"
    case "pending": return "bg-nc-secondary/10 text-nc-secondary"
    case "cancelled": return "bg-red-50 text-red-600"
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
      .limit(4),
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

  const kpis = [
    {
      label: "Agendamentos Hoje",
      value: String(todayCount ?? 0),
      desc: todayCount ? `consulta${(todayCount ?? 0) !== 1 ? "s" : ""} agendada${(todayCount ?? 0) !== 1 ? "s" : ""}` : "Nenhum para hoje",
      icon: "calendar_month",
      badge: null,
    },
    {
      label: "Pacientes Ativos",
      value: String(patientsCount ?? 0),
      desc: (patientsCount ?? 0) === 0 ? "Cadastre o primeiro" : "pacientes cadastrados",
      icon: "groups",
      badge: null,
    },
    {
      label: "Receita do Mês",
      value: fmt(monthIncome),
      desc: "Movimentações do mês",
      icon: "payments",
      badge: null,
    },
    {
      label: "Trial Gratuito",
      value: "14 dias",
      desc: "Aproveite sem limites",
      icon: "star",
      badge: "Ativo",
    },
  ]

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
    <div className="space-y-6 w-full">
      {/* Hero banner */}
      <section className="relative rounded-2xl overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#0d3a6b] to-[#0a2d58] pointer-events-none" />
        <div className="relative z-10 px-8 py-7">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
            <div>
              <h2 className="font-headline font-extrabold text-3xl text-white">
                {greeting},{" "}
                <span className="text-nc-secondary">{firstName}.</span>
              </h2>
              <p className="text-white/50 text-sm mt-1 font-sans capitalize">
                Painel da {clinic.name} — {dateLabel}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href="/configuracoes"
                className="text-white/70 border border-white/20 px-3 py-1.5 rounded-lg text-xs font-semibold font-headline hover:bg-white/10 transition-colors"
              >
                Configurações
              </Link>
              <Link
                href="/agenda"
                className="bg-nc-secondary text-white px-4 py-1.5 rounded-lg text-xs font-bold font-headline flex items-center gap-1.5 hover:opacity-90 transition-opacity"
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                Nova Consulta
              </Link>
            </div>
          </div>

          {/* Inline KPIs no banner */}
          <div className="flex items-center gap-8 pt-5 border-t border-white/10 flex-wrap">
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-widest font-sans">Receita do Mês</p>
              <p className="text-white font-headline font-bold text-xl mt-0.5">{fmt(monthIncome)}</p>
            </div>
            <div className="w-px h-8 bg-white/20 hidden sm:block" />
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-widest font-sans">Pacientes Ativos</p>
              <p className="text-white font-headline font-bold text-xl mt-0.5">{patientsCount ?? 0}</p>
            </div>
            <div className="w-px h-8 bg-white/20 hidden sm:block" />
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-widest font-sans">Agendamentos Hoje</p>
              <p className="text-white font-headline font-bold text-xl mt-0.5">{todayCount ?? 0}</p>
            </div>
          </div>
        </div>
      </section>

      {/* KPI cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 rounded-2xl overflow-hidden shadow-sm">
        {kpis.map((s, i) => (
          <div
            key={s.label}
            className={`bg-card p-5 transition-colors duration-200 hover:bg-nc-secondary/5 cursor-default ${
              i < kpis.length - 1 ? "border-r border-outline-variant/20" : ""
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="p-2.5 bg-nc-secondary/10 rounded-xl">
                <span
                  className="material-symbols-outlined text-nc-secondary"
                  style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}
                >
                  {s.icon}
                </span>
              </div>
              {s.badge && (
                <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-xs font-bold font-sans">
                  {s.badge}
                </span>
              )}
            </div>
            <p className="text-outline text-[10px] font-bold uppercase tracking-widest font-sans">{s.label}</p>
            <h3 className="font-headline font-extrabold text-2xl text-primary mt-1">{s.value}</h3>
            <p className="text-on-surface-variant text-xs mt-1 font-sans">{s.desc}</p>
          </div>
        ))}
      </section>

      {/* Ações rápidas */}
      <section>
        <h3 className="font-headline font-bold text-sm text-primary mb-3 uppercase tracking-wide">Ações rápidas</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-0 rounded-2xl overflow-hidden shadow-sm">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="bg-card p-4 rounded-none flex flex-col items-center gap-2 hover:bg-nc-secondary/5 transition-colors duration-200 border-r border-outline-variant/20 last:border-r-0 group"
            >
              <span
                className="material-symbols-outlined text-nc-secondary group-hover:scale-110 transition-transform"
                style={{ fontSize: 22 }}
              >
                {action.icon}
              </span>
              <span className="text-xs font-bold text-primary text-center leading-tight font-headline">
                {action.label}
              </span>
              <span className="text-[10px] text-on-surface-variant text-center font-sans">{action.description}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Próximos atendimentos + Configure sua clínica */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Próximos atendimentos (2/3) */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-outline-variant/20 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/20">
            <h3 className="font-headline font-semibold text-primary text-sm">Próximos atendimentos</h3>
            <Link
              href="/agenda"
              className="text-xs text-nc-secondary font-semibold hover:underline underline-offset-2 font-sans"
            >
              Ver agenda completa
            </Link>
          </div>

          {upcoming.length > 0 ? (
            <div className="divide-y divide-outline-variant/20">
              {upcoming.map((apt) => {
                const patient = apt.patients
                const service = apt.services
                const member = apt.clinic_members
                return (
                  <div key={apt.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-container-low/50 transition-colors">
                    <div className="text-center shrink-0 w-12">
                      <p className="text-xs font-bold text-nc-secondary font-headline">{apt.start_time?.slice(0, 5)}</p>
                      <p className="text-[10px] text-on-surface-variant font-sans capitalize">
                        {new Date(apt.date + "T00:00:00").toLocaleDateString("pt-BR", { weekday: "short" })}
                      </p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-nc-secondary/10 flex items-center justify-center text-nc-secondary font-bold text-sm shrink-0 font-headline">
                      {(patient?.full_name?.[0] ?? "?").toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-primary truncate font-headline">
                        {patient?.full_name ?? "Paciente"}
                      </p>
                      <p className="text-xs text-on-surface-variant truncate font-sans">
                        {service?.name ?? "Consulta"}
                        {member?.full_name ? ` · ${member.full_name}` : ""}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 font-sans ${getStatusColor(apt.status)}`}
                    >
                      {getStatusLabel(apt.status)}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="py-10 text-center">
              <span
                className="material-symbols-outlined text-outline text-3xl"
                style={{ fontVariationSettings: "'FILL' 0" }}
              >
                calendar_today
              </span>
              <p className="text-on-surface-variant text-sm mt-2 font-sans">Nenhum agendamento próximo</p>
              <Link
                href="/agenda"
                className="mt-3 inline-block text-xs text-nc-secondary font-semibold hover:underline font-sans"
              >
                Agendar consulta
              </Link>
            </div>
          )}
        </div>

        {/* Configure sua clínica (1/3) */}
        <div className="bg-card rounded-2xl border border-outline-variant/20 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-outline-variant/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-headline font-semibold text-primary text-sm">Configure sua clínica</h3>
              <span className="text-[10px] text-on-surface-variant font-sans">
                {setupProgress}%
              </span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-nc-secondary transition-all duration-500"
                style={{ width: `${setupProgress}%` }}
              />
            </div>
            <p className="text-[10px] text-on-surface-variant mt-1.5 font-sans">
              Quase lá, doutor! {completedCount} de {setupSteps.length} concluídos
            </p>
          </div>
          <div className="divide-y divide-outline-variant/20">
            {setupSteps.map((step) => (
              <Link
                key={step.href}
                href={step.href}
                className={`flex items-center gap-3 px-4 py-3 transition-colors group ${
                  step.done ? "opacity-60" : "hover:bg-surface-container-low/50"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    step.done ? "bg-emerald-100" : "bg-nc-secondary/10"
                  }`}
                >
                  {step.done ? (
                    <span
                      className="material-symbols-outlined text-emerald-600"
                      style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}
                    >
                      check
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-nc-secondary" style={{ fontSize: 14 }}>
                      {step.icon}
                    </span>
                  )}
                </div>
                <p
                  className={`text-xs font-semibold font-headline flex-1 truncate ${
                    step.done ? "text-emerald-700 line-through" : "text-primary"
                  }`}
                >
                  {step.title}
                </p>
                {!step.done && (
                  <span
                    className="material-symbols-outlined text-outline/50 group-hover:text-nc-secondary transition-colors"
                    style={{ fontSize: 16 }}
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
