"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

import { createClient } from "@/lib/supabase/client"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"

const schema = z.object({
  email: z.string().email("Email inválido"),
})

type FormData = z.infer<typeof schema>

export default function RecuperarSenhaPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const supabase = createClient()

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  })

  async function onSubmit(data: FormData) {
    setIsLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/redefinir-senha`,
    })

    if (error) {
      toast.error("Erro", { description: "Não foi possível enviar o email." })
      setIsLoading(false)
      return
    }

    setSent(true)
    setIsLoading(false)
  }

  if (sent) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-nc-secondary/10 flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-nc-secondary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            mark_email_read
          </span>
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-primary font-headline">Email enviado!</h2>
          <p className="text-on-surface-variant text-sm mt-2 font-sans">
            Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 w-full justify-center py-3 border border-outline-variant/20 rounded-lg text-primary font-bold text-sm font-headline hover:bg-surface-container-low transition-colors"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
          Voltar para o login
        </Link>
      </div>
    )
  }

  return (
    <>
      <h1 className="text-4xl font-extrabold font-headline text-primary mb-2 tracking-tight">
        Recuperar senha
      </h1>
      <p className="text-on-surface-variant font-sans mb-10">
        Digite seu email e enviaremos um link para redefinir sua senha.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-sans">
                  Email
                </label>
                <FormControl>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">
                      mail
                    </span>
                    <input
                      type="email"
                      placeholder="voce@clinica.com"
                      autoComplete="email"
                      className="w-full pl-11 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-on-surface placeholder:text-outline/50"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 surgical-gradient text-white font-headline font-bold rounded-lg shadow-premium hover:opacity-90 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isLoading ? <span className="material-symbols-outlined animate-spin" style={{ fontSize: 16 }}>autorenew</span> : null}
            Enviar link de recuperação
          </button>
        </form>
      </Form>

      <Link
        href="/login"
        className="mt-6 inline-flex items-center gap-2 w-full justify-center py-3 text-on-surface-variant font-semibold text-sm font-sans hover:text-primary transition-colors"
      >
        <span className="material-symbols-outlined text-xl">arrow_back</span>
        Voltar para o login
      </Link>
    </>
  )
}
