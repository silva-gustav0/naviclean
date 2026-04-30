import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export const PERMISSIONS = {
  // Financeiro: admin e recepção veem tudo; filiados veem só o próprio repasse (filtro no dado)
  'finance:read_all': ['clinic_owner', 'receptionist'],
  'finance:read_own': ['clinic_owner', 'receptionist', 'dentist', 'doctor', 'independent_professional'],
  'finance:write': ['clinic_owner'],
  // Estoque: admin e recepção gerenciam; filiados registram saída
  'stock:manage': ['clinic_owner', 'receptionist'],
  'stock:exit': ['clinic_owner', 'receptionist', 'dentist', 'doctor', 'independent_professional'],
  // Pacientes: filiados veem dados sensíveis; recepção vê dados básicos
  'patient:read_sensitive': ['clinic_owner', 'dentist', 'doctor', 'independent_professional'],
  'patient:read_basic': ['clinic_owner', 'dentist', 'doctor', 'receptionist', 'independent_professional'],
  // Prontuário: apenas profissionais clínicos
  'evolution:write': ['clinic_owner', 'dentist', 'doctor', 'independent_professional'],
  // Agenda: admin e recepção gerenciam; filiados apenas visualizam/agendam os próprios
  'appointment:manage': ['clinic_owner', 'receptionist'],
  'appointment:view': ['clinic_owner', 'receptionist', 'dentist', 'doctor', 'independent_professional'],
  // Configurações e equipe: apenas admin
  'settings:manage': ['clinic_owner'],
  'team:manage': ['clinic_owner'],
} as const

export type Permission = keyof typeof PERMISSIONS

export async function getCurrentMemberRole(clinicId: string): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('clinic_members')
    .select('role')
    .eq('clinic_id', clinicId)
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single()

  return data?.role ?? null
}

export async function requirePermission(clinicId: string, perm: Permission): Promise<void> {
  const role = await getCurrentMemberRole(clinicId)
  if (!role) redirect('/login')
  const allowed = PERMISSIONS[perm] as readonly string[]
  if (!allowed.includes(role)) redirect('/dashboard')
}

export function hasPermission(role: string, perm: Permission): boolean {
  const allowed = PERMISSIONS[perm] as readonly string[]
  return allowed.includes(role)
}
