import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import {
  DollarSign, TrendingUp, TrendingDown, Wallet,
  ArrowUpRight, ArrowDownRight, Clock, AlertCircle, ChevronRight,
} from "lucide-react"
import { NewTransactionModal } from "@/components/dashboard/modals/new-transaction-modal"
import { FinanceiroChart } from "@/components/dashboard/financeiro/FinanceiroChart"
import Link from "next/link"

function getMonthLabel(offset: number) {
  const d = new Date()
  d.setMonth(d.getMonth() - offset)
  return d.toLocaleString("pt-BR", { month: "short" }).replace(".", "")
}

export default async function FinanceiroPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase.from("clinics").select("id").eq("owner_id", user.id).single()
  if (!clinic) redirect("/onboarding")

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString()

  const [{ data: allTx }, { data: monthTx }] = await Promise.all([
    supabase
      .from("transactions")
      .select("*")
      .eq("clinic_id", clinic.id)
      .gte("created_at", sixMonthsAgo)
      .order("created_at", { ascending: false }),
    supabase
      .from("transactions")
      .select("*")
      .eq("clinic_id", clinic.id)
      .gte("created_at", monthStart)
      .lte("created_at", monthEnd),
  ])

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  const monthIncome = (monthTx ?? []).filter((t) => t.type === "income").reduce((a, t) => a + Number(t.amount), 0)
  const monthExpense = (monthTx ?? []).filter((t) => t.type === "expense").reduce((a, t) => a + Number(t.amount), 0)
  const balance = monthIncome - monthExpense
  const pendingReceivable = (allTx ?? []).filter((t) => t.type === "income" && t.payment_status === "pending").reduce((a, t) => a + Number(t.amount), 0)
  const overdueAmount = (allTx ?? []).filter((t) => t.payment_status === "overdue").reduce((a, t) => a + Number(t.amount), 0)

  // Build 6-month chart data
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const offset = 5 - i
    const d = new Date(now.getFullYear(), now.getMonth() - offset, 1)
    const start = new Date(d.getFullYear(), d.getMonth(), 1)
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59)

    const inPeriod = (allTx ?? []).filter((t) => {
      const dt = new Date(t.created_at as string)
      return dt >= start && dt <= end
    })

    return {
      month: getMonthLabel(offset),
      receitas: inPeriod.filter((t) => t.type === "income").reduce((a, t) => a + Number(t.amount), 0),
      despesas: inPeriod.filter((t) => t.type === "expense").reduce((a, t) => a + Number(t.amount), 0),
    }
  })

  const recentTx = (allTx ?? []).slice(0, 15)

  const subPages = [
    { href: "/financeiro/receitas", label: "Receitas", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950" },
    { href: "/financeiro/despesas", label: "Despesas", icon: TrendingDown, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950" },
    { href: "/financeiro/comissoes", label: "Comissões", icon: DollarSign, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950" },
    { href: "/financeiro/relatorios", label: "Relatórios", icon: ChevronRight, color: "text-slate-600", bg: "bg-slate-50 dark:bg-slate-800" },
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

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-emerald-50 dark:bg-emerald-950 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <ArrowUpRight className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-xl font-bold">{fmt(monthIncome)}</p>
          <p className="text-xs text-muted-foreground">Receitas do mês</p>
        </div>
        <div className="bg-red-50 dark:bg-red-950 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 bg-red-100 dark:bg-red-900 rounded-xl flex items-center justify-center">
              <TrendingDown className="h-4 w-4 text-red-500" />
            </div>
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          </div>
          <p className="text-xl font-bold">{fmt(monthExpense)}</p>
          <p className="text-xs text-muted-foreground">Despesas do mês</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
              <Wallet className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <p className="text-xl font-bold">{fmt(balance)}</p>
          <p className="text-xs text-muted-foreground">Saldo do mês</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-950 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 bg-amber-100 dark:bg-amber-900 rounded-xl flex items-center justify-center">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            {overdueAmount > 0 && <AlertCircle className="h-4 w-4 text-red-500" />}
          </div>
          <p className="text-xl font-bold">{fmt(pendingReceivable)}</p>
          <p className="text-xs text-muted-foreground">A receber</p>
        </div>
      </div>

      {/* Sub-page links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {subPages.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="bg-white dark:bg-slate-900 border rounded-xl p-4 flex items-center gap-3 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-sm transition-all group"
          >
            <div className={`w-9 h-9 rounded-xl ${p.bg} flex items-center justify-center shrink-0`}>
              <p.icon className={`h-4 w-4 ${p.color}`} />
            </div>
            <span className="text-sm font-medium">{p.label}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border p-5">
        <h2 className="font-semibold text-sm mb-4">Receitas vs Despesas — últimos 6 meses</h2>
        <FinanceiroChart data={chartData} />
      </div>

      {/* Recent transactions */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-sm">Últimas movimentações</h2>
          <div className="flex gap-2">
            <Link href="/financeiro/receitas" className="text-xs text-blue-600 hover:underline">Ver receitas</Link>
            <span className="text-muted-foreground text-xs">·</span>
            <Link href="/financeiro/despesas" className="text-xs text-blue-600 hover:underline">Ver despesas</Link>
          </div>
        </div>

        {recentTx.length > 0 ? (
          <div className="divide-y">
            {recentTx.map((t) => (
              <div key={t.id as string} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  t.type === "income" ? "bg-emerald-100 dark:bg-emerald-900" : "bg-red-100 dark:bg-red-900"
                }`}>
                  {t.type === "income"
                    ? <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
                    : <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{t.description as string}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.category as string ? `${t.category} · ` : ""}
                    {new Date(t.created_at as string).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`font-semibold text-sm ${t.type === "income" ? "text-emerald-600" : "text-red-500"}`}>
                    {t.type === "income" ? "+" : "-"}{fmt(Number(t.amount))}
                  </p>
                  {t.payment_status !== "paid" && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      t.payment_status === "overdue" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {t.payment_status === "overdue" ? "Vencido" : "Pendente"}
                    </span>
                  )}
                </div>
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
