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
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="nc-section-label text-outline/60 mb-1.5">Clínica</p>
          <h2 className="font-headline font-black text-primary tracking-tight" style={{ fontSize: "1.8rem", letterSpacing: "-0.03em" }}>
            Estoque
          </h2>
          <p className="text-on-surface-variant text-[13px] mt-1 font-sans">{enriched.length} itens cadastrados</p>
        </div>
        <div className="flex gap-2 pt-1">
          <Link
            href="/estoque/importar-nfe"
            className="text-[12px] px-3.5 py-2 border border-outline-variant/25 rounded-xl hover:bg-surface-container-low transition-colors font-medium text-primary/70 font-sans"
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
            <div className="flex items-center gap-3 p-3.5 bg-red-50 dark:bg-red-950/30 border border-red-200/40 rounded-xl">
              <span className="material-symbols-outlined text-red-500 shrink-0" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>
                warning
              </span>
              <span className="text-red-700 dark:text-red-400 text-[12px] font-semibold font-sans">{lowItems.length} item(s) abaixo do mínimo:</span>
              <span className="text-red-600/70 text-[11px] font-sans truncate">{lowItems.map((i) => i.name).join(", ")}</span>
            </div>
          )}
          {expiringSoon.length > 0 && (
            <div className="flex items-center gap-3 p-3.5 bg-nc-secondary/8 border border-nc-secondary/20 rounded-xl">
              <span className="material-symbols-outlined text-nc-secondary shrink-0" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>
                event_busy
              </span>
              <span className="text-nc-secondary text-[12px] font-semibold font-sans">{expiringSoon.length} item(s) vencendo em até 30 dias</span>
            </div>
          )}
        </div>
      )}

      {/* Tabela */}
      <div className="bg-card rounded-2xl overflow-hidden shadow-card">
        {enriched.length === 0 ? (
          <div className="py-16 text-center">
            <span
              className="material-symbols-outlined text-outline/25 block mb-3"
              style={{ fontSize: 32, fontVariationSettings: "'FILL' 0" }}
            >
              inventory_2
            </span>
            <h3 className="font-sans font-semibold text-[14px] text-primary mb-1">Estoque vazio</h3>
            <p className="text-on-surface-variant text-[13px] mb-4 font-sans">Cadastre itens ou importe uma NF-e para começar.</p>
            <StockItemModal />
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant/15">
                <th className="text-left px-5 py-3.5"><span className="nc-section-label text-outline/60">Item</span></th>
                <th className="text-left px-4 py-3.5"><span className="nc-section-label text-outline/60">Categoria</span></th>
                <th className="text-right px-4 py-3.5"><span className="nc-section-label text-outline/60">Estoque</span></th>
                <th className="text-right px-4 py-3.5"><span className="nc-section-label text-outline/60">Mínimo</span></th>
                <th className="text-left px-4 py-3.5"><span className="nc-section-label text-outline/60">Vencimento</span></th>
                <th className="text-center px-4 py-3.5"><span className="nc-section-label text-outline/60">Status</span></th>
                <th className="px-4 py-3.5"></th>
              </tr>
            </thead>
            <tbody>
              {enriched.map((item, idx) => (
                <tr key={item.id} className={`hover:bg-surface-container-low/40 transition-colors ${idx < enriched.length - 1 ? "border-b border-outline-variant/10" : ""}`}>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-[13px] text-primary font-sans">{item.name}</p>
                    {item.brand && <p className="text-[11px] text-on-surface-variant font-sans">{item.brand}</p>}
                  </td>
                  <td className="px-4 py-3.5 text-[12px] text-on-surface-variant font-sans">{item.category ?? "—"}</td>
                  <td className="px-4 py-3.5 text-right font-semibold text-[13px] text-primary font-sans tabular-nums">{item.totalQty} {item.unit}</td>
                  <td className="px-4 py-3.5 text-right text-[12px] text-on-surface-variant font-sans tabular-nums">{Number(item.minimum_stock)} {item.unit}</td>
                  <td className="px-4 py-3.5 text-[12px] font-sans">
                    {item.nearestExpiry
                      ? item.nearestExpiry.toLocaleDateString("pt-BR")
                      : <span className="text-outline">—</span>
                    }
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`nc-stat-chip ${
                      item.isLow ? "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : item.isExpiringSoon ? "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : item.isExpiringWarning ? "bg-nc-secondary/10 text-nc-secondary"
                        : "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
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
