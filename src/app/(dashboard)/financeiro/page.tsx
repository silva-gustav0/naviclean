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
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-start justify-between gap-4">
        <div className="nc-page-header">
          <p className="nc-section-label text-outline/55 mb-1">Gestão</p>
          <h2 className="font-headline font-black text-primary" style={{ fontSize: "1.75rem", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Financeiro
          </h2>
          <p className="text-on-surface-variant text-[13px] mt-1 font-sans">Controle de receitas, despesas e comissões</p>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <button className="text-primary/70 border border-outline-variant/25 text-[12px] font-medium px-3.5 py-2 rounded-xl hover:bg-surface-container transition-colors font-sans flex items-center gap-1.5">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>download</span>
            Exportar DRE
          </button>
          <NewTransactionModal />
        </div>
      </div>

      {/* KPI strip */}
      <div className="bg-card rounded-2xl overflow-hidden shadow-card">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 divide-x divide-outline-variant/15">
          {kpis.map((kpi, i) => (
            <div key={kpi.label} className={`p-5 ${i === 0 ? "md:border-l-2 md:border-l-emerald-500/50" : ""}`}>
              <div className="flex items-center justify-between mb-3">
                <p className="nc-section-label text-outline/70">{kpi.label}</p>
                <span className={`material-symbols-outlined ${kpi.colorClass} opacity-60`} style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>
                  {kpi.icon}
                </span>
              </div>
              <p className="nc-kpi-value text-primary" style={{ fontSize: "1.4rem" }}>{kpi.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sub-page links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {subPages.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="bg-card border border-outline-variant/20 rounded-xl p-4 flex items-center gap-3 hover:border-nc-secondary/25 hover:shadow-card transition-all group"
          >
            <span className={`material-symbols-outlined ${p.color} shrink-0`} style={{ fontVariationSettings: "'FILL' 0", fontSize: 20 }}>
              {p.icon}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-primary font-sans leading-tight">{p.label}</p>
              <p className="text-[10px] text-on-surface-variant font-sans truncate mt-0.5">{p.description}</p>
            </div>
            <span className="material-symbols-outlined text-outline/25 group-hover:text-nc-secondary group-hover:translate-x-0.5 transition-all shrink-0" style={{ fontSize: 13 }}>
              chevron_right
            </span>
          </Link>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-card rounded-2xl overflow-hidden shadow-card">
        <div className="px-5 py-4 border-b border-outline-variant/15">
          <h3 className="font-sans font-semibold text-[14px] text-primary">Receitas vs Despesas — últimos 6 meses</h3>
        </div>
        <div className="p-5">
          <FinanceiroChart data={chartData} />
        </div>
      </div>

      {/* Recent transactions */}
      <div className="bg-card rounded-2xl overflow-hidden shadow-card">
        <div className="px-5 py-4 border-b border-outline-variant/15 flex items-center justify-between">
          <h3 className="font-sans font-semibold text-[14px] text-primary">Últimas movimentações</h3>
          <Link href="/financeiro/receitas" className="text-[12px] text-nc-secondary font-semibold font-sans hover:opacity-75 transition-opacity">
            Ver tudo →
          </Link>
        </div>

        {recentTx.length > 0 ? (
          <div>
            {recentTx.map((t, idx) => (
              <div key={t.id as string} className={`flex items-center gap-4 px-5 py-3.5 hover:bg-surface-container-low/40 transition-colors ${idx < recentTx.length - 1 ? "border-b border-outline-variant/10" : ""}`}>
                <span className={`font-black text-[15px] font-sans shrink-0 w-5 text-center ${t.type === "income" ? "text-emerald-500" : "text-red-400"}`}>
                  {t.type === "income" ? "+" : "−"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[13px] text-primary truncate font-sans">{t.description as string}</p>
                  <p className="text-[11px] text-on-surface-variant font-sans">
                    {t.category as string ? `${t.category} · ` : ""}
                    {new Date(t.created_at as string).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`font-semibold text-[13px] font-sans ${t.type === "income" ? "text-emerald-600" : "text-red-500"}`}>
                    {t.type === "income" ? "+" : "-"}{fmt(Number(t.amount))}
                  </p>
                  {t.payment_status !== "paid" && (
                    <span className={`nc-stat-chip mt-1 ${
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
            <span
              className="material-symbols-outlined text-outline/25 block mb-3"
              style={{ fontSize: 32, fontVariationSettings: "'FILL' 0" }}
            >
              payments
            </span>
            <h3 className="font-sans font-semibold text-[14px] text-primary mb-1">Nenhuma movimentação</h3>
            <p className="text-on-surface-variant text-[13px] mb-5 max-w-xs mx-auto font-sans">
              Registre receitas e despesas para ter controle financeiro completo.
            </p>
            <NewTransactionModal />
          </div>
        )}
      </div>
    </div>
  )
}
