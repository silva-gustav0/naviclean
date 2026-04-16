import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Calendar, MapPin, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const STATUS_COLORS: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  completed: "bg-slate-100 text-slate-600",
  cancelled: "bg-red-100 text-red-700",
  no_show: "bg-amber-100 text-amber-700",
}
const STATUS_LABELS: Record<string, string> = {
  scheduled: "Agendado",
  confirmed: "Confirmado",
  completed: "Concluído",
  cancelled: "Cancelado",
  no_show: "Faltou",
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
      <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-900 border rounded-2xl hover:shadow-sm transition-all">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isPast ? "bg-slate-100" : "bg-[#E8F0F9]"}`}>
          <Calendar className={`h-5 w-5 ${isPast ? "text-slate-400" : "text-[#0D3A6B]"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <p className="font-semibold text-sm">{service?.name ?? "Consulta"}</p>
            <Badge className={`text-[10px] ${STATUS_COLORS[a.status as string] ?? "bg-slate-100 text-slate-600"}`}>
              {STATUS_LABELS[a.status as string] ?? a.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{clinic?.name}</p>
          {member?.full_name && <p className="text-xs text-muted-foreground">Dr(a). {member.full_name}</p>}
          {clinic?.address_city && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3" />
              {clinic.address_street}{clinic.address_city ? `, ${clinic.address_city}` : ""}
            </p>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-semibold">{new Date(a.date as string).toLocaleDateString("pt-BR", { day: "numeric", month: "short" })}</p>
          <p className="text-xs text-muted-foreground">{a.start_time as string}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Meus Agendamentos</h1>

      {/* Upcoming */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Próximos</h2>
        {upcoming && upcoming.length > 0 ? (
          upcoming.map((a) => <ApptCard key={a.id as string} a={a as Appt} />)
        ) : (
          <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6 text-center">
            <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium">Nenhum agendamento próximo</p>
            <a href="/buscar" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-2">
              Buscar clínica
              <ChevronRight className="h-3.5 w-3.5" />
            </a>
          </div>
        )}
      </div>

      {/* Past */}
      {past && past.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Histórico</h2>
          {past.map((a) => <ApptCard key={a.id as string} a={a as Appt} past />)}
        </div>
      )}
    </div>
  )
}
