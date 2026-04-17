import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { WorkingHoursForm } from "@/components/dashboard/forms/working-hours-form"

const DEFAULT_HOURS: Record<number, { open: boolean; start: string; end: string }> = {
  0: { open: false, start: "08:00", end: "18:00" },
  1: { open: true, start: "08:00", end: "18:00" },
  2: { open: true, start: "08:00", end: "18:00" },
  3: { open: true, start: "08:00", end: "18:00" },
  4: { open: true, start: "08:00", end: "18:00" },
  5: { open: true, start: "08:00", end: "18:00" },
  6: { open: true, start: "08:00", end: "13:00" },
}

export default async function HorariosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase.from("clinics").select("id").eq("owner_id", user.id).single()
  if (!clinic) redirect("/onboarding")

  const { data: workingHours } = await supabase
    .from("working_hours")
    .select("*")
    .eq("clinic_id", clinic.id)

  const hoursMap: Record<number, { open: boolean; start: string; end: string }> = { ...DEFAULT_HOURS }
  workingHours?.forEach((wh) => {
    hoursMap[wh.day_of_week as number] = {
      open: wh.is_active as boolean ?? false,
      start: (wh.start_time as string) ?? "08:00",
      end: (wh.end_time as string) ?? "18:00",
    }
  })

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/configuracoes" className="p-2 hover:bg-surface-container rounded-xl transition-colors">
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>arrow_back</span>
        </Link>
        <div>
          <h1 className="font-headline font-extrabold text-2xl text-primary">Horários de Atendimento</h1>
          <p className="text-on-surface-variant text-sm">Defina quando sua clínica está aberta</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-premium-sm">
        <div className="px-6 py-4 border-b border-outline-variant bg-surface-container flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-600" style={{ fontSize: 16 }}>schedule</span>
          <span className="font-semibold text-sm text-on-surface">Horários semanais</span>
        </div>
        <WorkingHoursForm initialHours={hoursMap} />
      </div>
    </div>
  )
}
