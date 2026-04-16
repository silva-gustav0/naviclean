import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Shield, Plus } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { InsurancePlanModal } from "@/components/dashboard/modals/insurance-plan-modal"

export default async function ConveniosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase.from("clinics").select("id").eq("owner_id", user.id).single()
  if (!clinic) redirect("/onboarding")

  const { data: plans } = await supabase
    .from("insurance_plans")
    .select("*")
    .eq("clinic_id", clinic.id)
    .order("name")

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/configuracoes" className="hover:text-foreground transition-colors">Configurações</Link>
            <span>/</span>
            <span>Convênios</span>
          </div>
          <h1 className="text-2xl font-bold">Convênios</h1>
          <p className="text-muted-foreground text-sm">{plans?.length ?? 0} planos cadastrados</p>
        </div>
        <InsurancePlanModal />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
        {(plans ?? []).length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-base mb-1">Nenhum convênio cadastrado</h3>
            <p className="text-muted-foreground text-sm mb-4 max-w-xs mx-auto">
              Cadastre os planos e convênios aceitos pela sua clínica.
            </p>
            <InsurancePlanModal />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b">
              <tr>
                <th className="text-left font-medium text-xs text-muted-foreground px-5 py-3">Plano</th>
                <th className="text-left font-medium text-xs text-muted-foreground px-4 py-3">Código ANS</th>
                <th className="text-center font-medium text-xs text-muted-foreground px-4 py-3">Status</th>
                <th className="text-right font-medium text-xs text-muted-foreground px-5 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {(plans ?? []).map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <Shield className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{p.ans_code ?? "—"}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge className={p.is_active ? "bg-emerald-100 text-emerald-700 text-[10px]" : "bg-slate-100 text-slate-500 text-[10px]"}>
                      {p.is_active ? "Ativo" : "Inativo"}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <InsurancePlanModal plan={p} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
