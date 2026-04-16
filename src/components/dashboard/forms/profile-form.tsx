"use client"

import { useRef, useTransition } from "react"
import { toast } from "sonner"
import { updateProfile } from "@/app/actions/profile"
import { Loader2 } from "lucide-react"

interface ProfileFormProps {
  fullName: string
  email: string
}

export function ProfileForm({ fullName, email }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const formData = new FormData(formRef.current!)
    startTransition(async () => {
      const result = await updateProfile(formData)
      if (result.error) {
        toast.error("Erro ao salvar", { description: result.error })
      } else {
        toast.success("Perfil atualizado!")
      }
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Nome completo</label>
        <input
          name="full_name"
          type="text"
          defaultValue={fullName}
          required
          minLength={3}
          className="w-full px-4 py-2.5 text-sm border rounded-xl bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full px-4 py-2.5 text-sm border rounded-xl bg-slate-100 dark:bg-slate-700 text-muted-foreground cursor-not-allowed"
        />
        <p className="text-xs text-muted-foreground">O email não pode ser alterado por aqui.</p>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Salvar perfil
        </button>
      </div>
    </form>
  )
}
