import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

const STATUS_COLORS: Record<string, string> = {
  paid:    "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  overdue: "bg-red-50 text-red-700 border-red-200",
}
const STATUS_LABELS: Record<string, string> = {
  paid:    "Pago",
  pending: "Pendente",
  overdue: "Vencido",
}
const STATUS_ICON: Record<string, string> = {
  paid:    "check_circle",
  pending: "schedule",
  overdue: "warning",
}
const KPI_ICON_CLS: Record<string, string> = {
  paid:    "bg-emerald-50 text-emerald-600",
  pending: "bg-amber-50 text-amber-600",
  overdue: "bg-red-50 text-red-600",
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

  const totalPaid    = (transactions ?? []).filter((t) => t.payment_status === "paid").reduce((s, t) => s + Number(t.amount), 0)
  const totalPending = (transactions ?? []).filter((t) => t.payment_status === "pending").reduce((s, t) => s + Number(t.amount), 0)
  const totalOverdue = (transactions ?? []).filter((t) => t.payment_status === "overdue").reduce((s, t) => s + Number(t.amount), 0)

  const kpis = [
    { key: "paid",    label: "Pago",     value: totalPaid },
    { key: "pending", label: "A pagar",  value: totalPending },
    { key: "overdue", label: "Vencido",  value: totalOverdue },
  ]

  return (
    <div className="space-y-6">
      <h1 className="font-headline font-extrabold text-2xl text-primary">Financeiro</h1>

      <div className="grid grid-cols-3 gap-3">
        {kpis.map((k) => (
          <div key={k.key} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 shadow-premium-sm">
            <div className={`w-8 h-8 rounded-xl ${KPI_ICON_CLS[k.key]} flex items-center justify-center mb-2`}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{STATUS_ICON[k.key]}</span>
            </div>
            <p className="font-bold text-on-surface text-sm">{fmt(k.value)}</p>
            <p className="text-xs text-on-surface-variant">{k.label}</p>
          </div>
        ))}
      </div>

      {totalOverdue > 0 && (
        <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-xl text-sm">
          <span className="material-symbols-outlined text-red-500 shrink-0" style={{ fontSize: 18 }}>warning</span>
          <p className="text-red-700 font-medium">Você tem {fmt(totalOverdue)} vencidos. Entre em contato com a clínica.</p>
        </div>
      )}

      {transactions && transactions.length > 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-premium-sm">
          <div className="divide-y divide-outline-variant/50">
            {transactions.map((t) => {
              const clinic = t.clinics as { name: string } | null
              const statusKey = t.payment_status as string
              return (
                <div key={t.id as string} className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-container transition-colors">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${KPI_ICON_CLS[statusKey] ?? "bg-surface-container"}`}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{STATUS_ICON[statusKey] ?? "payments"}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-on-surface truncate">{t.description as string}</p>
                    <p className="text-xs text-on-surface-variant">{clinic?.name ?? "—"}</p>
                    {t.payment_method && (
                      <p className="text-xs text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined" style={{ fontSize: 12 }}>credit_card</span>
                        {t.payment_method as string}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-sm text-on-surface">{fmt(Number(t.amount))}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${STATUS_COLORS[statusKey] ?? "bg-surface-container text-on-surface-variant border-outline-variant"}`}>
                      {STATUS_LABELS[statusKey] ?? statusKey}
                    </span>
                    {t.due_date && statusKey !== "paid" && (
                      <p className="text-[10px] text-on-surface-variant mt-0.5">
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
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl py-14 text-center shadow-premium-sm">
          <span className="material-symbols-outlined text-outline mb-2 block" style={{ fontSize: 32 }}>payments</span>
          <p className="text-sm font-medium text-on-surface">Nenhuma cobrança encontrada</p>
        </div>
      )}
    </div>
  )
}
