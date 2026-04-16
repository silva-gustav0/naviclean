import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import {
  Calendar,
  Users,
  DollarSign,
  Clock,
  ArrowRight,
  UserCog,
  Stethoscope,
  Settings,
  Megaphone,
  TrendingUp,
  Star,
  Zap,
} from "lucide-react"

const quickActions = [
  {
    href: "/agenda",
    icon: Calendar,
    label: "Novo Agendamento",
    description: "Marcar consulta",
    gradient: "from-blue-500 to-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950",
    iconColor: "text-blue-600",
  },
  {
    href: "/pacientes",
    icon: Users,
    label: "Novo Paciente",
    description: "Cadastrar paciente",
    gradient: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950",
    iconColor: "text-emerald-600",
  },
  {
    href: "/financeiro",
    icon: DollarSign,
    label: "Lançamento",
    description: "Registrar receita",
    gradient: "from-amber-500 to-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950",
    iconColor: "text-amber-600",
  },
  {
    href: "/tratamentos",
    icon: Stethoscope,
    label: "Tratamentos",
    description: "Gerenciar serviços",
    gradient: "from-cyan-500 to-cyan-600",
    bg: "bg-cyan-50 dark:bg-cyan-950",
    iconColor: "text-cyan-600",
  },
  {
    href: "/equipe",
    icon: UserCog,
    label: "Equipe",
    description: "Adicionar dentista",
    gradient: "from-pink-500 to-pink-600",
    bg: "bg-pink-50 dark:bg-pink-950",
    iconColor: "text-pink-600",
  },
  {
    href: "/marketing",
    icon: Megaphone,
    label: "Marketing",
    description: "Atrair pacientes",
    gradient: "from-orange-500 to-orange-600",
    bg: "bg-orange-50 dark:bg-orange-950",
    iconColor: "text-orange-600",
  },
]

const setupSteps = [
  {
    done: false,
    href: "/configuracoes/horarios",
    icon: Clock,
    title: "Configure os horários",
    description: "Defina quando sua clínica atende",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    done: false,
    href: "/tratamentos",
    icon: Stethoscope,
    title: "Adicione tratamentos",
    description: "Cadastre os serviços oferecidos",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
  },
  {
    done: false,
    href: "/equipe",
    icon: UserCog,
    title: "Cadastre sua equipe",
    description: "Adicione dentistas e recepcionistas",
    color: "text-pink-600",
    bg: "bg-pink-50",
  },
  {
    done: false,
    href: "/pacientes",
    icon: Users,
    title: "Primeiro paciente",
    description: "Cadastre o primeiro paciente",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
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
    {
      label: "Agendamentos Hoje",
      value: "0",
      desc: "Nenhum para hoje",
      icon: Calendar,
      gradient: "from-blue-500 to-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/50",
      iconBg: "bg-blue-100 dark:bg-blue-900",
      iconColor: "text-blue-600",
      trend: null,
    },
    {
      label: "Pacientes Ativos",
      value: "0",
      desc: "Cadastre o primeiro",
      icon: Users,
      gradient: "from-emerald-500 to-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/50",
      iconBg: "bg-emerald-100 dark:bg-emerald-900",
      iconColor: "text-emerald-600",
      trend: null,
    },
    {
      label: "Receita do Mês",
      value: "R$ 0",
      desc: "Sem movimentações",
      icon: DollarSign,
      gradient: "from-amber-500 to-amber-600",
      bg: "bg-amber-50 dark:bg-amber-950/50",
      iconBg: "bg-amber-100 dark:bg-amber-900",
      iconColor: "text-amber-600",
      trend: null,
    },
    {
      label: "Trial Gratuito",
      value: "14 dias",
      desc: "Aproveite sem limites",
      icon: Star,
      gradient: "from-violet-500 to-violet-600",
      bg: "bg-violet-50 dark:bg-violet-950/50",
      iconBg: "bg-violet-100 dark:bg-violet-900",
      iconColor: "text-violet-600",
      trend: null,
    },
  ]

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-violet-700 p-6 text-white shadow-lg">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-4 w-4 text-yellow-300" />
            <span className="text-blue-200 text-sm font-medium">Trial gratuito ativo</span>
          </div>
          <h1 className="text-2xl font-bold mb-1">Olá, {firstName}! 👋</h1>
          <p className="text-blue-200 text-sm">Bem-vindo ao painel da <strong className="text-white">{clinic.name}</strong></p>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10">
          <TrendingUp className="h-32 w-32" />
        </div>
        {/* decorative circles */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-12 right-20 w-32 h-32 rounded-full bg-white/5" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-2xl border-0 ${s.bg} p-5 space-y-3`}>
            <div className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center`}>
              <s.icon className={`h-5 w-5 ${s.iconColor}`} />
            </div>
            <div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-sm font-medium text-foreground/80">{s.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
          <Zap className="h-4 w-4 text-blue-600" />
          Ações rápidas
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`group flex flex-col items-center gap-3 p-4 rounded-2xl ${action.bg} hover:shadow-md transition-all hover:-translate-y-0.5 border border-transparent hover:border-white/50`}
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-foreground leading-tight">{action.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Setup checklist */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <Settings className="h-4 w-4 text-slate-500" />
            Configure sua clínica
          </h2>
          <span className="text-xs text-muted-foreground bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">0 de {setupSteps.length} concluído</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {setupSteps.map((step) => (
            <Link
              key={step.href}
              href={step.href}
              className="group flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-sm transition-all"
            >
              <div className={`w-10 h-10 rounded-xl ${step.bg} flex items-center justify-center shrink-0`}>
                <step.icon className={`h-5 w-5 ${step.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
