import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ArrowLeft, Clock } from "lucide-react"
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
        <Link href="/configuracoes" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Horários de Atendimento</h1>
          <p className="text-muted-foreground text-sm">Defina quando sua clínica está aberta</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center gap-2">
          <Clock className="h-4 w-4 text-emerald-600" />
          <span className="font-semibold text-sm">Horários semanais</span>
        </div>
        <WorkingHoursForm initialHours={hoursMap} />
      </div>
    </div>
  )
}
