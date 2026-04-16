"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createHash } from "crypto"
import { z } from "zod"

const evolutionSchema = z.object({
  clinicId: z.string().uuid(),
  patientId: z.string().uuid(),
  appointmentId: z.string().uuid().optional(),
  proceduresPerformed: z.string().min(1),
  materialsUsed: z.string().optional(),
  toothNumbers: z.array(z.number()).optional(),
  observations: z.string().optional(),
  signNow: z.boolean().default(false),
})

export async function createEvolution(values: z.infer<typeof evolutionSchema>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const parsed = evolutionSchema.parse(values)

  const { data: member } = await supabase
    .from('clinic_members')
    .select('id, full_name, cro, user_id')
    .eq('clinic_id', parsed.clinicId)
    .eq('user_id', user.id)
    .single()

  if (!member) throw new Error('Membro não encontrado')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const memberName = member.full_name ?? profile?.full_name ?? 'Profissional'

  let signedFields: {
    status: 'signed'
    signed_at: string
    signed_by_name: string
    signed_by_cro: string | null
    signed_hash: string
  } | { status: 'draft' } = { status: 'draft' }

  if (parsed.signNow) {
    const contentToHash = [
      parsed.patientId,
      parsed.proceduresPerformed,
      parsed.materialsUsed ?? '',
      parsed.observations ?? '',
      new Date().toISOString().split('T')[0],
    ].join('|')
    signedFields = {
      status: 'signed',
      signed_at: new Date().toISOString(),
      signed_by_name: memberName,
      signed_by_cro: member.cro ?? null,
      signed_hash: createHash('sha256').update(contentToHash).digest('hex'),
    }
  }

  const { data: evolution, error } = await supabase
    .from('clinical_evolutions')
    .insert({
      clinic_id: parsed.clinicId,
      patient_id: parsed.patientId,
      appointment_id: parsed.appointmentId ?? null,
      author_member_id: member.id,
      procedures_performed: parsed.proceduresPerformed,
      materials_used: parsed.materialsUsed ?? null,
      tooth_numbers: parsed.toothNumbers ?? null,
      observations: parsed.observations ?? null,
      ...signedFields,
    })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  revalidatePath(`/pacientes/${parsed.patientId}`)
  return evolution
}

export async function signEvolution(evolutionId: string, clinicId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: evolution } = await supabase
    .from('clinical_evolutions')
    .select('*')
    .eq('id', evolutionId)
    .single()

  if (!evolution) throw new Error('Evolução não encontrada')
  if (evolution.status === 'signed') throw new Error('Evolução já assinada')

  const { data: member } = await supabase
    .from('clinic_members')
    .select('id, full_name, cro')
    .eq('clinic_id', clinicId)
    .eq('user_id', user.id)
    .single()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const memberName = member?.full_name ?? profile?.full_name ?? 'Profissional'

  const contentToHash = [
    evolution.patient_id,
    evolution.procedures_performed,
    evolution.materials_used ?? '',
    evolution.observations ?? '',
    evolution.created_at?.split('T')[0] ?? '',
  ].join('|')

  const { error } = await supabase
    .from('clinical_evolutions')
    .update({
      status: 'signed',
      signed_at: new Date().toISOString(),
      signed_by_name: memberName,
      signed_by_cro: member?.cro ?? null,
      signed_hash: createHash('sha256').update(contentToHash).digest('hex'),
    })
    .eq('id', evolutionId)

  if (error) throw new Error(error.message)

  revalidatePath(`/pacientes/${evolution.patient_id}`)
}
