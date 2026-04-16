import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Package, ArrowLeft, AlertTriangle, TrendingDown } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

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
    entry: "Entrada",
    exit: "Saída",
    adjustment: "Ajuste",
    loss: "Perda",
  }
  const movTypeColor: Record<string, string> = {
    entry: "bg-emerald-100 text-emerald-700",
    exit: "bg-red-100 text-red-700",
    adjustment: "bg-blue-100 text-blue-700",
    loss: "bg-amber-100 text-amber-700",
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/estoque" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{item.name as string}</h1>
          <p className="text-muted-foreground text-sm">{item.category as string ?? "Sem categoria"} · {item.unit as string}</p>
        </div>
        {isLow && (
          <div className="flex items-center gap-1.5 text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl text-sm">
            <AlertTriangle className="h-4 w-4" />
            Estoque baixo
          </div>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Estoque atual", value: `${totalQty} ${item.unit}`, color: isLow ? "text-red-600" : "text-emerald-600" },
          { label: "Estoque mínimo", value: `${Number(item.minimum_stock)} ${item.unit}`, color: "" },
          { label: "Lotes ativos", value: String(batches.filter((b) => b.quantity > 0).length), color: "" },
          { label: "Marca", value: (item.brand as string) || "—", color: "" },
        ].map((k) => (
          <div key={k.label} className="bg-white dark:bg-slate-900 border rounded-2xl p-4">
            <p className="text-xs text-muted-foreground mb-1">{k.label}</p>
            <p className={`font-bold text-lg ${k.color}`}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Lotes */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h2 className="font-semibold text-sm">Lotes ativos</h2>
        </div>
        {batches.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b">
              <tr>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-2">Lote</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-2">Qtd</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2">Vencimento</th>
                <th className="text-center text-xs font-medium text-muted-foreground px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {batches.filter((b) => b.quantity > 0).sort((a, b) => {
                if (!a.expiry_date) return 1
                if (!b.expiry_date) return -1
                return new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime()
              }).map((batch, i) => {
                const expiry = batch.expiry_date ? new Date(batch.expiry_date) : null
                const expSoon = expiry && expiry <= in30
                return (
                  <tr key={batch.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3 text-xs text-muted-foreground">#{i + 1}</td>
                    <td className="px-4 py-3 text-right font-medium">{batch.quantity} {item.unit as string}</td>
                    <td className="px-4 py-3 text-xs">
                      {expiry ? expiry.toLocaleDateString("pt-BR") : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {expSoon
                        ? <Badge className="bg-red-100 text-red-700 border-red-200 text-[10px]">Vence em breve</Badge>
                        : <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px]">OK</Badge>
                      }
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <div className="py-10 text-center">
            <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Nenhum lote ativo</p>
          </div>
        )}
      </div>

      {/* Movimentações */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-sm">Histórico de movimentações</h2>
          <Link href="/estoque/movimentacoes" className="text-xs text-blue-600 hover:underline">Ver todas</Link>
        </div>
        {movements && movements.length > 0 ? (
          <div className="divide-y">
            {movements.map((m) => {
              return (
                <div key={m.id as string} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    m.type === "entry" ? "bg-emerald-100" : "bg-red-100"
                  }`}>
                    <TrendingDown className={`h-4 w-4 ${m.type === "entry" ? "text-emerald-600 rotate-180" : "text-red-600"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{m.reason as string || movTypeLabel[m.type as string]}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(m.created_at as string).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${movTypeColor[m.type as string] ?? "bg-slate-100 text-slate-600"}`}>
                      {movTypeLabel[m.type as string] ?? m.type}
                    </span>
                    <p className={`text-sm font-bold mt-0.5 ${m.type === "entry" ? "text-emerald-600" : "text-red-600"}`}>
                      {m.type === "entry" ? "+" : "-"}{Number(m.quantity)} {item.unit as string}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="py-10 text-center">
            <p className="text-sm text-muted-foreground">Nenhuma movimentação registrada</p>
          </div>
        )}
      </div>
    </div>
  )
}
