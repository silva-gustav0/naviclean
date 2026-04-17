"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

type StockItem = { id: string; name: string; unit: string }

const TYPES = [
  { value: "entry",      label: "Entrada de compra",     icon: "add_circle" },
  { value: "exit",       label: "Saída manual",           icon: "remove_circle" },
  { value: "adjustment", label: "Ajuste de inventário",   icon: "tune" },
  { value: "expired",    label: "Perda por vencimento",   icon: "block" },
]

const inputCls = "w-full border border-outline-variant rounded-xl px-4 py-2.5 text-sm bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"

export default function NovaMovimentacaoPage() {
  const router = useRouter()
  const supabase = createClient()
  const [items, setItems] = useState<StockItem[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    stock_item_id: "",
    type: "entry",
    quantity: "",
    reason: "",
    expiry_date: "",
    cost_per_unit: "",
  })

  useEffect(() => {
    async function loadItems() {
      const { data: clinic } = await supabase.from("clinics").select("id").eq("owner_id", (await supabase.auth.getUser()).data.user?.id ?? "").single()
      if (!clinic) return
      const { data } = await supabase.from("stock_items").select("id, name, unit").eq("clinic_id", clinic.id).eq("is_active", true).order("name")
      setItems(data ?? [])
    }
    loadItems()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.stock_item_id || !form.quantity) {
      toast.error("Preencha o item e a quantidade")
      return
    }
    setLoading(true)
    const { data: clinic } = await supabase.from("clinics").select("id").eq("owner_id", (await supabase.auth.getUser()).data.user?.id ?? "").single()
    if (!clinic) { setLoading(false); return }

    const { error } = await supabase.from("stock_movements").insert({
      clinic_id: clinic.id,
      stock_item_id: form.stock_item_id,
      type: form.type as "entry" | "exit" | "adjustment" | "expired",
      quantity: Number(form.quantity),
      reason: form.reason || null,
    })

    if (form.type === "entry") {
      await supabase.from("stock_batches").insert({
        clinic_id: clinic.id,
        stock_item_id: form.stock_item_id,
        quantity: Number(form.quantity),
        expiry_date: form.expiry_date || null,
      })
    }

    setLoading(false)
    if (error) { toast.error("Erro ao registrar", { description: error.message }); return }
    toast.success("Movimentação registrada!")
    router.push("/estoque/movimentacoes")
  }

  const isEntry = form.type === "entry"

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/estoque/movimentacoes" className="p-2 hover:bg-surface-container rounded-xl transition-colors">
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>arrow_back</span>
        </Link>
        <div>
          <h1 className="font-headline font-extrabold text-2xl text-primary">Nova movimentação</h1>
          <p className="text-on-surface-variant text-sm">Registre entrada, saída ou ajuste de estoque</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 space-y-5 shadow-premium-sm">
        <div>
          <label className="block text-sm font-medium text-on-surface mb-2">Tipo de movimentação</label>
          <div className="grid grid-cols-2 gap-2">
            {TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setForm((f) => ({ ...f, type: t.value }))}
                className={`p-3 rounded-xl border-2 text-sm font-medium transition-all text-left flex items-center gap-2 ${
                  form.type === t.value
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-outline-variant hover:border-primary/30 text-on-surface-variant"
                }`}
              >
                <span className="material-symbols-outlined shrink-0" style={{ fontSize: 16 }}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-on-surface mb-1.5">Item do estoque</label>
          <select
            required
            value={form.stock_item_id}
            onChange={(e) => setForm((f) => ({ ...f, stock_item_id: e.target.value }))}
            className={inputCls}
          >
            <option value="">Selecione um item...</option>
            {items.map((i) => <option key={i.id} value={i.id}>{i.name} ({i.unit})</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5">Quantidade</label>
            <input
              type="number"
              min={1}
              required
              value={form.quantity}
              onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
              className={inputCls}
              placeholder="0"
            />
          </div>
          {isEntry && (
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5">Custo por unidade (R$)</label>
              <input
                type="number"
                step="0.01"
                value={form.cost_per_unit}
                onChange={(e) => setForm((f) => ({ ...f, cost_per_unit: e.target.value }))}
                className={inputCls}
                placeholder="0,00"
              />
            </div>
          )}
        </div>

        {isEntry && (
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5">Data de vencimento</label>
            <input
              type="date"
              value={form.expiry_date}
              onChange={(e) => setForm((f) => ({ ...f, expiry_date: e.target.value }))}
              className={inputCls}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-on-surface mb-1.5">Motivo / Observação</label>
          <input
            value={form.reason}
            onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
            className={inputCls}
            placeholder="Ex: Compra da distribuidora, Uso em procedimento..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 surgical-gradient text-white py-3 rounded-xl font-semibold text-sm shadow-premium-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{loading ? "autorenew" : "inventory_2"}</span>
          {loading ? "Salvando..." : "Registrar movimentação"}
        </button>
      </form>
    </div>
  )
}
