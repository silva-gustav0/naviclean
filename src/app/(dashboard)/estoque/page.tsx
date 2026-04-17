import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
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
          <h2 className="font-headline font-extrabold text-3xl text-primary tracking-tight">Estoque</h2>
          <p className="text-on-surface-variant text-sm mt-1 font-sans">{enriched.length} itens cadastrados</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/estoque/importar-nfe"
            className="text-xs px-3 py-2 border border-outline-variant/20 rounded-lg hover:bg-surface-container-low transition-colors font-semibold text-primary font-sans"
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
            <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200/50 rounded-xl text-sm">
              <span className="material-symbols-outlined text-red-500 text-xl shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                warning
              </span>
              <span className="text-red-700 font-semibold font-sans">{lowItems.length} item(s) abaixo do estoque mínimo:</span>
              <span className="text-red-600 text-xs font-sans">{lowItems.map((i) => i.name).join(", ")}</span>
            </div>
          )}
          {expiringSoon.length > 0 && (
            <div className="flex items-center gap-3 p-3 bg-nc-secondary/10 border border-nc-secondary/20 rounded-xl text-sm">
              <span className="material-symbols-outlined text-nc-secondary text-xl shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                event_busy
              </span>
              <span className="text-nc-secondary font-semibold font-sans">{expiringSoon.length} item(s) vencendo em até 30 dias</span>
            </div>
          )}
        </div>
      )}

      {/* Tabela */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden shadow-premium-sm">
        {enriched.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-nc-secondary/10 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-nc-secondary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                inventory_2
              </span>
            </div>
            <h3 className="font-headline font-semibold text-primary text-base mb-1">Estoque vazio</h3>
            <p className="text-on-surface-variant text-sm mb-4 font-sans">Cadastre itens ou importe uma NF-e para começar.</p>
            <StockItemModal />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface-container-low border-b border-outline-variant/10">
              <tr>
                <th className="text-left font-semibold text-xs text-on-surface-variant uppercase tracking-wider px-5 py-3 font-sans">Item</th>
                <th className="text-left font-semibold text-xs text-on-surface-variant uppercase tracking-wider px-4 py-3 font-sans">Categoria</th>
                <th className="text-right font-semibold text-xs text-on-surface-variant uppercase tracking-wider px-4 py-3 font-sans">Estoque</th>
                <th className="text-right font-semibold text-xs text-on-surface-variant uppercase tracking-wider px-4 py-3 font-sans">Mínimo</th>
                <th className="text-left font-semibold text-xs text-on-surface-variant uppercase tracking-wider px-4 py-3 font-sans">Vencimento</th>
                <th className="text-center font-semibold text-xs text-on-surface-variant uppercase tracking-wider px-4 py-3 font-sans">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {enriched.map((item) => (
                <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-primary font-headline">{item.name}</p>
                    {item.brand && <p className="text-xs text-on-surface-variant font-sans">{item.brand}</p>}
                  </td>
                  <td className="px-4 py-3 text-xs text-on-surface-variant font-sans">{item.category ?? "—"}</td>
                  <td className="px-4 py-3 text-right font-semibold text-primary font-headline">{item.totalQty} {item.unit}</td>
                  <td className="px-4 py-3 text-right text-on-surface-variant font-sans">{Number(item.minimum_stock)} {item.unit}</td>
                  <td className="px-4 py-3 text-xs font-sans">
                    {item.nearestExpiry
                      ? item.nearestExpiry.toLocaleDateString("pt-BR")
                      : <span className="text-outline">—</span>
                    }
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-semibold font-sans ${
                      item.isLow ? "bg-red-50 text-red-700"
                        : item.isExpiringSoon ? "bg-red-50 text-red-700"
                        : item.isExpiringWarning ? "bg-nc-secondary/10 text-nc-secondary"
                        : "bg-emerald-50 text-emerald-700"
                    }`}>
                      {item.isLow ? "Baixo" : item.isExpiringSoon ? "Vence em breve" : item.isExpiringWarning ? "Atenção" : "OK"}
                    </span>
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
