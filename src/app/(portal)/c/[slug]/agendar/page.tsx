import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { BookingClient } from "@/components/portal/BookingClient"

interface Props {
  params: Promise<{ slug: string }>
}

export default async function AgendarPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: clinic } = await supabase
    .from("clinics")
    .select("id, name, slug, allow_online_booking, appointment_duration_minutes, appointment_buffer_minutes")
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  if (!clinic || !clinic.allow_online_booking) notFound()

  const [{ data: members }, { data: services }, { data: workingHours }] = await Promise.all([
    supabase
      .from("clinic_members")
      .select("id, full_name, specialty, profiles(full_name)")
      .eq("clinic_id", clinic.id)
      .eq("is_active", true)
      .in("role", ["dentist", "doctor", "independent_professional"]),
    supabase
      .from("services")
      .select("id, name, price, duration_minutes")
      .eq("clinic_id", clinic.id)
      .eq("is_active", true)
      .order("name"),
    supabase
      .from("working_hours")
      .select("*")
      .eq("clinic_id", clinic.id)
      .eq("is_active", true),
  ])

  const formattedMembers = (members ?? []).map((m) => {
    const profile = m.profiles as { full_name: string | null } | null
    return {
      id: m.id as string,
      name: (m.full_name ?? profile?.full_name) ?? "Profissional",
      specialty: m.specialty as string | null,
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <Link href={`/c/${slug}`} className="hover:text-foreground transition-colors">{clinic.name as string}</Link>
          <span>/</span>
          <span>Agendar</span>
        </div>
        <h1 className="text-2xl font-bold">Agendar consulta</h1>
        <p className="text-muted-foreground text-sm">em {clinic.name as string}</p>
      </div>

      <BookingClient
        clinicId={clinic.id}
        clinicName={clinic.name as string}
        members={formattedMembers}
        services={(services ?? []).map((s) => ({
          id: s.id as string,
          name: s.name as string,
          price: Number(s.price ?? 0),
          duration_minutes: Number(s.duration_minutes ?? clinic.appointment_duration_minutes ?? 30),
        }))}
        workingHours={(workingHours ?? []).map((wh) => ({
          day_of_week: wh.day_of_week,
          start_time: wh.start_time,
          end_time: wh.end_time,
        }))}
        defaultDuration={Number(clinic.appointment_duration_minutes ?? 30)}
        bufferMinutes={Number(clinic.appointment_buffer_minutes ?? 0)}
      />
    </div>
  )
}
