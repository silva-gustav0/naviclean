"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createService(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Não autorizado" }

  const { data: clinic } = await supabase
    .from("clinics")
    .select("id")
    .eq("owner_id", user.id)
    .single()

  if (!clinic) return { error: "Clínica não encontrada" }

  const name = (formData.get("name") as string).trim()
  if (!name) return { error: "Nome do tratamento é obrigatório" }

  const priceStr = formData.get("price") as string
  const durationStr = formData.get("duration_minutes") as string

  const { error } = await supabase.from("services").insert({
    clinic_id: clinic.id,
    name,
    description: (formData.get("description") as string).trim() || null,
    price: priceStr ? parseFloat(priceStr.replace(",", ".")) : undefined,
    duration_minutes: durationStr ? parseInt(durationStr) : undefined,
    category: (formData.get("category") as string).trim() || null,
    is_active: true,
  })

  if (error) return { error: error.message }

  revalidatePath("/tratamentos")
  return { success: true }
}
