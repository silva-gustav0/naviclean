import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NewTransactionModal } from "@/components/dashboard/modals/new-transaction-modal"
import Link from "next/link"

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: "Dinheiro",
  credit_card: "Cartão Crédito",
  debit_card: "Cartão Débito",
  pix: "PIX",
  bank_transfer: "Transferência",
  insurance: "Convênio",
}

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

export default async function ReceitasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase.from("clinics").select("id").eq("owner_id", user.id).single()
  if (!clinic) redirect("/onboarding")

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*, patients(full_name)")
    .eq("clinic_id", clinic.id)
    .eq("type", "income")
    .order("created_at", { ascending: false })
    .limit(100)

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  const total = (transactions ?? []).reduce((a, t) => a + Number(t.amount), 0)
  const totalPaid = (transactions ?? []).filter((t) => t.payment_status === "paid").reduce((a, t) => a + Number(t.amount), 0)

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mb-1">
            <Link href="/financeiro" className="hover:text-primary transition-colors">Financeiro</Link>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
            <span className="text-on-surface">Receitas</span>
          </div>
          <h1 className="font-headline font-extrabold text-3xl text-primary">Receitas</h1>
          <p className="text-on-surface-variant text-sm mt-0.5">{transactions?.length ?? 0} registros · {fmt(totalPaid)} recebido</p>
        </div>
        <NewTransactionModal />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5 shadow-premium-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-emerald-600" style={{ fontSize: 18 }}>trending_up</span>
            <span className="text-xs text-on-surface-variant font-medium">Total</span>
          </div>
          <p className="font-headline font-extrabold text-2xl text-primary">{fmt(total)}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5 shadow-premium-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-blue-600" style={{ fontSize: 18 }}>payments</span>
            <span className="text-xs text-on-surface-variant font-medium">Recebido</span>
          </div>
          <p className="font-headline font-extrabold text-2xl text-primary">{fmt(totalPaid)}</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-premium-sm">
        {(transactions ?? []).length === 0 ? (
          <div className="py-16 text-center">
            <span className="material-symbols-outlined text-outline mb-3 block" style={{ fontSize: 40 }}>trending_up</span>
            <h3 className="font-semibold text-on-surface mb-1">Nenhuma receita registrada</h3>
            <p className="text-on-surface-variant text-sm mb-4">Registre receitas para acompanhar seu faturamento.</p>
            <NewTransactionModal />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface-container border-b border-outline-variant">
              <tr>
                <th className="text-left font-medium text-xs text-on-surface-variant px-5 py-3">Descrição</th>
                <th className="text-left font-medium text-xs text-on-surface-variant px-4 py-3">Paciente</th>
                <th className="text-left font-medium text-xs text-on-surface-variant px-4 py-3">Método</th>
                <th className="text-left font-medium text-xs text-on-surface-variant px-4 py-3">Data</th>
                <th className="text-right font-medium text-xs text-on-surface-variant px-5 py-3">Valor</th>
                <th className="text-center font-medium text-xs text-on-surface-variant px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50">
              {(transactions ?? []).map((t) => {
                const patient = t.patients as { full_name: string } | null
                return (
                  <tr key={t.id as string} className="hover:bg-surface-container transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-on-surface">{t.description as string}</p>
                      {t.category && <p className="text-xs text-on-surface-variant">{t.category as string}</p>}
                    </td>
                    <td className="px-4 py-3 text-xs text-on-surface-variant">{patient?.full_name ?? "—"}</td>
                    <td className="px-4 py-3 text-xs text-on-surface-variant">
                      {t.payment_method ? PAYMENT_METHOD_LABELS[t.payment_method as string] ?? t.payment_method : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-on-surface-variant">
                      {new Date(t.created_at as string).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-emerald-600">{fmt(Number(t.amount))}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${STATUS_STYLES[t.payment_status as string] ?? ""}`}>
                        {STATUS_LABELS[t.payment_status as string] ?? t.payment_status}
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
