"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

import { createClient } from "@/lib/supabase/client"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const supabase = createClient()

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(data: LoginForm) {
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      const msg =
        error.message.includes("Email not confirmed")
          ? "Confirme seu email antes de entrar."
          : error.message.includes("Invalid login")
          ? "Email ou senha incorretos."
          : error.message
      toast.error("Erro ao entrar", { description: msg })
      setIsLoading(false)
      return
    }

    window.location.href = "/dashboard"
  }

  return (
    <>
      <h1 className="text-4xl font-extrabold font-headline text-primary mb-2 tracking-tight">
        Bem-vindo de volta
      </h1>
      <p className="text-on-surface-variant font-sans mb-10">
        Acesse seu painel e prontuários dos pacientes.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  <input
                    type="email"
                    placeholder="dr.silva@naviclin.com"
                    autoComplete="email"
                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-on-surface placeholder:text-outline/50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-sans">
                    Senha
                  </label>
                  <Link href="/recuperar-senha" className="text-xs font-semibold text-primary hover:text-nc-secondary transition-colors">
                    Esqueceu a senha?
                  </Link>
                </div>
                <FormControl>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-on-surface"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-xl">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
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
            Entrar no Painel
          </button>
        </form>
      </Form>

      <p className="mt-10 text-center text-sm text-on-surface-variant font-sans">
        Não tem conta?{" "}
        <Link href="/cadastro" className="text-primary font-bold hover:underline underline-offset-4 transition-all">
          Começar teste grátis
        </Link>
      </p>
    </>
  )
}
