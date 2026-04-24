"use client"

import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import { useState } from "react"
import { toast } from "sonner"

const clinicSizes = [
  "1 profissional (autônomo)",
  "2 a 5 profissionais",
  "6 a 15 profissionais",
  "Mais de 15 profissionais",
  "Multi-unidade",
]

const inputCls = "w-full border border-outline-variant rounded-xl px-4 py-2.5 text-sm bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"

export default function ContatoPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    setSent(true)
    toast.success("Mensagem enviada!", { description: "Nossa equipe entrará em contato em breve." })
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="pt-20">
        <section className="bg-primary/5 border-b border-primary/10 py-16 px-6 text-center">
          <h1 className="font-headline font-extrabold text-4xl text-primary mb-3">Fale com a gente</h1>
          <p className="text-on-surface-variant max-w-xl mx-auto">
            Dúvidas, demos, suporte — estamos aqui para ajudar. Resposta em até 1 dia útil.
          </p>
        </section>

        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-headline font-bold text-xl text-primary mb-6">Envie uma mensagem</h2>
              {sent ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                    <span className="material-symbols-outlined text-emerald-600" style={{ fontSize: 28 }}>send</span>
                  </div>
                  <h3 className="font-bold text-emerald-800 mb-1">Mensagem enviada!</h3>
                  <p className="text-sm text-emerald-700">Nossa equipe entrará em contato em breve.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-on-surface mb-1.5">Nome completo</label>
                      <input required className={inputCls} placeholder="Dra. Ana Costa" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-on-surface mb-1.5">Email</label>
                      <input required type="email" className={inputCls} placeholder="ana@clinica.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-1.5">WhatsApp</label>
                    <input className={inputCls} placeholder="(11) 99999-9999" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-1.5">Tamanho da clínica</label>
                    <select className={inputCls}>
                      <option value="">Selecione...</option>
                      {clinicSizes.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-1.5">Mensagem</label>
                    <textarea required rows={4} className={`${inputCls} resize-none`} placeholder="Como podemos ajudar?" />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 surgical-gradient text-white font-semibold py-3 rounded-xl shadow-premium-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{loading ? "autorenew" : "send"}</span>
                    {loading ? "Enviando..." : "Enviar mensagem"}
                  </button>
                </form>
              )}
            </div>

            <div className="space-y-6">
              <h2 className="font-headline font-bold text-xl text-primary">Outros canais</h2>
              <div className="space-y-4">
                <a href="https://wa.me/5511999999999" className="flex items-start gap-4 p-4 border border-outline-variant rounded-xl hover:border-emerald-300 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/40 flex items-center justify-center shrink-0 transition-colors">
                    <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-300" style={{ fontSize: 20 }}>chat</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-on-surface">WhatsApp</p>
                    <p className="text-xs text-on-surface-variant">(11) 99999-9999 — seg a sex, 9h–18h</p>
                  </div>
                </a>
                <a href="mailto:contato@naviclin.com" className="flex items-start gap-4 p-4 border border-outline-variant rounded-xl hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 flex items-center justify-center shrink-0 transition-colors">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-300" style={{ fontSize: 20 }}>mail</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-on-surface">Email</p>
                    <p className="text-xs text-on-surface-variant">contato@naviclin.com — resposta em até 1 dia útil</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
