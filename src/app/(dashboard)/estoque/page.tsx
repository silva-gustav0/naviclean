import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Package, AlertTriangle, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { StockItemModal } from "@/components/dashboard/modals/stock-item-modal"
import { StockEntryModal } from "@/components/dashboard/modals/stock-entry-modal"

export default async function EstoquePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase.from("clinics").select("id").eq("owner_id", user.id).single()
  if (!clinic) redirect("/onboarding")

  const { data: items } = await supabase
    .from("stock_items")
    .select("*, stock_batches(id, quantity, expiry_date)")
    .eq("clinic_id", clinic.id)
    .eq("is_active", true)
    .order("name")

  const today = new Date()
  const in30Days = new Date(today.getTime() + 30 * 86400000)
  const in60Days = new Date(today.getTime() + 60 * 86400000)

  const enriched = (items ?? []).map((item) => {
    const batches = (item.stock_batches ?? []) as { id: string; quantity: number; expiry_date: string | null }[]
    const totalQty = batches.reduce((sum, b) => sum + Number(b.quantity), 0)
    const nearestExpiry = batches
      .filter((b) => b.expiry_date)
      .map((b) => new Date(b.expiry_date!))
      .sort((a, b2) => a.getTime() - b2.getTime())[0]

    const isLow = totalQty < Number(item.minimum_stock)
    const isExpiringSoon = nearestExpiry && nearestExpiry <= in30Days
    const isExpiringWarning = nearestExpiry && nearestExpiry <= in60Days && nearestExpiry > in30Days

    return { ...item, totalQty, nearestExpiry, isLow, isExpiringSoon, isExpiringWarning }
  })

  const lowItems = enriched.filter((i) => i.isLow)
  const expiringSoon = enriched.filter((i) => i.isExpiringSoon)

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Estoque</h1>
          <p className="text-muted-foreground text-sm">{enriched.length} itens cadastrados</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/estoque/importar-nfe"
            className="text-xs px-3 py-2 border rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            Importar NF-e
          </Link>
          <StockEntryModal items={(items ?? []).map((i) => ({ id: i.id, name: i.name, unit: i.unit }))} />
          <StockItemModal />
        </div>
      </div>

      {/* Alertas */}
      {(lowItems.length > 0 || expiringSoon.length > 0) && (
        <div className="space-y-2">
          {lowItems.length > 0 && (
            <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-xl text-sm">
              <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
              <span className="text-red-700 font-medium">{lowItems.length} item(s) abaixo do estoque mínimo:</span>
              <span className="text-red-600 text-xs">{lowItems.map((i) => i.name).join(', ')}</span>
            </div>
          )}
          {expiringSoon.length > 0 && (
            <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm">
              <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
              <span className="text-amber-700 font-medium">{expiringSoon.length} item(s) vencendo em até 30 dias</span>
            </div>
          )}
        </div>
      )}

      {/* Tabela */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
        {enriched.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#E8F0F9] flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-[#0D3A6B]" />
            </div>
            <h3 className="font-semibold text-base mb-1">Estoque vazio</h3>
            <p className="text-muted-foreground text-sm mb-4">Cadastre itens ou importe uma NF-e para começar.</p>
            <StockItemModal />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b">
              <tr>
                <th className="text-left font-medium text-xs text-muted-foreground px-5 py-3">Item</th>
                <th className="text-left font-medium text-xs text-muted-foreground px-4 py-3">Categoria</th>
                <th className="text-right font-medium text-xs text-muted-foreground px-4 py-3">Estoque</th>
                <th className="text-right font-medium text-xs text-muted-foreground px-4 py-3">Mínimo</th>
                <th className="text-left font-medium text-xs text-muted-foreground px-4 py-3">Vencimento</th>
                <th className="text-center font-medium text-xs text-muted-foreground px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {enriched.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium">{item.name}</p>
                    {item.brand && <p className="text-xs text-muted-foreground">{item.brand}</p>}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{item.category ?? '—'}</td>
                  <td className="px-4 py-3 text-right font-medium">{item.totalQty} {item.unit}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{Number(item.minimum_stock)} {item.unit}</td>
                  <td className="px-4 py-3 text-xs">
                    {item.nearestExpiry
                      ? item.nearestExpiry.toLocaleDateString('pt-BR')
                      : <span className="text-muted-foreground">—</span>
                    }
                  </td>
                  <td className="px-4 py-3 text-center">
                    {item.isLow ? (
                      <Badge className="bg-red-100 text-red-700 border-red-200 text-[10px]">Baixo</Badge>
                    ) : item.isExpiringSoon ? (
                      <Badge className="bg-red-100 text-red-700 border-red-200 text-[10px]">Vence em breve</Badge>
                    ) : item.isExpiringWarning ? (
                      <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px]">Atenção</Badge>
                    ) : (
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px]">OK</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <StockItemModal item={item} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
