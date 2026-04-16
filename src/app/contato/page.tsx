"use client"

import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import { useState } from "react"
import { Mail, Phone, MessageSquare, MapPin, Send, Loader2 } from "lucide-react"
import { toast } from "sonner"

const clinicSizes = [
  "1 profissional (autônomo)",
  "2 a 5 profissionais",
  "6 a 15 profissionais",
  "Mais de 15 profissionais",
  "Multi-unidade",
]

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
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-b from-[#E8F0F9] to-white py-16 px-6 text-center">
          <h1 className="text-4xl font-bold text-[#0F172A] mb-3">Fale com a gente</h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            Dúvidas, demos, suporte — estamos aqui para ajudar. Resposta em até 2 horas úteis.
          </p>
        </section>

        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="text-xl font-bold mb-6">Envie uma mensagem</h2>
              {sent ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                    <Send className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-emerald-800 mb-1">Mensagem enviada!</h3>
                  <p className="text-sm text-emerald-700">Nossa equipe entrará em contato em breve.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Nome completo</label>
                      <input required className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0D3A6B] focus:ring-1 focus:ring-[#0D3A6B]/20" placeholder="Dra. Ana Costa" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Email</label>
                      <input required type="email" className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0D3A6B] focus:ring-1 focus:ring-[#0D3A6B]/20" placeholder="ana@clinica.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">WhatsApp</label>
                    <input className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0D3A6B] focus:ring-1 focus:ring-[#0D3A6B]/20" placeholder="(11) 99999-9999" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Tamanho da clínica</label>
                    <select className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0D3A6B] bg-white">
                      <option value="">Selecione...</option>
                      {clinicSizes.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Mensagem</label>
                    <textarea required rows={4} className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0D3A6B] focus:ring-1 focus:ring-[#0D3A6B]/20 resize-none" placeholder="Como podemos ajudar?" />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-[#0D3A6B] hover:bg-[#1A5599] text-white font-semibold py-3 rounded-xl transition-colors"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {loading ? "Enviando..." : "Enviar mensagem"}
                  </button>
                </form>
              )}
            </div>

            {/* Contact info */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Outros canais</h2>
              <div className="space-y-4">
                <a href="https://wa.me/5511999999999" className="flex items-start gap-4 p-4 border rounded-xl hover:border-emerald-200 hover:bg-emerald-50 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 group-hover:bg-emerald-200 flex items-center justify-center shrink-0 transition-colors">
                    <MessageSquare className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">WhatsApp</p>
                    <p className="text-xs text-slate-500">(11) 99999-9999 — seg a sex, 9h–18h</p>
                  </div>
                </a>
                <a href="mailto:contato@naviclin.com" className="flex items-start gap-4 p-4 border rounded-xl hover:border-blue-200 hover:bg-blue-50 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center shrink-0 transition-colors">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Email</p>
                    <p className="text-xs text-slate-500">contato@naviclin.com — resposta em até 2h úteis</p>
                  </div>
                </a>
                <div className="flex items-start gap-4 p-4 border rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Telefone</p>
                    <p className="text-xs text-slate-500">(11) 3000-0000 — seg a sex, 9h–18h</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 border rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Endereço</p>
                    <p className="text-xs text-slate-500">Av. Paulista, 1000 — São Paulo, SP — 01310-100</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
