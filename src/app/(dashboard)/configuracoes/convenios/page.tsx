import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
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
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mb-1">
            <Link href="/configuracoes" className="hover:text-primary transition-colors">Configurações</Link>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
            <span className="text-on-surface">Convênios</span>
          </div>
          <h1 className="font-headline font-extrabold text-2xl text-primary">Convênios</h1>
          <p className="text-on-surface-variant text-sm mt-0.5">{plans?.length ?? 0} planos cadastrados</p>
        </div>
        <InsurancePlanModal />
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-premium-sm">
        {(plans ?? []).length === 0 ? (
          <div className="py-16 text-center">
            <span className="material-symbols-outlined text-outline mb-3 block" style={{ fontSize: 40 }}>health_and_safety</span>
            <h3 className="font-semibold text-on-surface text-base mb-1">Nenhum convênio cadastrado</h3>
            <p className="text-on-surface-variant text-sm mb-4 max-w-xs mx-auto">
              Cadastre os planos e convênios aceitos pela sua clínica.
            </p>
            <InsurancePlanModal />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface-container border-b border-outline-variant">
              <tr>
                <th className="text-left font-medium text-xs text-on-surface-variant px-5 py-3">Plano</th>
                <th className="text-left font-medium text-xs text-on-surface-variant px-4 py-3">Código ANS</th>
                <th className="text-center font-medium text-xs text-on-surface-variant px-4 py-3">Status</th>
                <th className="text-right font-medium text-xs text-on-surface-variant px-5 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50">
              {(plans ?? []).map((p) => (
                <tr key={p.id} className="hover:bg-surface-container transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary" style={{ fontSize: 16 }}>health_and_safety</span>
                      </div>
                      <span className="font-semibold text-on-surface">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-on-surface-variant">{p.ans_code ?? "—"}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-medium ${p.is_active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-surface-container text-on-surface-variant border-outline-variant"}`}>
                      {p.is_active ? "Ativo" : "Inativo"}
                    </span>
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
