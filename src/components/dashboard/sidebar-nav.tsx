"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/agenda", icon: "calendar_month", label: "Agenda" },
  { href: "/pacientes", icon: "assignment_ind", label: "Pacientes" },
  { href: "/financeiro", icon: "payments", label: "Financeiro" },
  { href: "/equipe", icon: "groups", label: "Equipe" },
  { href: "/tratamentos", icon: "stethoscope", label: "Tratamentos" },
  { href: "/estoque", icon: "inventory_2", label: "Estoque" },
  { href: "/marketing", icon: "campaign", label: "Marketing" },
  { href: "/configuracoes", icon: "settings", label: "Configurações" },
]

interface SidebarNavProps {
  clinicName: string
  userEmail: string
  userInitials: string
}

export function SidebarNav({ clinicName, userEmail, userInitials }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col bg-surface-container-low h-screen w-64 fixed left-0 top-0 z-40 p-4 gap-2">
      {/* Brand */}
      <div className="flex items-center gap-3 px-2 py-5">
        <div className="w-10 h-10 rounded-lg surgical-gradient flex items-center justify-center shadow-premium-sm text-white shrink-0">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            medical_services
          </span>
        </div>
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-primary font-headline tracking-tight leading-tight">NaviClin</h1>
          <p className="text-[10px] text-on-surface-variant font-sans uppercase tracking-widest truncate">
            {clinicName}
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-headline font-semibold text-sm transition-all duration-200 hover:translate-x-1 ${
                isActive
                  ? "bg-surface-container-lowest text-primary shadow-sm"
                  : "text-slate-500 hover:bg-surface-container-highest/50 hover:text-primary"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* CTA */}
      <Link
        href="/agenda"
        className="mt-4 w-full py-3 px-4 rounded-xl surgical-gradient text-white text-sm font-headline font-bold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 hover:opacity-90"
      >
        <span className="material-symbols-outlined text-sm">add</span>
        Novo Agendamento
      </Link>

      {/* Footer */}
      <div className="mt-3 border-t border-outline-variant/20 pt-3 flex flex-col gap-1">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full surgical-gradient flex items-center justify-center text-white text-xs font-bold shrink-0">
            {userInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium truncate text-on-surface">{userEmail}</p>
            <p className="text-[10px] text-on-surface-variant">Administrador</p>
          </div>
        </div>
        <form action="/api/auth/signout" method="post">
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-headline font-semibold text-slate-500 hover:bg-error-container/20 hover:text-error transition-all duration-200 hover:translate-x-1"
          >
            <span className="material-symbols-outlined">logout</span>
            Sair
          </button>
        </form>
      </div>
    </aside>
  )
}
