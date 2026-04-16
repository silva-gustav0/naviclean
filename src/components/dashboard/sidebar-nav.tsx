"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Calendar,
  Users,
  DollarSign,
  UserCog,
  Stethoscope,
  Megaphone,
  Settings,
  LogOut,
  Package,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", color: "text-violet-500" },
  { href: "/agenda", icon: Calendar, label: "Agenda", color: "text-blue-500" },
  { href: "/pacientes", icon: Users, label: "Pacientes", color: "text-emerald-500" },
  { href: "/financeiro", icon: DollarSign, label: "Financeiro", color: "text-amber-500" },
  { href: "/equipe", icon: UserCog, label: "Equipe", color: "text-pink-500" },
  { href: "/tratamentos", icon: Stethoscope, label: "Tratamentos", color: "text-cyan-500" },
  { href: "/estoque", icon: Package, label: "Estoque", color: "text-teal-500" },
  { href: "/marketing", icon: Megaphone, label: "Marketing", color: "text-orange-500" },
  { href: "/configuracoes", icon: Settings, label: "Configurações", color: "text-slate-500" },
]

interface SidebarNavProps {
  clinicName: string
  userEmail: string
  userInitials: string
}

export function SidebarNav({ clinicName, userEmail, userInitials }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-white dark:bg-slate-950 shadow-sm">
      {/* Logo */}
      <div className="flex h-16 items-center px-5 border-b gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#0D3A6B] flex items-center justify-center shadow-sm">
          <span className="text-white font-bold text-sm">N</span>
        </div>
        <div className="min-w-0">
          <p className="font-bold text-sm leading-tight truncate">NaviClin</p>
          <p className="text-xs text-muted-foreground truncate">{clinicName}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-50"
              }`}
            >
              <item.icon className={`h-4 w-4 shrink-0 ${isActive ? item.color : ""}`} />
              {item.label}
              {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />}
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="p-3 border-t">
        <div className="flex items-center gap-3 px-2 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {userInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium truncate">{userEmail}</p>
            <p className="text-xs text-muted-foreground">Administrador</p>
          </div>
        </div>
        <form action="/api/auth/signout" method="post">
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400 transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sair da conta
          </button>
        </form>
      </div>
    </aside>
  )
}
