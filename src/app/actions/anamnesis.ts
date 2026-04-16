"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { randomBytes } from "crypto"
import { z } from "zod"

const anamnesisSchema = z.object({
  patientId: z.string().uuid(),
  clinicId: z.string().uuid(),
  chiefComplaint: z.string().optional(),
  historyOfPresentIllness: z.string().optional(),
  painCurrently: z.boolean().optional(),
  painLevel: z.number().min(0).max(10).optional(),
  hasCardiovascular: z.boolean().optional(),
  cardiovascularNotes: z.string().optional(),
  hasDiabetes: z.boolean().optional(),
  diabetesType: z.string().optional(),
  hasCoagulationIssues: z.boolean().optional(),
  hasAllergies: z.boolean().optional(),
  allergiesList: z.string().optional(),
  usesContinuousMedication: z.boolean().optional(),
  medicationList: z.string().optional(),
  hasCancerHistory: z.boolean().optional(),
  hasInfectiousDisease: z.boolean().optional(),
  infectiousDiseaseNotes: z.string().optional(),
  smokes: z.boolean().optional(),
  smokingStatus: z.string().optional(),
  smokingStoppedYears: z.number().optional(),
  consumesAlcohol: z.boolean().optional(),
  isPregnant: z.boolean().optional(),
  isBreastfeeding: z.boolean().optional(),
  filledBy: z.enum(['staff', 'patient']).default('staff'),
})

export async function upsertAnamnesis(values: z.infer<typeof anamnesisSchema>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const parsed = anamnesisSchema.parse(values)

  const { error } = await supabase
    .from('anamnesis')
    .upsert(
      {
        patient_id: parsed.patientId,
        clinic_id: parsed.clinicId,
        chief_complaint: parsed.chiefComplaint ?? null,
        history_of_present_illness: parsed.historyOfPresentIllness ?? null,
        pain_currently: parsed.painCurrently ?? null,
        pain_level: parsed.painLevel ?? null,
        has_cardiovascular: parsed.hasCardiovascular ?? null,
        cardiovascular_notes: parsed.cardiovascularNotes ?? null,
        has_diabetes: parsed.hasDiabetes ?? null,
        diabetes_type: parsed.diabetesType ?? null,
        has_coagulation_issues: parsed.hasCoagulationIssues ?? null,
        has_allergies: parsed.hasAllergies ?? null,
        allergies_list: parsed.allergiesList ?? null,
        uses_continuous_medication: parsed.usesContinuousMedication ?? null,
        medication_list: parsed.medicationList ?? null,
        has_cancer_history: parsed.hasCancerHistory ?? null,
        has_infectious_disease: parsed.hasInfectiousDisease ?? null,
        infectious_disease_notes: parsed.infectiousDiseaseNotes ?? null,
        smokes: parsed.smokes ?? null,
        smoking_status: parsed.smokingStatus ?? null,
        smoking_stopped_years: parsed.smokingStoppedYears ?? null,
        consumes_alcohol: parsed.consumesAlcohol ?? null,
        is_pregnant: parsed.isPregnant ?? null,
        is_breastfeeding: parsed.isBreastfeeding ?? null,
        filled_by: parsed.filledBy,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'patient_id' }
    )

  if (error) throw new Error(error.message)

  // Marca anamnesis_completed_at no paciente
  await supabase
    .from('patients')
    .update({ anamnesis_completed_at: new Date().toISOString() })
    .eq('id', parsed.patientId)

  revalidatePath(`/pacientes/${parsed.patientId}`)
}

export async function generateAnamnesisToken(patientId: string, clinicId: string): Promise<string> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString() // 72h

  const { error } = await supabase.from('anamnesis_tokens').insert({
    clinic_id: clinicId,
    patient_id: patientId,
    token,
    expires_at: expiresAt,
  })

  if (error) throw new Error(error.message)

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  return `${baseUrl}/anamnese/${token}`
}
