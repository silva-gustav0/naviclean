import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

const adminLinks = [
  { href: "/admin/clinicas",  icon: "business",    label: "Clínicas",  cls: "text-blue-600",    bg: "bg-blue-50" },
  { href: "/admin/usuarios",  icon: "group",       label: "Usuários",  cls: "text-primary",     bg: "bg-primary/10" },
  { href: "/admin/planos",    icon: "payments",    label: "Planos",    cls: "text-emerald-600", bg: "bg-emerald-50" },
  { href: "/admin/cupons",    icon: "local_offer", label: "Cupons",    cls: "text-nc-secondary",bg: "bg-nc-secondary/10" },
  { href: "/admin/logs",      icon: "history",     label: "Logs",      cls: "text-on-surface-variant", bg: "bg-surface-container" },
]

const kpis = [
  { label: "Clínicas ativas",  icon: "business",     cls: "text-blue-600",    bg: "bg-blue-50" },
  { label: "Usuários totais",  icon: "group",        cls: "text-primary",     bg: "bg-primary/10" },
  { label: "MRR estimado",     icon: "payments",     cls: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Novos (30d)",      icon: "trending_up",  cls: "text-nc-secondary",bg: "bg-nc-secondary/10" },
]

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "super_admin") redirect("/dashboard")

  const [{ count: clinicCount }, { count: userCount }] = await Promise.all([
    supabase.from("clinics").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
  ])

  const { data: recentClinics } = await supabase
    .from("clinics")
    .select("id, name, subscription_plan, is_active, created_at")
    .order("created_at", { ascending: false })
    .limit(5)

  const kpiValues = [String(clinicCount ?? 0), String(userCount ?? 0), "R$ —", "—"]

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl surgical-gradient flex items-center justify-center shadow-premium-sm">
          <span className="material-symbols-outlined text-white" style={{ fontSize: 20 }}>admin_panel_settings</span>
        </div>
        <div>
          <h1 className="font-headline font-extrabold text-2xl text-primary">Painel Admin</h1>
          <p className="text-on-surface-variant text-sm">NaviClin Super Admin</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <div key={k.label} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 shadow-premium-sm">
            <div className={`w-8 h-8 rounded-xl ${k.bg} flex items-center justify-center mb-2`}>
              <span className={`material-symbols-outlined ${k.cls}`} style={{ fontSize: 16 }}>{k.icon}</span>
            </div>
            <p className="font-headline font-bold text-xl text-on-surface">{kpiValues[i]}</p>
            <p className="text-xs text-on-surface-variant">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Quick nav */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {adminLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-center gap-2 hover:border-primary/30 hover:shadow-premium-sm transition-all group text-sm font-medium text-on-surface"
          >
            <div className={`w-8 h-8 rounded-lg ${l.bg} flex items-center justify-center shrink-0`}>
              <span className={`material-symbols-outlined ${l.cls}`} style={{ fontSize: 16 }}>{l.icon}</span>
            </div>
            {l.label}
            <span className="material-symbols-outlined text-on-surface-variant ml-auto group-hover:translate-x-0.5 transition-transform" style={{ fontSize: 14 }}>chevron_right</span>
          </Link>
        ))}
      </div>

      {/* Recent clinics */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-premium-sm">
        <div className="px-5 py-4 border-b border-outline-variant bg-surface-container flex items-center justify-between">
          <h2 className="font-semibold text-sm text-on-surface">Clínicas recentes</h2>
          <Link href="/admin/clinicas" className="text-xs text-primary hover:text-primary/80 transition-colors font-medium">Ver todas</Link>
        </div>
        {recentClinics && recentClinics.length > 0 ? (
          <div className="divide-y divide-outline-variant/50">
            {recentClinics.map((c) => (
              <div key={c.id as string} className="flex items-center gap-4 px-5 py-3 hover:bg-surface-container transition-colors">
                <div className="w-8 h-8 rounded-lg surgical-gradient flex items-center justify-center font-bold text-white text-xs shrink-0">
                  {(c.name as string)?.[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-on-surface">{c.name as string}</p>
                  <p className="text-xs text-on-surface-variant">{new Date(c.created_at as string).toLocaleDateString("pt-BR")}</p>
                </div>
                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${c.is_active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-surface-container text-on-surface-variant border-outline-variant"}`}>
                  {c.is_active ? "Ativa" : "Inativa"}
                </span>
                <span className="text-xs text-on-surface-variant">{c.subscription_plan as string}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-on-surface-variant">Nenhuma clínica cadastrada</div>
        )}
      </div>
    </div>
  )
}
