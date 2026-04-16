"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateClinic(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Não autorizado" }

  const name = (formData.get("name") as string).trim()
  const slug = (formData.get("slug") as string).trim().toLowerCase()
  const phone = (formData.get("phone") as string).trim()
  const address_city = (formData.get("address_city") as string).trim()
  const address_state = (formData.get("address_state") as string).trim().toUpperCase()

  if (!name || !slug) return { error: "Nome e identificador são obrigatórios" }

  const { error } = await supabase
    .from("clinics")
    .update({ name, slug, phone, address_city, address_state })
    .eq("owner_id", user.id)

  if (error) {
    if (error.code === "23505") return { error: "Esse identificador já está em uso" }
    return { error: error.message }
  }

  revalidatePath("/configuracoes/clinica")
  revalidatePath("/dashboard")
  revalidatePath("/configuracoes")
  return { success: true }
}
