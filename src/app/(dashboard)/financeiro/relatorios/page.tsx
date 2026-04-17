import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function RelatoriosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase.from("clinics").select("id").eq("owner_id", user.id).single()
  if (!clinic) redirect("/onboarding")

  const now = new Date()
  const yearStart = new Date(now.getFullYear(), 0, 1).toISOString()

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*, patients(full_name), appointments(service_id, services(name, category))")
    .eq("clinic_id", clinic.id)
    .gte("created_at", yearStart)
    .order("created_at", { ascending: false })

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  const income = (transactions ?? []).filter((t) => t.type === "income")
  const expense = (transactions ?? []).filter((t) => t.type === "expense")
  const totalIncome = income.reduce((a, t) => a + Number(t.amount), 0)
  const totalExpense = expense.reduce((a, t) => a + Number(t.amount), 0)
  const paid = income.filter((t) => t.payment_status === "paid").reduce((a, t) => a + Number(t.amount), 0)
  const overdue = income.filter((t) => t.payment_status === "overdue").reduce((a, t) => a + Number(t.amount), 0)
  const ticketMedio = income.length > 0 ? totalIncome / income.length : 0

  const byCategory: Record<string, number> = {}
  for (const t of income) {
    const cat = (t.category as string) ?? "Outros"
    byCategory[cat] = (byCategory[cat] ?? 0) + Number(t.amount)
  }
  const categoryEntries = Object.entries(byCategory).sort((a, b) => b[1] - a[1])

  const reportCards = [
    { label: "Faturamento do ano", value: fmt(totalIncome), icon: "trending_up", iconCls: "text-emerald-600", accent: "bg-emerald-50" },
    { label: "Despesas do ano", value: fmt(totalExpense), icon: "trending_down", iconCls: "text-red-500", accent: "bg-red-50" },
    { label: "Saldo líquido", value: fmt(totalIncome - totalExpense), icon: "account_balance", iconCls: "text-primary", accent: "bg-primary/5" },
    { label: "Ticket médio", value: fmt(ticketMedio), icon: "person", iconCls: "text-nc-secondary", accent: "bg-nc-secondary/10" },
    { label: "Total recebido", value: fmt(paid), icon: "payments", iconCls: "text-emerald-600", accent: "bg-emerald-50" },
    { label: "Inadimplência", value: fmt(overdue), icon: "warning", iconCls: "text-amber-600", accent: "bg-amber-50" },
  ]

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mb-1">
          <Link href="/financeiro" className="hover:text-primary transition-colors">Financeiro</Link>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
          <span className="text-on-surface">Relatórios</span>
        </div>
        <h1 className="font-headline font-extrabold text-3xl text-primary">Relatórios</h1>
        <p className="text-on-surface-variant text-sm mt-0.5">Resumo financeiro de {now.getFullYear()}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {reportCards.map((c) => (
          <div key={c.label} className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5 shadow-premium-sm relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-20 h-20 ${c.accent} rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110`} />
            <div className={`w-9 h-9 ${c.accent} rounded-xl flex items-center justify-center mb-3`}>
              <span className={`material-symbols-outlined ${c.iconCls}`} style={{ fontSize: 18 }}>{c.icon}</span>
            </div>
            <p className="font-headline font-extrabold text-xl text-on-surface">{c.value}</p>
            <p className="text-xs text-on-surface-variant mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      {categoryEntries.length > 0 && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5 shadow-premium-sm">
          <h2 className="font-semibold text-sm text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: 18 }}>donut_large</span>
            Receita por categoria
          </h2>
          <div className="space-y-3">
            {categoryEntries.map(([cat, val]) => (
              <div key={cat} className="flex items-center gap-3">
                <span className="text-sm text-on-surface-variant w-32 shrink-0 truncate">{cat}</span>
                <div className="flex-1 bg-surface-container rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full surgical-gradient"
                    style={{ width: `${(val / totalIncome) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-on-surface w-24 text-right shrink-0">{fmt(val)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-premium-sm">
        <div className="px-5 py-4 border-b border-outline-variant bg-surface-container">
          <h2 className="font-semibold text-sm text-on-surface">Transações do ano</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-surface-container border-b border-outline-variant">
            <tr>
              <th className="text-left font-medium text-xs text-on-surface-variant px-5 py-3">Descrição</th>
              <th className="text-left font-medium text-xs text-on-surface-variant px-4 py-3">Tipo</th>
              <th className="text-left font-medium text-xs text-on-surface-variant px-4 py-3">Data</th>
              <th className="text-right font-medium text-xs text-on-surface-variant px-5 py-3">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/50">
            {(transactions ?? []).map((t) => (
              <tr key={t.id as string} className="hover:bg-surface-container transition-colors">
                <td className="px-5 py-3 font-semibold text-on-surface">{t.description as string}</td>
                <td className="px-4 py-3 text-xs">
                  <span className={`px-2 py-0.5 rounded-full border font-medium ${
                    t.type === "income"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-red-50 text-red-600 border-red-200"
                  }`}>
                    {t.type === "income" ? "Receita" : "Despesa"}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-on-surface-variant">
                  {new Date(t.created_at as string).toLocaleDateString("pt-BR")}
                </td>
                <td className={`px-5 py-3 text-right font-bold ${t.type === "income" ? "text-emerald-600" : "text-red-500"}`}>
                  {fmt(Number(t.amount))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
