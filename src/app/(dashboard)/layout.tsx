import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import {
  LayoutDashboard,
  Calendar,
  Users,
  DollarSign,
  UserCog,
  Stethoscope,
  Megaphone,
  Settings,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/agenda", icon: Calendar, label: "Agenda" },
  { href: "/pacientes", icon: Users, label: "Pacientes" },
  { href: "/financeiro", icon: DollarSign, label: "Financeiro" },
  { href: "/equipe", icon: UserCog, label: "Equipe" },
  { href: "/tratamentos", icon: Stethoscope, label: "Tratamentos" },
  { href: "/marketing", icon: Megaphone, label: "Marketing" },
  { href: "/configuracoes", icon: Settings, label: "Configuracoes" },
]

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r bg-sidebar">
        <div className="flex h-14 items-center px-4 border-b">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">N</span>
            </div>
            <span className="font-bold">NaviClean</span>
          </Link>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t">
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              Sair
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 border-b flex items-center px-6 shrink-0">
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user.email}</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
