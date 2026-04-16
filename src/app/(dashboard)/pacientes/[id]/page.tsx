import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { User, ClipboardList, GitGraph, Activity, Calendar, FileText } from "lucide-react"
import { AnamnesisForm } from "@/components/dashboard/patient/AnamnesisForm"
import { Odontogram } from "@/components/dashboard/patient/Odontogram"
import { EvolutionsTab } from "@/components/dashboard/patient/EvolutionsTab"
import Link from "next/link"

export default async function PatientChartPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase
    .from("clinics")
    .select("id, name")
    .eq("owner_id", user.id)
    .single()

  // fallback: clinic_member
  let clinicId = clinic?.id
  if (!clinicId) {
    const { data: member } = await supabase
      .from("clinic_members")
      .select("clinic_id")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single()
    clinicId = member?.clinic_id
  }
  if (!clinicId) redirect("/onboarding")

  const { data: patient } = await supabase
    .from("patients")
    .select("*")
    .eq("id", id)
    .eq("clinic_id", clinicId)
    .single()

  if (!patient) notFound()

  // Fetch paralelo
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
    scheduled: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-emerald-100 text-emerald-700',
    waiting_room: 'bg-amber-100 text-amber-700',
    in_progress: 'bg-violet-100 text-violet-700',
    awaiting_payment: 'bg-orange-100 text-orange-700',
    completed: 'bg-slate-100 text-slate-600',
    cancelled: 'bg-red-100 text-red-600',
    no_show: 'bg-red-100 text-red-600',
  }

  const statusLabels: Record<string, string> = {
    scheduled: 'Agendado', confirmed: 'Confirmado', waiting_room: 'Aguardando',
    in_progress: 'Em atendimento', awaiting_payment: 'Aguardando pagamento',
    completed: 'Concluído', cancelled: 'Cancelado', no_show: 'Faltou',
  }

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-[#0D3A6B] flex items-center justify-center text-white font-bold text-xl shrink-0">
          {patient.full_name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold truncate">{patient.full_name}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {age !== null && <Badge variant="outline" className="text-xs">{age} anos</Badge>}
            {patient.health_insurance && (
              <Badge className="bg-[#DBB47A]/20 text-[#8B6A35] border-[#DBB47A] text-xs">
                {patient.health_insurance}
              </Badge>
            )}
            {patient.anamnesis_completed_at && (
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                Anamnese preenchida
              </Badge>
            )}
            {!patient.is_active && (
              <Badge variant="destructive" className="text-xs">Inativo</Badge>
            )}
          </div>
          <div className="flex gap-3 text-xs text-muted-foreground mt-1">
            {patient.phone && <span>{patient.phone}</span>}
            {patient.email && <span>{patient.email}</span>}
            {patient.cpf && <span>CPF: {patient.cpf}</span>}
          </div>
        </div>
        <Link href={`/pacientes/${id}/editar`} className="text-xs px-3 py-1.5 border rounded-lg hover:bg-slate-50 transition-colors">
          Editar dados
        </Link>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="anamnesis">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-slate-100 p-1">
          <TabsTrigger value="dados" className="text-xs gap-1.5 data-[state=active]:bg-white">
            <User className="h-3.5 w-3.5" />Dados Pessoais
          </TabsTrigger>
          <TabsTrigger value="anamnesis" className="text-xs gap-1.5 data-[state=active]:bg-white">
            <ClipboardList className="h-3.5 w-3.5" />Anamnese
          </TabsTrigger>
          <TabsTrigger value="odontogram" className="text-xs gap-1.5 data-[state=active]:bg-white">
            <GitGraph className="h-3.5 w-3.5" />Odontograma
          </TabsTrigger>
          <TabsTrigger value="evolutions" className="text-xs gap-1.5 data-[state=active]:bg-white">
            <Activity className="h-3.5 w-3.5" />Evoluções
          </TabsTrigger>
          <TabsTrigger value="appointments" className="text-xs gap-1.5 data-[state=active]:bg-white">
            <Calendar className="h-3.5 w-3.5" />Agendamentos
          </TabsTrigger>
          <TabsTrigger value="documents" className="text-xs gap-1.5 data-[state=active]:bg-white">
            <FileText className="h-3.5 w-3.5" />Documentos
          </TabsTrigger>
        </TabsList>

        {/* Dados pessoais */}
        <TabsContent value="dados" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {[
              ['Nome completo', patient.full_name],
              ['CPF', patient.cpf],
              ['RG', patient.rg],
              ['Data de nascimento', patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString('pt-BR') : null],
              ['Gênero', patient.gender],
              ['Email', patient.email],
              ['Telefone', patient.phone],
              ['WhatsApp', patient.whatsapp],
              ['Convênio', patient.health_insurance],
              ['Nº do convênio', patient.health_insurance_number],
              ['Contato de emergência', patient.emergency_contact_name],
              ['Tel. emergência', patient.emergency_contact_phone],
              ['Endereço', [patient.address_street, patient.address_number, patient.address_neighborhood, patient.address_city, patient.address_state].filter(Boolean).join(', ')],
            ].map(([label, value]) => value ? (
              <div key={label as string}>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-medium">{value}</p>
              </div>
            ) : null)}
          </div>
          {(patient.medical_notes || patient.allergies || patient.medications) && (
            <div className="mt-4 space-y-3 border-t pt-4">
              {patient.allergies && (
                <div>
                  <p className="text-xs font-medium text-amber-600">Alergias</p>
                  <p className="text-sm">{patient.allergies}</p>
                </div>
              )}
              {patient.medications && (
                <div>
                  <p className="text-xs font-medium text-blue-600">Medicamentos em uso</p>
                  <p className="text-sm">{patient.medications}</p>
                </div>
              )}
              {patient.medical_notes && (
                <div>
                  <p className="text-xs font-medium text-slate-500">Observações médicas</p>
                  <p className="text-sm">{patient.medical_notes}</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* Anamnese */}
        <TabsContent value="anamnesis" className="mt-4">
          <AnamnesisForm
            patientId={id}
            clinicId={clinicId}
            initial={anamnesisData}
          />
        </TabsContent>

        {/* Odontograma */}
        <TabsContent value="odontogram" className="mt-4">
          <Odontogram
            patientId={id}
            clinicId={clinicId}
            faceMarks={faceMarks ?? []}
            symbols={symbols ?? []}
          />
        </TabsContent>

        {/* Evoluções */}
        <TabsContent value="evolutions" className="mt-4">
          <EvolutionsTab
            patientId={id}
            clinicId={clinicId}
            evolutions={evolutions ?? []}
            memberName={memberData?.full_name ?? undefined}
          />
        </TabsContent>

        {/* Agendamentos */}
        <TabsContent value="appointments" className="mt-4">
          {appointments && appointments.length > 0 ? (
            <div className="space-y-2">
              {appointments.map((appt) => (
                <div key={appt.id} className="flex items-center gap-3 border rounded-xl p-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {new Date(appt.date).toLocaleDateString('pt-BR')} às {appt.start_time}
                    </p>
                    {appt.services && <p className="text-xs text-muted-foreground">{(appt.services as { name: string }).name}</p>}
                  </div>
                  <Badge className={`text-xs ${statusColors[appt.status ?? 'scheduled']}`}>
                    {statusLabels[appt.status ?? 'scheduled']}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">Nenhum agendamento encontrado</p>
          )}
        </TabsContent>

        {/* Documentos */}
        <TabsContent value="documents" className="mt-4">
          <div className="text-center py-10 text-muted-foreground text-sm">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
            Upload de documentos em breve
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
