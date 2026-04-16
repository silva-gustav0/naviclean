"use client"

import { useState, useTransition } from "react"
import { createStockItem, updateStockItem } from "@/app/actions/stock"
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
import { Plus, Pencil } from "lucide-react"
import type { Tables } from "@/types/database"

type StockItem = Tables<"stock_items">

interface Props {
  item?: StockItem
}

const UNITS = ["unit", "box", "pack", "ml", "l", "mg", "g", "kg"]
const CATEGORIES = ["consumable", "medication", "instrument", "prosthetic_material"]
const CATEGORY_LABELS: Record<string, string> = {
  consumable: "Consumível",
  medication: "Medicamento",
  instrument: "Instrumento",
  prosthetic_material: "Material Protético",
}

export function StockItemModal({ item }: Props) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [name, setName] = useState(item?.name ?? "")
  const [brand, setBrand] = useState(item?.brand ?? "")
  const [category, setCategory] = useState(item?.category ?? "")
  const [unit, setUnit] = useState(item?.unit ?? "unit")
  const [minimumStock, setMinimumStock] = useState(String(item?.minimum_stock ?? 0))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      try {
        const values = {
          name,
          brand: brand || undefined,
          category: category || undefined,
          unit,
          minimum_stock: parseFloat(minimumStock) || 0,
        }
        if (item) {
          await updateStockItem(item.id, values)
          toast.success("Item atualizado")
        } else {
          await createStockItem(values)
          toast.success("Item cadastrado")
          setName("")
          setBrand("")
          setCategory("")
          setUnit("unit")
          setMinimumStock("0")
        }
        setOpen(false)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erro ao salvar item")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {item ? (
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
            <Pencil className="h-3.5 w-3.5 mr-1" />Editar
          </Button>
        ) : (
          <Button className="flex items-center gap-1.5 text-xs bg-[#0D3A6B] hover:bg-[#1A5599] text-white">
            <Plus className="h-3.5 w-3.5" />
            Novo item
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{item ? "Editar item" : "Novo item de estoque"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          <div className="space-y-1">
            <Label className="text-xs">Nome *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Luva látex M" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Marca</Label>
              <Input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Ex: Medix" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Unidade *</Label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full text-sm border rounded-lg px-3 py-2 bg-white dark:bg-slate-800"
                required
              >
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Categoria</Label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-sm border rounded-lg px-3 py-2 bg-white dark:bg-slate-800"
              >
                <option value="">Selecione...</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Estoque mínimo</Label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={minimumStock}
                onChange={(e) => setMinimumStock(e.target.value)}
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={isPending || !name.trim() || !unit}
            className="w-full bg-[#0D3A6B] hover:bg-[#1A5599] text-white"
          >
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
