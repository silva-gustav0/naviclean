import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

const STATUS_COLORS: Record<string, string> = {
  scheduled: "bg-blue-50 text-blue-700 border-blue-200",
  confirmed:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  completed:  "bg-surface-container text-on-surface-variant border-outline-variant",
  cancelled:  "bg-red-50 text-red-700 border-red-200",
  no_show:    "bg-amber-50 text-amber-700 border-amber-200",
}
const STATUS_LABELS: Record<string, string> = {
  scheduled: "Agendado",
  confirmed: "Confirmado",
  completed: "Concluído",
  cancelled: "Cancelado",
  no_show:   "Faltou",
}

export default async function PacienteAgendamentosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/paciente/login")

  const { data: patient } = await supabase.from("patients").select("id").eq("user_id", user.id).single()
  const patientId = patient?.id ?? ""
  const today = new Date().toISOString().split("T")[0]

  const [{ data: upcoming }, { data: past }] = await Promise.all([
    supabase
      .from("appointments")
      .select("id, date, start_time, status, clinics(name, slug, address_street, address_city), services(name), clinic_members(full_name)")
      .eq("patient_id", patientId)
      .gte("date", today)
      .order("date"),
    supabase
      .from("appointments")
      .select("id, date, start_time, status, clinics(name), services(name), clinic_members(full_name)")
      .eq("patient_id", patientId)
      .lt("date", today)
      .order("date", { ascending: false })
      .limit(20),
  ])

  type Appt = { id: string; date: string; start_time: string; status: string | null; clinics: unknown; services: { name: string } | null; clinic_members: { full_name: string } | null }

  function ApptCard({ a, past: isPast }: { a: Appt; past?: boolean }) {
    const clinic = a.clinics as { name: string; slug?: string; address_street?: string; address_city?: string } | null
    const service = a.services as { name: string } | null
    const member = a.clinic_members as { full_name: string } | null
    return (
      <div className="flex items-start gap-4 p-4 bg-surface-container-lowest border border-outline-variant rounded-2xl hover:shadow-premium-sm transition-all">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isPast ? "bg-surface-container" : "bg-primary/10"}`}>
          <span className={`material-symbols-outlined ${isPast ? "text-on-surface-variant" : "text-primary"}`} style={{ fontSize: 20 }}>calendar_month</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <p className="font-semibold text-sm text-on-surface">{service?.name ?? "Consulta"}</p>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${STATUS_COLORS[a.status as string] ?? "bg-surface-container text-on-surface-variant border-outline-variant"}`}>
              {STATUS_LABELS[a.status as string] ?? a.status}
            </span>
          </div>
          <p className="text-sm text-on-surface-variant">{clinic?.name}</p>
          {member?.full_name && <p className="text-xs text-on-surface-variant">Dr(a). {member.full_name}</p>}
          {clinic?.address_city && (
            <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>location_on</span>
              {clinic.address_street}{clinic.address_city ? `, ${clinic.address_city}` : ""}
            </p>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-semibold text-on-surface">{new Date(a.date as string).toLocaleDateString("pt-BR", { day: "numeric", month: "short" })}</p>
          <p className="text-xs text-on-surface-variant">{a.start_time as string}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="font-headline font-extrabold text-2xl text-primary">Meus Agendamentos</h1>

      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Próximos</h2>
        {upcoming && upcoming.length > 0 ? (
          upcoming.map((a) => <ApptCard key={a.id as string} a={a as Appt} />)
        ) : (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 text-center">
            <span className="material-symbols-outlined text-outline mb-2 block" style={{ fontSize: 32 }}>calendar_month</span>
            <p className="text-sm font-medium text-on-surface">Nenhum agendamento próximo</p>
            <a href="/buscar" className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2">
              Buscar clínica
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
            </a>
          </div>
        )}
      </div>

      {past && past.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Histórico</h2>
          {past.map((a) => <ApptCard key={a.id as string} a={a as Appt} past />)}
        </div>
      )}
    </div>
  )
}
