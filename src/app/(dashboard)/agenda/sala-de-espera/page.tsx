import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Clock, UserCheck, ChevronRight, Users } from "lucide-react"
import Link from "next/link"

const STATUS_COLORS: Record<string, string> = {
  waiting_room: "bg-amber-100 text-amber-700",
  in_progress: "bg-violet-100 text-violet-700",
  confirmed: "bg-blue-100 text-blue-700",
}
const STATUS_LABELS: Record<string, string> = {
  waiting_room: "Sala de espera",
  in_progress: "Em atendimento",
  confirmed: "Confirmado",
}

function waitTime(start: string) {
  const diff = Math.floor((Date.now() - new Date(start).getTime()) / 60000)
  if (diff < 1) return "< 1 min"
  return `${diff} min`
}

export default async function SalaDeEsperaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase.from("clinics").select("id").eq("owner_id", user.id).single()
  if (!clinic) redirect("/onboarding")

  const today = new Date().toISOString().split("T")[0]

  const { data: appointments } = await supabase
    .from("appointments")
    .select("id, start_time, status, patient_id, dentist_id, patients(full_name, phone), clinic_members(full_name)")
    .eq("clinic_id", clinic.id)
    .eq("date", today)
    .in("status", ["waiting_room", "in_progress", "confirmed"])
    .order("start_time")

  const waiting = (appointments ?? []).filter((a) => ["waiting_room", "confirmed"].includes(a.status as string))
  const inProgress = (appointments ?? []).filter((a) => a.status === "in_progress")

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sala de Espera</h1>
          <p className="text-muted-foreground text-sm">
            {waiting.length} aguardando · {inProgress.length} em atendimento
          </p>
        </div>
        <Link
          href="/agenda"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Ver agenda completa
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Em atendimento */}
      {inProgress.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Em atendimento</h2>
          <div className="space-y-2">
            {inProgress.map((a) => {
              const patient = a.patients as { full_name: string } | null
              const dentist = a.clinic_members as { full_name: string } | null
              return (
                <div key={a.id as string} className="bg-violet-50 dark:bg-violet-950 border border-violet-200 dark:border-violet-800 rounded-2xl px-5 py-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-violet-200 dark:bg-violet-800 flex items-center justify-center text-violet-700 dark:text-violet-200 font-bold text-sm shrink-0">
                    {(patient?.full_name ?? "?")[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{patient?.full_name ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">{dentist?.full_name ?? "—"} · {a.start_time as string}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-violet-100 text-violet-700">Em atendimento</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Aguardando */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Aguardando</h2>
        {waiting.length > 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
            <div className="divide-y">
              {waiting.map((a, idx) => {
                const patient = a.patients as { full_name: string; phone?: string } | null
                const dentist = a.clinic_members as { full_name: string } | null
                return (
                  <div key={a.id as string} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                      {idx + 1}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#E8F0F9] flex items-center justify-center font-bold text-sm text-[#0D3A6B] shrink-0">
                      {(patient?.full_name ?? "?")[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{patient?.full_name ?? "—"}</p>
                      <p className="text-xs text-muted-foreground">
                        {dentist?.full_name ?? "—"} · Horário: {a.start_time as string}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[a.status as string] ?? "bg-slate-100 text-slate-500"}`}>
                      {STATUS_LABELS[a.status as string] ?? a.status}
                    </span>
                    <div className="flex gap-1 shrink-0">
                      <button className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-colors text-xs font-medium text-blue-600 flex items-center gap-1">
                        <UserCheck className="h-3.5 w-3.5" />
                        Chamar
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border py-14 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#E8F0F9] flex items-center justify-center mx-auto mb-3">
              <Users className="h-7 w-7 text-[#0D3A6B]" />
            </div>
            <p className="font-semibold">Sala de espera vazia</p>
            <p className="text-muted-foreground text-sm mt-1">Nenhum paciente aguardando no momento.</p>
          </div>
        )}
      </div>
    </div>
  )
}
