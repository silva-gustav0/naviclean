"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, MessageSquare, Mail, Users, Calendar, Send } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

const STEPS = ["Canal", "Audiência", "Mensagem", "Agendamento"]

const CHANNELS = [
  { value: "whatsapp", label: "WhatsApp", icon: MessageSquare, color: "bg-emerald-50 border-emerald-200 text-emerald-600" },
  { value: "email", label: "Email", icon: Mail, color: "bg-blue-50 border-blue-200 text-blue-600" },
]

const SEGMENTS = [
  { value: "all", label: "Todos os pacientes" },
  { value: "inactive_3m", label: "Sem atendimento há 3+ meses" },
  { value: "inactive_6m", label: "Sem atendimento há 6+ meses" },
  { value: "birthday_month", label: "Aniversariantes do mês" },
  { value: "pending_treatment", label: "Com tratamento pendente" },
]

export default function NovaCampanhaPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    channel: "",
    segment: "",
    message: "",
    scheduled_at: "",
  })

  function next() { setStep((s) => Math.min(s + 1, STEPS.length - 1)) }
  function back() { setStep((s) => Math.max(s - 1, 0)) }

  async function submit() {
    if (!form.name || !form.channel || !form.segment) {
      toast.error("Preencha todos os campos obrigatórios")
      return
    }
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data: clinic } = await supabase.from("clinics").select("id").eq("owner_id", user?.id ?? "").single()
    if (!clinic) { setLoading(false); return }

    const { error } = await supabase.from("notifications").insert({
      clinic_id: clinic.id,
      channel: form.channel as "email" | "whatsapp" | "sms" | "push",
      title: form.name,
      message: form.message || `Campanha para segmento: ${form.segment}`,
    })

    setLoading(false)
    if (error) { toast.error("Erro ao criar campanha", { description: error.message }); return }
    toast.success("Campanha criada!")
    router.push("/marketing/campanhas")
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/marketing/campanhas" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Nova campanha</h1>
          <p className="text-muted-foreground text-sm">Passo {step + 1} de {STEPS.length}: {STEPS[step]}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-orange-500" : "bg-slate-200"}`} />
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border p-6 space-y-5">
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Nome da campanha <span className="text-red-500">*</span></label>
              <input
                className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                placeholder="Ex: Reativação Q1 2025"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Canal <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 gap-3">
                {CHANNELS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, channel: c.value }))}
                    className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${
                      form.channel === c.value ? `border-orange-400 ${c.color}` : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <c.icon className="h-6 w-6" />
                    <span className="text-sm font-medium">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium mb-1">Segmento de pacientes <span className="text-red-500">*</span></label>
            {SEGMENTS.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setForm((f) => ({ ...f, segment: s.value }))}
                className={`w-full flex items-center gap-3 p-3 border-2 rounded-xl text-left transition-all ${
                  form.segment === s.value ? "border-orange-400 bg-orange-50 dark:bg-orange-950" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <Users className={`h-5 w-5 shrink-0 ${form.segment === s.value ? "text-orange-500" : "text-slate-400"}`} />
                <span className="text-sm">{s.label}</span>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div>
            <label className="block text-sm font-medium mb-1.5">Mensagem</label>
            <textarea
              className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 resize-none"
              rows={6}
              placeholder={form.channel === "whatsapp"
                ? "Olá {{nome}}, sua saúde é nossa prioridade! Que tal agendar uma consulta de revisão?"
                : "Escreva o conteúdo do email..."
              }
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground mt-1.5">Use {"{{nome}}"} para personalizar com o nome do paciente.</p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                Agendar para
              </label>
              <input
                type="datetime-local"
                className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                value={form.scheduled_at}
                onChange={(e) => setForm((f) => ({ ...f, scheduled_at: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground mt-1">Deixe em branco para salvar como rascunho.</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-2 text-sm">
              <p className="font-medium">Resumo da campanha</p>
              <p className="text-muted-foreground">Nome: {form.name}</p>
              <p className="text-muted-foreground">Canal: {form.channel.toUpperCase()}</p>
              <p className="text-muted-foreground">Segmento: {SEGMENTS.find((s) => s.value === form.segment)?.label}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={back}
            className="flex-1 border py-3 rounded-xl font-medium text-sm hover:bg-slate-50 transition-colors"
          >
            Voltar
          </button>
        )}
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={next}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold text-sm transition-colors"
          >
            Próximo
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold text-sm transition-colors"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {loading ? "Salvando..." : "Criar campanha"}
          </button>
        )}
      </div>
    </div>
  )
}
