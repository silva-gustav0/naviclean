"use client"

import { useState, useTransition } from "react"
import { createPriceTable, updatePriceTable } from "@/app/actions/insurance"
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

type PriceTable = Tables<"price_tables">
type InsurancePlan = { id: string; name: string }

interface Props {
  table?: PriceTable
  insurancePlans: InsurancePlan[]
}

export function PriceTableModal({ table, insurancePlans }: Props) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [name, setName] = useState(table?.name ?? "")
  const [type, setType] = useState<"private" | "insurance">(table?.type ?? "private")
  const [insurancePlanId, setInsurancePlanId] = useState(table?.insurance_plan_id ?? "")
  const [isDefault, setIsDefault] = useState(table?.is_default ?? false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      try {
        const values = {
          name,
          type,
          insurance_plan_id: insurancePlanId || null,
          is_default: isDefault,
        }
        if (table) {
          await updatePriceTable(table.id, values)
          toast.success("Tabela atualizada")
        } else {
          await createPriceTable(values)
          toast.success("Tabela criada")
          setName("")
          setType("private")
          setInsurancePlanId("")
          setIsDefault(false)
        }
        setOpen(false)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erro ao salvar tabela")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {table ? (
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button className="flex items-center gap-1.5 text-xs bg-[#0D3A6B] hover:bg-[#1A5599] text-white">
            <Plus className="h-3.5 w-3.5" />
            Nova tabela
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{table ? "Editar tabela" : "Nova tabela de preço"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1">
            <Label className="text-xs">Nome *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Particular, Amil Dental..."
              required
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Tipo *</Label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "private" | "insurance")}
              className="w-full text-sm border rounded-lg px-3 py-2 bg-white dark:bg-slate-800"
            >
              <option value="private">Particular</option>
              <option value="insurance">Convênio</option>
            </select>
          </div>
          {type === "insurance" && insurancePlans.length > 0 && (
            <div className="space-y-1">
              <Label className="text-xs">Convênio vinculado</Label>
              <select
                value={insurancePlanId}
                onChange={(e) => setInsurancePlanId(e.target.value)}
                className="w-full text-sm border rounded-lg px-3 py-2 bg-white dark:bg-slate-800"
              >
                <option value="">Selecione...</option>
                {insurancePlans.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_default"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="is_default" className="text-xs cursor-pointer">Tabela padrão da clínica</Label>
          </div>
          <Button
            type="submit"
            disabled={isPending || !name.trim()}
            className="w-full bg-[#0D3A6B] hover:bg-[#1A5599] text-white"
          >
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
