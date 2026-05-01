import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { EquipeClient } from "@/components/dashboard/equipe-client"

// Exportados para uso em /equipe/[id]/page.tsx
export const ROLE_LABELS: Record<string, string> = {
  clinic_owner: "Proprietário",
  dentist: "Dentista",
  doctor: "Médico",
  receptionist: "Recepcionista",
  independent_professional: "Profissional Independente",
}

export const ROLE_COLORS: Record<string, string> = {
  clinic_owner: "bg-primary/10 text-primary",
  dentist: "bg-nc-secondary/10 text-nc-secondary",
  doctor: "bg-primary/10 text-primary",
  receptionist: "bg-emerald-50 text-emerald-700",
  independent_professional: "bg-nc-secondary/10 text-nc-secondary",
}

export default async function EquipePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase.from("clinics").select("id").eq("owner_id", user.id).single()
  if (!clinic) redirect("/onboarding")

  const [{ data: members }, { data: aptCounts }] = await Promise.all([
    supabase
      .from("clinic_members")
      .select("id, role, specialty, cro, is_active, affiliation, full_name, created_at, profiles(full_name, email)")
      .eq("clinic_id", clinic.id)
      .order("created_at"),
    supabase
      .from("appointments")
      .select("dentist_id")
      .eq("clinic_id", clinic.id),
  ])

  // Contagem de consultas por membro
  const countMap: Record<string, number> = {}
  for (const apt of aptCounts ?? []) {
    if (apt.dentist_id) {
      countMap[apt.dentist_id as string] = (countMap[apt.dentist_id as string] ?? 0) + 1
    }
  }

  const safeMembers = (members ?? []).map((m) => {
    const profile = m.profiles as { full_name?: string; email?: string } | null
    return {
      id: m.id as string,
      role: m.role as string,
      specialty: m.specialty as string | null,
      is_active: m.is_active as boolean,
      full_name: ((m.full_name ?? profile?.full_name) as string | null),
      email: (profile?.email as string | null),
      consultations: countMap[m.id as string] ?? 0,
    }
  })

  const activeCount = safeMembers.filter((m) => m.is_active).length

  return (
    <div className="space-y-5 max-w-5xl">
      <div>
        <p className="nc-section-label text-outline/60 mb-1.5">Clínica</p>
        <h2 className="font-headline font-black text-primary tracking-tight" style={{ fontSize: "1.8rem", letterSpacing: "-0.03em" }}>
          Equipe
        </h2>
        <p className="text-on-surface-variant text-[13px] mt-1 font-sans">
          {activeCount} membro{activeCount !== 1 ? "s" : ""} ativo{activeCount !== 1 ? "s" : ""} hoje
        </p>
      </div>
      <EquipeClient members={safeMembers} />
    </div>
  )
}
