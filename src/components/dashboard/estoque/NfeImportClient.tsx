"use client"

import { useState, useTransition } from "react"
import { parseNfeXml, type NfeParsed, type NfeItem } from "@/lib/nfe/parse"
import { importNfe } from "@/app/actions/stock"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Upload, FileText, ArrowRight, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface ExistingItem {
  id: string
  name: string
  unit: string
  category: string | null
}

interface Props {
  clinicId: string
  existingItems: ExistingItem[]
}

interface NfeItemMapping {
  nfeItem: NfeItem
  mappedItemId: string | null
  createNew: boolean
  newUnit: string
  newCategory: string
}

const UNITS = ["unit", "box", "pack", "ml", "l", "mg", "g", "kg"]
const CATEGORIES = [
  { value: "consumable", label: "Consumível" },
  { value: "medication", label: "Medicamento" },
  { value: "instrument", label: "Instrumento" },
  { value: "prosthetic_material", label: "Material Protético" },
]

export function NfeImportClient({ clinicId, existingItems }: Props) {
  const router = useRouter()
  const [parsed, setParsed] = useState<NfeParsed | null>(null)
  const [mappings, setMappings] = useState<NfeItemMapping[]>([])
  const [isPending, startTransition] = useTransition()
  const [step, setStep] = useState<"upload" | "map" | "done">("upload")

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const xml = ev.target?.result as string
        const result = parseNfeXml(xml)
        setParsed(result)

        const initMappings: NfeItemMapping[] = result.items.map((item) => {
          // Try to find exact match by name (case insensitive)
          const match = existingItems.find(
            (ei) => ei.name.toLowerCase().includes(item.name.toLowerCase().substring(0, 10))
          )
          return {
            nfeItem: item,
            mappedItemId: match?.id ?? null,
            createNew: !match,
            newUnit: "unit",
            newCategory: "",
          }
        })
        setMappings(initMappings)
        setStep("map")
      } catch (err) {
        toast.error("Erro ao processar XML: " + (err instanceof Error ? err.message : "arquivo inválido"))
      }
    }
    reader.readAsText(file)
  }

  function updateMapping(index: number, updates: Partial<NfeItemMapping>) {
    setMappings((prev) => prev.map((m, i) => i === index ? { ...m, ...updates } : m))
  }

  function handleImport() {
    if (!parsed) return

    startTransition(async () => {
      try {
        await importNfe(
          clinicId,
          parsed.nfeKey,
          parsed.supplierName,
          parsed.issueDate,
          parsed.totalAmount,
          mappings.map((m) => ({
            stock_item_id: m.createNew ? null : m.mappedItemId,
            new_item_name: m.createNew ? m.nfeItem.name : null,
            new_item_unit: m.createNew ? m.newUnit : m.nfeItem.unit,
            new_item_category: m.createNew ? m.newCategory || null : null,
            quantity: m.nfeItem.quantity,
            batch_number: m.nfeItem.batchNumber,
            expiry_date: m.nfeItem.expiryDate,
          }))
        )
        toast.success("NF-e importada com sucesso!")
        setStep("done")
        setTimeout(() => router.push("/estoque"), 1500)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erro ao importar NF-e")
      }
    })
  }

  if (step === "done") {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-emerald-600" />
        </div>
        <h3 className="font-semibold text-lg mb-1">NF-e importada!</h3>
        <p className="text-muted-foreground text-sm">Redirecionando para o estoque...</p>
      </div>
    )
  }

  if (step === "upload") {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border p-8">
        <label className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-10 cursor-pointer hover:border-blue-300 transition-colors">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
            <Upload className="h-7 w-7 text-blue-600" />
          </div>
          <div className="text-center">
            <p className="font-semibold">Selecionar arquivo XML</p>
            <p className="text-sm text-muted-foreground mt-1">Arraste e solte ou clique para escolher</p>
            <p className="text-xs text-muted-foreground mt-2">Formatos aceitos: .xml (NF-e SEFAZ)</p>
          </div>
          <input type="file" accept=".xml" className="hidden" onChange={handleFile} />
        </label>
      </div>
    )
  }

  // step === "map"
  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  return (
    <div className="space-y-4">
      {/* NFe summary */}
      <div className="bg-blue-50 dark:bg-blue-950 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
          <FileText className="h-5 w-5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">{parsed!.supplierName}</p>
          <p className="text-xs text-muted-foreground">
            NF-e {parsed!.nfeKey ? parsed!.nfeKey.substring(0, 8) + "..." : "sem chave"} ·{" "}
            {parsed!.issueDate} · {fmt(parsed!.totalAmount)} · {parsed!.items.length} itens
          </p>
        </div>
        <Button variant="outline" size="sm" className="text-xs" onClick={() => setStep("upload")}>
          Trocar arquivo
        </Button>
      </div>

      {/* Item mapping table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h2 className="font-semibold text-sm">Mapeamento de itens</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Para cada item da nota, selecione o item do estoque correspondente ou crie um novo.
          </p>
        </div>
        <div className="divide-y">
          {mappings.map((m, i) => (
            <div key={i} className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{m.nfeItem.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {m.nfeItem.quantity} {m.nfeItem.unit} · {fmt(m.nfeItem.totalPrice)}
                    {m.nfeItem.batchNumber ? ` · Lote: ${m.nfeItem.batchNumber}` : ""}
                    {m.nfeItem.expiryDate ? ` · Val: ${m.nfeItem.expiryDate}` : ""}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                <div className="w-52 shrink-0">
                  <select
                    value={m.createNew ? "new" : (m.mappedItemId ?? "")}
                    onChange={(e) => {
                      if (e.target.value === "new") {
                        updateMapping(i, { createNew: true, mappedItemId: null })
                      } else {
                        updateMapping(i, { createNew: false, mappedItemId: e.target.value })
                      }
                    }}
                    className="w-full text-sm border rounded-lg px-2 py-1.5 bg-white dark:bg-slate-800"
                  >
                    <option value="new">+ Criar novo item</option>
                    {existingItems.map((ei) => (
                      <option key={ei.id} value={ei.id}>{ei.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              {m.createNew && (
                <div className="ml-7 grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Unidade</label>
                    <select
                      value={m.newUnit}
                      onChange={(e) => updateMapping(i, { newUnit: e.target.value })}
                      className="w-full text-sm border rounded-lg px-2 py-1.5 bg-white dark:bg-slate-800 mt-1"
                    >
                      {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Categoria</label>
                    <select
                      value={m.newCategory}
                      onChange={(e) => updateMapping(i, { newCategory: e.target.value })}
                      className="w-full text-sm border rounded-lg px-2 py-1.5 bg-white dark:bg-slate-800 mt-1"
                    >
                      <option value="">Sem categoria</option>
                      {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => setStep("upload")}>Cancelar</Button>
        <Button
          onClick={handleImport}
          disabled={isPending}
          className="bg-[#0D3A6B] hover:bg-[#1A5599] text-white"
        >
          {isPending ? "Importando..." : `Importar ${mappings.length} itens`}
        </Button>
      </div>
    </div>
  )
}
