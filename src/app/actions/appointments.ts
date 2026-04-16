"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

type AppointmentStatus = 'scheduled' | 'confirmed' | 'waiting_room' | 'in_progress' | 'awaiting_payment' | 'completed' | 'cancelled' | 'no_show'

const VALID_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  scheduled: ['confirmed', 'cancelled', 'no_show'],
  confirmed: ['waiting_room', 'cancelled', 'no_show'],
  waiting_room: ['in_progress', 'cancelled', 'no_show'],
  in_progress: ['awaiting_payment', 'completed'],
  awaiting_payment: ['completed'],
  completed: [],
  cancelled: [],
  no_show: ['scheduled'],
}

export async function changeAppointmentStatus(appointmentId: string, newStatus: AppointmentStatus) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: appt } = await supabase
    .from('appointments')
    .select('status, clinic_id')
    .eq('id', appointmentId)
    .single()

  if (!appt) throw new Error('Agendamento não encontrado')

  const currentStatus = appt.status as AppointmentStatus
  const allowed = VALID_TRANSITIONS[currentStatus] ?? []
  if (!allowed.includes(newStatus)) {
    throw new Error(`Transição inválida: ${currentStatus} → ${newStatus}`)
  }

  const { error } = await supabase
    .from('appointments')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', appointmentId)

  if (error) throw new Error(error.message)

  revalidatePath('/agenda')
  revalidatePath('/dashboard')
}

const createAppointmentSchema = z.object({
  clinicId: z.string().uuid(),
  patientId: z.string().uuid(),
  dentistId: z.string().uuid(),
  serviceId: z.string().uuid().optional(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  notes: z.string().optional(),
})

export async function createAppointment(values: z.infer<typeof createAppointmentSchema>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const parsed = createAppointmentSchema.parse(values)

  // Verificar conflito de horário
  const { data: conflicts } = await supabase
    .from('appointments')
    .select('id')
    .eq('dentist_id', parsed.dentistId)
    .eq('date', parsed.date)
    .neq('status', 'cancelled')
    .neq('status', 'no_show')
    .or(`start_time.lt.${parsed.endTime},end_time.gt.${parsed.startTime}`)

  if (conflicts && conflicts.length > 0) {
    throw new Error('Conflito de horário: o profissional já tem agendamento nesse horário')
  }

  const { data, error } = await supabase
    .from('appointments')
    .insert({
      clinic_id: parsed.clinicId,
      patient_id: parsed.patientId,
      dentist_id: parsed.dentistId,
      service_id: parsed.serviceId ?? null,
      date: parsed.date,
      start_time: parsed.startTime,
      end_time: parsed.endTime,
      notes: parsed.notes ?? null,
      status: 'scheduled',
    })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/agenda')
  return data
}
