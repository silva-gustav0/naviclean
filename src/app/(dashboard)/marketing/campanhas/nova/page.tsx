"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

const STEPS = ["Canal", "Audiência", "Mensagem", "Agendamento"]

const CHANNELS = [
  { value: "whatsapp", label: "WhatsApp", icon: "chat",  cls: "text-emerald-600", bg: "bg-emerald-50 border-emerald-400" },
  { value: "email",    label: "Email",    icon: "mail",  cls: "text-blue-600",    bg: "bg-blue-50 border-blue-400" },
]

const SEGMENTS = [
  { value: "all",               label: "Todos os pacientes" },
  { value: "inactive_3m",       label: "Sem atendimento há 3+ meses" },
  { value: "inactive_6m",       label: "Sem atendimento há 6+ meses" },
  { value: "birthday_month",    label: "Aniversariantes do mês" },
  { value: "pending_treatment", label: "Com tratamento pendente" },
]

const inputCls = "w-full border border-outline-variant rounded-xl px-4 py-2.5 text-sm bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"

export default function NovaCampanhaPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "", channel: "", segment: "", message: "", scheduled_at: "",
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
        <Link href="/marketing/campanhas" className="p-2 hover:bg-surface-container rounded-xl transition-colors">
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>arrow_back</span>
        </Link>
        <div>
          <h1 className="font-headline font-extrabold text-2xl text-primary">Nova campanha</h1>
          <p className="text-on-surface-variant text-sm">Passo {step + 1} de {STEPS.length}: {STEPS[step]}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-surface-container-high"}`} />
        ))}
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 space-y-5 shadow-premium-sm">
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5">Nome da campanha <span className="text-red-500">*</span></label>
              <input
                className={inputCls}
                placeholder="Ex: Reativação Q1 2025"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">Canal <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 gap-3">
                {CHANNELS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, channel: c.value }))}
                    className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${
                      form.channel === c.value ? `${c.bg}` : "border-outline-variant hover:border-primary/30 bg-surface-container-lowest"
                    }`}
                  >
                    <span className={`material-symbols-outlined ${c.cls}`} style={{ fontSize: 24 }}>{c.icon}</span>
                    <span className="text-sm font-semibold text-on-surface">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-on-surface mb-1">Segmento de pacientes <span className="text-red-500">*</span></label>
            {SEGMENTS.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setForm((f) => ({ ...f, segment: s.value }))}
                className={`w-full flex items-center gap-3 p-3 border-2 rounded-xl text-left transition-all ${
                  form.segment === s.value ? "border-primary bg-primary/5" : "border-outline-variant hover:border-primary/30"
                }`}
              >
                <span className={`material-symbols-outlined shrink-0 ${form.segment === s.value ? "text-primary" : "text-outline"}`} style={{ fontSize: 18 }}>group</span>
                <span className="text-sm text-on-surface">{s.label}</span>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5">Mensagem</label>
            <textarea
              className={`${inputCls} resize-none`}
              rows={6}
              placeholder={form.channel === "whatsapp"
                ? "Olá {{nome}}, sua saúde é nossa prioridade! Que tal agendar uma consulta de revisão?"
                : "Escreva o conteúdo do email..."}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            />
            <p className="text-xs text-on-surface-variant mt-1.5">Use {"{{nome}}"} para personalizar com o nome do paciente.</p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5 flex items-center gap-1.5">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>calendar_month</span>
                Agendar para
              </label>
              <input
                type="datetime-local"
                className={inputCls}
                value={form.scheduled_at}
                onChange={(e) => setForm((f) => ({ ...f, scheduled_at: e.target.value }))}
              />
              <p className="text-xs text-on-surface-variant mt-1">Deixe em branco para salvar como rascunho.</p>
            </div>
            <div className="bg-surface-container rounded-xl p-4 space-y-2 text-sm">
              <p className="font-semibold text-on-surface">Resumo da campanha</p>
              <p className="text-on-surface-variant">Nome: {form.name}</p>
              <p className="text-on-surface-variant">Canal: {form.channel.toUpperCase()}</p>
              <p className="text-on-surface-variant">Segmento: {SEGMENTS.find((s) => s.value === form.segment)?.label}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={back}
            className="flex-1 border border-outline-variant text-on-surface-variant py-3 rounded-xl font-medium text-sm hover:bg-surface-container transition-colors"
          >
            Voltar
          </button>
        )}
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={next}
            className="flex-1 surgical-gradient text-white py-3 rounded-xl font-semibold text-sm shadow-premium-sm hover:opacity-90 transition-opacity"
          >
            Próximo
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 surgical-gradient text-white py-3 rounded-xl font-semibold text-sm shadow-premium-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{loading ? "autorenew" : "send"}</span>
            {loading ? "Salvando..." : "Criar campanha"}
          </button>
        )}
      </div>
    </div>
  )
}
