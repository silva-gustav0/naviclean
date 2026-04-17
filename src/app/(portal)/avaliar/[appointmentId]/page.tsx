import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ReviewClient } from "@/components/portal/ReviewClient"

interface Props {
  params: Promise<{ appointmentId: string }>
}

export default async function AvaliarPage({ params }: Props) {
  const { appointmentId } = await params
  const supabase = await createClient()

  const { data: appointment } = await supabase
    .from("appointments")
    .select("id, patient_id, clinic_id, dentist_id, status, services(name), clinic_members(full_name, profiles(full_name)), clinics(name)")
    .eq("id", appointmentId)
    .single()

  if (!appointment || appointment.status !== "completed") notFound()

  const service = appointment.services as { name: string } | null
  const member = appointment.clinic_members as { full_name: string | null; profiles: { full_name: string | null } | null } | null
  const clinic = appointment.clinics as { name: string } | null
  const memberName = member?.full_name ?? (member?.profiles as { full_name: string | null } | null)?.full_name ?? "Profissional"

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h1 className="font-headline font-extrabold text-2xl text-primary mb-1">Como foi sua consulta?</h1>
        <p className="text-on-surface-variant text-sm">
          {service?.name ?? "Consulta"} com {memberName}
          {clinic ? ` em ${clinic.name}` : ""}
        </p>
      </div>

      <ReviewClient
        appointmentId={appointmentId}
        clinicId={appointment.clinic_id as string}
        patientId={appointment.patient_id as string}
        memberId={appointment.dentist_id as string}
      />
    </div>
  )
}
