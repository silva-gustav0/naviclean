"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const faceMarkSchema = z.object({
  patientId: z.string().uuid(),
  clinicId: z.string().uuid(),
  toothNumber: z.number(),
  face: z.enum(['vestibular', 'lingual', 'mesial', 'distal', 'occlusal']),
  condition: z.enum(['healthy', 'cavity', 'filled', 'crown', 'missing', 'implant', 'root_canal', 'extraction_needed']),
  markStatus: z.enum(['planned', 'done', 'existing']),
  notes: z.string().optional(),
})

export async function upsertFaceMark(values: z.infer<typeof faceMarkSchema>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const parsed = faceMarkSchema.parse(values)

  // Find member
  const { data: member } = await supabase
    .from('clinic_members')
    .select('id')
    .eq('clinic_id', parsed.clinicId)
    .eq('user_id', user.id)
    .single()

  // Upsert — match por patient+tooth+face
  const { data: existing } = await supabase
    .from('tooth_face_marks')
    .select('id')
    .eq('patient_id', parsed.patientId)
    .eq('tooth_number', parsed.toothNumber)
    .eq('face', parsed.face)
    .single()

  if (existing) {
    await supabase
      .from('tooth_face_marks')
      .update({
        condition: parsed.condition,
        mark_status: parsed.markStatus,
        notes: parsed.notes ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
  } else {
    await supabase.from('tooth_face_marks').insert({
      clinic_id: parsed.clinicId,
      patient_id: parsed.patientId,
      tooth_number: parsed.toothNumber,
      face: parsed.face,
      condition: parsed.condition,
      mark_status: parsed.markStatus,
      notes: parsed.notes ?? null,
      created_by: member?.id ?? null,
    })
  }

  revalidatePath(`/pacientes/${parsed.patientId}`)
}

export async function removeFaceMark(markId: string, patientId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase.from('tooth_face_marks').delete().eq('id', markId)
  revalidatePath(`/pacientes/${patientId}`)
}

const symbolSchema = z.object({
  patientId: z.string().uuid(),
  clinicId: z.string().uuid(),
  toothNumber: z.number(),
  symbol: z.enum(['extraction', 'root_canal', 'missing', 'implant', 'crown']),
  status: z.enum(['planned', 'done']),
})

export async function upsertToothSymbol(values: z.infer<typeof symbolSchema>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const parsed = symbolSchema.parse(values)

  const { data: member } = await supabase
    .from('clinic_members')
    .select('id')
    .eq('clinic_id', parsed.clinicId)
    .eq('user_id', user.id)
    .single()

  const { data: existing } = await supabase
    .from('tooth_symbols')
    .select('id')
    .eq('patient_id', parsed.patientId)
    .eq('tooth_number', parsed.toothNumber)
    .eq('symbol', parsed.symbol)
    .single()

  if (existing) {
    await supabase
      .from('tooth_symbols')
      .update({ status: parsed.status })
      .eq('id', existing.id)
  } else {
    await supabase.from('tooth_symbols').insert({
      clinic_id: parsed.clinicId,
      patient_id: parsed.patientId,
      tooth_number: parsed.toothNumber,
      symbol: parsed.symbol,
      status: parsed.status,
      created_by: member?.id ?? null,
    })
  }

  revalidatePath(`/pacientes/${parsed.patientId}`)
}

export async function removeToothSymbol(symbolId: string, patientId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase.from('tooth_symbols').delete().eq('id', symbolId)
  revalidatePath(`/pacientes/${patientId}`)
}
