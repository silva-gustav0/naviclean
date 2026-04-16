"use client"

import { useRef, useState, useTransition } from "react"
import { toast } from "sonner"
import { updateClinic } from "@/app/actions/clinic"
import { Loader2 } from "lucide-react"

interface ClinicFormProps {
  clinic: {
    name: string
    slug: string
    phone: string | null
    address_city: string | null
    address_state: string | null
  }
}

export function ClinicForm({ clinic }: ClinicFormProps) {
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const formData = new FormData(formRef.current!)
    startTransition(async () => {
      const result = await updateClinic(formData)
      if (result.error) {
        toast.error("Erro ao salvar", { description: result.error })
      } else {
        toast.success("Informações salvas com sucesso!")
      }
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Nome da clínica</label>
        <input
          name="name"
          type="text"
          defaultValue={clinic.name}
          required
          className="w-full px-4 py-2.5 text-sm border rounded-xl bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Identificador (URL)</label>
        <div className="flex">
          <span className="inline-flex items-center px-3 text-sm border border-r-0 rounded-l-xl bg-slate-100 dark:bg-slate-700 text-muted-foreground">
            naviclin.com/c/
          </span>
          <input
            name="slug"
            type="text"
            defaultValue={clinic.slug}
            required
            pattern="[a-z0-9-]+"
            className="flex-1 px-4 py-2.5 text-sm border rounded-r-xl bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <p className="text-xs text-muted-foreground">Apenas letras minúsculas, números e hífens.</p>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Telefone / WhatsApp</label>
        <input
          name="phone"
          type="text"
          defaultValue={clinic.phone ?? ""}
          className="w-full px-4 py-2.5 text-sm border rounded-xl bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5 col-span-2">
          <label className="text-sm font-medium">Cidade</label>
          <input
            name="address_city"
            type="text"
            defaultValue={clinic.address_city ?? ""}
            className="w-full px-4 py-2.5 text-sm border rounded-xl bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Estado</label>
          <input
            name="address_state"
            type="text"
            defaultValue={clinic.address_state ?? ""}
            maxLength={2}
            className="w-full px-4 py-2.5 text-sm border rounded-xl bg-slate-50 dark:bg-slate-800 text-center uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Salvar alterações
        </button>
      </div>
    </form>
  )
}
