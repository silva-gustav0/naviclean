"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export async function inviteMember(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Não autorizado" }

  const { data: clinic } = await supabase
    .from("clinics")
    .select("id, name")
    .eq("owner_id", user.id)
    .single()

  if (!clinic) return { error: "Clínica não encontrada" }

  const email = (formData.get("email") as string).trim().toLowerCase()
  const role = (formData.get("role") as string) as "super_admin" | "clinic_owner" | "dentist" | "receptionist" | "patient"

  if (!email) return { error: "Email é obrigatório" }

  // Check if user already exists
  const admin = createAdminClient()
  const { data: existingUsers } = await admin.auth.admin.listUsers()
  const existingUser = existingUsers?.users.find((u) => u.email === email)

  if (existingUser) {
    // Check if already a member
    const { data: existing } = await supabase
      .from("clinic_members")
      .select("id")
      .eq("clinic_id", clinic.id)
      .eq("user_id", existingUser.id)
      .single()

    if (existing) return { error: "Este usuário já é membro da clínica" }

    // Add as member directly
    const { error } = await supabase.from("clinic_members").insert({
      clinic_id: clinic.id,
      user_id: existingUser.id,
      role,
    })
    if (error) return { error: error.message }
  } else {
    // Create user and add as member
    const { data: newUser, error: createError } = await admin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { role },
    })
    if (createError) return { error: createError.message }

    const { error } = await supabase.from("clinic_members").insert({
      clinic_id: clinic.id,
      user_id: newUser.user.id,
      role,
    })
    if (error) return { error: error.message }
  }

  revalidatePath("/equipe")
  return { success: true }
}
