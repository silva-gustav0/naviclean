"use client"

import { useState, useTransition } from "react"
import { upsertAnamnesis } from "@/app/actions/anamnesis"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import type { Tables } from "@/types/database"

type Anamnesis = Tables<"anamnesis">

interface Props {
  patientId: string
  clinicId: string
  token: string
  initial?: Anamnesis | null
}

export function AnamnesisFormPublic({ patientId, clinicId, token, initial }: Props) {
  const [isPending, startTransition] = useTransition()
  const [submitted, setSubmitted] = useState(false)

  const [values, setValues] = useState({
    chiefComplaint: initial?.chief_complaint ?? "",
    historyOfPresentIllness: initial?.history_of_present_illness ?? "",
    painCurrently: initial?.pain_currently ?? false,
    hasCardiovascular: initial?.has_cardiovascular ?? false,
    cardiovascularNotes: initial?.cardiovascular_notes ?? "",
    hasDiabetes: initial?.has_diabetes ?? false,
    hasCoagulationIssues: initial?.has_coagulation_issues ?? false,
    hasAllergies: initial?.has_allergies ?? false,
    allergiesList: initial?.allergies_list ?? "",
    usesContinuousMedication: initial?.uses_continuous_medication ?? false,
    medicationList: initial?.medication_list ?? "",
    hasCancerHistory: initial?.has_cancer_history ?? false,
    smokes: initial?.smokes ?? false,
    consumesAlcohol: initial?.consumes_alcohol ?? false,
    isPregnant: initial?.is_pregnant ?? false,
    isBreastfeeding: initial?.is_breastfeeding ?? false,
  })

  const set = <K extends keyof typeof values>(k: K, v: (typeof values)[K]) =>
    setValues((prev) => ({ ...prev, [k]: v }))

  function handleSubmit() {
    startTransition(async () => {
      try {
        await upsertAnamnesis({ ...values, patientId, clinicId, filledBy: "patient" })
        // Marca token como usado
        const supabase = createClient()
        await supabase.from("anamnesis_tokens").update({ used_at: new Date().toISOString() }).eq("token", token)
        setSubmitted(true)
        toast.success("Anamnese enviada com sucesso!")
      } catch {
        toast.error("Erro ao enviar anamnese. Tente novamente.")
      }
    })
  }

  if (submitted) {
    return (
      <div className="text-center py-8 space-y-3">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <span className="text-3xl">✓</span>
        </div>
        <h2 className="text-lg font-bold text-emerald-700">Anamnese enviada!</h2>
        <p className="text-sm text-muted-foreground">Obrigado por preencher. Seu dentista terá acesso antes do atendimento.</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Queixa Principal</h3>
        <Textarea value={values.chiefComplaint} onChange={(e) => set("chiefComplaint", e.target.value)} placeholder="Por que você está vindo à clínica?" rows={2} />
        <Textarea value={values.historyOfPresentIllness} onChange={(e) => set("historyOfPresentIllness", e.target.value)} placeholder="Histórico da queixa atual..." rows={2} />
        <div className="flex items-center gap-3">
          <Switch checked={values.painCurrently} onCheckedChange={(v) => set("painCurrently", v)} />
          <Label className="text-sm">Tenho dor no momento</Label>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Histórico de Saúde</h3>
        {[
          { key: "hasCardiovascular" as const, label: "Tenho problemas cardíacos / pressão alta" },
          { key: "hasDiabetes" as const, label: "Sou diabético(a)" },
          { key: "hasCoagulationIssues" as const, label: "Uso anticoagulante / tenho problemas de coagulação" },
          { key: "hasCancerHistory" as const, label: "Tive ou tenho câncer" },
        ].map(({ key, label }) => (
          <div key={key} className="flex items-center gap-3">
            <Switch checked={values[key]} onCheckedChange={(v) => set(key, v)} />
            <Label className="text-sm">{label}</Label>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Medicamentos e Alergias</h3>
        <div className="flex items-center gap-3">
          <Switch checked={values.usesContinuousMedication} onCheckedChange={(v) => set("usesContinuousMedication", v)} />
          <Label className="text-sm">Uso medicamentos contínuos</Label>
        </div>
        {values.usesContinuousMedication && (
          <Textarea value={values.medicationList} onChange={(e) => set("medicationList", e.target.value)} placeholder="Quais medicamentos?" rows={2} />
        )}
        <div className="flex items-center gap-3">
          <Switch checked={values.hasAllergies} onCheckedChange={(v) => set("hasAllergies", v)} />
          <Label className="text-sm">Tenho alergias conhecidas</Label>
        </div>
        {values.hasAllergies && (
          <Textarea value={values.allergiesList} onChange={(e) => set("allergiesList", e.target.value)} placeholder="Quais alergias? (ex: penicilina, látex...)" rows={2} />
        )}
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Hábitos e Outros</h3>
        {[
          { key: "smokes" as const, label: "Sou fumante" },
          { key: "consumesAlcohol" as const, label: "Consumo bebidas alcoólicas regularmente" },
          { key: "isPregnant" as const, label: "Estou grávida" },
          { key: "isBreastfeeding" as const, label: "Estou amamentando" },
        ].map(({ key, label }) => (
          <div key={key} className="flex items-center gap-3">
            <Switch checked={values[key]} onCheckedChange={(v) => set(key, v)} />
            <Label className="text-sm">{label}</Label>
          </div>
        ))}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isPending}
        className="w-full bg-[#0D3A6B] hover:bg-[#1A5599] text-white"
      >
        {isPending ? "Enviando..." : "Enviar Anamnese"}
      </Button>
    </div>
  )
}
