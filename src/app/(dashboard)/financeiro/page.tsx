import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DollarSign, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { NewTransactionModal } from "@/components/dashboard/modals/new-transaction-modal"

export default async function FinanceiroPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase.from("clinics").select("id").eq("owner_id", user.id).single()
  if (!clinic) redirect("/onboarding")

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("clinic_id", clinic.id)
    .order("created_at", { ascending: false })
    .limit(20)

  const totalIn = transactions?.filter((t) => t.type === "income").reduce((a, t) => a + Number(t.amount), 0) ?? 0
  const totalOut = transactions?.filter((t) => t.type === "expense").reduce((a, t) => a + Number(t.amount), 0) ?? 0
  const balance = totalIn - totalOut
  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  const summaryCards = [
    { label: "Receitas do Mês", value: fmt(totalIn), icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950", iconBg: "bg-emerald-100 dark:bg-emerald-900", arrow: ArrowUpRight, arrowColor: "text-emerald-600" },
    { label: "Despesas do Mês", value: fmt(totalOut), icon: TrendingDown, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950", iconBg: "bg-red-100 dark:bg-red-900", arrow: ArrowDownRight, arrowColor: "text-red-500" },
    { label: "Saldo Atual", value: fmt(balance), icon: Wallet, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950", iconBg: "bg-blue-100 dark:bg-blue-900", arrow: null, arrowColor: "" },
  ]

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Financeiro</h1>
          <p className="text-muted-foreground text-sm">Controle de receitas e despesas</p>
        </div>
        <NewTransactionModal />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summaryCards.map((c) => (
          <div key={c.label} className={`${c.bg} rounded-2xl p-5 space-y-3`}>
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 ${c.iconBg} rounded-xl flex items-center justify-center`}>
                <c.icon className={`h-5 w-5 ${c.color}`} />
              </div>
              {c.arrow && <c.arrow className={`h-4 w-4 ${c.arrowColor}`} />}
            </div>
            <div>
              <p className="text-2xl font-bold">{c.value}</p>
              <p className="text-sm text-muted-foreground">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h2 className="font-semibold text-sm">Últimas movimentações</h2>
        </div>

        {transactions && transactions.length > 0 ? (
          <div className="divide-y">
            {transactions.map((t) => (
              <div key={t.id as string} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  t.type === "income" ? "bg-emerald-100 dark:bg-emerald-900" : "bg-red-100 dark:bg-red-900"
                }`}>
                  {t.type === "income"
                    ? <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                    : <ArrowDownRight className="h-4 w-4 text-red-500" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{t.description as string}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.category as string ? `${t.category} · ` : ""}
                    {new Date(t.created_at as string).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <p className={`font-semibold text-sm shrink-0 ${t.type === "income" ? "text-emerald-600" : "text-red-500"}`}>
                  {t.type === "income" ? "+" : "-"}{fmt(Number(t.amount))}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center mx-auto mb-4">
              <DollarSign className="h-8 w-8 text-amber-500" />
            </div>
            <h3 className="font-semibold text-base mb-1">Nenhuma movimentação</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
              Registre receitas e despesas para ter controle financeiro completo.
            </p>
            <NewTransactionModal />
          </div>
        )}
      </div>
    </div>
  )
}
