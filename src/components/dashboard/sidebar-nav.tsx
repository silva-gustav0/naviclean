"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { isNavRouteAllowed, canManageAppointments } from "@/lib/auth/nav-config"
import { cn } from "@/lib/utils"

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
    <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 z-40 overflow-hidden">

      {/* ── Background ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(175deg, #001020 0%, #001e40 45%, #001530 100%)" }}
      />

      {/* ── Gold vertical rail ── */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] pointer-events-none"
        style={{ background: "linear-gradient(180deg, #c9943a 0%, #daa840 40%, rgba(201,148,58,0.15) 100%)" }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col h-full pl-[3px]">

        {/* ── Brand ── */}
        <div className="px-5 pt-6 pb-5">
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #c9943a 0%, #e0aa4e 100%)" }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 16, fontVariationSettings: "'FILL' 1", color: "#001020" }}
              >
                medical_services
              </span>
            </div>
            <div>
              <p className="text-white font-black font-headline text-[15px] tracking-tight leading-none">
                NaviClin
              </p>
              <p className="text-white/25 text-[8px] font-sans uppercase tracking-[0.22em] mt-0.5">
                Sistema Clínico
              </p>
            </div>
          </div>

          {/* Clinic identity badge */}
          <div
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
            style={{
              background: "rgba(201,148,58,0.07)",
              border: "1px solid rgba(201,148,58,0.20)",
            }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-[15px] font-headline shrink-0"
              style={{ background: "rgba(201,148,58,0.18)", color: "#c9943a" }}
            >
              {clinicName[0]?.toUpperCase() ?? "C"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white/85 text-[12px] font-semibold font-sans truncate leading-snug">
                {clinicName}
              </p>
              <p className="text-[9px] font-sans font-medium mt-0.5" style={{ color: "rgba(201,148,58,0.55)" }}>
                {userRoleLabel}
              </p>
            </div>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto px-3 pb-2">
          {visibleSections.map((section, sIdx) => (
            <div key={section.key} className={cn(sIdx > 0 && "mt-4")}>

              {/* Section label */}
              <p
                className="text-[9px] font-bold uppercase tracking-[0.22em] font-sans px-3 mb-1.5"
                style={{ color: "rgba(201,148,58,0.40)" }}
              >
                {section.label}
              </p>

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
                        "flex items-center gap-3 px-3 py-[9px] rounded-xl text-[13px] font-medium font-sans transition-all duration-150",
                        isActive
                          ? "shadow-md"
                          : "text-white/38 hover:text-white/72 hover:bg-white/[0.05]"
                      )}
                      style={
                        isActive
                          ? { background: "linear-gradient(90deg, #c9943a 0%, #daa840 100%)", color: "#001020" }
                          : {}
                      }
                    >
                      <span
                        className="material-symbols-outlined shrink-0"
                        style={{
                          fontSize: 17,
                          fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                          color: isActive ? "#001020" : undefined,
                        }}
                      >
                        {item.icon}
                      </span>
                      <span className={cn("flex-1 truncate", isActive && "font-semibold")}>
                        {item.label}
                      </span>
                      {badge && !isActive && (
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center leading-none"
                          style={{ background: "linear-gradient(135deg, #c9943a 0%, #daa840 100%)", color: "#001020" }}
                        >
                          {badge > 99 ? "99+" : badge}
                        </span>
                      )}
                      {isActive && (
                        <span
                          className="material-symbols-outlined shrink-0"
                          style={{ fontSize: 13, color: "rgba(0,16,32,0.45)" }}
                        >
                          chevron_right
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* ── CTA ── */}
        {showNewAppointment && (
          <div className="px-4 pb-3">
            <Link
              href="/agenda"
              className="w-full py-2.5 px-4 rounded-xl text-[12px] font-bold font-sans flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
              style={{ background: "linear-gradient(135deg, #c9943a 0%, #daa840 100%)", color: "#001020" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span>
              Novo Agendamento
            </Link>
          </div>
        )}

        {/* ── User footer ── */}
        <div className="px-4 pb-5">
          <div
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.035)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black font-headline shrink-0"
              style={{ background: "linear-gradient(135deg, #c9943a 0%, #daa840 100%)", color: "#001020" }}
            >
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-white/65 truncate font-sans leading-tight">
                {userName ?? userEmail.split("@")[0]}
              </p>
              <p className="text-[9px] text-white/25 font-sans">{userEmail}</p>
            </div>
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors group"
                title="Sair"
              >
                <span
                  className="material-symbols-outlined text-white/20 group-hover:text-white/55 transition-colors"
                  style={{ fontSize: 14 }}
                >
                  logout
                </span>
              </button>
            </form>
          </div>
        </div>

      </div>
    </aside>
  )
}
