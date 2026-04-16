"use client"

import { useRef, useState, useTransition } from "react"
import { toast } from "sonner"
import { inviteMember } from "@/app/actions/team"
import { X, Loader2, UserCog } from "lucide-react"

const ROLES = [
  { value: "dentist", label: "Dentista" },
  { value: "receptionist", label: "Recepcionista" },
  { value: "clinic_owner", label: "Sócio" },
]

export function InviteMemberModal() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const formData = new FormData(formRef.current!)
    startTransition(async () => {
      const result = await inviteMember(formData)
      if (result.error) {
        toast.error("Erro ao convidar", { description: result.error })
      } else {
        toast.success("Membro adicionado à clínica!")
        formRef.current?.reset()
        setOpen(false)
      }
    })
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
      >
        <span className="text-lg leading-none">+</span>
        Convidar membro
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-pink-50 dark:bg-pink-950 flex items-center justify-center">
                  <UserCog className="h-5 w-5 text-pink-600" />
                </div>
                <h2 className="font-semibold">Convidar Membro</h2>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Email <span className="text-red-500">*</span></label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="dentista@email.com"
                  className="w-full px-4 py-2.5 text-sm border rounded-xl bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <p className="text-xs text-muted-foreground">Se o usuário já tiver conta, será adicionado diretamente. Caso contrário, uma conta será criada.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Função <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-3 gap-2">
                  {ROLES.map((r) => (
                    <label key={r.value} className="relative cursor-pointer">
                      <input type="radio" name="role" value={r.value} defaultChecked={r.value === "dentist"} className="sr-only peer" />
                      <div className="border-2 peer-checked:border-pink-500 peer-checked:bg-pink-50 dark:peer-checked:bg-pink-950 rounded-xl py-3 text-center text-sm font-medium transition-all hover:border-pink-300">
                        {r.label}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="flex-1 py-2.5 text-sm font-semibold border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={isPending} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold bg-pink-600 hover:bg-pink-700 disabled:opacity-60 text-white rounded-xl transition-colors">
                  {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
