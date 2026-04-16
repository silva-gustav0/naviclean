import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export const PERMISSIONS = {
  'finance:read_all': ['clinic_owner'],
  'finance:write': ['clinic_owner'],
  'stock:manage': ['clinic_owner'],
  'stock:exit': ['clinic_owner', 'receptionist', 'dentist', 'doctor', 'independent_professional'],
  'patient:read_sensitive': ['clinic_owner', 'dentist', 'doctor', 'independent_professional'],
  'patient:read_basic': ['clinic_owner', 'dentist', 'doctor', 'receptionist', 'independent_professional'],
  'evolution:write': ['dentist', 'doctor', 'independent_professional', 'clinic_owner'],
  'appointment:manage': ['clinic_owner', 'receptionist'],
  'appointment:view': ['clinic_owner', 'receptionist', 'dentist', 'doctor', 'independent_professional'],
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
