import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Building2, Users, DollarSign, TrendingDown, Ticket, ChevronRight } from "lucide-react"
import Link from "next/link"

const adminLinks = [
  { href: "/admin/clinicas", icon: Building2, label: "Clínicas", color: "bg-blue-50 text-blue-600" },
  { href: "/admin/usuarios", icon: Users, label: "Usuários", color: "bg-violet-50 text-violet-600" },
  { href: "/admin/subscription_planos", icon: DollarSign, label: "Planos", color: "bg-emerald-50 text-emerald-600" },
  { href: "/admin/cupons", icon: Ticket, label: "Cupons", color: "bg-amber-50 text-amber-600" },
  { href: "/admin/logs", icon: TrendingDown, label: "Logs", color: "bg-slate-100 text-slate-600" },
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

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#0D3A6B] flex items-center justify-center">
          <span className="text-white font-bold text-sm">A</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold">Painel Admin</h1>
          <p className="text-muted-foreground text-sm">NaviClin Super Admin</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Clínicas ativas", value: String(clinicCount ?? 0), icon: Building2, color: "bg-blue-50 text-blue-600" },
          { label: "Usuários totais", value: String(userCount ?? 0), icon: Users, color: "bg-violet-50 text-violet-600" },
          { label: "MRR estimado", value: "R$ —", icon: DollarSign, color: "bg-emerald-50 text-emerald-600" },
          { label: "Novos (30d)", value: "—", icon: TrendingDown, color: "bg-amber-50 text-amber-600" },
        ].map((k) => (
          <div key={k.label} className="bg-white dark:bg-slate-900 border rounded-2xl p-4">
            <div className={`w-8 h-8 rounded-xl ${k.color} flex items-center justify-center mb-2`}>
              <k.icon className="h-4 w-4" />
            </div>
            <p className="text-xl font-bold">{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Quick nav */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {adminLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="bg-white dark:bg-slate-900 border rounded-xl p-4 flex items-center gap-2 hover:border-[#0D3A6B]/30 hover:shadow-sm transition-all group text-sm font-medium"
          >
            <div className={`w-8 h-8 rounded-lg ${l.color} flex items-center justify-center shrink-0`}>
              <l.icon className="h-4 w-4" />
            </div>
            {l.label}
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground ml-auto group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ))}
      </div>

      {/* Recent clinics */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-sm">Clínicas recentes</h2>
          <Link href="/admin/clinicas" className="text-xs text-blue-600 hover:underline">Ver todas</Link>
        </div>
        {recentClinics && recentClinics.length > 0 ? (
          <div className="divide-y">
            {recentClinics.map((c) => (
              <div key={c.id as string} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#E8F0F9] flex items-center justify-center font-bold text-[#0D3A6B] text-xs shrink-0">
                  {(c.name as string)?.[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{c.name as string}</p>
                  <p className="text-xs text-muted-foreground">{new Date(c.created_at as string).toLocaleDateString("pt-BR")}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                  {c.is_active ? "Ativa" : "Inativa"}
                </span>
                <span className="text-xs text-muted-foreground">{c.subscription_plan as string}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-muted-foreground">Nenhuma clínica cadastrada</div>
        )}
      </div>
    </div>
  )
}
