import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Building2, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default async function AdminClinicasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "super_admin") redirect("/dashboard")

  const { data: clinics } = await supabase
    .from("clinics")
    .select("id, name, subscription_plan, is_active, created_at, slug, owner_id, profiles(full_name, email)")
    .order("created_at", { ascending: false })
    .limit(200)

  const PLAN_COLORS: Record<string, string> = {
    solo: "bg-slate-100 text-slate-600",
    starter: "bg-blue-100 text-blue-700",
    pro: "bg-violet-100 text-violet-700",
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold">Clínicas</h1>
          <p className="text-muted-foreground text-sm">{clinics?.length ?? 0} clínicas cadastradas</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-max">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b">
            <tr>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Clínica</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Proprietário</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Plano</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Cadastro</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {(clinics ?? []).map((c) => {
              const owner = c.profiles as { full_name?: string; email?: string } | null
              return (
                <tr key={c.id as string} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#E8F0F9] flex items-center justify-center font-bold text-[#0D3A6B] text-xs shrink-0">
                        {(c.name as string)?.[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{c.name as string}</p>
                        <p className="text-xs text-muted-foreground">/c/{c.slug as string}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm">{owner?.full_name ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">{owner?.email ?? "—"}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={`text-[10px] ${PLAN_COLORS[c.subscription_plan as string] ?? "bg-slate-100 text-slate-600"}`}>
                      {c.subscription_plan as string ?? "—"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={`text-[10px] ${c.is_active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                      {c.is_active ? "Ativa" : "Inativa"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date(c.created_at as string).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3">
                    <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                      <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {(!clinics || clinics.length === 0) && (
          <div className="py-14 text-center">
            <Building2 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Nenhuma clínica cadastrada</p>
          </div>
        )}
      </div>
    </div>
  )
}
