import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EstoqueItemPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase.from("clinics").select("id").eq("owner_id", user.id).single()
  if (!clinic) redirect("/onboarding")

  const { data: item } = await supabase
    .from("stock_items")
    .select("*, stock_batches(id, quantity, batch_number, expiry_date, created_at)")
    .eq("id", id)
    .eq("clinic_id", clinic.id)
    .single()

  if (!item) notFound()

  const { data: movements } = await supabase
    .from("stock_movements")
    .select("id, type, quantity, reason, created_at, performed_by")
    .eq("stock_item_id", id)
    .order("created_at", { ascending: false })
    .limit(20)

  const batches = (item.stock_batches ?? []) as { id: string; quantity: number; batch_number: string | null; expiry_date: string | null; created_at: string }[]
  const totalQty = batches.reduce((s, b) => s + Number(b.quantity), 0)
  const isLow = totalQty < Number(item.minimum_stock)
  const today = new Date()
  const in30 = new Date(today.getTime() + 30 * 86400000)

  const movTypeLabel: Record<string, string> = {
    entry: "Entrada", exit: "Saída", adjustment: "Ajuste", loss: "Perda",
  }
  const movTypeColor: Record<string, string> = {
    entry:      "bg-emerald-50 text-emerald-700 border-emerald-200",
    exit:       "bg-red-50 text-red-600 border-red-200",
    adjustment: "bg-blue-50 text-blue-700 border-blue-200",
    loss:       "bg-amber-50 text-amber-700 border-amber-200",
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/estoque" className="p-2 hover:bg-surface-container rounded-xl transition-colors">
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>arrow_back</span>
        </Link>
        <div className="flex-1">
          <h1 className="font-headline font-extrabold text-2xl text-primary">{item.name as string}</h1>
          <p className="text-on-surface-variant text-sm">{item.category as string ?? "Sem categoria"} · {item.unit as string}</p>
        </div>
        {isLow && (
          <div className="flex items-center gap-1.5 text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl text-sm font-medium">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>warning</span>
            Estoque baixo
          </div>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Estoque atual", value: `${totalQty} ${item.unit}`, valueCls: isLow ? "text-red-600" : "text-emerald-600" },
          { label: "Estoque mínimo", value: `${Number(item.minimum_stock)} ${item.unit}`, valueCls: "text-on-surface" },
          { label: "Lotes ativos", value: String(batches.filter((b) => b.quantity > 0).length), valueCls: "text-primary" },
          { label: "Marca", value: (item.brand as string) || "—", valueCls: "text-on-surface" },
        ].map((k) => (
          <div key={k.label} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 shadow-premium-sm">
            <p className="text-xs text-on-surface-variant mb-1 font-medium">{k.label}</p>
            <p className={`font-bold text-lg ${k.valueCls}`}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Lotes */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-premium-sm">
        <div className="px-5 py-4 border-b border-outline-variant bg-surface-container">
          <h2 className="font-semibold text-sm text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: 16 }}>inventory_2</span>
            Lotes ativos
          </h2>
        </div>
        {batches.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-surface-container border-b border-outline-variant">
              <tr>
                <th className="text-left text-xs font-medium text-on-surface-variant px-5 py-2">Lote</th>
                <th className="text-right text-xs font-medium text-on-surface-variant px-4 py-2">Qtd</th>
                <th className="text-left text-xs font-medium text-on-surface-variant px-4 py-2">Vencimento</th>
                <th className="text-center text-xs font-medium text-on-surface-variant px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50">
              {batches.filter((b) => b.quantity > 0).sort((a, b) => {
                if (!a.expiry_date) return 1
                if (!b.expiry_date) return -1
                return new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime()
              }).map((batch, i) => {
                const expiry = batch.expiry_date ? new Date(batch.expiry_date) : null
                const expSoon = expiry && expiry <= in30
                return (
                  <tr key={batch.id} className="hover:bg-surface-container transition-colors">
                    <td className="px-5 py-3 text-xs text-on-surface-variant">#{i + 1}</td>
                    <td className="px-4 py-3 text-right font-semibold text-on-surface">{batch.quantity} {item.unit as string}</td>
                    <td className="px-4 py-3 text-xs text-on-surface">
                      {expiry ? expiry.toLocaleDateString("pt-BR") : <span className="text-on-surface-variant">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${expSoon ? "bg-red-50 text-red-600 border-red-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>
                        {expSoon ? "Vence em breve" : "OK"}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <div className="py-10 text-center">
            <span className="material-symbols-outlined text-outline mb-2 block" style={{ fontSize: 32 }}>inventory_2</span>
            <p className="text-sm text-on-surface-variant">Nenhum lote ativo</p>
          </div>
        )}
      </div>

      {/* Movimentações */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-premium-sm">
        <div className="px-5 py-4 border-b border-outline-variant bg-surface-container flex items-center justify-between">
          <h2 className="font-semibold text-sm text-on-surface">Histórico de movimentações</h2>
          <Link href="/estoque/movimentacoes" className="text-xs text-primary hover:text-primary/80 transition-colors font-medium">Ver todas</Link>
        </div>
        {movements && movements.length > 0 ? (
          <div className="divide-y divide-outline-variant/50">
            {movements.map((m) => (
              <div key={m.id as string} className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-container transition-colors">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${m.type === "entry" ? "bg-emerald-50" : "bg-red-50"}`}>
                  <span className={`material-symbols-outlined ${m.type === "entry" ? "text-emerald-600" : "text-red-600"}`} style={{ fontSize: 16 }}>
                    {m.type === "entry" ? "trending_up" : "trending_down"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-on-surface">{m.reason as string || movTypeLabel[m.type as string]}</p>
                  <p className="text-xs text-on-surface-variant">
                    {new Date(m.created_at as string).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${movTypeColor[m.type as string] ?? "bg-surface-container text-on-surface-variant border-outline-variant"}`}>
                    {movTypeLabel[m.type as string] ?? m.type}
                  </span>
                  <p className={`text-sm font-bold mt-0.5 ${m.type === "entry" ? "text-emerald-600" : "text-red-600"}`}>
                    {m.type === "entry" ? "+" : "-"}{Number(m.quantity)} {item.unit as string}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center">
            <p className="text-sm text-on-surface-variant">Nenhuma movimentação registrada</p>
          </div>
        )}
      </div>
    </div>
  )
}
