import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
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

  const kpis = [
    { label: "Atend. no mês", value: String(monthTotal), icon: "calendar_month", cls: "text-blue-600", bg: "bg-blue-50" },
    { label: "Concluídos", value: String(monthDone), icon: "check_circle", cls: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Comissão pend.", value: fmt((commissions ?? []).filter((c) => c.status === "pending").reduce((s, c) => s + Number(c.commission_amount), 0)), icon: "payments", cls: "text-nc-secondary", bg: "bg-nc-secondary/10" },
    { label: "Afiliação", value: member.affiliation === "independent" ? "Independente" : "Filiado", icon: "verified", cls: "text-primary", bg: "bg-primary/10" },
  ]

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/equipe" className="p-2 hover:bg-surface-container rounded-xl transition-colors">
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>arrow_back</span>
        </Link>
        <div>
          <h1 className="font-headline font-extrabold text-3xl text-primary">Perfil da equipe</h1>
        </div>
      </div>

      {/* Header card */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 flex items-start gap-5 shadow-premium-sm">
        <div className="w-16 h-16 rounded-2xl surgical-gradient flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-premium-sm">
          {initials}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h2 className="font-headline font-bold text-xl text-on-surface">{name}</h2>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${ROLE_COLORS[role] ?? "bg-surface-container text-on-surface-variant"}`}>
              {ROLE_LABELS[role] ?? role}
            </span>
            {!member.is_active && (
              <span className="text-xs text-red-500 font-medium bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">Inativo</span>
            )}
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-on-surface-variant">
            {email !== "—" && (
              <a href={`mailto:${email}`} className="flex items-center gap-1 hover:text-primary transition-colors">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>mail</span>
                {email}
              </a>
            )}
            {member.specialty && <span>· {member.specialty as string}</span>}
            {member.cro && (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-nc-secondary" style={{ fontSize: 14 }}>verified</span>
                CRO: {member.cro as string}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 shadow-premium-sm">
            <div className={`w-8 h-8 rounded-xl ${k.bg} flex items-center justify-center mb-2`}>
              <span className={`material-symbols-outlined ${k.cls}`} style={{ fontSize: 16 }}>{k.icon}</span>
            </div>
            <p className="font-headline font-bold text-lg text-on-surface">{k.value}</p>
            <p className="text-xs text-on-surface-variant">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Agendamentos do mês */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-premium-sm">
        <div className="px-5 py-4 border-b border-outline-variant bg-surface-container">
          <h2 className="font-semibold text-sm text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: 16 }}>calendar_month</span>
            Atendimentos este mês
          </h2>
        </div>
        {monthAppointments && monthAppointments.length > 0 ? (
          <div className="divide-y divide-outline-variant/50">
            {monthAppointments.map((a) => {
              const patient = a.patients as { full_name: string } | null
              const service = a.services as { name: string } | null
              return (
                <div key={a.id as string} className="flex items-center gap-4 px-5 py-3 hover:bg-surface-container transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-on-surface">{patient?.full_name ?? "—"}</p>
                    <p className="text-xs text-on-surface-variant">{service?.name ?? "—"} · {new Date(a.date as string).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${
                    a.status === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : a.status === "cancelled" ? "bg-red-50 text-red-600 border-red-200"
                    : "bg-blue-50 text-blue-700 border-blue-200"
                  }`}>
                    {a.status === "completed" ? "Concluído" : a.status === "cancelled" ? "Cancelado" : "Agendado"}
                  </span>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="py-10 text-center">
            <span className="material-symbols-outlined text-outline mb-2 block" style={{ fontSize: 32 }}>event_busy</span>
            <p className="text-sm text-on-surface-variant">Nenhum atendimento este mês</p>
          </div>
        )}
      </div>
    </div>
  )
}
