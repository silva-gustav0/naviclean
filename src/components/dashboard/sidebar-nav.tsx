"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { isNavRouteAllowed, canManageAppointments } from "@/lib/auth/nav-config"

const navSections = [
  {
    key: "principal",
    label: "Principal",
    items: [
      { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
      { href: "/agenda", icon: "calendar_month", label: "Agenda", hasBadge: true },
      { href: "/pacientes", icon: "assignment_ind", label: "Pacientes" },
      { href: "/financeiro", icon: "payments", label: "Financeiro" },
    ],
  },
  {
    key: "clinica",
    label: "Clínica",
    items: [
      { href: "/equipe", icon: "groups", label: "Equipe" },
      { href: "/tratamentos", icon: "stethoscope", label: "Tratamentos" },
      { href: "/estoque", icon: "inventory_2", label: "Estoque" },
    ],
  },
  {
    key: "sistema",
    label: "Sistema",
    items: [
      { href: "/treinamento", icon: "school", label: "Treinamento" },
      { href: "/configuracoes", icon: "settings", label: "Configurações" },
    ],
  },
]

interface SidebarNavProps {
  clinicName: string
  userEmail: string
  userInitials: string
  userRole: string
  userRoleLabel: string
  userName?: string
  agendaBadge?: number
}

export function SidebarNav({
  clinicName,
  userEmail,
  userInitials,
  userRole,
  userRoleLabel,
  userName,
  agendaBadge,
}: SidebarNavProps) {
  const pathname = usePathname()
  const showNewAppointment = canManageAppointments(userRole)

  const visibleSections = navSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => isNavRouteAllowed(userRole, item.href)),
    }))
    .filter((section) => section.items.length > 0)

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 z-40 bg-[#00244a] dark:bg-[#0a1628]">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-lg bg-nc-secondary flex items-center justify-center shrink-0">
          <span
            className="material-symbols-outlined text-white"
            style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}
          >
            medical_services
          </span>
        </div>
        <div className="min-w-0">
          <h1 className="text-sm font-bold text-white font-headline tracking-tight">NaviClin</h1>
          <p className="text-[10px] text-white/50 font-sans uppercase tracking-widest truncate">{clinicName}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {visibleSections.map((section) => (
          <div key={section.key}>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-2 mb-1.5">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href))
                const badge = item.hasBadge && agendaBadge && agendaBadge > 0 ? agendaBadge : null

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-headline font-semibold transition-all duration-150 ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span
                      className="material-symbols-outlined shrink-0"
                      style={{
                        fontSize: 20,
                        fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                      }}
                    >
                      {item.icon}
                    </span>
                    <span className="flex-1 truncate">{item.label}</span>
                    {badge && (
                      <span className="bg-nc-secondary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
                        {badge > 99 ? "99+" : badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* CTA */}
      {showNewAppointment && (
        <div className="px-3 pb-3">
          <Link
            href="/agenda"
            className="w-full py-2.5 px-4 rounded-xl bg-nc-secondary text-white text-sm font-headline font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
            Novo Agendamento
          </Link>
        </div>
      )}

      {/* User footer */}
      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-nc-secondary flex items-center justify-center text-white text-xs font-bold shrink-0 font-headline">
            {userInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              {userName ?? userEmail.split("@")[0]}
            </p>
            <p className="text-[10px] text-white/50">{userRoleLabel}</p>
          </div>
          <form action="/api/auth/signout" method="post">
            <button type="submit" className="p-1.5 hover:bg-white/10 rounded-lg transition-colors" title="Sair">
              <span
                className="material-symbols-outlined text-white/50 hover:text-white"
                style={{ fontSize: 18 }}
              >
                logout
              </span>
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}
