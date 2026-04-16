import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TrendingDown } from "lucide-react"
import { NewTransactionModal } from "@/components/dashboard/modals/new-transaction-modal"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  overdue: "bg-red-100 text-red-700",
  cancelled: "bg-slate-100 text-slate-500",
  refunded: "bg-blue-100 text-blue-700",
}

const STATUS_LABELS: Record<string, string> = {
  paid: "Pago",
  pending: "Pendente",
  overdue: "Vencido",
  cancelled: "Cancelado",
  refunded: "Estornado",
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
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/financeiro" className="hover:text-foreground transition-colors">Financeiro</Link>
            <span>/</span>
            <span>Despesas</span>
          </div>
          <h1 className="text-2xl font-bold">Despesas</h1>
          <p className="text-muted-foreground text-sm">{transactions?.length ?? 0} registros · {fmt(totalPaid)} pago</p>
        </div>
        <NewTransactionModal />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-red-50 dark:bg-red-950 rounded-2xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Total</p>
          <p className="text-xl font-bold">{fmt(total)}</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Pago</p>
          <p className="text-xl font-bold">{fmt(totalPaid)}</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-950 rounded-2xl p-4">
          <p className="text-xs text-muted-foreground mb-1">A pagar</p>
          <p className="text-xl font-bold">{fmt(pending)}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
        {(transactions ?? []).length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="font-semibold mb-1">Nenhuma despesa registrada</h3>
            <p className="text-muted-foreground text-sm mb-4">Registre despesas para controlar seus custos.</p>
            <NewTransactionModal />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b">
              <tr>
                <th className="text-left font-medium text-xs text-muted-foreground px-5 py-3">Descrição</th>
                <th className="text-left font-medium text-xs text-muted-foreground px-4 py-3">Categoria</th>
                <th className="text-left font-medium text-xs text-muted-foreground px-4 py-3">Vencimento</th>
                <th className="text-right font-medium text-xs text-muted-foreground px-5 py-3">Valor</th>
                <th className="text-center font-medium text-xs text-muted-foreground px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {(transactions ?? []).map((t) => (
                <tr key={t.id as string} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3 font-medium">{t.description as string}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{t.category as string ?? "—"}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {t.due_date ? new Date(t.due_date as string).toLocaleDateString("pt-BR") : "—"}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-red-500">{fmt(Number(t.amount))}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge className={`text-[10px] ${STATUS_STYLES[t.payment_status as string] ?? ""}`}>
                      {STATUS_LABELS[t.payment_status as string] ?? t.payment_status}
                    </Badge>
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
