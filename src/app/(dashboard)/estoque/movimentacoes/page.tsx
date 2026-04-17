import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

const TYPE_LABELS: Record<string, string> = {
  entry: "Entrada", exit: "Saída", adjustment: "Ajuste", expired: "Perda por vencimento",
}
const TYPE_COLORS: Record<string, string> = {
  entry:      "bg-emerald-50 text-emerald-700 border-emerald-200",
  exit:       "bg-red-50 text-red-600 border-red-200",
  adjustment: "bg-blue-50 text-blue-700 border-blue-200",
  expired:    "bg-amber-50 text-amber-700 border-amber-200",
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
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-headline font-extrabold text-3xl text-primary">Movimentações de Estoque</h1>
          <p className="text-on-surface-variant text-sm mt-0.5">{movements?.length ?? 0} registros</p>
        </div>
        <Link
          href="/estoque/movimentacoes/nova"
          className="surgical-gradient text-white text-sm font-semibold flex items-center gap-1.5 px-4 py-2 rounded-xl shadow-premium-sm hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
          Nova movimentação
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5 shadow-premium-sm flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-emerald-600" style={{ fontSize: 18 }}>trending_up</span>
          </div>
          <div>
            <p className="font-headline font-bold text-xl text-on-surface">{totalEntries}</p>
            <p className="text-xs text-on-surface-variant">Unidades entradas</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5 shadow-premium-sm flex items-center gap-3">
          <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-red-500" style={{ fontSize: 18 }}>trending_down</span>
          </div>
          <div>
            <p className="font-headline font-bold text-xl text-on-surface">{totalExits}</p>
            <p className="text-xs text-on-surface-variant">Unidades saídas/ajuste</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-premium-sm">
        {movements && movements.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-surface-container border-b border-outline-variant">
              <tr>
                <th className="text-left text-xs font-medium text-on-surface-variant px-5 py-3">Item</th>
                <th className="text-left text-xs font-medium text-on-surface-variant px-4 py-3">Tipo</th>
                <th className="text-right text-xs font-medium text-on-surface-variant px-4 py-3">Qtd</th>
                <th className="text-left text-xs font-medium text-on-surface-variant px-4 py-3">Motivo</th>
                <th className="text-left text-xs font-medium text-on-surface-variant px-4 py-3">Responsável</th>
                <th className="text-left text-xs font-medium text-on-surface-variant px-4 py-3">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50">
              {movements.map((m) => {
                const stockItem = m.stock_items as { name: string; unit: string } | null
                return (
                  <tr key={m.id as string} className="hover:bg-surface-container transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 14 }}>inventory_2</span>
                        </div>
                        <span className="font-semibold text-sm text-on-surface">{stockItem?.name ?? "—"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${TYPE_COLORS[m.type as string] ?? "bg-surface-container text-on-surface-variant border-outline-variant"}`}>
                        {TYPE_LABELS[m.type as string] ?? m.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold">
                      <span className={m.type === "entry" ? "text-emerald-600" : "text-red-600"}>
                        {m.type === "entry" ? "+" : "-"}{Number(m.quantity)} {stockItem?.unit ?? ""}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-on-surface-variant">{(m.reason as string) || "—"}</td>
                    <td className="px-4 py-3 text-xs text-on-surface-variant">{(m.performed_by as string | null) ? "Usuário" : "Sistema"}</td>
                    <td className="px-4 py-3 text-xs text-on-surface-variant">
                      {new Date(m.created_at as string).toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <div className="py-16 text-center">
            <span className="material-symbols-outlined text-outline mb-3 block" style={{ fontSize: 40 }}>inventory_2</span>
            <p className="font-semibold text-on-surface">Nenhuma movimentação</p>
            <p className="text-on-surface-variant text-sm mt-1">Registre entradas e saídas de estoque.</p>
          </div>
        )}
      </div>
    </div>
  )
}
