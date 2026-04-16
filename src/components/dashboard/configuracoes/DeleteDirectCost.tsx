"use client"

import { useTransition } from "react"
import { deleteDirectCost } from "@/app/actions/commissions"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

export function DeleteDirectCost({ costId }: { costId: string }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm("Remover este custo direto?")) return
    startTransition(async () => {
      try {
        await deleteDirectCost(costId)
        toast.success("Custo removido")
      } catch {
        toast.error("Erro ao remover custo")
      }
    })
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
      className="h-7 w-7 p-0 text-muted-foreground hover:text-red-600"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </Button>
  )
}
