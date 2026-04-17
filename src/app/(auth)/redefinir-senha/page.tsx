"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"

const schema = z.object({
  password: z.string().min(8, "Mínimo 8 caracteres"),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, {
  message: "As senhas não coincidem",
  path: ["confirm"],
})

type FormData = z.infer<typeof schema>

const inputCls = "w-full pl-11 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-on-surface placeholder:text-outline/50"

export default function RedefinirSenhaPage() {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const supabase = createClient()

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirm: "" },
  })

  async function onSubmit(data: FormData) {
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password: data.password })
    setLoading(false)

    if (error) {
      toast.error("Erro ao redefinir senha", { description: error.message })
      return
    }
    setDone(true)
  }

  if (done) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-emerald-600" style={{ fontSize: 32, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        </div>
        <div>
          <h1 className="font-headline font-extrabold text-2xl text-primary">Senha redefinida!</h1>
          <p className="text-on-surface-variant text-sm mt-1">Sua senha foi alterada com sucesso.</p>
        </div>
        <a href="/login" className="block w-full py-3 surgical-gradient text-white rounded-xl font-semibold text-sm text-center shadow-premium hover:opacity-90 transition-opacity">
          Ir para o login
        </a>
      </div>
    )
  }

  return (
    <>
      <h1 className="text-4xl font-extrabold font-headline text-primary mb-2 tracking-tight">
        Criar nova senha
      </h1>
      <p className="text-on-surface-variant font-sans mb-10">
        Escolha uma senha segura com pelo menos 8 caracteres.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-sans">
                  Nova senha
                </label>
                <FormControl>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">lock</span>
                    <input type="password" placeholder="••••••••" autoComplete="new-password" className={inputCls} {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-sans">
                  Confirmar senha
                </label>
                <FormControl>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">lock_reset</span>
                    <input type="password" placeholder="••••••••" autoComplete="new-password" className={inputCls} {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 surgical-gradient text-white font-headline font-bold rounded-lg shadow-premium hover:opacity-90 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <span className="material-symbols-outlined animate-spin" style={{ fontSize: 16 }}>autorenew</span> : null}
            Salvar nova senha
          </button>
        </form>
      </Form>
    </>
  )
}
