"use client"

import { useRef, useState, useTransition } from "react"
import { toast } from "sonner"
import { createService } from "@/app/actions/services"
import { X, Loader2, Stethoscope } from "lucide-react"

export function NewServiceModal() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const formData = new FormData(formRef.current!)
    startTransition(async () => {
      const result = await createService(formData)
      if (result.error) {
        toast.error("Erro ao criar tratamento", { description: result.error })
      } else {
        toast.success("Tratamento criado!")
        formRef.current?.reset()
        setOpen(false)
      }
    })
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
      >
        <span className="text-lg leading-none">+</span>
        Novo Tratamento
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-950 flex items-center justify-center">
                  <Stethoscope className="h-5 w-5 text-cyan-600" />
                </div>
                <h2 className="font-semibold">Novo Tratamento</h2>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Nome do tratamento <span className="text-red-500">*</span></label>
                <input name="name" type="text" required placeholder="Ex: Limpeza, Clareamento, Implante..." className="w-full px-4 py-2.5 text-sm border rounded-xl bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Descrição</label>
                <textarea name="description" rows={2} placeholder="Descrição do procedimento..." className="w-full px-4 py-2.5 text-sm border rounded-xl bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Preço (R$)</label>
                  <input name="price" type="text" placeholder="150,00" className="w-full px-4 py-2.5 text-sm border rounded-xl bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Duração (minutos)</label>
                  <input name="duration_minutes" type="number" min="5" step="5" placeholder="60" className="w-full px-4 py-2.5 text-sm border rounded-xl bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Categoria</label>
                <select name="category" className="w-full px-4 py-2.5 text-sm border rounded-xl bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  <option value="">Selecione uma categoria</option>
                  <option value="preventivo">Preventivo</option>
                  <option value="restaurador">Restaurador</option>
                  <option value="estetico">Estético</option>
                  <option value="cirurgico">Cirúrgico</option>
                  <option value="ortodontia">Ortodontia</option>
                  <option value="endodontia">Endodontia</option>
                  <option value="periodontia">Periodontia</option>
                  <option value="implantes">Implantes</option>
                  <option value="outros">Outros</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="flex-1 py-2.5 text-sm font-semibold border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={isPending} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold bg-cyan-600 hover:bg-cyan-700 disabled:opacity-60 text-white rounded-xl transition-colors">
                  {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Criar tratamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
