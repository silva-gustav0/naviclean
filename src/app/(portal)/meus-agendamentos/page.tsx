import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Calendar, Clock, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const STATUS_LABELS: Record<string, string> = {
  scheduled: "Agendado",
  confirmed: "Confirmado",
  waiting_room: "Na recepção",
  in_progress: "Em atendimento",
  awaiting_payment: "Aguardando pagamento",
  completed: "Concluído",
  cancelled: "Cancelado",
  no_show: "Não compareceu",
}

const STATUS_STYLES: Record<string, string> = {
  scheduled: "bg-slate-100 text-slate-600",
  confirmed: "bg-blue-100 text-blue-700",
  waiting_room: "bg-amber-100 text-amber-700",
  in_progress: "bg-green-100 text-green-700",
  awaiting_payment: "bg-violet-100 text-violet-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-600",
  no_show: "bg-red-100 text-red-600",
}

export default async function MeusAgendamentosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Find patient records for this user
  const { data: patients } = await supabase
    .from("patients")
    .select("id, clinic_id, clinics(name)")
    .eq("email", user.email ?? "")

  if (!patients || patients.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Meus Agendamentos</h1>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border py-16 text-center">
          <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold mb-1">Nenhum agendamento encontrado</h3>
          <p className="text-muted-foreground text-sm mb-4">Seu email não está vinculado a nenhuma clínica ainda.</p>
          <Link href="/buscar" className="text-sm px-4 py-2 bg-[#0D3A6B] text-white rounded-lg hover:bg-[#1A5599] transition-colors">
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
      <div className="bg-white dark:bg-slate-900 border rounded-2xl p-4 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center shrink-0">
          <Calendar className="h-5 w-5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <p className="font-semibold text-sm">{service?.name ?? "Consulta"}</p>
            <Badge className={`text-[10px] ${STATUS_STYLES[a.status as string] ?? ""}`}>
              {STATUS_LABELS[a.status as string] ?? a.status}
            </Badge>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(a.date as string + "T12:00").toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short" })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {a.start_time as string}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {memberName}
            </span>
          </div>
          {clinic && <p className="text-xs text-muted-foreground mt-0.5">{clinic.name}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Meus Agendamentos</h1>

      {upcoming.length > 0 && (
        <div>
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">Próximos</h2>
          <div className="space-y-3">
            {upcoming.map((a) => <AppointmentCard key={a.id as string} a={a} />)}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">Anteriores</h2>
          <div className="space-y-3">
            {past.map((a) => <AppointmentCard key={a.id as string} a={a} />)}
          </div>
        </div>
      )}

      {upcoming.length === 0 && past.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border py-16 text-center">
          <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold mb-1">Nenhum agendamento</h3>
          <Link href="/buscar" className="text-sm px-4 py-2 bg-[#0D3A6B] text-white rounded-lg hover:bg-[#1A5599] transition-colors inline-block mt-4">
            Agendar consulta
          </Link>
        </div>
      )}
    </div>
  )
}
