import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AgendaClient } from "@/components/dashboard/agenda/AgendaClient"

export default async function AgendaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  let clinicId: string | null = null

  const { data: clinic } = await supabase.from("clinics").select("id").eq("owner_id", user.id).single()
  clinicId = clinic?.id ?? null

  if (!clinicId) {
    const { data: member } = await supabase.from("clinic_members").select("clinic_id").eq("user_id", user.id).eq("is_active", true).single()
    clinicId = member?.clinic_id ?? null
  }
  if (!clinicId) redirect("/onboarding")

  const today = new Date().toISOString().split("T")[0]

  const [
    { data: appointments },
    { data: members },
    { data: patients },
    { data: services },
  ] = await Promise.all([
    supabase
      .from("appointments")
      .select("id, date, start_time, end_time, status, notes, patient_id, dentist_id, service_id, patients(full_name, phone), services(name), clinic_members(full_name)")
      .eq("clinic_id", clinicId)
      .gte("date", new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0])
      .lte("date", new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0])
      .order("date")
      .order("start_time"),
    supabase.from("clinic_members").select("id, full_name, role, cro").eq("clinic_id", clinicId).eq("is_active", true),
    supabase.from("patients").select("id, full_name, phone, whatsapp").eq("clinic_id", clinicId).eq("is_active", true).order("full_name").limit(500),
    supabase.from("services").select("id, name, duration_minutes, price").eq("clinic_id", clinicId).eq("is_active", true),
  ])

  return (
    <AgendaClient
      clinicId={clinicId}
      today={today}
      appointments={appointments ?? []}
      members={members ?? []}
      patients={patients ?? []}
      services={services ?? []}
    />
  )
}
