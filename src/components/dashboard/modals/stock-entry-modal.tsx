"use client"

import { useState, useTransition } from "react"
import { stockEntry } from "@/app/actions/stock"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Plus } from "lucide-react"

interface StockItem { id: string; name: string; unit: string }

interface Props {
  items: StockItem[]
  defaultItemId?: string
}

export function StockEntryModal({ items, defaultItemId }: Props) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [itemId, setItemId] = useState(defaultItemId ?? "")
  const [quantity, setQuantity] = useState("")
  const [batchNumber, setBatchNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!itemId || !quantity) return

    startTransition(async () => {
      try {
        await stockEntry({
          stock_item_id: itemId,
          quantity: parseFloat(quantity),
          batch_number: batchNumber || undefined,
          expiry_date: expiryDate || undefined,
        })
        toast.success("Entrada registrada")
        setItemId(defaultItemId ?? "")
        setQuantity("")
        setBatchNumber("")
        setExpiryDate("")
        setOpen(false)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erro ao registrar entrada")
      }
    })
  }

  const selectedItem = items.find((i) => i.id === itemId)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-1.5 text-xs">
          <Plus className="h-3.5 w-3.5" />
          Entrada manual
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Entrada de estoque</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          <div className="space-y-1">
            <Label className="text-xs">Item *</Label>
            <select
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              className="w-full text-sm border rounded-lg px-3 py-2 bg-white dark:bg-slate-800"
              required
            >
              <option value="">Selecione...</option>
              {items.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Quantidade {selectedItem ? `(${selectedItem.unit})` : ""} *</Label>
              <Input
                type="number"
                min="0.01"
                step="0.01"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Lote (opcional)</Label>
              <Input value={batchNumber} onChange={(e) => setBatchNumber(e.target.value)} placeholder="Ex: LOT123" />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Validade (opcional)</Label>
            <Input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
          </div>
          <Button
            type="submit"
            disabled={isPending || !itemId || !quantity}
            className="w-full bg-[#0D3A6B] hover:bg-[#1A5599] text-white"
          >
            {isPending ? "Registrando..." : "Registrar entrada"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
