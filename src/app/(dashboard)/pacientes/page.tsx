import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NewPatientModal } from "@/components/dashboard/modals/new-patient-modal"
import { PatientsList, type PatientListItem } from "@/components/dashboard/patients-list"
import { PatientDetailPanel, type PatientDetail } from "@/components/dashboard/patient-detail-panel"
import { CopyLinkButton } from "@/components/dashboard/copy-link-button"

type Appointment = {
  id: string
  date: string
  start_time: string
  status: string
  patient_id: string
  services: { name: string } | null
  clinic_members: { full_name: string } | null
}

function computeStatus(
  appointmentCount: number,
  lastVisitDate: string | null,
  daysSinceVisit: number | null,
): PatientListItem["status"] {
  if (appointmentCount === 0) return "novo"
  if (daysSinceVisit !== null && daysSinceVisit > 90 && daysSinceVisit <= 180) return "retorno"
  return "em_dia"
}

export default async function PacientesPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const { id: selectedId } = await searchParams

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase
    .from("clinics")
    .select("id, slug")
    .eq("owner_id", user.id)
    .single()
  if (!clinic) redirect("/onboarding")

  const [{ data: patients }, { data: allAppointments }, { data: members }] = await Promise.all([
    supabase
      .from("patients")
      .select("id, full_name, email, phone, date_of_birth")
      .eq("clinic_id", clinic.id)
      .eq("is_active", true)
      .order("full_name")
      .limit(300),
    supabase
      .from("appointments")
      .select("id, date, start_time, status, patient_id, services(name), clinic_members(full_name)")
      .eq("clinic_id", clinic.id)
      .order("date", { ascending: false }),
    supabase
      .from("clinic_members")
      .select("id, full_name")
      .eq("clinic_id", clinic.id)
      .eq("is_active", true)
      .order("full_name"),
  ])

  // Fetch assigned_to separately (column added via migration — cast avoids generated-type mismatch)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: assignedRaw } = await (supabase as any)
    .from("patients")
    .select("id, assigned_to")
    .eq("clinic_id", clinic.id)
    .eq("is_active", true) as { data: { id: string; assigned_to: string | null }[] | null }

  const assignedMap: Record<string, string | null> = {}
  for (const row of (assignedRaw ?? [])) {
    assignedMap[row.id] = row.assigned_to
  }

  const membersMap: Record<string, string> = {}
  for (const m of (members ?? [])) {
    if (m.id && m.full_name) membersMap[m.id as string] = m.full_name as string
  }

  const aptMap: Record<string, Appointment[]> = {}
  for (const apt of (allAppointments ?? []) as Appointment[]) {
    if (!apt.patient_id) continue
    if (!aptMap[apt.patient_id]) aptMap[apt.patient_id] = []
    aptMap[apt.patient_id].push(apt)
  }

  const today = new Date()

  const patientItems: PatientListItem[] = (patients ?? []).map((p) => {
    const apts = aptMap[p.id as string] ?? []
    const completedApts = apts.filter((a) => a.status !== "cancelled")
    const lastApt = completedApts[0]
    const lastVisitDate = lastApt?.date ?? null
    const daysSinceVisit = lastVisitDate
      ? Math.floor((today.getTime() - new Date(lastVisitDate + "T00:00:00").getTime()) / (1000 * 60 * 60 * 24))
      : null
    const status = computeStatus(completedApts.length, lastVisitDate, daysSinceVisit)
    const assignedTo = assignedMap[p.id as string] ?? null

    return {
      id: p.id as string,
      full_name: p.full_name as string,
      email: p.email as string | null,
      phone: p.phone as string | null,
      date_of_birth: p.date_of_birth as string | null,
      appointmentCount: completedApts.length,
      lastVisitDate,
      daysSinceVisit,
      status,
      assignedToName: assignedTo ? (membersMap[assignedTo] ?? null) : null,
    }
  })

  let selectedPatient: PatientDetail | null = null
  if (selectedId) {
    const { data: patientRaw } = await supabase
      .from("patients")
      .select("id, full_name, email, phone, date_of_birth, cpf, rg, health_insurance, address_street, address_number, address_city, address_state, gender")
      .eq("id", selectedId)
      .eq("clinic_id", clinic.id)
      .single()

    if (patientRaw) {
      const apts = aptMap[selectedId] ?? []
      const completed = apts.filter((a) => a.status !== "cancelled")
      const lastVisit = completed[0]?.date ?? null
      const assignedTo = assignedMap[selectedId] ?? null

      const [
        { data: evolutions },
        { data: faceMarks },
        { data: toothSymbols },
        { data: anamnesis },
      ] = await Promise.all([
        supabase
          .from("clinical_evolutions")
          .select("*")
          .eq("patient_id", selectedId)
          .order("created_at", { ascending: false }),
        supabase.from("tooth_face_marks").select("*").eq("patient_id", selectedId),
        supabase.from("tooth_symbols").select("*").eq("patient_id", selectedId),
        supabase.from("anamnesis").select("*").eq("patient_id", selectedId).maybeSingle(),
      ])

      selectedPatient = {
        id: patientRaw.id as string,
        full_name: patientRaw.full_name as string,
        email: patientRaw.email as string | null,
        phone: patientRaw.phone as string | null,
        date_of_birth: patientRaw.date_of_birth as string | null,
        cpf: patientRaw.cpf as string | null,
        rg: patientRaw.rg as string | null,
        health_insurance: patientRaw.health_insurance as string | null,
        address_street: patientRaw.address_street as string | null,
        address_number: patientRaw.address_number as string | null,
        address_city: patientRaw.address_city as string | null,
        address_state: patientRaw.address_state as string | null,
        gender: patientRaw.gender as string | null,
        appointmentCount: completed.length,
        lastVisitDate: lastVisit,
        recentAppointments: apts.slice(0, 4),
        clinicId: clinic.id as string,
        evolutions: (evolutions ?? []) as PatientDetail["evolutions"],
        faceMarks: (faceMarks ?? []) as PatientDetail["faceMarks"],
        symbols: (toothSymbols ?? []) as PatientDetail["symbols"],
        anamnesis: (anamnesis ?? null) as PatientDetail["anamnesis"],
        assignedToName: assignedTo ? (membersMap[assignedTo] ?? null) : null,
      }
    }
  }

  const membersList = (members ?? []).map((m) => ({
    id: m.id as string,
    full_name: m.full_name as string | null,
  }))

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))]">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4 shrink-0">
        <div>
          <p className="nc-section-label text-outline/60 mb-1.5">Clínica</p>
          <h2 className="font-headline font-black text-primary tracking-tight" style={{ fontSize: "1.8rem", letterSpacing: "-0.03em" }}>
            Pacientes
          </h2>
          <p className="text-on-surface-variant text-[13px] mt-1 font-sans">
            {patientItems.length} cadastro{patientItems.length !== 1 ? "s" : ""} — prontuário digital completo
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <CopyLinkButton
            slug={clinic.slug as string}
            label="Link de cadastro"
            icon="link"
            path="/pacientes/cadastro"
          />
          <button className="flex items-center gap-1.5 border border-outline-variant/25 text-primary/70 text-[12px] font-medium px-3.5 py-2 rounded-xl hover:bg-surface-container transition-colors font-sans">
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>upload_file</span>
            Importar
          </button>
          <NewPatientModal members={membersList} />
        </div>
      </div>

      {/* Split layout */}
      {patientItems.length > 0 ? (
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
          <div className="bg-card rounded-2xl shadow-card p-3 flex flex-col min-h-0">
            <PatientsList patients={patientItems} />
          </div>

          <div className="min-h-0">
            {selectedPatient ? (
              <PatientDetailPanel key={selectedPatient.id} patient={selectedPatient} />
            ) : (
              <div className="bg-card rounded-2xl border border-outline-variant/20 shadow-sm h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center mb-4">
                  <span
                    className="material-symbols-outlined text-outline text-3xl"
                    style={{ fontVariationSettings: "'FILL' 0" }}
                  >
                    person
                  </span>
                </div>
                <h3 className="font-headline font-semibold text-primary text-base mb-1">
                  Selecione um paciente
                </h3>
                <p className="text-on-surface-variant text-sm font-sans max-w-xs">
                  Clique em um paciente na lista para visualizar os dados e o histórico completo.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-outline-variant/20 py-16 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-nc-secondary/10 flex items-center justify-center mx-auto mb-4">
            <span
              className="material-symbols-outlined text-nc-secondary text-3xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              groups
            </span>
          </div>
          <h3 className="font-headline font-semibold text-primary text-base mb-1">
            Nenhum paciente ainda
          </h3>
          <p className="text-on-surface-variant text-sm mb-6 max-w-xs mx-auto font-sans">
            Cadastre o primeiro paciente para começar a organizar os atendimentos.
          </p>
          <div className="flex justify-center">
            <NewPatientModal members={membersList} />
          </div>
        </div>
      )}
    </div>
  )
}
