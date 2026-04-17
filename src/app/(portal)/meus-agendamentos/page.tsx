import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

const STATUS_LABELS: Record<string, string> = {
  scheduled:        "Agendado",
  confirmed:        "Confirmado",
  waiting_room:     "Na recepção",
  in_progress:      "Em atendimento",
  awaiting_payment: "Aguardando pagamento",
  completed:        "Concluído",
  cancelled:        "Cancelado",
  no_show:          "Não compareceu",
}

const STATUS_STYLES: Record<string, string> = {
  scheduled:        "bg-surface-container text-on-surface-variant border-outline-variant",
  confirmed:        "bg-blue-50 text-blue-700 border-blue-200",
  waiting_room:     "bg-amber-50 text-amber-700 border-amber-200",
  in_progress:      "bg-primary/10 text-primary border-primary/20",
  awaiting_payment: "bg-violet-50 text-violet-700 border-violet-200",
  completed:        "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled:        "bg-red-50 text-red-600 border-red-200",
  no_show:          "bg-red-50 text-red-600 border-red-200",
}

export default async function MeusAgendamentosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: patients } = await supabase
    .from("patients")
    .select("id, clinic_id, clinics(name)")
    .eq("email", user.email ?? "")

  if (!patients || patients.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="font-headline font-extrabold text-2xl text-primary">Meus Agendamentos</h1>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl py-16 text-center shadow-premium-sm">
          <span className="material-symbols-outlined text-outline mb-4 block" style={{ fontSize: 48 }}>calendar_month</span>
          <h3 className="font-semibold text-on-surface mb-1">Nenhum agendamento encontrado</h3>
          <p className="text-on-surface-variant text-sm mb-4">Seu email não está vinculado a nenhuma clínica ainda.</p>
          <Link href="/buscar" className="inline-flex items-center gap-2 text-sm px-4 py-2 surgical-gradient text-white rounded-xl font-semibold shadow-premium-sm hover:opacity-90 transition-opacity">
            Encontrar clínica
          </Link>
        </div>
      </div>
    )
  }

  const patientIds = patients.map((p) => p.id)

  const { data: appointments } = await supabase
    .from("appointments")
    .select("*, services(name), clinic_members(full_name, profiles(full_name)), clinics(name)")
    .in("patient_id", patientIds)
    .order("date", { ascending: false })
    .order("start_time", { ascending: false })
    .limit(50)

  const now = new Date()
  const upcoming = (appointments ?? []).filter((a) => new Date(a.date as string + "T23:59") >= now && a.status !== "cancelled")
  const past = (appointments ?? []).filter((a) => new Date(a.date as string + "T23:59") < now || a.status === "cancelled")

  const AppointmentCard = ({ a }: { a: typeof appointments extends (infer T)[] | null ? T : never }) => {
    if (!a) return null
    const service = a.services as { name: string } | null
    const member = a.clinic_members as { full_name: string | null; profiles: { full_name: string | null } | null } | null
    const clinic = a.clinics as { name: string } | null
    const memberName = member?.full_name ?? (member?.profiles as { full_name: string | null } | null)?.full_name ?? "Profissional"

    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 flex items-start gap-4 shadow-premium-sm">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>calendar_month</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <p className="font-semibold text-sm text-on-surface">{service?.name ?? "Consulta"}</p>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${STATUS_STYLES[a.status as string] ?? ""}`}>
              {STATUS_LABELS[a.status as string] ?? a.status}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-on-surface-variant flex-wrap">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>calendar_today</span>
              {new Date(a.date as string + "T12:00").toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short" })}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>schedule</span>
              {a.start_time as string}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>person</span>
              {memberName}
            </span>
          </div>
          {clinic && <p className="text-xs text-on-surface-variant mt-0.5">{clinic.name}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="font-headline font-extrabold text-2xl text-primary">Meus Agendamentos</h1>

      {upcoming.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3">Próximos</h2>
          <div className="space-y-3">
            {upcoming.map((a) => <AppointmentCard key={a.id as string} a={a} />)}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3">Anteriores</h2>
          <div className="space-y-3">
            {past.map((a) => <AppointmentCard key={a.id as string} a={a} />)}
          </div>
        </div>
      )}

      {upcoming.length === 0 && past.length === 0 && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl py-16 text-center shadow-premium-sm">
          <span className="material-symbols-outlined text-outline mb-4 block" style={{ fontSize: 48 }}>calendar_month</span>
          <h3 className="font-semibold text-on-surface mb-1">Nenhum agendamento</h3>
          <Link href="/buscar" className="inline-flex items-center gap-2 text-sm px-4 py-2 surgical-gradient text-white rounded-xl font-semibold shadow-premium-sm hover:opacity-90 transition-opacity mt-4">
            Agendar consulta
          </Link>
        </div>
      )}
    </div>
  )
}
