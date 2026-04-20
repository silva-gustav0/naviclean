import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: clinic } = await supabase
    .from("clinics")
    .select("name")
    .eq("owner_id", user.id)
    .single()

  const fullName: string = (user.user_metadata?.full_name as string) ?? user.email ?? ""
  const initials = fullName
    .split(" ")
    .slice(0, 2)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase() || "?"

  const firstName = fullName.split(" ")[0] || "Usuário"

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <SidebarNav
        clinicName={clinic?.name ?? "Minha Clínica"}
        userEmail={user.email ?? ""}
        userInitials={initials}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden md:ml-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 glass-header flex items-center px-8 py-4 gap-4 shadow-premium">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">
                search
              </span>
              <input
                type="text"
                placeholder="Buscar pacientes, agendamentos..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-surface-container-low border-none rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button className="relative w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-primary">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-nc-secondary" />
              </button>
              <button className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-primary">help_outline</span>
              </button>
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-outline-variant/30">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-semibold text-primary font-headline">{firstName}</p>
                <p className="text-[10px] text-outline font-bold uppercase tracking-widest">Administrador</p>
              </div>
              <div className="w-10 h-10 rounded-full surgical-gradient flex items-center justify-center text-white text-xs font-bold border-2 border-surface-container-high">
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
  )
}
