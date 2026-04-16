"use client"

import { useState, useTransition } from "react"
import { createEvolution, signEvolution } from "@/app/actions/evolutions"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CheckCircle, Clock, Plus, PenLine } from "lucide-react"
import { toast } from "sonner"
import type { Tables } from "@/types/database"

type Evolution = Tables<"clinical_evolutions">

interface Props {
  patientId: string
  clinicId: string
  evolutions: Evolution[]
  memberName?: string
}

export function EvolutionsTab({ patientId, clinicId, evolutions, memberName }: Props) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [procedures, setProcedures] = useState("")
  const [materials, setMaterials] = useState("")
  const [observations, setObservations] = useState("")
  const [signNow, setSignNow] = useState(false)

  function handleSubmit() {
    if (!procedures.trim()) {
      toast.error("Informe os procedimentos realizados")
      return
    }
    startTransition(async () => {
      try {
        await createEvolution({
          clinicId,
          patientId,
          proceduresPerformed: procedures,
          materialsUsed: materials || undefined,
          observations: observations || undefined,
          signNow,
        })
        toast.success(signNow ? "Evolução criada e assinada" : "Evolução salva como rascunho")
        setProcedures("")
        setMaterials("")
        setObservations("")
        setSignNow(false)
        setOpen(false)
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : "Erro ao salvar evolução")
      }
    })
  }

  async function handleSign(evoId: string) {
    startTransition(async () => {
      try {
        await signEvolution(evoId, clinicId)
        toast.success("Evolução assinada com sucesso")
      } catch {
        toast.error("Erro ao assinar evolução")
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Evoluções Clínicas</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-[#0D3A6B] hover:bg-[#1A5599] text-white gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Nova Evolução
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Nova Evolução Clínica</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label className="text-xs">Procedimentos realizados *</Label>
                <Textarea
                  value={procedures}
                  onChange={(e) => setProcedures(e.target.value)}
                  placeholder="Descreva os procedimentos realizados..."
                  rows={3}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Materiais utilizados</Label>
                <Textarea
                  value={materials}
                  onChange={(e) => setMaterials(e.target.value)}
                  placeholder="Ex: Resina composta A2, anestésico..."
                  rows={2}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Observações</Label>
                <Textarea
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Observações adicionais..."
                  rows={2}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sign-now"
                  checked={signNow}
                  onChange={(e) => setSignNow(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="sign-now" className="text-xs cursor-pointer">
                  Assinar digitalmente agora (não poderá ser editada)
                </Label>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="bg-[#0D3A6B] hover:bg-[#1A5599] text-white"
                >
                  {isPending ? "Salvando..." : signNow ? "Salvar e Assinar" : "Salvar Rascunho"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {evolutions.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground text-sm">
          <PenLine className="h-8 w-8 mx-auto mb-2 opacity-30" />
          Nenhuma evolução registrada
        </div>
      ) : (
        <div className="space-y-3">
          {evolutions.map((evo) => (
            <div key={evo.id} className="border rounded-xl p-4 space-y-2 bg-white dark:bg-slate-900">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-sm font-medium">{evo.procedures_performed}</p>
                  {evo.materials_used && (
                    <p className="text-xs text-muted-foreground mt-0.5">Materiais: {evo.materials_used}</p>
                  )}
                  {evo.observations && (
                    <p className="text-xs text-muted-foreground mt-0.5">{evo.observations}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  {evo.status === 'signed' ? (
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 gap-1 text-[10px]">
                      <CheckCircle className="h-3 w-3" />
                      Assinado
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-amber-600 border-amber-300 gap-1 text-[10px]">
                      <Clock className="h-3 w-3" />
                      Rascunho
                    </Badge>
                  )}
                  {evo.status === 'draft' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 text-[10px] px-2 border-[#0D3A6B] text-[#0D3A6B]"
                      onClick={() => handleSign(evo.id)}
                      disabled={isPending}
                    >
                      Assinar
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span>{new Date(evo.created_at!).toLocaleString('pt-BR')}</span>
                {evo.signed_by_name && (
                  <span className="text-emerald-600">
                    Dr(a). {evo.signed_by_name}
                    {evo.signed_by_cro && ` — CRO ${evo.signed_by_cro}`}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
