"use client"

import { useState, useTransition } from "react"
import { markCommissionsPaid } from "@/app/actions/commissions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { CheckCircle } from "lucide-react"

interface Props {
  memberId: string
  memberName: string
  amount: number
  commissionIds: string[]
}

export function CommissionBatchPay({ memberName, amount, commissionIds }: Props) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  function handlePay() {
    startTransition(async () => {
      try {
        await markCommissionsPaid(commissionIds)
        toast.success("Comissões marcadas como repassadas")
        setOpen(false)
      } catch {
        toast.error("Erro ao marcar comissões")
      }
    })
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-xs"
      >
        <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
        Marcar repassado
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirmar repasse</DialogTitle>
            <DialogDescription>
              Marcar {commissionIds.length} comissão(ões) de{" "}
              <span className="font-semibold">{memberName}</span> totalizando{" "}
              <span className="font-semibold text-emerald-600">{fmt(amount)}</span> como repassadas?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancelar
            </Button>
            <Button
              onClick={handlePay}
              disabled={isPending}
              className="bg-[#0D3A6B] hover:bg-[#1A5599] text-white"
            >
              {isPending ? "Processando..." : "Confirmar repasse"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
