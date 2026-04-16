import { createClient } from "@/lib/supabase/server"

export async function logAccess(
  clinicId: string,
  action: string,
  entityType: string,
  entityId?: string,
  oldData?: unknown,
  newData?: unknown,
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('audit_log').insert({
      clinic_id: clinicId,
      user_id: user?.id ?? null,
      action,
      entity_type: entityType,
      entity_id: entityId ?? null,
      old_data: oldData ? JSON.parse(JSON.stringify(oldData)) : null,
      new_data: newData ? JSON.parse(JSON.stringify(newData)) : null,
    })
  } catch {
    // silencioso — log nao deve quebrar a operação principal
  }
}
