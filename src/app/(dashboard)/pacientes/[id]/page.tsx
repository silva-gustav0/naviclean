import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnamnesisForm } from "@/components/dashboard/patient/AnamnesisForm"
import { Odontogram } from "@/components/dashboard/patient/Odontogram"
import { EvolutionsTab } from "@/components/dashboard/patient/EvolutionsTab"
import Link from "next/link"

export default async function PatientChartPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase.from("clinics").select("id, name").eq("owner_id", user.id).single()
  let clinicId = clinic?.id
  if (!clinicId) {
    const { data: member } = await supabase.from("clinic_members").select("clinic_id").eq("user_id", user.id).eq("is_active", true).single()
    clinicId = member?.clinic_id
  }
  if (!clinicId) redirect("/onboarding")

  const { data: patient } = await supabase.from("patients").select("*").eq("id", id).eq("clinic_id", clinicId).single()
  if (!patient) notFound()

  const [
    { data: anamnesisData },
    { data: faceMarks },
    { data: symbols },
    { data: evolutions },
    { data: appointments },
    { data: memberData },
  ] = await Promise.all([
    supabase.from("anamnesis").select("*").eq("patient_id", id).single(),
    supabase.from("tooth_face_marks").select("*").eq("patient_id", id),
    supabase.from("tooth_symbols").select("*").eq("patient_id", id),
    supabase.from("clinical_evolutions").select("*").eq("patient_id", id).order("created_at", { ascending: false }),
    supabase.from("appointments").select("id, date, start_time, status, services(name)").eq("patient_id", id).order("date", { ascending: false }).limit(10),
    supabase.from("clinic_members").select("id, full_name, cro").eq("clinic_id", clinicId).eq("user_id", user.id).single(),
  ])

  const age = patient.date_of_birth
    ? Math.floor((Date.now() - new Date(patient.date_of_birth).getTime()) / (365.25 * 24 * 3600 * 1000))
    : null

  const statusColors: Record<string, string> = {
    scheduled: "bg-primary/10 text-primary",
    confirmed: "bg-emerald-50 text-emerald-700",
    waiting_room: "bg-nc-secondary/10 text-nc-secondary",
    in_progress: "bg-primary/10 text-primary",
    awaiting_payment: "bg-nc-secondary/10 text-nc-secondary",
    completed: "bg-surface-container-low text-on-surface-variant",
    cancelled: "bg-red-50 text-red-600",
    no_show: "bg-red-50 text-red-600",
  }
  const statusLabels: Record<string, string> = {
    scheduled: "Agendado", confirmed: "Confirmado", waiting_room: "Aguardando",
    in_progress: "Em atendimento", awaiting_payment: "Ag. pagamento",
    completed: "Concluído", cancelled: "Cancelado", no_show: "Faltou",
  }

  const initials = patient.full_name.split(" ").slice(0, 2).map((n: string) => n[0]).join("").toUpperCase()

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Breadcrumb */}
      <Link
        href="/pacientes"
        className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors font-sans"
      >
        <span className="material-symbols-outlined text-lg">arrow_back</span>
        Voltar para lista de pacientes
      </Link>

      {/* Patient Header Card */}
      <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-premium border border-outline-variant/10 flex flex-col sm:flex-row gap-6 items-start sm:items-center relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-2xl surgical-gradient flex items-center justify-center text-white text-2xl font-extrabold font-headline shadow-premium-sm">
            {initials}
          </div>
          {patient.anamnesis_completed_at && (
            <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-nc-secondary rounded-full border-2 border-surface flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col gap-2 z-10">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-headline font-bold text-2xl text-primary">{patient.full_name}</h2>
            <span className="bg-surface-container-low text-on-surface-variant text-xs font-semibold px-2.5 py-1 rounded-md font-sans">
              ID: #{id.slice(0, 6).toUpperCase()}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-on-surface-variant font-sans">
            {age !== null && (
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">cake</span>
                {age} anos
                {patient.date_of_birth && ` (${new Date(patient.date_of_birth).toLocaleDateString("pt-BR")})`}
              </div>
            )}
            {patient.phone && (
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">call</span>
                {patient.phone}
              </div>
            )}
            {patient.email && (
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">mail</span>
                {patient.email}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-1">
            {patient.allergies && (
              <div className="flex items-center gap-1 bg-red-50 text-red-600 px-2.5 py-1 rounded-md text-xs font-semibold font-sans">
                <span className="material-symbols-outlined text-sm">warning</span>
                {patient.allergies}
              </div>
            )}
            {patient.health_insurance && (
              <div className="flex items-center gap-1 bg-nc-secondary/10 text-nc-secondary px-2.5 py-1 rounded-md text-xs font-semibold font-sans">
                <span className="material-symbols-outlined text-sm">medical_information</span>
                {patient.health_insurance}
              </div>
            )}
            {!patient.is_active && (
              <span className="bg-red-50 text-red-600 px-2.5 py-1 rounded-md text-xs font-semibold font-sans">Inativo</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto z-10 sm:mt-0">
          <Link
            href={`/pacientes/${id}/editar`}
            className="flex-1 sm:flex-none bg-surface-container-low text-primary hover:bg-surface-container-high rounded-lg px-4 py-2 text-sm font-semibold text-center transition-colors font-headline"
          >
            Editar Perfil
          </Link>
          <Link
            href="/agenda"
            className="flex-1 sm:flex-none surgical-gradient text-white rounded-lg px-4 py-2 text-sm font-semibold text-center shadow-premium-sm hover:opacity-90 transition-all font-headline"
          >
            Nova Consulta
          </Link>
        </div>
      </section>

      {/* Tabs */}
      <Tabs defaultValue="anamnesis">
        <TabsList className="flex flex-wrap h-auto gap-0 bg-transparent p-0 border-b border-surface-container-high/50 w-full justify-start">
          {[
            { value: "dados", icon: "person", label: "Dados Pessoais" },
            { value: "anamnesis", icon: "clipboard_medical", label: "Anamnese" },
            { value: "odontogram", icon: "dentistry", label: "Odontograma" },
            { value: "evolutions", icon: "monitor_heart", label: "Evoluções" },
            { value: "appointments", icon: "calendar_month", label: "Agendamentos" },
            { value: "documents", icon: "folder_open", label: "Arquivos" },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="whitespace-nowrap px-4 py-2.5 text-sm font-medium rounded-t-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-lowest/50 transition-all data-[state=active]:text-primary data-[state=active]:bg-surface-container-lowest data-[state=active]:shadow-[0px_-4px_12px_rgba(0,36,74,0.03)] data-[state=active]:border-b-2 data-[state=active]:border-nc-secondary font-headline gap-1.5"
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Dados pessoais */}
        <TabsContent value="dados" className="mt-6">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-6 shadow-premium-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
              {[
                ["Nome completo", patient.full_name],
                ["CPF", patient.cpf],
                ["RG", patient.rg],
                ["Data de nascimento", patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString("pt-BR") : null],
                ["Gênero", patient.gender],
                ["Email", patient.email],
                ["Telefone", patient.phone],
                ["WhatsApp", patient.whatsapp],
                ["Convênio", patient.health_insurance],
                ["Nº do convênio", patient.health_insurance_number],
                ["Contato de emergência", patient.emergency_contact_name],
                ["Tel. emergência", patient.emergency_contact_phone],
                ["Endereço", [patient.address_street, patient.address_number, patient.address_neighborhood, patient.address_city, patient.address_state].filter(Boolean).join(", ")],
              ].map(([label, value]) => value ? (
                <div key={label as string}>
                  <p className="text-xs text-on-surface-variant uppercase tracking-wider font-sans mb-1">{label}</p>
                  <p className="font-semibold text-primary font-headline">{value}</p>
                </div>
              ) : null)}
            </div>
            {(patient.medical_notes || patient.medications) && (
              <div className="mt-5 space-y-3 border-t border-outline-variant/10 pt-5">
                {patient.medications && (
                  <div>
                    <p className="text-xs font-semibold text-primary/70 uppercase tracking-wider font-sans mb-1">Medicamentos em uso</p>
                    <p className="text-sm text-on-surface font-sans">{patient.medications}</p>
                  </div>
                )}
                {patient.medical_notes && (
                  <div>
                    <p className="text-xs font-semibold text-outline uppercase tracking-wider font-sans mb-1">Observações médicas</p>
                    <p className="text-sm text-on-surface font-sans">{patient.medical_notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Anamnese */}
        <TabsContent value="anamnesis" className="mt-6">
          <AnamnesisForm patientId={id} clinicId={clinicId} initial={anamnesisData} />
        </TabsContent>

        {/* Odontograma */}
        <TabsContent value="odontogram" className="mt-6">
          <Odontogram patientId={id} clinicId={clinicId} faceMarks={faceMarks ?? []} symbols={symbols ?? []} />
        </TabsContent>

        {/* Evoluções */}
        <TabsContent value="evolutions" className="mt-6">
          <EvolutionsTab patientId={id} clinicId={clinicId} evolutions={evolutions ?? []} memberName={memberData?.full_name ?? undefined} />
        </TabsContent>

        {/* Agendamentos */}
        <TabsContent value="appointments" className="mt-6">
          {appointments && appointments.length > 0 ? (
            <div className="space-y-2">
              {appointments.map((appt) => (
                <div key={appt.id} className="flex items-center gap-4 bg-surface-container-lowest border border-outline-variant/10 rounded-xl p-4 hover:border-nc-secondary/20 transition-colors">
                  <span className="material-symbols-outlined text-nc-secondary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    calendar_month
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-primary font-headline">
                      {new Date(appt.date).toLocaleDateString("pt-BR")} às {appt.start_time}
                    </p>
                    {appt.services && (
                      <p className="text-xs text-on-surface-variant font-sans">{(appt.services as { name: string }).name}</p>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold font-sans ${statusColors[appt.status ?? "scheduled"]}`}>
                    {statusLabels[appt.status ?? "scheduled"]}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-on-surface-variant text-sm font-sans">
              <span className="material-symbols-outlined text-4xl block mx-auto mb-2 text-outline">calendar_month</span>
              Nenhum agendamento encontrado
            </div>
          )}
        </TabsContent>

        {/* Documentos */}
        <TabsContent value="documents" className="mt-6">
          <div className="text-center py-12 text-on-surface-variant text-sm font-sans">
            <span className="material-symbols-outlined text-4xl block mx-auto mb-2 text-outline">folder_open</span>
            Upload de documentos em breve
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
