"use client"

import { useState, useTransition } from "react"
import { upsertServicePrice } from "@/app/actions/insurance"
import { toast } from "sonner"
import { Check, Loader2 } from "lucide-react"

interface Service {
  id: string
  name: string
  price: number | null
  category: string | null
}

interface ExistingPrice {
  id: string
  service_id: string
  price: number
}

interface Props {
  priceTableId: string
  services: Service[]
  existingPrices: ExistingPrice[]
}

export function PriceTableEditor({ priceTableId, services, existingPrices }: Props) {
  const [prices, setPrices] = useState<Record<string, string>>(() => {
    const m: Record<string, string> = {}
    for (const ep of existingPrices) {
      m[ep.service_id] = String(Number(ep.price).toFixed(2))
    }
    return m
  })
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState<Record<string, boolean>>({})
  const [, startTransition] = useTransition()

  function handleBlur(serviceId: string) {
    const val = prices[serviceId]
    if (!val || isNaN(parseFloat(val))) return

    setSaving((s) => ({ ...s, [serviceId]: true }))
    startTransition(async () => {
      try {
        await upsertServicePrice({
          service_id: serviceId,
          price_table_id: priceTableId,
          price: parseFloat(val),
        })
        setSaved((s) => ({ ...s, [serviceId]: true }))
        setTimeout(() => setSaved((s) => ({ ...s, [serviceId]: false })), 2000)
      } catch {
        toast.error("Erro ao salvar preço")
      } finally {
        setSaving((s) => ({ ...s, [serviceId]: false }))
      }
    })
  }

  if (services.length === 0) {
    return (
      <div className="px-5 py-8 text-center text-sm text-muted-foreground">
        Nenhum serviço cadastrado. Adicione serviços em Tratamentos primeiro.
      </div>
    )
  }

  return (
    <div className="divide-y">
      {services.map((svc) => (
        <div key={svc.id} className="flex items-center gap-4 px-5 py-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{svc.name}</p>
            {svc.category && <p className="text-xs text-muted-foreground">{svc.category}</p>}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-muted-foreground">R$</span>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.01"
                value={prices[svc.id] ?? ""}
                onChange={(e) => setPrices((p) => ({ ...p, [svc.id]: e.target.value }))}
                onBlur={() => handleBlur(svc.id)}
                placeholder={svc.price ? String(Number(svc.price).toFixed(2)) : "0,00"}
                className="w-28 text-right text-sm border rounded-lg px-3 py-1.5 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              {saving[svc.id] && (
                <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 animate-spin text-muted-foreground" />
              )}
              {saved[svc.id] && !saving[svc.id] && (
                <Check className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-emerald-600" />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
