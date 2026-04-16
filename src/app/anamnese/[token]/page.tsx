import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { AnamnesisForm } from "@/components/dashboard/patient/AnamnesisForm"

export default async function AnamnesisPublicPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = await createClient()

  const { data: tokenData } = await supabase
    .from("anamnesis_tokens")
    .select("*, patients(full_name), clinics(name)")
    .eq("token", token)
    .single()

  if (!tokenData) notFound()
  if (tokenData.used_at) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-3">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">✓</span>
          </div>
          <h1 className="text-xl font-bold">Anamnese já preenchida</h1>
          <p className="text-muted-foreground text-sm">Este link já foi utilizado. Caso precise atualizar, solicite um novo link à clínica.</p>
        </div>
      </div>
    )
  }
  if (new Date(tokenData.expires_at) < new Date()) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-3">
          <h1 className="text-xl font-bold">Link expirado</h1>
          <p className="text-muted-foreground text-sm">Este link de anamnese expirou. Solicite um novo link à clínica.</p>
        </div>
      </div>
    )
  }

  const { data: existingAnamnesis } = await supabase
    .from("anamnesis")
    .select("*")
    .eq("patient_id", tokenData.patient_id)
    .single()

  const patient = tokenData.patients as { full_name: string } | null
  const clinic = tokenData.clinics as { name: string } | null

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-[#0D3A6B] rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <h1 className="text-xl font-bold text-[#0D3A6B]">{clinic?.name ?? "Clínica"}</h1>
          <p className="text-sm text-muted-foreground">Anamnese de <strong>{patient?.full_name}</strong></p>
          <p className="text-xs text-muted-foreground">
            Preencha com cuidado. Suas respostas são confidenciais e ajudam a garantir um atendimento seguro.
          </p>
        </div>

        <div className="bg-white rounded-2xl border p-6">
          <AnamnesisFormWithSubmit
            patientId={tokenData.patient_id}
            clinicId={tokenData.clinic_id}
            token={token}
            initial={existingAnamnesis}
          />
        </div>
      </div>
    </div>
  )
}

// Wrapper client para submeter o token
import { AnamnesisFormPublic } from "@/components/dashboard/patient/AnamnesisFormPublic"

function AnamnesisFormWithSubmit({
  patientId,
  clinicId,
  token,
  initial,
}: {
  patientId: string
  clinicId: string
  token: string
  initial: unknown
}) {
  return (
    <AnamnesisFormPublic
      patientId={patientId}
      clinicId={clinicId}
      token={token}
      initial={initial as Parameters<typeof AnamnesisFormPublic>[0]['initial']}
    />
  )
}
