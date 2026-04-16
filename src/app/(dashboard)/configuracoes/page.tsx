import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Clock, Building2, Bell, Shield, CreditCard, ChevronRight, User, Heart, Tag, Percent, ScrollText } from "lucide-react"

const settingsSections = [
  {
    icon: Building2,
    label: "Informações da Clínica",
    description: "Nome, slug, telefone e localização",
    href: "/configuracoes/clinica",
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950",
  },
  {
    icon: Clock,
    label: "Horários de Atendimento",
    description: "Defina os dias e horários que você atende",
    href: "/configuracoes/horarios",
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950",
  },
  {
    icon: Heart,
    label: "Convênios",
    description: "Planos e convênios aceitos pela clínica",
    href: "/configuracoes/convenios",
    color: "text-rose-600",
    bg: "bg-rose-50 dark:bg-rose-950",
  },
  {
    icon: Tag,
    label: "Tabelas de Preço",
    description: "Particular, convênios e preços por serviço",
    href: "/configuracoes/tabelas-preco",
    color: "text-cyan-600",
    bg: "bg-cyan-50 dark:bg-cyan-950",
  },
  {
    icon: Percent,
    label: "Comissões e Split",
    description: "Regras de comissão e custos diretos",
    href: "/configuracoes/comissoes",
    color: "text-violet-600",
    bg: "bg-violet-50 dark:bg-violet-950",
  },
  {
    icon: User,
    label: "Meu Perfil",
    description: "Nome, foto e dados pessoais",
    href: "/configuracoes/perfil",
    color: "text-indigo-600",
    bg: "bg-indigo-50 dark:bg-indigo-950",
  },
  {
    icon: Bell,
    label: "Notificações",
    description: "WhatsApp, email e lembretes automáticos",
    href: "/configuracoes/notificacoes",
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950",
  },
  {
    icon: CreditCard,
    label: "Plano e Cobrança",
    description: "Seu plano atual, faturas e pagamento",
    href: "/configuracoes/plano",
    color: "text-pink-600",
    bg: "bg-pink-50 dark:bg-pink-950",
  },
  {
    icon: Shield,
    label: "Segurança",
    description: "Senha e autenticação em dois fatores",
    href: "/configuracoes/seguranca",
    color: "text-slate-600",
    bg: "bg-slate-50 dark:bg-slate-800",
  },
  {
    icon: ScrollText,
    label: "Auditoria LGPD",
    description: "Log de acessos e modificações sensíveis",
    href: "/configuracoes/auditoria",
    color: "text-orange-600",
    bg: "bg-orange-50 dark:bg-orange-950",
  },
]

export default async function ConfiguracoesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase.from("clinics").select("*").eq("owner_id", user.id).single()
  if (!clinic) redirect("/onboarding")

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground text-sm">Gerencie sua clínica e preferências</p>
      </div>

      {/* Clinic overview */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-2xl font-bold shrink-0">
          {(clinic.name as string)?.[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-lg leading-tight">{clinic.name as string}</p>
          <p className="text-slate-400 text-sm">naviclin.com/c/{clinic.slug as string}</p>
          <p className="text-slate-400 text-xs mt-0.5">{clinic.address_city as string}, {clinic.address_state as string}</p>
        </div>
        <Link href="/configuracoes/clinica" className="text-xs text-blue-300 hover:text-blue-200 font-medium shrink-0">
          Editar
        </Link>
      </div>

      {/* Settings grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {settingsSections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group bg-white dark:bg-slate-900 border rounded-2xl p-5 flex items-center gap-4 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-sm transition-all"
          >
            <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{s.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{s.description}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  )
}
