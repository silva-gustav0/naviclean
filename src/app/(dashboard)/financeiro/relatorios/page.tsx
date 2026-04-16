import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { FileText, TrendingUp, TrendingDown, DollarSign, Users } from "lucide-react"
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

  // Ticket medio
  const ticketMedio = income.length > 0 ? totalIncome / income.length : 0

  // Revenue by category
  const byCategory: Record<string, number> = {}
  for (const t of income) {
    const cat = (t.category as string) ?? "Outros"
    byCategory[cat] = (byCategory[cat] ?? 0) + Number(t.amount)
  }
  const categoryEntries = Object.entries(byCategory).sort((a, b) => b[1] - a[1])

  const reportCards = [
    { label: "Faturamento do ano", value: fmt(totalIncome), icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950" },
    { label: "Despesas do ano", value: fmt(totalExpense), icon: TrendingDown, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950" },
    { label: "Saldo líquido", value: fmt(totalIncome - totalExpense), icon: DollarSign, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950" },
    { label: "Ticket médio", value: fmt(ticketMedio), icon: Users, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950" },
    { label: "Total recebido", value: fmt(paid), icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950" },
    { label: "Inadimplência", value: fmt(overdue), icon: FileText, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950" },
  ]

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <Link href="/financeiro" className="hover:text-foreground transition-colors">Financeiro</Link>
          <span>/</span>
          <span>Relatórios</span>
        </div>
        <h1 className="text-2xl font-bold">Relatórios</h1>
        <p className="text-muted-foreground text-sm">Resumo financeiro de {now.getFullYear()}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {reportCards.map((c) => (
          <div key={c.label} className={`${c.bg} rounded-2xl p-4`}>
            <div className="w-9 h-9 bg-white/50 rounded-xl flex items-center justify-center mb-3">
              <c.icon className={`h-4 w-4 ${c.color}`} />
            </div>
            <p className="text-xl font-bold">{c.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      {categoryEntries.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border p-5">
          <h2 className="font-semibold text-sm mb-4">Receita por categoria</h2>
          <div className="space-y-3">
            {categoryEntries.map(([cat, val]) => (
              <div key={cat} className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground w-32 shrink-0 truncate">{cat}</span>
                <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-[#0D3A6B]"
                    style={{ width: `${(val / totalIncome) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-24 text-right shrink-0">{fmt(val)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h2 className="font-semibold text-sm">Transações do ano</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b">
            <tr>
              <th className="text-left font-medium text-xs text-muted-foreground px-5 py-3">Descrição</th>
              <th className="text-left font-medium text-xs text-muted-foreground px-4 py-3">Tipo</th>
              <th className="text-left font-medium text-xs text-muted-foreground px-4 py-3">Data</th>
              <th className="text-right font-medium text-xs text-muted-foreground px-5 py-3">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {(transactions ?? []).map((t) => (
              <tr key={t.id as string} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-5 py-3 font-medium">{t.description as string}</td>
                <td className="px-4 py-3 text-xs">
                  <span className={`px-2 py-0.5 rounded-full font-medium ${
                    t.type === "income" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                  }`}>
                    {t.type === "income" ? "Receita" : "Despesa"}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(t.created_at as string).toLocaleDateString("pt-BR")}
                </td>
                <td className={`px-5 py-3 text-right font-semibold ${t.type === "income" ? "text-emerald-600" : "text-red-500"}`}>
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
