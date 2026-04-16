"use client"

import { useState, useTransition } from "react"
import { createDirectCost } from "@/app/actions/commissions"
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

interface Service { id: string; name: string }

interface Props {
  services: Service[]
}

const PAYMENT_METHODS = [
  { value: "cash", label: "Dinheiro" },
  { value: "credit_card", label: "Cartão Crédito" },
  { value: "debit_card", label: "Cartão Débito" },
  { value: "pix", label: "PIX" },
  { value: "bank_transfer", label: "Transferência" },
  { value: "insurance", label: "Convênio" },
]

export function DirectCostModal({ services }: Props) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [name, setName] = useState("")
  const [kind, setKind] = useState<"payment_fee" | "external_service">("payment_fee")
  const [percentage, setPercentage] = useState("")
  const [fixedAmount, setFixedAmount] = useState("")
  const [serviceId, setServiceId] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      try {
        await createDirectCost({
          name,
          kind,
          percentage: percentage ? parseFloat(percentage) : null,
          fixed_amount: fixedAmount ? parseFloat(fixedAmount) : null,
          applies_to_service_id: serviceId || null,
          applies_to_payment_method: (paymentMethod as "cash" | "credit_card" | "debit_card" | "pix" | "bank_transfer" | "insurance") || null,
        })
        toast.success("Custo direto criado")
        setName("")
        setKind("payment_fee")
        setPercentage("")
        setFixedAmount("")
        setServiceId("")
        setPaymentMethod("")
        setOpen(false)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erro ao criar custo")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-1.5 text-xs">
          <Plus className="h-3.5 w-3.5" />
          Novo custo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Novo custo direto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          <div className="space-y-1">
            <Label className="text-xs">Nome *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Taxa cartão crédito..."
              required
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Tipo *</Label>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as "payment_fee" | "external_service")}
              className="w-full text-sm border rounded-lg px-3 py-2 bg-white dark:bg-slate-800"
            >
              <option value="payment_fee">Taxa de pagamento</option>
              <option value="external_service">Serviço externo (lab, etc)</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Percentual (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                placeholder="Ex: 3.49"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Valor fixo (R$)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={fixedAmount}
                onChange={(e) => setFixedAmount(e.target.value)}
                placeholder="Ex: 120"
              />
            </div>
          </div>
          {kind === "payment_fee" && (
            <div className="space-y-1">
              <Label className="text-xs">Aplica ao método de pagamento</Label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full text-sm border rounded-lg px-3 py-2 bg-white dark:bg-slate-800"
              >
                <option value="">Todos</option>
                {PAYMENT_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
          )}
          {kind === "external_service" && (
            <div className="space-y-1">
              <Label className="text-xs">Aplica ao serviço</Label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full text-sm border rounded-lg px-3 py-2 bg-white dark:bg-slate-800"
              >
                <option value="">Todos</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          )}
          <Button
            type="submit"
            disabled={isPending || !name.trim()}
            className="w-full bg-[#0D3A6B] hover:bg-[#1A5599] text-white"
          >
            {isPending ? "Salvando..." : "Criar custo"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
