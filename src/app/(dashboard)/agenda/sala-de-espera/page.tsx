import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

function waitTime(start: string) {
  const diff = Math.floor((Date.now() - new Date(start).getTime()) / 60000)
  if (diff < 1) return "< 1 min"
  return `${diff}min`
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
    .select("id, start_time, status, check_in_at, patient_id, dentist_id, patients(full_name, phone), clinic_members(full_name)")
    .eq("clinic_id", clinic.id)
    .eq("date", today)
    .in("status", ["waiting_room", "in_progress", "confirmed"])
    .order("start_time")

  const waiting = (appointments ?? []).filter((a) => ["waiting_room", "confirmed"].includes(a.status as string))
  const inProgress = (appointments ?? []).filter((a) => a.status === "in_progress")

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline font-extrabold text-3xl text-primary tracking-tight">Sala de Espera</h2>
          <p className="text-on-surface-variant text-sm mt-1 font-sans flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            {waiting.length} aguardando · {inProgress.length} em atendimento
          </p>
        </div>
        <Link
          href="/agenda"
          className="flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-primary transition-colors font-sans"
        >
          Ver agenda completa
          <span className="material-symbols-outlined text-xl">arrow_forward</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Fila principal */}
        <div className="xl:col-span-2 space-y-4">
          {/* Em atendimento */}
          {inProgress.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-headline font-bold text-sm text-on-surface-variant uppercase tracking-wider">Em atendimento</h3>
              {inProgress.map((a) => {
                const patient = a.patients as { full_name: string } | null
                const dentist = a.clinic_members as { full_name: string } | null
                const initials = (patient?.full_name ?? "?")[0].toUpperCase()
                return (
                  <div key={a.id as string} className="bg-primary rounded-2xl p-5 flex items-center gap-5 relative overflow-hidden shadow-premium">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-nc-secondary" />
                    <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center text-white font-bold text-lg shrink-0 font-headline border border-white/20">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-headline font-bold text-white">{patient?.full_name ?? "—"}</p>
                      <p className="text-white/60 text-xs font-sans mt-0.5">{dentist?.full_name ?? "—"} · {a.start_time as string}</p>
                    </div>
                    <span className="text-xs px-3 py-1.5 rounded-full font-semibold bg-white/15 text-white border border-white/20 font-sans">
                      Em atendimento
                    </span>
                  </div>
                )
              })}
            </div>
          )}

          {/* Fila de espera */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-headline font-bold text-sm text-on-surface-variant uppercase tracking-wider">Fila Principal</h3>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-surface-container-lowest rounded-full text-xs font-semibold text-on-surface-variant border border-outline-variant/20 flex items-center gap-1 font-sans">
                  <span className="material-symbols-outlined text-sm">filter_list</span> Filtrar
                </span>
              </div>
            </div>

            {waiting.length > 0 ? (
              <div className="space-y-3">
                {waiting.map((a, idx) => {
                  const patient = a.patients as { full_name: string; phone?: string } | null
                  const dentist = a.clinic_members as { full_name: string } | null
                  const initials = (patient?.full_name ?? "?")[0].toUpperCase()
                  const elapsed = (a as { check_in_at?: string }).check_in_at ? waitTime((a as { check_in_at: string }).check_in_at) : null
                  const isLongWait = elapsed && parseInt(elapsed) > 30

                  return (
                    <div
                      key={a.id as string}
                      className="bg-surface-container-lowest rounded-2xl p-5 flex items-center gap-5 shadow-premium-sm relative overflow-hidden border border-outline-variant/10"
                    >
                      {/* Accent line */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${isLongWait ? "bg-red-500" : "bg-nc-secondary"}`} />

                      {/* Position number */}
                      <div className="w-7 h-7 rounded-full bg-surface-container-low flex items-center justify-center text-xs font-bold text-on-surface-variant shrink-0 font-headline">
                        {idx + 1}
                      </div>

                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full surgical-gradient flex items-center justify-center text-white font-bold shrink-0 font-headline relative">
                        {initials}
                        {isLongWait && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-surface flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-[10px]">priority_high</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-headline font-bold text-primary">{patient?.full_name ?? "—"}</p>
                            <p className="text-on-surface-variant text-xs font-sans mt-0.5">
                              {dentist?.full_name ?? "—"} · Horário: {a.start_time as string}
                            </p>
                          </div>
                          {elapsed && (
                            <div className="text-right">
                              <div className={`font-headline font-bold text-lg ${isLongWait ? "text-red-500" : "text-nc-secondary"}`}>
                                {elapsed}
                              </div>
                              <p className="text-outline text-[10px] uppercase tracking-wider font-sans">Espera</p>
                            </div>
                          )}
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold font-sans ${
                            a.status === "in_progress"
                              ? "bg-primary/10 text-primary"
                              : a.status === "waiting_room"
                              ? "bg-nc-secondary/10 text-nc-secondary"
                              : "bg-surface-container-low text-on-surface-variant"
                          }`}>
                            {a.status === "in_progress" ? "Em atendimento" : a.status === "waiting_room" ? "Sala de espera" : "Confirmado"}
                          </span>
                          <button className="px-4 py-2 bg-primary text-white rounded-lg font-headline font-semibold text-xs hover:opacity-90 transition-all flex items-center gap-1.5 shadow-premium-sm">
                            <span className="material-symbols-outlined text-base">campaign</span>
                            Chamar
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 py-16 text-center shadow-premium-sm">
                <div className="w-16 h-16 rounded-2xl bg-nc-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-nc-secondary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    chair
                  </span>
                </div>
                <p className="font-headline font-semibold text-primary">Sala de espera vazia</p>
                <p className="text-on-surface-variant text-sm mt-1 font-sans">Nenhum paciente aguardando no momento.</p>
              </div>
            )}
          </div>
        </div>

        {/* Painel de status */}
        <div className="space-y-4">
          <h3 className="font-headline font-bold text-xl text-primary">Painel de Status</h3>

          {/* Stats */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-premium-sm border border-outline-variant/10">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1 font-sans">Aguardando</p>
                <div className="font-headline font-bold text-2xl text-primary">{waiting.length}</div>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1 font-sans">Em Atendimento</p>
                <div className="font-headline font-bold text-2xl text-emerald-600">{inProgress.length}</div>
              </div>
            </div>
          </div>

          {/* Link agenda */}
          <Link
            href="/agenda"
            className="block bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/10 shadow-premium-sm hover:border-nc-secondary/30 hover:shadow-premium transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-nc-secondary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-nc-secondary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  calendar_month
                </span>
              </div>
              <div className="flex-1">
                <p className="font-headline font-semibold text-sm text-primary">Agenda do Dia</p>
                <p className="text-xs text-on-surface-variant font-sans">Ver todos os horários</p>
              </div>
              <span className="material-symbols-outlined text-outline group-hover:text-nc-secondary transition-colors">
                arrow_forward
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
