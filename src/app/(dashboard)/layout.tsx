import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { ROLE_LABELS } from "@/lib/auth/nav-config"
import { AppointmentReminder } from "@/components/dashboard/agenda/AppointmentReminder"
import { ClinicConfigProvider, type ClinicType } from "@/lib/clinic-config-context"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  let clinicName = "Minha Clínica"
  let clinicId = ""
  let effectiveRole = "clinic_owner"
  let displayRoleLabel = "Administrador"
  let memberId: string | null = null
  let clinicType: ClinicType = "dental"

  const [{ data: ownedClinic }, { data: profile }] = await Promise.all([
    supabase.from("clinics").select("id, name, clinic_type").eq("owner_id", user.id).single(),
    supabase.from("profiles").select("full_name").eq("id", user.id).single(),
  ])

  if (ownedClinic) {
    clinicName = ownedClinic.name
    clinicId = ownedClinic.id
    effectiveRole = "clinic_owner"
    clinicType = ((ownedClinic as Record<string, unknown>).clinic_type as ClinicType) ?? "dental"

    // Check if owner also has a professional role in clinic_members
    const { data: ownerMembership } = await supabase
      .from("clinic_members")
      .select("id, role")
      .eq("user_id", user.id)
      .eq("clinic_id", ownedClinic.id)
      .eq("is_active", true)
      .maybeSingle()

    memberId = ownerMembership?.id ?? null
    displayRoleLabel = ownerMembership?.role
      ? (ROLE_LABELS[ownerMembership.role as string] ?? "Administrador")
      : "Administrador"
  } else {
    const { data: membership } = await supabase
      .from("clinic_members")
      .select("id, role, clinic_id")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single()

    if (!membership) redirect("/onboarding")

    const memberRole = membership.role as string
    effectiveRole = memberRole === "independent_professional" ? "affiliated_professional" : memberRole
    clinicId = membership.clinic_id
    memberId = membership.id as string
    displayRoleLabel = ROLE_LABELS[effectiveRole] ?? "Usuário"

    const { data: memberClinic } = await supabase
      .from("clinics")
      .select("name, clinic_type")
      .eq("id", membership.clinic_id)
      .single()

    clinicName = memberClinic?.name ?? "Clínica"
    clinicType = ((memberClinic as Record<string, unknown> | null)?.clinic_type as ClinicType) ?? "dental"
  }

  // Badge de agendamentos de hoje na sidebar
  const todayStr = new Date().toISOString().split("T")[0]
  const { count: agendaBadge } = clinicId
    ? await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("clinic_id", clinicId)
        .eq("date", todayStr)
    : { count: 0 }

  const fullName: string =
    (profile?.full_name as string) ?? (user.user_metadata?.full_name as string) ?? ""
  const initials = fullName
    .split(" ")
    .slice(0, 2)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase() || (user.email?.[0]?.toUpperCase() ?? "?")

  const firstName = fullName.split(" ")[0] || "Usuário"
  const roleLabel = displayRoleLabel

  return (
    <ClinicConfigProvider clinicType={clinicType} userRole={effectiveRole}>
    <div className="flex h-screen overflow-hidden bg-background">
      <AppointmentReminder memberId={memberId} clinicId={clinicId} />
      <SidebarNav
        clinicName={clinicName}
        userEmail={user.email ?? ""}
        userInitials={initials}
        userRole={effectiveRole}
        userRoleLabel={roleLabel}
        userName={fullName || undefined}
        agendaBadge={agendaBadge ?? 0}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden md:ml-64">
        {/* Topbar */}
        <header className="nc-topbar sticky top-0 z-30 flex items-center px-6 py-2.5 gap-4 border-b border-outline-variant/15">
          <div className="flex-1 max-w-sm">
            <div className="relative">
              <span
                className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline/40"
                style={{ fontSize: 16 }}
              >
                search
              </span>
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full pl-9 pr-4 py-1.5 text-[13px] bg-surface-container-low/70 border border-outline-variant/20 rounded-full focus:outline-none focus:ring-1 focus:ring-primary/15 transition-colors placeholder:text-outline/35 font-sans"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
            <button className="relative w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-outline/60" style={{ fontSize: 18 }}>
                notifications
              </span>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-nc-secondary" />
            </button>
            <a
              href="/contato"
              className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-outline/60" style={{ fontSize: 18 }}>
                help_outline
              </span>
            </a>
            <div className="w-px h-5 bg-outline-variant/30 mx-1.5" />
            <div className="flex items-center gap-2 cursor-default">
              <div className="text-right hidden lg:block">
                <p className="text-[12px] font-semibold text-primary leading-tight font-sans">{firstName}</p>
                <p className="text-[9px] text-outline/60 uppercase tracking-widest font-sans">{roleLabel}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#00244a] dark:bg-[#1a4070] flex items-center justify-center text-white text-[11px] font-bold font-headline">
                {initials}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
    </ClinicConfigProvider>
  )
}
