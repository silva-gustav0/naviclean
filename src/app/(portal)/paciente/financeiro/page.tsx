import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DollarSign, CreditCard, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const STATUS_COLORS: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  overdue: "bg-red-100 text-red-700",
}
const STATUS_LABELS: Record<string, string> = {
  paid: "Pago",
  pending: "Pendente",
  overdue: "Vencido",
}

export default async function PacienteFinanceiroPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/paciente/login")

  const { data: patient } = await supabase.from("patients").select("id").eq("user_id", user.id).single()
  const patientId = patient?.id ?? ""

  const { data: transactions } = await supabase
    .from("transactions")
    .select("id, amount, description, payment_status, payment_method, due_date, paid_at, clinics(name)")
    .eq("patient_id", patientId)
    .eq("type", "income")
    .order("created_at", { ascending: false })
    .limit(50)

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  const totalPaid = (transactions ?? []).filter((t) => t.payment_status === "paid").reduce((s, t) => s + Number(t.amount), 0)
  const totalPending = (transactions ?? []).filter((t) => t.payment_status === "pending").reduce((s, t) => s + Number(t.amount), 0)
  const totalOverdue = (transactions ?? []).filter((t) => t.payment_status === "overdue").reduce((s, t) => s + Number(t.amount), 0)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Financeiro</h1>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Pago", value: totalPaid, icon: CheckCircle, color: "bg-emerald-50 text-emerald-600" },
          { label: "A pagar", value: totalPending, icon: Clock, color: "bg-amber-50 text-amber-600" },
          { label: "Vencido", value: totalOverdue, icon: AlertCircle, color: "bg-red-50 text-red-600" },
        ].map((k) => (
          <div key={k.label} className="bg-white dark:bg-slate-900 border rounded-2xl p-4">
            <div className={`w-8 h-8 rounded-xl ${k.color} flex items-center justify-center mb-2`}>
              <k.icon className="h-4 w-4" />
            </div>
            <p className="font-bold">{fmt(k.value)}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Overdue alert */}
      {totalOverdue > 0 && (
        <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-xl text-sm">
          <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
          <p className="text-red-700 font-medium">Você tem {fmt(totalOverdue)} vencidos. Entre em contato com a clínica.</p>
        </div>
      )}

      {/* Transactions */}
      {transactions && transactions.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
          <div className="divide-y">
            {transactions.map((t) => {
              const clinic = t.clinics as { name: string } | null
              return (
                <div key={t.id as string} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    t.payment_status === "paid" ? "bg-emerald-100" : t.payment_status === "overdue" ? "bg-red-100" : "bg-amber-100"
                  }`}>
                    <DollarSign className={`h-4 w-4 ${t.payment_status === "paid" ? "text-emerald-600" : t.payment_status === "overdue" ? "text-red-600" : "text-amber-600"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{t.description as string}</p>
                    <p className="text-xs text-muted-foreground">{clinic?.name ?? "—"}</p>
                    {t.payment_method && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <CreditCard className="h-3 w-3" />
                        {t.payment_method as string}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-sm">{fmt(Number(t.amount))}</p>
                    <Badge className={`text-[10px] ${STATUS_COLORS[t.payment_status as string] ?? "bg-slate-100 text-slate-500"}`}>
                      {STATUS_LABELS[t.payment_status as string] ?? t.payment_status}
                    </Badge>
                    {t.due_date && t.payment_status !== "paid" && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Vence: {new Date(t.due_date as string).toLocaleDateString("pt-BR")}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border rounded-2xl py-14 text-center">
          <DollarSign className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-medium">Nenhuma cobrança encontrada</p>
        </div>
      )}
    </div>
  )
}
