import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TrendingUp, TrendingDown, Package, Plus } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

const TYPE_LABELS: Record<string, string> = {
  entry: "Entrada",
  exit: "Saída",
  adjustment: "Ajuste",
  expired: "Perda por vencimento",
}
const TYPE_COLORS: Record<string, string> = {
  entry: "bg-emerald-100 text-emerald-700",
  exit: "bg-red-100 text-red-700",
  adjustment: "bg-blue-100 text-blue-700",
  expired: "bg-amber-100 text-amber-700",
}

export default async function MovimentacoesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase.from("clinics").select("id").eq("owner_id", user.id).single()
  if (!clinic) redirect("/onboarding")

  const { data: movements } = await supabase
    .from("stock_movements")
    .select("id, type, quantity, reason, created_at, performed_by, stock_item_id, stock_items(name, unit)")
    .eq("clinic_id", clinic.id)
    .order("created_at", { ascending: false })
    .limit(100)

  const totalEntries = (movements ?? []).filter((m) => m.type === "entry").reduce((s, m) => s + Number(m.quantity), 0)
  const totalExits = (movements ?? []).filter((m) => m.type !== "entry").reduce((s, m) => s + Number(m.quantity), 0)

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Movimentações de Estoque</h1>
          <p className="text-muted-foreground text-sm">{movements?.length ?? 0} registros</p>
        </div>
        <Link
          href="/estoque/movimentacoes/nova"
          className="flex items-center gap-2 bg-[#0D3A6B] hover:bg-[#1A5599] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nova movimentação
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-50 dark:bg-emerald-950 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{totalEntries}</p>
            <p className="text-xs text-muted-foreground">Unidades entradas</p>
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-950 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-red-100 dark:bg-red-900 rounded-xl flex items-center justify-center">
            <TrendingDown className="h-4 w-4 text-red-500" />
          </div>
          <div>
            <p className="text-xl font-bold">{totalExits}</p>
            <p className="text-xs text-muted-foreground">Unidades saídas/ajuste</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
        {movements && movements.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b">
              <tr>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Item</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Tipo</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Qtd</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Motivo</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Responsável</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {movements.map((m) => {
                const item = m.stock_items as { name: string; unit: string } | null
                return (
                  <tr key={m.id as string} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                          <Package className="h-3.5 w-3.5 text-slate-500" />
                        </div>
                        <span className="font-medium text-sm">{item?.name ?? "—"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={`text-[10px] ${TYPE_COLORS[m.type as string] ?? "bg-slate-100 text-slate-600"}`}>
                        {TYPE_LABELS[m.type as string] ?? m.type}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      <span className={m.type === "entry" ? "text-emerald-600" : "text-red-600"}>
                        {m.type === "entry" ? "+" : "-"}{Number(m.quantity)} {item?.unit ?? ""}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{(m.reason as string) || "—"}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{(m.performed_by as string | null) ? "Usuário" : "Sistema"}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(m.created_at as string).toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <div className="py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#E8F0F9] flex items-center justify-center mx-auto mb-3">
              <Package className="h-7 w-7 text-[#0D3A6B]" />
            </div>
            <p className="font-semibold">Nenhuma movimentação</p>
            <p className="text-muted-foreground text-sm mt-1">Registre entradas e saídas de estoque.</p>
          </div>
        )}
      </div>
    </div>
  )
}
