"use client"

import { useState, useTransition } from "react"
import { createInsurancePlan, updateInsurancePlan, toggleInsurancePlan } from "@/app/actions/insurance"
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

type InsurancePlan = Tables<"insurance_plans">

interface Props {
  plan?: InsurancePlan
}

export function InsurancePlanModal({ plan }: Props) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [name, setName] = useState(plan?.name ?? "")
  const [ansCode, setAnsCode] = useState(plan?.ans_code ?? "")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      try {
        if (plan) {
          await updateInsurancePlan(plan.id, { name, ans_code: ansCode || undefined })
          toast.success("Convênio atualizado")
        } else {
          await createInsurancePlan({ name, ans_code: ansCode || undefined })
          toast.success("Convênio criado")
          setName("")
          setAnsCode("")
        }
        setOpen(false)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erro ao salvar convênio")
      }
    })
  }

  function handleToggle() {
    if (!plan) return
    startTransition(async () => {
      try {
        await toggleInsurancePlan(plan.id, !plan.is_active)
        toast.success(plan.is_active ? "Convênio desativado" : "Convênio ativado")
        setOpen(false)
      } catch {
        toast.error("Erro ao alterar status")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {plan ? (
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button className="flex items-center gap-1.5 text-xs bg-[#0D3A6B] hover:bg-[#1A5599] text-white">
            <Plus className="h-3.5 w-3.5" />
            Novo convênio
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{plan ? "Editar convênio" : "Novo convênio"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1">
            <Label className="text-xs">Nome do plano *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Amil Dental, Unimed..."
              required
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Código ANS</Label>
            <Input
              value={ansCode}
              onChange={(e) => setAnsCode(e.target.value)}
              placeholder="Ex: 123456"
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isPending || !name.trim()}
              className="flex-1 bg-[#0D3A6B] hover:bg-[#1A5599] text-white"
            >
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
            {plan && (
              <Button
                type="button"
                variant="outline"
                onClick={handleToggle}
                disabled={isPending}
                className="text-xs"
              >
                {plan.is_active ? "Desativar" : "Ativar"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
