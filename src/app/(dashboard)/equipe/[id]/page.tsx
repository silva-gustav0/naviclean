import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { ArrowLeft, Calendar, DollarSign, BadgeCheck, Mail } from "lucide-react"
import Link from "next/link"
import { ROLE_LABELS, ROLE_COLORS } from "../page"

interface Props {
  params: Promise<{ id: string }>
}

export default async function MembroDetalhe({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase.from("clinics").select("id").eq("owner_id", user.id).single()
  if (!clinic) redirect("/onboarding")

  const { data: member } = await supabase
    .from("clinic_members")
    .select("*, profiles(full_name, email, avatar_url)")
    .eq("id", id)
    .eq("clinic_id", clinic.id)
    .single()

  if (!member) notFound()

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const [{ data: monthAppointments }, { data: commissions }] = await Promise.all([
    supabase
      .from("appointments")
      .select("id, date, status, patients(full_name), services(name)")
      .eq("dentist_id", id)
      .gte("date", monthStart.split("T")[0])
      .order("date", { ascending: false })
      .limit(20),
    supabase
      .from("commissions")
      .select("commission_amount, status, created_at")
      .eq("member_id", id)
      .order("created_at", { ascending: false })
      .limit(5),
  ])

  const profile = member.profiles as { full_name?: string; email?: string } | null
  const name = (member.full_name ?? profile?.full_name) ?? "Sem nome"
  const email = profile?.email ?? "—"
  const initials = name.split(" ").slice(0, 2).map((n: string) => n[0]).join("").toUpperCase()
  const role = member.role as string

  const monthDone = (monthAppointments ?? []).filter((a) => a.status === "completed").length
  const monthTotal = monthAppointments?.length ?? 0

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/equipe" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold">Perfil da equipe</h1>
      </div>

      {/* Header card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border p-6 flex items-start gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0D3A6B] to-[#1A5599] flex items-center justify-center text-white text-xl font-bold shrink-0">
          {initials}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h2 className="text-xl font-bold">{name}</h2>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[role] ?? "bg-slate-100 text-slate-600"}`}>
              {ROLE_LABELS[role] ?? role}
            </span>
            {!member.is_active && <span className="text-xs text-red-500 font-medium">Inativo</span>}
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            {email !== "—" && (
              <a href={`mailto:${email}`} className="flex items-center gap-1 hover:text-foreground transition-colors">
                <Mail className="h-3.5 w-3.5" />
                {email}
              </a>
            )}
            {member.specialty && <span>· {member.specialty as string}</span>}
            {member.cro && (
              <span className="flex items-center gap-1">
                <BadgeCheck className="h-3.5 w-3.5" />
                CRO: {member.cro as string}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* KPIs do mês */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Atend. no mês", value: String(monthTotal), icon: Calendar, color: "bg-blue-50 text-blue-600" },
          { label: "Concluídos", value: String(monthDone), icon: BadgeCheck, color: "bg-emerald-50 text-emerald-600" },
          { label: "Comissão pend.", value: fmt((commissions ?? []).filter((c) => c.status === "pending").reduce((s, c) => s + Number(c.commission_amount), 0)), icon: DollarSign, color: "bg-amber-50 text-amber-600" },
          { label: "Afiliação", value: member.affiliation === "independent" ? "Independente" : "Filiado", icon: BadgeCheck, color: "bg-violet-50 text-violet-600" },
        ].map((k) => (
          <div key={k.label} className="bg-white dark:bg-slate-900 border rounded-2xl p-4">
            <div className={`w-8 h-8 rounded-xl ${k.color} flex items-center justify-center mb-2`}>
              <k.icon className="h-4 w-4" />
            </div>
            <p className="text-lg font-bold">{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Agendamentos do mês */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h2 className="font-semibold text-sm">Atendimentos este mês</h2>
        </div>
        {monthAppointments && monthAppointments.length > 0 ? (
          <div className="divide-y">
            {monthAppointments.map((a) => {
              const patient = a.patients as { full_name: string } | null
              const service = a.services as { name: string } | null
              return (
                <div key={a.id as string} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{patient?.full_name ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">{service?.name ?? "—"} · {new Date(a.date as string).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    a.status === "completed" ? "bg-emerald-100 text-emerald-700"
                    : a.status === "cancelled" ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                  }`}>
                    {a.status === "completed" ? "Concluído" : a.status === "cancelled" ? "Cancelado" : "Agendado"}
                  </span>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="py-10 text-center">
            <p className="text-sm text-muted-foreground">Nenhum atendimento este mês</p>
          </div>
        )}
      </div>
    </div>
  )
}
