import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

const quickActions = [
  { href: "/agenda", icon: "calendar_month", label: "Novo Agendamento", description: "Marcar consulta" },
  { href: "/pacientes", icon: "person_add", label: "Novo Paciente", description: "Cadastrar paciente" },
  { href: "/financeiro", icon: "payments", label: "Lançamento", description: "Registrar receita" },
  { href: "/tratamentos", icon: "stethoscope", label: "Tratamentos", description: "Gerenciar serviços" },
  { href: "/equipe", icon: "groups", label: "Equipe", description: "Adicionar membro" },
  { href: "/marketing", icon: "campaign", label: "Marketing", description: "Atrair pacientes" },
]

const setupSteps = [
  { href: "/configuracoes/horarios", icon: "schedule", title: "Configure os horários", description: "Defina quando sua clínica atende" },
  { href: "/tratamentos", icon: "stethoscope", title: "Adicione tratamentos", description: "Cadastre os serviços oferecidos" },
  { href: "/equipe", icon: "groups", title: "Cadastre sua equipe", description: "Adicione dentistas e recepcionistas" },
  { href: "/pacientes", icon: "person_add", title: "Primeiro paciente", description: "Cadastre o primeiro paciente" },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: clinic } = await supabase
    .from("clinics")
    .select("*")
    .eq("owner_id", user.id)
    .single()

  if (!clinic) redirect("/onboarding")

  const firstName = ((user.user_metadata?.full_name as string) ?? "").split(" ")[0] || "Doutor(a)"

  const stats = [
    { label: "Agendamentos Hoje", value: "0", desc: "Nenhum para hoje", icon: "calendar_month", badge: null },
    { label: "Pacientes Ativos", value: "0", desc: "Cadastre o primeiro", icon: "groups", badge: null },
    { label: "Receita do Mês", value: "R$ 0", desc: "Sem movimentações", icon: "payments", badge: null },
    { label: "Trial Gratuito", value: "14 dias", desc: "Aproveite sem limites", icon: "star", badge: "Ativo" },
  ]

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Saudação */}
      <section className="flex justify-between items-end">
        <div>
          <h2 className="font-headline font-extrabold text-4xl text-primary tracking-tight">
            Bom dia, {firstName}
          </h2>
          <p className="text-on-surface-variant mt-1 font-sans">
            Bem-vindo ao painel da <strong className="text-primary">{clinic.name}</strong>
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/configuracoes"
            className="bg-surface-container-low text-primary px-4 py-2 rounded-lg font-headline font-semibold text-sm hover:bg-surface-container-high transition-colors"
          >
            Configurações
          </Link>
          <Link
            href="/agenda"
            className="surgical-gradient text-white px-4 py-2 rounded-lg font-headline font-semibold text-sm shadow-premium-sm"
          >
            Nova Consulta
          </Link>
        </div>
      </section>

      {/* KPIs */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-surface-container-lowest p-6 rounded-2xl shadow-premium border border-outline-variant/10"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-nc-secondary/10 rounded-xl">
                <span className="material-symbols-outlined text-nc-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {s.icon}
                </span>
              </div>
              {s.badge && (
                <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-bold">
                  {s.badge}
                </span>
              )}
            </div>
            <p className="text-outline text-xs font-bold uppercase tracking-widest">{s.label}</p>
            <h3 className="font-headline font-extrabold text-3xl text-primary mt-1">{s.value}</h3>
            <p className="text-on-surface-variant text-xs mt-1">{s.desc}</p>
          </div>
        ))}
      </section>

      {/* Ações rápidas */}
      <section>
        <h3 className="font-headline font-bold text-xl text-primary mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="bg-surface-container-lowest p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-surface-container-low transition-colors shadow-premium-sm border border-outline-variant/10 group"
            >
              <span className="material-symbols-outlined text-nc-secondary group-hover:scale-110 transition-transform">
                {action.icon}
              </span>
              <span className="text-xs font-bold text-primary text-center leading-tight">{action.label}</span>
              <span className="text-[10px] text-on-surface-variant text-center">{action.description}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Setup */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-headline font-bold text-xl text-primary">Configure sua clínica</h3>
          <span className="text-xs text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-full font-sans">
            0 de {setupSteps.length} concluído
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {setupSteps.map((step) => (
            <Link
              key={step.href}
              href={step.href}
              className="group flex items-center gap-4 p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/10 hover:border-nc-secondary/30 hover:shadow-premium-sm transition-all"
            >
              <div className="p-3 bg-nc-secondary/10 rounded-xl shrink-0">
                <span className="material-symbols-outlined text-nc-secondary">{step.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-primary">{step.title}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">{step.description}</p>
              </div>
              <span className="material-symbols-outlined text-outline group-hover:text-nc-secondary group-hover:translate-x-0.5 transition-all">
                arrow_forward
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Suporte */}
      <section className="surgical-gradient p-6 rounded-2xl text-white relative overflow-hidden">
        <div className="relative z-10">
          <h4 className="font-headline font-bold text-lg">Precisa de ajuda?</h4>
          <p className="text-xs text-on-primary-container mt-2">
            Conecte-se com nosso suporte dedicado para configurar sua clínica.
          </p>
          <a
            href="mailto:suporte@naviclin.com"
            className="mt-4 inline-block bg-white text-primary px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-surface-container-low transition-colors"
          >
            Falar com Suporte
          </a>
        </div>
        <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-white/10" style={{ fontSize: 120 }}>
          support_agent
        </span>
      </section>
    </div>
  )
}
