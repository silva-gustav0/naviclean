"use client"

import { useState, useTransition } from "react"
import { createCommissionRule } from "@/app/actions/commissions"
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

interface Member { id: string; name: string }
interface Service { id: string; name: string; category: string | null }
interface PriceTable { id: string; name: string }

interface Props {
  members: Member[]
  services: Service[]
  priceTables: PriceTable[]
}

export function CommissionRuleModal({ members, services, priceTables }: Props) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [memberId, setMemberId] = useState("")
  const [serviceId, setServiceId] = useState("")
  const [serviceCategory, setServiceCategory] = useState("")
  const [priceTableId, setPriceTableId] = useState("")
  const [percentage, setPercentage] = useState("")
  const [priority, setPriority] = useState("0")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!memberId || !percentage) return

    startTransition(async () => {
      try {
        await createCommissionRule({
          member_id: memberId,
          service_id: serviceId || null,
          service_category: serviceCategory || null,
          price_table_id: priceTableId || null,
          percentage: parseFloat(percentage),
          priority: parseInt(priority) || 0,
        })
        toast.success("Regra de comissão criada")
        setMemberId("")
        setServiceId("")
        setServiceCategory("")
        setPriceTableId("")
        setPercentage("")
        setPriority("0")
        setOpen(false)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erro ao criar regra")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-1.5 text-xs bg-[#0D3A6B] hover:bg-[#1A5599] text-white">
          <Plus className="h-3.5 w-3.5" />
          Nova regra
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Nova regra de comissão</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          <div className="space-y-1">
            <Label className="text-xs">Profissional *</Label>
            <select
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="w-full text-sm border rounded-lg px-3 py-2 bg-white dark:bg-slate-800"
              required
            >
              <option value="">Selecione...</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Serviço (opcional)</Label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full text-sm border rounded-lg px-3 py-2 bg-white dark:bg-slate-800"
            >
              <option value="">Todos os serviços</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          {!serviceId && (
            <div className="space-y-1">
              <Label className="text-xs">Categoria (opcional)</Label>
              <Input
                value={serviceCategory}
                onChange={(e) => setServiceCategory(e.target.value)}
                placeholder="Ex: ortodontia, clínico geral..."
              />
            </div>
          )}
          <div className="space-y-1">
            <Label className="text-xs">Tabela de preço (opcional)</Label>
            <select
              value={priceTableId}
              onChange={(e) => setPriceTableId(e.target.value)}
              className="w-full text-sm border rounded-lg px-3 py-2 bg-white dark:bg-slate-800"
            >
              <option value="">Todas as tabelas</option>
              {priceTables.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Porcentagem (%) *</Label>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                placeholder="Ex: 30"
                required
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Prioridade</Label>
              <Input
                type="number"
                min="0"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Prioridade maior tem precedência em caso de múltiplas regras.
          </p>
          <Button
            type="submit"
            disabled={isPending || !memberId || !percentage}
            className="w-full bg-[#0D3A6B] hover:bg-[#1A5599] text-white"
          >
            {isPending ? "Salvando..." : "Criar regra"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
