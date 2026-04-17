import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NewTransactionModal } from "@/components/dashboard/modals/new-transaction-modal"
import Link from "next/link"

const STATUS_STYLES: Record<string, string> = {
  paid:      "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending:   "bg-amber-50 text-amber-700 border-amber-200",
  overdue:   "bg-red-50 text-red-600 border-red-200",
  cancelled: "bg-surface-container text-on-surface-variant border-outline-variant",
  refunded:  "bg-blue-50 text-blue-700 border-blue-200",
}

const STATUS_LABELS: Record<string, string> = {
  paid: "Pago", pending: "Pendente", overdue: "Vencido",
  cancelled: "Cancelado", refunded: "Estornado",
}

export default async function DespesasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase.from("clinics").select("id").eq("owner_id", user.id).single()
  if (!clinic) redirect("/onboarding")

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("clinic_id", clinic.id)
    .eq("type", "expense")
    .order("created_at", { ascending: false })
    .limit(100)

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  const total = (transactions ?? []).reduce((a, t) => a + Number(t.amount), 0)
  const totalPaid = (transactions ?? []).filter((t) => t.payment_status === "paid").reduce((a, t) => a + Number(t.amount), 0)
  const pending = total - totalPaid

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mb-1">
            <Link href="/financeiro" className="hover:text-primary transition-colors">Financeiro</Link>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
            <span className="text-on-surface">Despesas</span>
          </div>
          <h1 className="font-headline font-extrabold text-3xl text-primary">Despesas</h1>
          <p className="text-on-surface-variant text-sm mt-0.5">{transactions?.length ?? 0} registros · {fmt(totalPaid)} pago</p>
        </div>
        <NewTransactionModal />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5 shadow-premium-sm">
          <p className="text-xs text-on-surface-variant mb-1 font-medium uppercase tracking-wide">Total</p>
          <p className="font-headline font-extrabold text-2xl text-primary">{fmt(total)}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5 shadow-premium-sm">
          <p className="text-xs text-on-surface-variant mb-1 font-medium uppercase tracking-wide">Pago</p>
          <p className="font-headline font-extrabold text-2xl text-on-surface">{fmt(totalPaid)}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5 shadow-premium-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-50 rounded-bl-full -mr-6 -mt-6" />
          <p className="text-xs text-on-surface-variant mb-1 font-medium uppercase tracking-wide">A pagar</p>
          <p className="font-headline font-extrabold text-2xl text-amber-600">{fmt(pending)}</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-premium-sm">
        {(transactions ?? []).length === 0 ? (
          <div className="py-16 text-center">
            <span className="material-symbols-outlined text-outline mb-3 block" style={{ fontSize: 40 }}>trending_down</span>
            <h3 className="font-semibold text-on-surface mb-1">Nenhuma despesa registrada</h3>
            <p className="text-on-surface-variant text-sm mb-4">Registre despesas para controlar seus custos.</p>
            <NewTransactionModal />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface-container border-b border-outline-variant">
              <tr>
                <th className="text-left font-medium text-xs text-on-surface-variant px-5 py-3">Descrição</th>
                <th className="text-left font-medium text-xs text-on-surface-variant px-4 py-3">Categoria</th>
                <th className="text-left font-medium text-xs text-on-surface-variant px-4 py-3">Vencimento</th>
                <th className="text-right font-medium text-xs text-on-surface-variant px-5 py-3">Valor</th>
                <th className="text-center font-medium text-xs text-on-surface-variant px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50">
              {(transactions ?? []).map((t) => (
                <tr key={t.id as string} className="hover:bg-surface-container transition-colors">
                  <td className="px-5 py-3 font-semibold text-on-surface">{t.description as string}</td>
                  <td className="px-4 py-3 text-xs text-on-surface-variant">{t.category as string ?? "—"}</td>
                  <td className="px-4 py-3 text-xs text-on-surface-variant">
                    {t.due_date ? new Date(t.due_date as string).toLocaleDateString("pt-BR") : "—"}
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-red-500">{fmt(Number(t.amount))}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${STATUS_STYLES[t.payment_status as string] ?? ""}`}>
                      {STATUS_LABELS[t.payment_status as string] ?? t.payment_status}
                    </span>
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
