"use client"

import { useRef, useState, useTransition } from "react"
import { toast } from "sonner"
import { saveWorkingHours } from "@/app/actions/working-hours"
import { Loader2 } from "lucide-react"

const DAYS = [
  { key: 0, label: "Domingo" },
  { key: 1, label: "Segunda-feira" },
  { key: 2, label: "Terça-feira" },
  { key: 3, label: "Quarta-feira" },
  { key: 4, label: "Quinta-feira" },
  { key: 5, label: "Sexta-feira" },
  { key: 6, label: "Sábado" },
]

interface DayHours {
  open: boolean
  start: string
  end: string
}

interface WorkingHoursFormProps {
  initialHours: Record<number, DayHours>
}

export function WorkingHoursForm({ initialHours }: WorkingHoursFormProps) {
  const [isPending, startTransition] = useTransition()
  const [hours, setHours] = useState<Record<number, DayHours>>(initialHours)
  const formRef = useRef<HTMLFormElement>(null)

  function toggleDay(day: number) {
    setHours((prev) => ({ ...prev, [day]: { ...prev[day], open: !prev[day].open } }))
  }

  function setTime(day: number, field: "start" | "end", value: string) {
    setHours((prev) => ({ ...prev, [day]: { ...prev[day], [field]: value } }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const formData = new FormData()
    for (let day = 0; day <= 6; day++) {
      if (hours[day].open) formData.set(`day_${day}_open`, "on")
      formData.set(`day_${day}_start`, hours[day].start)
      formData.set(`day_${day}_end`, hours[day].end)
    }
    startTransition(async () => {
      const result = await saveWorkingHours(formData)
      if (result.error) {
        toast.error("Erro ao salvar", { description: result.error })
      } else {
        toast.success("Horários salvos com sucesso!")
      }
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="divide-y">
        {DAYS.map((day) => {
          const h = hours[day.key]
          return (
            <div key={day.key} className={`flex items-center gap-4 px-6 py-4 ${!h.open ? "opacity-60" : ""}`}>
              <div className="w-36 shrink-0">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={h.open}
                    onChange={() => toggleDay(day.key)}
                    className="w-4 h-4 rounded accent-emerald-600"
                  />
                  <span className="text-sm font-medium">{day.label}</span>
                </label>
              </div>

              {h.open ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="time"
                    value={h.start}
                    onChange={(e) => setTime(day.key, "start", e.target.value)}
                    className="px-3 py-1.5 text-sm border rounded-lg bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-muted-foreground text-sm">até</span>
                  <input
                    type="time"
                    value={h.end}
                    onChange={(e) => setTime(day.key, "end", e.target.value)}
                    className="px-3 py-1.5 text-sm border rounded-lg bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Fechado</span>
              )}
            </div>
          )
        })}
      </div>

      <div className="px-6 py-4 border-t">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Salvar horários
        </button>
      </div>
    </form>
  )
}
