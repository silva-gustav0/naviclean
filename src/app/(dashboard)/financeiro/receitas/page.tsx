import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ArrowUpRight, TrendingUp } from "lucide-react"
import { NewTransactionModal } from "@/components/dashboard/modals/new-transaction-modal"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: "Dinheiro",
  credit_card: "Cartão Crédito",
  debit_card: "Cartão Débito",
  pix: "PIX",
  bank_transfer: "Transferência",
  insurance: "Convênio",
}

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
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/financeiro" className="hover:text-foreground transition-colors">Financeiro</Link>
            <span>/</span>
            <span>Receitas</span>
          </div>
          <h1 className="text-2xl font-bold">Receitas</h1>
          <p className="text-muted-foreground text-sm">{transactions?.length ?? 0} registros · {fmt(totalPaid)} recebido</p>
        </div>
        <NewTransactionModal />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-50 dark:bg-emerald-950 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <span className="text-sm text-muted-foreground">Total</span>
          </div>
          <p className="text-2xl font-bold">{fmt(total)}</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
              <ArrowUpRight className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-sm text-muted-foreground">Recebido</span>
          </div>
          <p className="text-2xl font-bold">{fmt(totalPaid)}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
        {(transactions ?? []).length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="font-semibold mb-1">Nenhuma receita registrada</h3>
            <p className="text-muted-foreground text-sm mb-4">Registre receitas para acompanhar seu faturamento.</p>
            <NewTransactionModal />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b">
              <tr>
                <th className="text-left font-medium text-xs text-muted-foreground px-5 py-3">Descrição</th>
                <th className="text-left font-medium text-xs text-muted-foreground px-4 py-3">Paciente</th>
                <th className="text-left font-medium text-xs text-muted-foreground px-4 py-3">Método</th>
                <th className="text-left font-medium text-xs text-muted-foreground px-4 py-3">Data</th>
                <th className="text-right font-medium text-xs text-muted-foreground px-5 py-3">Valor</th>
                <th className="text-center font-medium text-xs text-muted-foreground px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {(transactions ?? []).map((t) => {
                const patient = t.patients as { full_name: string } | null
                return (
                  <tr key={t.id as string} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-medium">{t.description as string}</p>
                      {t.category && <p className="text-xs text-muted-foreground">{t.category as string}</p>}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{patient?.full_name ?? "—"}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {t.payment_method ? PAYMENT_METHOD_LABELS[t.payment_method as string] ?? t.payment_method : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(t.created_at as string).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-emerald-600">{fmt(Number(t.amount))}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge className={`text-[10px] ${STATUS_STYLES[t.payment_status as string] ?? ""}`}>
                        {STATUS_LABELS[t.payment_status as string] ?? t.payment_status}
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
