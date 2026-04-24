import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { InviteMemberModal } from "@/components/dashboard/modals/invite-member-modal"

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

  const { data: members } = await supabase
    .from("clinic_members")
    .select("id, role, specialty, cro, is_active, affiliation, full_name, created_at, profiles(full_name, email, avatar_url)")
    .eq("clinic_id", clinic.id)
    .order("created_at")

  const activeCount = members?.filter((m) => m.is_active).length ?? 0

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline font-extrabold text-3xl text-primary tracking-tight">Equipe</h2>
          <p className="text-on-surface-variant text-sm mt-1 font-sans">
            {activeCount} membro{activeCount !== 1 ? "s" : ""} ativo{activeCount !== 1 ? "s" : ""}
          </p>
        </div>
        <InviteMemberModal />
      </div>

      {members && members.length > 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden shadow-premium-sm">
          <div className="divide-y divide-outline-variant/10">
            {members.map((m) => {
              const profile = m.profiles as { full_name?: string; email?: string } | null
              const name = (m.full_name ?? profile?.full_name) ?? "Sem nome"
              const email = profile?.email ?? "—"
              const initials = name.split(" ").slice(0, 2).map((n: string) => n[0]).join("").toUpperCase()
              const role = m.role as string

              return (
                <div key={m.id as string} className={`flex items-center gap-4 px-5 py-4 hover:bg-surface-container-low transition-colors ${!m.is_active ? "opacity-50" : ""}`}>
                  <div className="w-10 h-10 rounded-full surgical-gradient flex items-center justify-center text-white text-sm font-bold shrink-0 font-headline">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm text-primary font-headline">{name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold font-sans ${ROLE_COLORS[role] ?? ROLE_COLORS.dentist}`}>
                        {ROLE_LABELS[role] ?? role}
                      </span>
                      {m.affiliation === "independent" && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-surface-container-low text-on-surface-variant font-sans">
                          Independente
                        </span>
                      )}
                      {!m.is_active && <span className="text-xs text-red-500 font-sans">Inativo</span>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-on-surface-variant mt-0.5 font-sans">
                      <span>{email}</span>
                      {m.specialty && <span>· {m.specialty}</span>}
                      {m.cro && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                          {m.cro}
                        </span>
                      )}
                    </div>
                  </div>
                  {email !== "—" && (
                    <a
                      href={`mailto:${email}`}
                      className="p-2 hover:bg-surface-container-low rounded-lg transition-colors"
                      title="Enviar email"
                    >
                      <span className="material-symbols-outlined text-outline text-xl">mail</span>
                    </a>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 py-16 text-center shadow-premium-sm">
          <div className="w-16 h-16 rounded-2xl bg-nc-secondary/10 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-nc-secondary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              manage_accounts
            </span>
          </div>
          <h3 className="font-headline font-semibold text-primary text-base mb-1">Nenhum membro ainda</h3>
          <p className="text-on-surface-variant text-sm mb-6 max-w-xs mx-auto font-sans">
            Convide profissionais e recepcionistas para colaborar.
          </p>
          <InviteMemberModal />
        </div>
      )}

      {/* Roles legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(ROLE_LABELS).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1.5 text-xs">
            <span className={`px-2 py-0.5 rounded-full font-semibold font-sans ${ROLE_COLORS[key]}`}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
