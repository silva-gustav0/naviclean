import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NewTransactionModal } from "@/components/dashboard/modals/new-transaction-modal"
import { FinanceiroChart } from "@/components/dashboard/financeiro/FinanceiroChart"
import Link from "next/link"

function getMonthLabel(offset: number) {
  const d = new Date()
  d.setMonth(d.getMonth() - offset)
  return d.toLocaleString("pt-BR", { month: "short" }).replace(".", "")
}

const subPages = [
  { href: "/financeiro/receitas", label: "Receitas", description: "Listar e filtrar", icon: "trending_up", color: "text-emerald-600", bg: "bg-emerald-50" },
  { href: "/financeiro/despesas", label: "Despesas", description: "Por categoria", icon: "trending_down", color: "text-red-500", bg: "bg-red-50" },
  { href: "/financeiro/comissoes", label: "Comissões", description: "Por profissional", icon: "payments", color: "text-nc-secondary", bg: "bg-nc-secondary/10" },
  { href: "/financeiro/relatorios", label: "Relatórios", description: "DRE e análises", icon: "bar_chart", color: "text-primary", bg: "bg-primary/10" },
]

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

  const kpis = [
    { label: "Receitas do Mês", value: fmt(monthIncome), icon: "trending_up", colorClass: "text-emerald-600", bgClass: "bg-emerald-50" },
    { label: "Despesas do Mês", value: fmt(monthExpense), icon: "trending_down", colorClass: "text-red-500", bgClass: "bg-red-50" },
    { label: "Saldo do Mês", value: fmt(balance), icon: "account_balance_wallet", colorClass: "text-primary", bgClass: "bg-primary/10" },
    { label: "A Receber", value: fmt(pendingReceivable), icon: "pending_actions", colorClass: "text-nc-secondary", bgClass: "bg-nc-secondary/10" },
  ]

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline font-extrabold text-3xl text-primary tracking-tight">Financeiro</h2>
          <p className="text-on-surface-variant text-sm mt-1 font-sans">Controle de receitas, despesas e comissões</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-primary border border-outline-variant text-sm font-semibold px-4 py-2 rounded-xl hover:bg-surface-container transition-colors font-headline flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span>
            Exportar DRE
          </button>
          <NewTransactionModal />
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-2xl p-5 border border-[#c3c6d0]/20 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${kpi.bgClass}`}>
              <span className={`material-symbols-outlined text-xl ${kpi.colorClass}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                {kpi.icon}
              </span>
            </div>
            <p className="font-headline font-extrabold text-xl text-primary">{kpi.value}</p>
            <p className="text-xs text-on-surface-variant mt-1 font-sans">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Sub-page links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {subPages.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="bg-white border border-[#c3c6d0]/20 rounded-xl p-4 flex items-center gap-3 hover:border-nc-secondary/30 hover:shadow-sm transition-all group"
          >
            <div className={`w-9 h-9 rounded-xl ${p.bg} flex items-center justify-center shrink-0`}>
              <span className={`material-symbols-outlined text-lg ${p.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                {p.icon}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-primary font-headline">{p.label}</p>
              <p className="text-[10px] text-on-surface-variant font-sans truncate">{p.description}</p>
            </div>
            <span className="material-symbols-outlined text-outline text-lg ml-auto group-hover:translate-x-0.5 transition-transform shrink-0">
              arrow_forward
            </span>
          </Link>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-[#c3c6d0]/20 p-5 shadow-sm">
        <h3 className="font-headline font-semibold text-primary text-sm mb-4">Receitas vs Despesas — últimos 6 meses</h3>
        <FinanceiroChart data={chartData} />
      </div>

      {/* Recent transactions */}
      <div className="bg-white rounded-2xl border border-[#c3c6d0]/20 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-[#c3c6d0]/20 flex items-center justify-between">
          <h3 className="font-headline font-semibold text-primary text-sm">Últimas movimentações</h3>
          <Link href="/financeiro/receitas" className="text-xs text-nc-secondary font-semibold hover:underline underline-offset-2 font-sans">
            Ver tudo
          </Link>
        </div>

        {recentTx.length > 0 ? (
          <div className="divide-y divide-[#c3c6d0]/15">
            {recentTx.map((t) => (
              <div key={t.id as string} className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-container-low/50 transition-colors">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  t.type === "income" ? "bg-emerald-50" : "bg-red-50"
                }`}>
                  <span className={`material-symbols-outlined text-base ${t.type === "income" ? "text-emerald-600" : "text-red-500"}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    {t.type === "income" ? "arrow_upward" : "arrow_downward"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-primary truncate font-headline">{t.description as string}</p>
                  <p className="text-xs text-on-surface-variant font-sans">
                    {t.category as string ? `${t.category} · ` : ""}
                    {new Date(t.created_at as string).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`font-semibold text-sm font-headline ${t.type === "income" ? "text-emerald-600" : "text-red-500"}`}>
                    {t.type === "income" ? "+" : "-"}{fmt(Number(t.amount))}
                  </p>
                  {t.payment_status !== "paid" && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold font-sans ${
                      t.payment_status === "overdue" ? "bg-red-50 text-red-700" : "bg-nc-secondary/10 text-nc-secondary"
                    }`}>
                      {t.payment_status === "overdue" ? "Vencido" : "Pendente"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-14 text-center">
            <div className="w-14 h-14 rounded-2xl bg-nc-secondary/10 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-nc-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                payments
              </span>
            </div>
            <h3 className="font-headline font-semibold text-primary text-base mb-1">Nenhuma movimentação</h3>
            <p className="text-on-surface-variant text-sm mb-5 max-w-xs mx-auto font-sans">
              Registre receitas e despesas para ter controle financeiro completo.
            </p>
            <NewTransactionModal />
          </div>
        )}
      </div>
    </div>
  )
}
