"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createPatient(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Não autorizado" }

  const { data: clinic } = await supabase
    .from("clinics")
    .select("id")
    .eq("owner_id", user.id)
    .single()

  if (!clinic) return { error: "Clínica não encontrada" }

  const full_name = (formData.get("full_name") as string).trim()
  if (!full_name || full_name.length < 3) return { error: "Nome deve ter pelo menos 3 caracteres" }

  const { error } = await supabase.from("patients").insert({
    clinic_id: clinic.id,
    full_name,
    email: (formData.get("email") as string).trim() || null,
    phone: (formData.get("phone") as string).trim() || null,
    whatsapp: (formData.get("phone") as string).trim() || null,
    date_of_birth: (formData.get("date_of_birth") as string) || null,
    cpf: (formData.get("cpf") as string).trim() || null,
    gender: (formData.get("gender") as string) || null,
  })

  if (error) return { error: error.message }

  revalidatePath("/pacientes")
  return { success: true }
}
