"use client"

import { useRef, useState, useTransition } from "react"
import { toast } from "sonner"
import { createTransaction } from "@/app/actions/transactions"
import { X, Loader2, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react"

export function NewTransactionModal() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [type, setType] = useState<"income" | "expense">("income")
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const formData = new FormData(formRef.current!)
    formData.set("type", type)
    startTransition(async () => {
      const result = await createTransaction(formData)
      if (result.error) {
        toast.error("Erro ao registrar", { description: result.error })
      } else {
        toast.success("Lançamento registrado!")
        formRef.current?.reset()
        setOpen(false)
      }
    })
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
      >
        <span className="text-lg leading-none">+</span>
        Novo Lançamento
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-amber-500" />
                </div>
                <h2 className="font-semibold">Novo Lançamento</h2>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Type toggle */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType("income")}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                    type === "income"
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                      : "border-transparent bg-slate-100 dark:bg-slate-800 text-muted-foreground"
                  }`}
                >
                  <ArrowUpRight className="h-4 w-4" />
                  Receita
                </button>
                <button
                  type="button"
                  onClick={() => setType("expense")}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                    type === "expense"
                      ? "border-red-500 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300"
                      : "border-transparent bg-slate-100 dark:bg-slate-800 text-muted-foreground"
                  }`}
                >
                  <ArrowDownRight className="h-4 w-4" />
                  Despesa
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Descrição <span className="text-red-500">*</span></label>
                <input name="description" type="text" required placeholder={type === "income" ? "Ex: Consulta Dr. João" : "Ex: Compra de materiais"} className="w-full px-4 py-2.5 text-sm border rounded-xl bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Valor (R$) <span className="text-red-500">*</span></label>
                  <input name="amount" type="text" required placeholder="0,00" className="w-full px-4 py-2.5 text-sm border rounded-xl bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Data</label>
                  <input name="due_date" type="date" defaultValue={new Date().toISOString().split("T")[0]} className="w-full px-4 py-2.5 text-sm border rounded-xl bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Categoria</label>
                <select name="category" className="w-full px-4 py-2.5 text-sm border rounded-xl bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option value="">Selecione</option>
                  {type === "income" ? (
                    <>
                      <option value="consulta">Consulta</option>
                      <option value="procedimento">Procedimento</option>
                      <option value="plano">Plano de tratamento</option>
                      <option value="outros">Outros</option>
                    </>
                  ) : (
                    <>
                      <option value="materiais">Materiais</option>
                      <option value="equipamentos">Equipamentos</option>
                      <option value="aluguel">Aluguel</option>
                      <option value="salarios">Salários</option>
                      <option value="marketing">Marketing</option>
                      <option value="outros">Outros</option>
                    </>
                  )}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="flex-1 py-2.5 text-sm font-semibold border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={isPending} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white rounded-xl transition-colors">
                  {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
