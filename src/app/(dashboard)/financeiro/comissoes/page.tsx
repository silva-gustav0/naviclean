import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DollarSign, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { CommissionBatchPay } from "@/components/dashboard/financeiro/CommissionBatchPay"

export default async function ComissoesFinanceiroPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase.from("clinics").select("id").eq("owner_id", user.id).single()
  if (!clinic) redirect("/onboarding")

  const { data: commissions } = await supabase
    .from("commissions")
    .select("*, clinic_members(full_name, profiles(full_name)), services(name), transactions(description, paid_at)")
    .eq("clinic_id", clinic.id)
    .order("created_at", { ascending: false })
    .limit(100)

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  const released = (commissions ?? []).filter((c) => c.status === "released")
  const pending = (commissions ?? []).filter((c) => c.status === "pending")
  const totalReleased = released.reduce((a, c) => a + Number(c.commission_amount), 0)
  const totalPending = pending.reduce((a, c) => a + Number(c.commission_amount), 0)

  // Group by member for summary
  const byMember: Record<string, { name: string; released: number; pending: number; paid: number; commissions: typeof commissions }> = {}
  for (const c of commissions ?? []) {
    const member = c.clinic_members as { full_name: string | null; profiles: { full_name: string } | null } | null
    const name = member?.full_name ?? (member?.profiles as { full_name: string } | null)?.full_name ?? "Desconhecido"
    const mid = (c as { member_id: string }).member_id
    if (!byMember[mid]) byMember[mid] = { name, released: 0, pending: 0, paid: 0, commissions: [] }
    byMember[mid].commissions = byMember[mid].commissions ?? []
    ;(byMember[mid].commissions as typeof commissions)!.push(c)
    if (c.status === "released") byMember[mid].released += Number(c.commission_amount)
    else if (c.status === "pending") byMember[mid].pending += Number(c.commission_amount)
    else if (c.status === "paid") byMember[mid].paid += Number(c.commission_amount)
  }

  const STATUS_STYLES: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    released: "bg-blue-100 text-blue-700",
    paid: "bg-emerald-100 text-emerald-700",
  }
  const STATUS_LABELS: Record<string, string> = {
    pending: "Pendente",
    released: "Liberada",
    paid: "Repassada",
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <Link href="/financeiro" className="hover:text-foreground transition-colors">Financeiro</Link>
          <span>/</span>
          <span>Comissões</span>
        </div>
        <h1 className="text-2xl font-bold">Comissões</h1>
        <p className="text-muted-foreground text-sm">Gestão de repasses para profissionais</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 dark:bg-blue-950 rounded-2xl p-4">
          <p className="text-xs text-muted-foreground mb-1">A repassar (liberadas)</p>
          <p className="text-2xl font-bold">{fmt(totalReleased)}</p>
          <p className="text-xs text-muted-foreground mt-1">{released.length} comissões</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-950 rounded-2xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Aguardando pagamento do paciente</p>
          <p className="text-2xl font-bold">{fmt(totalPending)}</p>
          <p className="text-xs text-muted-foreground mt-1">{pending.length} comissões</p>
        </div>
      </div>

      {/* By member summary */}
      {Object.keys(byMember).length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
          <div className="px-5 py-4 border-b">
            <h2 className="font-semibold text-sm">Por profissional</h2>
          </div>
          <div className="divide-y">
            {Object.entries(byMember).map(([memberId, data]) => (
              <div key={memberId} className="flex items-center gap-4 px-5 py-4">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {data.name[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{data.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Liberadas: {fmt(data.released)} · Pendentes: {fmt(data.pending)} · Repassadas: {fmt(data.paid)}
                  </p>
                </div>
                {data.released > 0 && (
                  <CommissionBatchPay
                    memberId={memberId}
                    memberName={data.name}
                    amount={data.released}
                    commissionIds={(data.commissions ?? []).filter((c) => c?.status === "released").map((c) => (c as { id: string }).id)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h2 className="font-semibold text-sm">Todas as comissões</h2>
        </div>
        {(commissions ?? []).length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-4">
              <DollarSign className="h-8 w-8 text-violet-600" />
            </div>
            <h3 className="font-semibold mb-1">Nenhuma comissão calculada</h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Configure regras de comissão em Configurações → Comissões.
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b">
              <tr>
                <th className="text-left font-medium text-xs text-muted-foreground px-5 py-3">Profissional</th>
                <th className="text-left font-medium text-xs text-muted-foreground px-4 py-3">Serviço</th>
                <th className="text-right font-medium text-xs text-muted-foreground px-4 py-3">Bruto</th>
                <th className="text-right font-medium text-xs text-muted-foreground px-4 py-3">Líquido</th>
                <th className="text-right font-medium text-xs text-muted-foreground px-4 py-3">%</th>
                <th className="text-right font-medium text-xs text-muted-foreground px-4 py-3">Comissão</th>
                <th className="text-center font-medium text-xs text-muted-foreground px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {(commissions ?? []).map((c) => {
                const member = c.clinic_members as { full_name: string | null; profiles: { full_name: string } | null } | null
                const name = member?.full_name ?? (member?.profiles as { full_name: string } | null)?.full_name ?? "—"
                const svc = c.services as unknown as { name: string } | null
                return (
                  <tr key={(c as { id: string }).id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-violet-400 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                          {name[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium text-xs">{name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{svc?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-right text-xs">{fmt(Number(c.gross_amount))}</td>
                    <td className="px-4 py-3 text-right text-xs">{fmt(Number(c.net_amount))}</td>
                    <td className="px-4 py-3 text-right text-xs">{Number(c.percentage).toFixed(1)}%</td>
                    <td className="px-4 py-3 text-right font-semibold">{fmt(Number(c.commission_amount))}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge className={`text-[10px] ${STATUS_STYLES[c.status as string] ?? ""}`}>
                        {c.status === "paid" && <CheckCircle className="h-3 w-3 mr-1 inline" />}
                        {STATUS_LABELS[c.status as string] ?? c.status}
                      </Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
