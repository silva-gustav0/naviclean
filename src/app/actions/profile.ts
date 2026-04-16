"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Não autorizado" }

  const full_name = (formData.get("full_name") as string).trim()
  if (!full_name || full_name.length < 3) return { error: "Nome deve ter pelo menos 3 caracteres" }

  const { error } = await supabase
    .from("profiles")
    .update({ full_name })
    .eq("id", user.id)

  if (error) return { error: error.message }

  revalidatePath("/configuracoes/perfil")
  revalidatePath("/dashboard")
  return { success: true }
}
