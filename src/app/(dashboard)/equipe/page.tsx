import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { UserCog, Mail, Shield, BadgeCheck } from "lucide-react"
import { InviteMemberModal } from "@/components/dashboard/modals/invite-member-modal"

export const ROLE_LABELS: Record<string, string> = {
  clinic_owner: "Proprietário",
  dentist: "Dentista",
  doctor: "Médico",
  receptionist: "Recepcionista",
  independent_professional: "Profissional Independente",
}

export const ROLE_COLORS: Record<string, string> = {
  clinic_owner: "bg-violet-100 text-violet-700",
  dentist: "bg-blue-100 text-blue-700",
  doctor: "bg-sky-100 text-sky-700",
  receptionist: "bg-emerald-100 text-emerald-700",
  independent_professional: "bg-amber-100 text-amber-700",
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
          <h1 className="text-2xl font-bold">Equipe</h1>
          <p className="text-muted-foreground text-sm">
            {activeCount} membro{activeCount !== 1 ? "s" : ""} ativo{activeCount !== 1 ? "s" : ""}
          </p>
        </div>
        <InviteMemberModal />
      </div>

      {members && members.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
          <div className="divide-y">
            {members.map((m) => {
              const profile = m.profiles as { full_name?: string; email?: string } | null
              const name = (m.full_name ?? profile?.full_name) ?? "Sem nome"
              const email = profile?.email ?? "—"
              const initials = name.split(" ").slice(0, 2).map((n: string) => n[0]).join("").toUpperCase()
              const role = m.role as string

              return (
                <div key={m.id as string} className={`flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${!m.is_active ? 'opacity-50' : ''}`}>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0D3A6B] to-[#1A5599] flex items-center justify-center text-white text-sm font-semibold shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm">{name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[role] ?? ROLE_COLORS.dentist}`}>
                        {ROLE_LABELS[role] ?? role}
                      </span>
                      {m.affiliation === 'independent' && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600">
                          Independente
                        </span>
                      )}
                      {!m.is_active && <span className="text-xs text-red-500">Inativo</span>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                      <span>{email}</span>
                      {m.specialty && <span>• {m.specialty}</span>}
                      {m.cro && <span className="flex items-center gap-1"><BadgeCheck className="h-3 w-3" />{m.cro}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {email !== "—" && (
                      <a href={`mailto:${email}`} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Enviar email">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#E8F0F9] flex items-center justify-center mx-auto mb-4">
            <UserCog className="h-8 w-8 text-[#0D3A6B]" />
          </div>
          <h3 className="font-semibold text-base mb-1">Nenhum membro ainda</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
            Convide dentistas, médicos e recepcionistas para colaborar.
          </p>
          <InviteMemberModal />
        </div>
      )}

      {/* Roles legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(ROLE_LABELS).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1.5 text-xs">
            <span className={`px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[key]}`}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
