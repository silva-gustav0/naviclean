"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

import { createClient } from "@/lib/supabase/client"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"

const cadastroSchema = z.object({
  full_name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: "As senhas não coincidem",
  path: ["confirm_password"],
})

type CadastroForm = z.infer<typeof cadastroSchema>

export default function CadastroPage() {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const form = useForm<CadastroForm>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: { full_name: "", email: "", password: "", confirm_password: "" },
  })

  async function onSubmit(data: CadastroForm) {
    setIsLoading(true)

    const { data: signUpData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          role: "clinic_owner",
        },
      },
    })

    if (error) {
      const msg = error.message.includes("already registered")
        ? "Este email já está cadastrado. Tente fazer login."
        : error.message
      toast.error("Erro ao criar conta", { description: msg })
      setIsLoading(false)
      return
    }

    if (signUpData.session) {
      toast.success("Conta criada com sucesso!")
      window.location.href = "/onboarding"
    } else {
      toast.success("Conta criada!", {
        description: "Verifique seu email para confirmar o cadastro.",
      })
      setIsLoading(false)
    }
  }

  const inputClass = "w-full pl-11 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-on-surface placeholder:text-outline/50"

  return (
    <>
      <h1 className="text-4xl font-extrabold font-headline text-primary mb-2 tracking-tight">
        Comece grátis hoje
      </h1>
      <p className="text-on-surface-variant font-sans mb-10">
        14 dias sem custo. Sem cartão de crédito.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Nome */}
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-sans">
                  Nome completo
                </label>
                <FormControl>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">
                      person
                    </span>
                    <input
                      type="text"
                      placeholder="Dr. João Silva"
                      autoComplete="name"
                      className={inputClass}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
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
                      className={inputClass}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Senha */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-sans">
                  Senha
                </label>
                <FormControl>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">
                      lock
                    </span>
                    <input
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      autoComplete="new-password"
                      className={inputClass}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirmar senha */}
          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-sans">
                  Confirmar senha
                </label>
                <FormControl>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">
                      lock_reset
                    </span>
                    <input
                      type="password"
                      placeholder="Repita a senha"
                      autoComplete="new-password"
                      className={inputClass}
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
            Começar gratuitamente
          </button>
        </form>
      </Form>

      <p className="mt-6 text-center text-xs text-on-surface-variant font-sans">
        Ao criar uma conta, você concorda com os{" "}
        <Link href="/termos" className="text-primary font-semibold hover:underline underline-offset-4">Termos de Uso</Link>{" "}
        e{" "}
        <Link href="/privacidade" className="text-primary font-semibold hover:underline underline-offset-4">Política de Privacidade</Link>.
      </p>

      <p className="mt-4 text-center text-sm text-on-surface-variant font-sans">
        Já tem uma conta?{" "}
        <Link href="/login" className="text-primary font-bold hover:underline underline-offset-4">
          Entrar
        </Link>
      </p>
    </>
  )
}
