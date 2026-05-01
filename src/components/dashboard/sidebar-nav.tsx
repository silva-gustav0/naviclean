"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { isNavRouteAllowed, canManageAppointments } from "@/lib/auth/nav-config"
import { cn } from "@/lib/utils"

const navSections = [
  {
    key: "principal",
    items: [
      { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
      { href: "/agenda", icon: "calendar_month", label: "Agenda", hasBadge: true },
      { href: "/pacientes", icon: "assignment_ind", label: "Pacientes" },
      { href: "/financeiro", icon: "payments", label: "Financeiro" },
    ],
  },
  {
    key: "clinica",
    items: [
      { href: "/equipe", icon: "groups", label: "Equipe" },
      { href: "/tratamentos", icon: "stethoscope", label: "Tratamentos" },
      { href: "/estoque", icon: "inventory_2", label: "Estoque" },
    ],
  },
  {
    key: "sistema",
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
    <aside className="nc-sidebar hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 z-40">

      {/* Brand */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-2.5 mb-5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #c9943a 0%, #daa840 100%)" }}
          >
            <span
              className="material-symbols-outlined text-white"
              style={{ fontSize: 15, fontVariationSettings: "'FILL' 1" }}
            >
              medical_services
            </span>
          </div>
          <span className="text-white font-headline font-bold text-[14px] tracking-tight">NaviClin</span>
        </div>
        <div className="border-t border-white/[0.07] pt-4">
          <p className="text-[9px] text-white/25 uppercase tracking-[0.18em] font-sans mb-1">Clínica</p>
          <p className="text-[13px] font-semibold text-white/85 font-sans leading-tight truncate">{clinicName}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
        {visibleSections.map((section, sIdx) => (
          <div key={section.key} className={cn(sIdx > 0 && "pt-3 mt-2 border-t border-white/[0.06]")}>
            <div className="space-y-px">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href))
                const badge = item.hasBadge && agendaBadge && agendaBadge > 0 ? agendaBadge : null

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-[9px] rounded-xl text-[13px] font-medium font-sans transition-colors duration-100 group",
                      isActive
                        ? "bg-white/[0.09] text-white"
                        : "text-white/45 hover:text-white/80 hover:bg-white/[0.05]"
                    )}
                    style={
                      isActive
                        ? { borderLeft: "2px solid #c9943a", paddingLeft: "10px" }
                        : { borderLeft: "2px solid transparent", paddingLeft: "10px" }
                    }
                  >
                    <span
                      className="material-symbols-outlined shrink-0 transition-colors"
                      style={{
                        fontSize: 18,
                        fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                        color: isActive ? "#c9943a" : "inherit",
                      }}
                    >
                      {item.icon}
                    </span>
                    <span className="flex-1 truncate">{item.label}</span>
                    {badge && (
                      <span
                        className="text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none"
                        style={{ background: "linear-gradient(135deg, #c9943a 0%, #daa840 100%)" }}
                      >
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
            className="w-full py-2.5 px-4 rounded-xl text-white text-[13px] font-semibold font-sans flex items-center justify-center gap-2 transition-opacity hover:opacity-90 active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #c9943a 0%, #daa840 100%)" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
            Novo Agendamento
          </Link>
        </div>
      )}

      {/* User footer */}
      <div className="border-t border-white/[0.07] p-3">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/[0.05] transition-colors">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0 font-headline ring-1 ring-white/15"
            style={{ background: "linear-gradient(135deg, #c9943a 0%, #b88a3e 100%)" }}
          >
            {userInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-white/85 truncate leading-tight font-sans">
              {userName ?? userEmail.split("@")[0]}
            </p>
            <p className="text-[10px] text-white/30 truncate font-sans mt-0.5">{userRoleLabel}</p>
          </div>
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors group"
              title="Sair"
            >
              <span
                className="material-symbols-outlined text-white/25 group-hover:text-white/60 transition-colors"
                style={{ fontSize: 16 }}
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
