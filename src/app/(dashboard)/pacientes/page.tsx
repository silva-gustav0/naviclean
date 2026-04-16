import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Users } from "lucide-react"
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
          <h1 className="text-2xl font-bold">Pacientes</h1>
          <p className="text-muted-foreground text-sm">
            {safePatients.length} paciente{safePatients.length !== 1 ? "s" : ""} cadastrado{safePatients.length !== 1 ? "s" : ""}
          </p>
        </div>
        <NewPatientModal />
      </div>

      {safePatients.length > 0 ? (
        <PatientsList patients={safePatients} />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-emerald-600" />
          </div>
          <h3 className="font-semibold text-base mb-1">Nenhum paciente ainda</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
            Cadastre o primeiro paciente para começar a organizar os atendimentos.
          </p>
          <NewPatientModal />
        </div>
      )}
    </div>
  )
}
