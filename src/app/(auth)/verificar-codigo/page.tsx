"use client"

import { useRef, useState, useTransition } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

export default function VerificarCodigoPage() {
  const [digits, setDigits] = useState(["", "", "", "", "", ""])
  const [isPending, startTransition] = useTransition()
  const inputs = useRef<(HTMLInputElement | null)[]>([])
  const supabase = createClient()

  function handleChange(i: number, value: string) {
    const v = value.replace(/\D/g, "").slice(-1)
    const next = [...digits]
    next[i] = v
    setDigits(next)
    if (v && i < 5) inputs.current[i + 1]?.focus()
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus()
    }
    if (e.key === "ArrowLeft" && i > 0) inputs.current[i - 1]?.focus()
    if (e.key === "ArrowRight" && i < 5) inputs.current[i + 1]?.focus()
  }

  function handlePaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (pasted.length === 6) {
      setDigits(pasted.split(""))
      inputs.current[5]?.focus()
      e.preventDefault()
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const code = digits.join("")
    if (code.length < 6) {
      toast.error("Digite o código completo de 6 dígitos")
      return
    }
    startTransition(async () => {
      const { error } = await supabase.auth.verifyOtp({
        type: "email",
        email: "",
        token: code,
      })
      if (error) {
        toast.error("Código inválido ou expirado", { description: "Solicite um novo código." })
      } else {
        toast.success("Verificação concluída!")
        window.location.href = "/dashboard"
      }
    })
  }

  const allFilled = digits.every((d) => d !== "")

  return (
    <>
      <div className="mb-8">
        <div className="w-12 h-12 rounded-2xl bg-nc-secondary/10 flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-nc-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            shield_lock
          </span>
        </div>
        <h1 className="text-3xl font-extrabold font-headline text-primary mb-2 tracking-tight">
          Verificação em dois fatores
        </h1>
        <p className="text-on-surface-variant font-sans text-sm">
          Enviamos um código de 6 dígitos para o seu e-mail. Digite-o abaixo para continuar.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-7">
        <div className="flex gap-3 justify-center" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => { inputs.current[i] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`w-12 h-16 text-center text-2xl font-bold rounded-xl border-2 bg-surface-container-lowest outline-none transition-all font-headline
                ${d
                  ? "border-nc-secondary text-primary shadow-glow-gold"
                  : "border-outline-variant/30 text-primary focus:border-nc-secondary/70"
                }`}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={isPending || !allFilled}
          className="w-full py-4 px-6 surgical-gradient text-white font-headline font-bold rounded-lg shadow-premium hover:opacity-90 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isPending && <span className="material-symbols-outlined animate-spin" style={{ fontSize: 16 }}>autorenew</span>}
          Verificar código
        </button>
      </form>

      <div className="mt-6 text-center space-y-2">
        <p className="text-sm text-on-surface-variant font-sans">
          Não recebeu o código?{" "}
          <button className="text-primary font-bold hover:underline underline-offset-4">
            Reenviar
          </button>
        </p>
        <p className="text-xs text-on-surface-variant font-sans">
          O código expira em 10 minutos.
        </p>
      </div>

      <p className="mt-6 text-center text-sm text-on-surface-variant font-sans">
        <Link href="/login" className="flex items-center justify-center gap-1 text-primary font-bold hover:underline underline-offset-4">
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span>
          Voltar ao login
        </Link>
      </p>
    </>
  )
}
