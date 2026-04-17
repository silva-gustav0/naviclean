import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NewPatientModal } from "@/components/dashboard/modals/new-patient-modal"
import { PatientsList } from "@/components/dashboard/patients-list"

export default async function PacientesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase.from("clinics").select("id").eq("owner_id", user.id).single()
  if (!clinic) redirect("/onboarding")

  const { data: patients } = await supabase
    .from("patients")
    .select("id, full_name, email, phone, date_of_birth")
    .eq("clinic_id", clinic.id)
    .order("full_name")
    .limit(200)

  const safePatients = (patients ?? []).map((p) => ({
    id: p.id as string,
    full_name: p.full_name as string,
    email: p.email as string | null,
    phone: p.phone as string | null,
    date_of_birth: p.date_of_birth as string | null,
  }))

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline font-extrabold text-3xl text-primary tracking-tight">Pacientes</h2>
          <p className="text-on-surface-variant text-sm mt-1 font-sans">
            {safePatients.length} paciente{safePatients.length !== 1 ? "s" : ""} cadastrado{safePatients.length !== 1 ? "s" : ""}
          </p>
        </div>
        <NewPatientModal />
      </div>

      {safePatients.length > 0 ? (
        <PatientsList patients={safePatients} />
      ) : (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 py-16 text-center shadow-premium-sm">
          <div className="w-16 h-16 rounded-2xl bg-nc-secondary/10 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-nc-secondary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              groups
            </span>
          </div>
          <h3 className="font-headline font-semibold text-primary text-base mb-1">Nenhum paciente ainda</h3>
          <p className="text-on-surface-variant text-sm mb-6 max-w-xs mx-auto font-sans">
            Cadastre o primeiro paciente para começar a organizar os atendimentos.
          </p>
          <NewPatientModal />
        </div>
      )}
    </div>
  )
}
