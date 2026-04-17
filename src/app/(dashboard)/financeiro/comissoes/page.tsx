import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { CommissionBatchPay } from "@/components/dashboard/financeiro/CommissionBatchPay"

const STATUS_STYLES: Record<string, string> = {
  pending:  "bg-amber-50 text-amber-700 border-amber-200",
  released: "bg-blue-50 text-blue-700 border-blue-200",
  paid:     "bg-emerald-50 text-emerald-700 border-emerald-200",
}
const STATUS_LABELS: Record<string, string> = {
  pending: "Pendente", released: "Liberada", paid: "Repassada",
}

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

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mb-1">
          <Link href="/financeiro" className="hover:text-primary transition-colors">Financeiro</Link>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
          <span className="text-on-surface">Comissões</span>
        </div>
        <h1 className="font-headline font-extrabold text-3xl text-primary">Comissões</h1>
        <p className="text-on-surface-variant text-sm mt-0.5">Gestão de repasses para profissionais</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5 shadow-premium-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110" />
          <p className="text-xs text-on-surface-variant mb-1 font-medium uppercase tracking-wide">A repassar (liberadas)</p>
          <p className="font-headline font-extrabold text-2xl text-primary">{fmt(totalReleased)}</p>
          <p className="text-xs text-on-surface-variant mt-1">{released.length} comissões</p>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5 shadow-premium-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-50 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110" />
          <p className="text-xs text-on-surface-variant mb-1 font-medium uppercase tracking-wide">Aguardando pagamento</p>
          <p className="font-headline font-extrabold text-2xl text-on-surface">{fmt(totalPending)}</p>
          <p className="text-xs text-on-surface-variant mt-1">{pending.length} comissões</p>
        </div>
      </div>

      {Object.keys(byMember).length > 0 && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-premium-sm">
          <div className="px-5 py-4 border-b border-outline-variant bg-surface-container">
            <h2 className="font-semibold text-sm text-on-surface">Por profissional</h2>
          </div>
          <div className="divide-y divide-outline-variant/50">
            {Object.entries(byMember).map(([memberId, data]) => (
              <div key={memberId} className="flex items-center gap-4 px-5 py-4">
                <div className="w-9 h-9 rounded-full surgical-gradient flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {data.name[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-on-surface">{data.name}</p>
                  <p className="text-xs text-on-surface-variant">
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

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-premium-sm">
        <div className="px-5 py-4 border-b border-outline-variant bg-surface-container">
          <h2 className="font-semibold text-sm text-on-surface">Todas as comissões</h2>
        </div>
        {(commissions ?? []).length === 0 ? (
          <div className="py-16 text-center">
            <span className="material-symbols-outlined text-outline mb-3 block" style={{ fontSize: 40 }}>payments</span>
            <h3 className="font-semibold text-on-surface mb-1">Nenhuma comissão calculada</h3>
            <p className="text-on-surface-variant text-sm max-w-xs mx-auto">
              Configure regras de comissão em Configurações → Comissões.
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface-container border-b border-outline-variant">
              <tr>
                <th className="text-left font-medium text-xs text-on-surface-variant px-5 py-3">Profissional</th>
                <th className="text-left font-medium text-xs text-on-surface-variant px-4 py-3">Serviço</th>
                <th className="text-right font-medium text-xs text-on-surface-variant px-4 py-3">Bruto</th>
                <th className="text-right font-medium text-xs text-on-surface-variant px-4 py-3">Líquido</th>
                <th className="text-right font-medium text-xs text-on-surface-variant px-4 py-3">%</th>
                <th className="text-right font-medium text-xs text-on-surface-variant px-4 py-3">Comissão</th>
                <th className="text-center font-medium text-xs text-on-surface-variant px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50">
              {(commissions ?? []).map((c) => {
                const member = c.clinic_members as { full_name: string | null; profiles: { full_name: string } | null } | null
                const name = member?.full_name ?? (member?.profiles as { full_name: string } | null)?.full_name ?? "—"
                const svc = c.services as unknown as { name: string } | null
                return (
                  <tr key={(c as { id: string }).id} className="hover:bg-surface-container transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full surgical-gradient flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                          {name[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium text-xs text-on-surface">{name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-on-surface-variant">{svc?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-right text-xs text-on-surface">{fmt(Number(c.gross_amount))}</td>
                    <td className="px-4 py-3 text-right text-xs text-on-surface">{fmt(Number(c.net_amount))}</td>
                    <td className="px-4 py-3 text-right text-xs text-on-surface-variant">{Number(c.percentage).toFixed(1)}%</td>
                    <td className="px-4 py-3 text-right font-bold text-primary">{fmt(Number(c.commission_amount))}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium inline-flex items-center gap-1 ${STATUS_STYLES[c.status as string] ?? ""}`}>
                        {c.status === "paid" && <span className="material-symbols-outlined" style={{ fontSize: 11 }}>check_circle</span>}
                        {STATUS_LABELS[c.status as string] ?? c.status}
                      </span>
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
