"use client"

import { useRef, useState, useTransition } from "react"
import { toast } from "sonner"
import { createTransaction } from "@/app/actions/transactions"
import { X, Loader2, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { CatalogCombobox, type CatalogExpenseRow } from "@/components/ui/catalog-combobox"

const EXPENSE_CATEGORY_MAP: Record<string, string> = {
  "Infraestrutura Clínica": "aluguel",
  "Folha de Pagamento": "salarios",
  "Suprimentos Administrativos": "materiais",
  "Biossegurança e Resíduos": "materiais",
  "Tecnologia": "outros",
  "Administrativo e Jurídico": "outros",
  "Taxas e Legalização": "outros",
}

function mapExpenseCategory(catalogCategory: unknown): string {
  return EXPENSE_CATEGORY_MAP[String(catalogCategory ?? "")] ?? "outros"
}

export function NewTransactionModal() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [type, setType] = useState<"income" | "expense">("income")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const formRef = useRef<HTMLFormElement>(null)

  function handleExpenseSelect(raw: Record<string, unknown>) {
    const item = raw as CatalogExpenseRow
    setDescription(item.description)
    setCategory(mapExpenseCategory(item.category))
  }

  function handleClose() {
    setOpen(false)
    setDescription("")
    setCategory("")
  }

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
        setDescription("")
        setCategory("")
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
          <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
          <div className="relative bg-card rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-amber-500" />
                </div>
                <h2 className="font-semibold">Novo Lançamento</h2>
              </div>
              <button onClick={handleClose} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Type toggle */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { setType("income"); setDescription(""); setCategory("") }}
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
                  onClick={() => { setType("expense"); setDescription(""); setCategory("") }}
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
                <label className="text-sm font-medium">
                  Descrição <span className="text-red-500">*</span>
                  {type === "expense" && (
                    <span className="ml-1.5 text-xs text-muted-foreground font-normal">(digite para buscar sugestões)</span>
                  )}
                </label>
                {type === "expense" ? (
                  <CatalogCombobox
                    name="description"
                    table="catalog_fixed_expenses"
                    searchColumn="description"
                    placeholder="Ex: Aluguel, Salário, Internet..."
                    value={description}
                    onChange={setDescription}
                    onSelect={handleExpenseSelect}
                    required
                    inputClassName="focus:ring-amber-500"
                    renderItem={(raw) => {
                      const exp = raw as CatalogExpenseRow
                      return (
                        <div>
                          <p className="text-sm font-medium">{exp.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {exp.category ?? ""}
                            {exp.estimated_value ? ` · R$ ${exp.estimated_value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : ""}
                          </p>
                        </div>
                      )
                    }}
                  />
                ) : (
                  <input
                    name="description"
                    type="text"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Consulta Dr. João"
                    className="w-full px-4 py-2.5 text-sm border rounded-xl bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                )}
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
                <select
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border rounded-xl bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
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
                <button type="button" onClick={handleClose} className="flex-1 py-2.5 text-sm font-semibold border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
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
