"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Package } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

type StockItem = { id: string; name: string; unit: string }

const TYPES = [
  { value: "entry", label: "Entrada de compra" },
  { value: "exit", label: "Saída manual" },
  { value: "adjustment", label: "Ajuste de inventário" },
  { value: "expired", label: "Perda por vencimento" },
]

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
        <Link href="/estoque/movimentacoes" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Nova movimentação</h1>
          <p className="text-muted-foreground text-sm">Registre entrada, saída ou ajuste de estoque</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl border p-6 space-y-5">
        <div>
          <Label htmlFor="type">Tipo de movimentação</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setForm((f) => ({ ...f, type: t.value }))}
                className={`p-3 rounded-xl border text-sm font-medium transition-all text-left ${
                  form.type === t.value
                    ? "border-[#0D3A6B] bg-[#E8F0F9] text-[#0D3A6B]"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="item">Item do estoque</Label>
          <select
            id="item"
            required
            value={form.stock_item_id}
            onChange={(e) => setForm((f) => ({ ...f, stock_item_id: e.target.value }))}
            className="mt-1.5 w-full border rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-slate-800 focus:outline-none focus:border-[#0D3A6B]"
          >
            <option value="">Selecione um item...</option>
            {items.map((i) => <option key={i.id} value={i.id}>{i.name} ({i.unit})</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              required
              value={form.quantity}
              onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
              className="mt-1.5"
              placeholder="0"
            />
          </div>
          {isEntry && (
            <div>
              <Label htmlFor="cost">Custo por unidade (R$)</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                value={form.cost_per_unit}
                onChange={(e) => setForm((f) => ({ ...f, cost_per_unit: e.target.value }))}
                className="mt-1.5"
                placeholder="0,00"
              />
            </div>
          )}
        </div>

        {isEntry && (
          <div>
            <Label htmlFor="expiry">Data de vencimento</Label>
            <Input
              id="expiry"
              type="date"
              value={form.expiry_date}
              onChange={(e) => setForm((f) => ({ ...f, expiry_date: e.target.value }))}
              className="mt-1.5"
            />
          </div>
        )}

        <div>
          <Label htmlFor="reason">Motivo / Observação</Label>
          <Input
            id="reason"
            value={form.reason}
            onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
            className="mt-1.5"
            placeholder="Ex: Compra da distribuidora, Uso em procedimento..."
          />
        </div>

        <Button type="submit" className="w-full h-11 font-semibold" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Package className="mr-2 h-4 w-4" />}
          {loading ? "Salvando..." : "Registrar movimentação"}
        </Button>
      </form>
    </div>
  )
}
