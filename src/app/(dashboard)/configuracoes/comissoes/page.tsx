import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Percent, Trash2 } from "lucide-react"
import Link from "next/link"
import { CommissionRuleModal } from "@/components/dashboard/modals/commission-rule-modal"
import { DeleteCommissionRule } from "@/components/dashboard/configuracoes/DeleteCommissionRule"
import { DeleteDirectCost } from "@/components/dashboard/configuracoes/DeleteDirectCost"
import { DirectCostModal } from "@/components/dashboard/modals/direct-cost-modal"

export default async function ComissoesConfigPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase.from("clinics").select("id").eq("owner_id", user.id).single()
  if (!clinic) redirect("/onboarding")

  const [{ data: rules }, { data: members }, { data: services }, { data: priceTables }, { data: directCosts }] = await Promise.all([
    supabase
      .from("commission_rules")
      .select("*, clinic_members(full_name, profiles(full_name)), services(name), price_tables(name)")
      .eq("clinic_id", clinic.id)
      .eq("is_active", true)
      .order("priority", { ascending: false }),
    supabase
      .from("clinic_members")
      .select("id, full_name, role, profiles(full_name)")
      .eq("clinic_id", clinic.id)
      .eq("is_active", true),
    supabase
      .from("services")
      .select("id, name, category")
      .eq("clinic_id", clinic.id)
      .eq("is_active", true)
      .order("name"),
    supabase
      .from("price_tables")
      .select("id, name")
      .eq("clinic_id", clinic.id)
      .eq("is_active", true),
    supabase
      .from("direct_costs")
      .select("*")
      .eq("clinic_id", clinic.id)
      .eq("is_active", true),
  ])

  const getMemberName = (m: { full_name: string | null; profiles: { full_name: string } | null } | null) =>
    m?.full_name ?? (m?.profiles as { full_name: string } | null)?.full_name ?? "Profissional"

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <Link href="/configuracoes" className="hover:text-foreground transition-colors">Configurações</Link>
          <span>/</span>
          <span>Comissões</span>
        </div>
        <h1 className="text-2xl font-bold">Comissões e Split</h1>
        <p className="text-muted-foreground text-sm">Defina regras de divisão para profissionais</p>
      </div>

      {/* Commission Rules */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="font-semibold text-sm">Regras de comissão</h2>
          <CommissionRuleModal
            members={(members ?? []).map((m) => ({
              id: m.id,
              name: getMemberName(m as { full_name: string | null; profiles: { full_name: string } | null }),
            }))}
            services={(services ?? []).map((s) => ({ id: s.id, name: s.name as string, category: s.category as string | null }))}
            priceTables={(priceTables ?? []).map((p) => ({ id: p.id, name: p.name }))}
          />
        </div>
        {(rules ?? []).length === 0 ? (
          <div className="py-10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-3">
              <Percent className="h-6 w-6 text-violet-600" />
            </div>
            <p className="text-sm text-muted-foreground">Nenhuma regra cadastrada.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b">
              <tr>
                <th className="text-left font-medium text-xs text-muted-foreground px-5 py-3">Profissional</th>
                <th className="text-left font-medium text-xs text-muted-foreground px-4 py-3">Serviço / Categoria</th>
                <th className="text-left font-medium text-xs text-muted-foreground px-4 py-3">Tabela</th>
                <th className="text-right font-medium text-xs text-muted-foreground px-4 py-3">%</th>
                <th className="text-right font-medium text-xs text-muted-foreground px-4 py-3">Prioridade</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {(rules ?? []).map((r) => {
                const member = r.clinic_members as { full_name: string | null; profiles: { full_name: string } | null } | null
                const svc = r.services as unknown as { name: string } | null
                const pt = r.price_tables as unknown as { name: string } | null
                return (
                  <tr key={(r as { id: string }).id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3 font-medium text-sm">{getMemberName(member)}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {svc?.name ?? r.service_category ?? "Todos"}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{pt?.name ?? "Todas"}</td>
                    <td className="px-4 py-3 text-right font-semibold">{Number(r.percentage).toFixed(1)}%</td>
                    <td className="px-4 py-3 text-right text-xs text-muted-foreground">{r.priority}</td>
                    <td className="px-4 py-3 text-right">
                      <DeleteCommissionRule ruleId={(r as { id: string }).id} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Direct Costs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div>
            <h2 className="font-semibold text-sm">Custos diretos</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Taxas e custos descontados antes do cálculo da comissão</p>
          </div>
          <DirectCostModal
            services={(services ?? []).map((s) => ({ id: s.id, name: s.name as string }))}
          />
        </div>
        {(directCosts ?? []).length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-muted-foreground">Nenhum custo direto cadastrado.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b">
              <tr>
                <th className="text-left font-medium text-xs text-muted-foreground px-5 py-3">Nome</th>
                <th className="text-left font-medium text-xs text-muted-foreground px-4 py-3">Tipo</th>
                <th className="text-right font-medium text-xs text-muted-foreground px-4 py-3">Valor</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {(directCosts ?? []).map((dc) => (
                <tr key={(dc as { id: string }).id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3 font-medium">{dc.name as string}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {dc.kind === "payment_fee" ? "Taxa de pagamento" : "Serviço externo"}
                  </td>
                  <td className="px-4 py-3 text-right text-xs">
                    {dc.percentage ? `${dc.percentage}%` : dc.fixed_amount ? `R$ ${Number(dc.fixed_amount).toFixed(2)}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DeleteDirectCost costId={(dc as { id: string }).id} />
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
