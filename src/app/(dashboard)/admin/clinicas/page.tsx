import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

const PLAN_COLORS: Record<string, string> = {
  solo:    "bg-surface-container text-on-surface-variant border-outline-variant",
  starter: "bg-blue-50 text-blue-700 border-blue-200",
  pro:     "bg-primary/10 text-primary border-primary/20",
}

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

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="font-headline font-extrabold text-2xl text-primary">Clínicas</h1>
        <p className="text-on-surface-variant text-sm mt-0.5">{clinics?.length ?? 0} clínicas cadastradas</p>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden overflow-x-auto shadow-premium-sm">
        <table className="w-full text-sm min-w-max">
          <thead className="bg-surface-container border-b border-outline-variant">
            <tr>
              <th className="text-left text-xs font-medium text-on-surface-variant px-5 py-3">Clínica</th>
              <th className="text-left text-xs font-medium text-on-surface-variant px-4 py-3">Proprietário</th>
              <th className="text-left text-xs font-medium text-on-surface-variant px-4 py-3">Plano</th>
              <th className="text-left text-xs font-medium text-on-surface-variant px-4 py-3">Status</th>
              <th className="text-left text-xs font-medium text-on-surface-variant px-4 py-3">Cadastro</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/50">
            {(clinics ?? []).map((c) => {
              const owner = c.profiles as { full_name?: string; email?: string } | null
              return (
                <tr key={c.id as string} className="hover:bg-surface-container transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg surgical-gradient flex items-center justify-center font-bold text-white text-xs shrink-0">
                        {(c.name as string)?.[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-on-surface">{c.name as string}</p>
                        <p className="text-xs text-on-surface-variant">/c/{c.slug as string}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-on-surface">{owner?.full_name ?? "—"}</p>
                    <p className="text-xs text-on-surface-variant">{owner?.email ?? "—"}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-medium ${PLAN_COLORS[c.subscription_plan as string] ?? PLAN_COLORS.solo}`}>
                      {c.subscription_plan as string ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-medium ${c.is_active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                      {c.is_active ? "Ativa" : "Inativa"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-on-surface-variant">
                    {new Date(c.created_at as string).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3">
                    <button className="p-1.5 hover:bg-surface-container rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 14 }}>shield</span>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {(!clinics || clinics.length === 0) && (
          <div className="py-14 text-center">
            <span className="material-symbols-outlined text-outline mb-2 block" style={{ fontSize: 32 }}>business</span>
            <p className="text-sm text-on-surface-variant">Nenhuma clínica cadastrada</p>
          </div>
        )}
      </div>
    </div>
  )
}
