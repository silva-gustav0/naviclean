"use client"

import { useState, useTransition } from "react"
import { upsertAnamnesis } from "@/app/actions/anamnesis"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import type { Tables } from "@/types/database"

type Anamnesis = Tables<"anamnesis">

interface Props {
  patientId: string
  clinicId: string
  initial?: Anamnesis | null
  readOnly?: boolean
}

export function AnamnesisForm({ patientId, clinicId, initial, readOnly }: Props) {
  const [isPending, startTransition] = useTransition()

  const [values, setValues] = useState({
    chiefComplaint: initial?.chief_complaint ?? "",
    historyOfPresentIllness: initial?.history_of_present_illness ?? "",
    painCurrently: initial?.pain_currently ?? false,
    painLevel: initial?.pain_level ?? 0,
    hasCardiovascular: initial?.has_cardiovascular ?? false,
    cardiovascularNotes: initial?.cardiovascular_notes ?? "",
    hasDiabetes: initial?.has_diabetes ?? false,
    diabetesType: initial?.diabetes_type ?? "",
    hasCoagulationIssues: initial?.has_coagulation_issues ?? false,
    hasAllergies: initial?.has_allergies ?? false,
    allergiesList: initial?.allergies_list ?? "",
    usesContinuousMedication: initial?.uses_continuous_medication ?? false,
    medicationList: initial?.medication_list ?? "",
    hasCancerHistory: initial?.has_cancer_history ?? false,
    hasInfectiousDisease: initial?.has_infectious_disease ?? false,
    infectiousDiseaseNotes: initial?.infectious_disease_notes ?? "",
    smokes: initial?.smokes ?? false,
    smokingStatus: initial?.smoking_status ?? "",
    consumesAlcohol: initial?.consumes_alcohol ?? false,
    isPregnant: initial?.is_pregnant ?? false,
    isBreastfeeding: initial?.is_breastfeeding ?? false,
  })

  const set = <K extends keyof typeof values>(key: K, val: (typeof values)[K]) =>
    setValues((v) => ({ ...v, [key]: val }))

  function handleSubmit() {
    startTransition(async () => {
      try {
        await upsertAnamnesis({ ...values, patientId, clinicId, filledBy: "staff" })
        toast.success("Anamnese salva com sucesso")
      } catch {
        toast.error("Erro ao salvar anamnese")
      }
    })
  }

  const fieldClass = "space-y-1"
  const sectionClass = "space-y-4 p-4 border rounded-xl bg-slate-50 dark:bg-slate-900"

  return (
    <div className="space-y-5">
      {/* Queixa principal */}
      <div className={sectionClass}>
        <h3 className="font-semibold text-sm text-[#0D3A6B] dark:text-blue-300">Queixa Principal</h3>
        <div className={fieldClass}>
          <Label className="text-xs">Queixa principal</Label>
          <Textarea
            value={values.chiefComplaint}
            onChange={(e) => set("chiefComplaint", e.target.value)}
            placeholder="Motivo da consulta..."
            disabled={readOnly}
            rows={2}
          />
        </div>
        <div className={fieldClass}>
          <Label className="text-xs">Histórico da doença atual</Label>
          <Textarea
            value={values.historyOfPresentIllness}
            onChange={(e) => set("historyOfPresentIllness", e.target.value)}
            placeholder="Descreva o histórico..."
            disabled={readOnly}
            rows={3}
          />
        </div>
        <div className="flex items-center gap-3">
          <Switch
            checked={values.painCurrently}
            onCheckedChange={(v) => set("painCurrently", v)}
            disabled={readOnly}
          />
          <Label className="text-xs">Dor no momento?</Label>
        </div>
        {values.painCurrently && (
          <div className={fieldClass}>
            <Label className="text-xs">Nível de dor: {values.painLevel}/10</Label>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={values.painLevel}
              onChange={(e) => set("painLevel", Number(e.target.value))}
              disabled={readOnly}
              className="w-48"
            />
          </div>
        )}
      </div>

      {/* Histórico médico */}
      <div className={sectionClass}>
        <h3 className="font-semibold text-sm text-[#0D3A6B] dark:text-blue-300">Histórico Médico</h3>
        <BoolField
          label="Problemas cardiovasculares?"
          checked={values.hasCardiovascular}
          onChange={(v) => set("hasCardiovascular", v)}
          disabled={readOnly}
        >
          {values.hasCardiovascular && (
            <Textarea
              value={values.cardiovascularNotes}
              onChange={(e) => set("cardiovascularNotes", e.target.value)}
              placeholder="Especifique..."
              disabled={readOnly}
              rows={2}
            />
          )}
        </BoolField>
        <BoolField
          label="Diabetes?"
          checked={values.hasDiabetes}
          onChange={(v) => set("hasDiabetes", v)}
          disabled={readOnly}
        >
          {values.hasDiabetes && (
            <select
              className="text-sm border rounded px-2 py-1 bg-white dark:bg-slate-800"
              value={values.diabetesType}
              onChange={(e) => set("diabetesType", e.target.value)}
              disabled={readOnly}
            >
              <option value="">Selecione</option>
              <option value="type_1">Tipo 1</option>
              <option value="type_2">Tipo 2</option>
            </select>
          )}
        </BoolField>
        <BoolField
          label="Distúrbios de coagulação / uso de anticoagulantes?"
          checked={values.hasCoagulationIssues}
          onChange={(v) => set("hasCoagulationIssues", v)}
          disabled={readOnly}
        />
        <BoolField
          label="Histórico de câncer?"
          checked={values.hasCancerHistory}
          onChange={(v) => set("hasCancerHistory", v)}
          disabled={readOnly}
        />
        <BoolField
          label="Doença infectocontagiosa ativa?"
          checked={values.hasInfectiousDisease}
          onChange={(v) => set("hasInfectiousDisease", v)}
          disabled={readOnly}
        >
          {values.hasInfectiousDisease && (
            <Textarea
              value={values.infectiousDiseaseNotes}
              onChange={(e) => set("infectiousDiseaseNotes", e.target.value)}
              placeholder="Especifique..."
              disabled={readOnly}
              rows={2}
            />
          )}
        </BoolField>
      </div>

      {/* Medicamentos e alergias */}
      <div className={sectionClass}>
        <h3 className="font-semibold text-sm text-[#0D3A6B] dark:text-blue-300">Medicamentos e Alergias</h3>
        <BoolField
          label="Usa medicação contínua?"
          checked={values.usesContinuousMedication}
          onChange={(v) => set("usesContinuousMedication", v)}
          disabled={readOnly}
        >
          {values.usesContinuousMedication && (
            <Textarea
              value={values.medicationList}
              onChange={(e) => set("medicationList", e.target.value)}
              placeholder="Liste os medicamentos..."
              disabled={readOnly}
              rows={2}
            />
          )}
        </BoolField>
        <BoolField
          label="Tem alergias conhecidas?"
          checked={values.hasAllergies}
          onChange={(v) => set("hasAllergies", v)}
          disabled={readOnly}
        >
          {values.hasAllergies && (
            <Textarea
              value={values.allergiesList}
              onChange={(e) => set("allergiesList", e.target.value)}
              placeholder="Ex: penicilina, iodo, látex..."
              disabled={readOnly}
              rows={2}
            />
          )}
        </BoolField>
      </div>

      {/* Hábitos */}
      <div className={sectionClass}>
        <h3 className="font-semibold text-sm text-[#0D3A6B] dark:text-blue-300">Hábitos</h3>
        <BoolField
          label="Fuma?"
          checked={values.smokes}
          onChange={(v) => set("smokes", v)}
          disabled={readOnly}
        >
          {values.smokes && (
            <select
              className="text-sm border rounded px-2 py-1 bg-white dark:bg-slate-800"
              value={values.smokingStatus}
              onChange={(e) => set("smokingStatus", e.target.value)}
              disabled={readOnly}
            >
              <option value="">Selecione</option>
              <option value="current">Fumante atual</option>
              <option value="former">Ex-fumante</option>
            </select>
          )}
        </BoolField>
        <BoolField
          label="Consome bebidas alcoólicas?"
          checked={values.consumesAlcohol}
          onChange={(v) => set("consumesAlcohol", v)}
          disabled={readOnly}
        />
      </div>

      {/* Específico feminino */}
      <div className={sectionClass}>
        <h3 className="font-semibold text-sm text-[#0D3A6B] dark:text-blue-300">Específico Feminino</h3>
        <BoolField
          label="Está grávida?"
          checked={values.isPregnant}
          onChange={(v) => set("isPregnant", v)}
          disabled={readOnly}
        />
        <BoolField
          label="Está amamentando?"
          checked={values.isBreastfeeding}
          onChange={(v) => set("isBreastfeeding", v)}
          disabled={readOnly}
        />
      </div>

      {!readOnly && (
        <Button
          onClick={handleSubmit}
          disabled={isPending}
          className="bg-[#0D3A6B] hover:bg-[#1A5599] text-white"
        >
          {isPending ? "Salvando..." : "Salvar Anamnese"}
        </Button>
      )}
    </div>
  )
}

function BoolField({
  label,
  checked,
  onChange,
  disabled,
  children,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
  children?: React.ReactNode
}): React.ReactElement {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
        <Label className="text-xs cursor-pointer">{label}</Label>
      </div>
      {children}
    </div>
  )
}
