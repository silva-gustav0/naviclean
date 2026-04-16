"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function saveWorkingHours(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Não autorizado" }

  const { data: clinic } = await supabase
    .from("clinics")
    .select("id")
    .eq("owner_id", user.id)
    .single()

  if (!clinic) return { error: "Clínica não encontrada" }

  const upserts = []
  for (let day = 0; day <= 6; day++) {
    const isOpen = formData.get(`day_${day}_open`) === "on"
    const start = formData.get(`day_${day}_start`) as string ?? "08:00"
    const end = formData.get(`day_${day}_end`) as string ?? "18:00"
    upserts.push({
      clinic_id: clinic.id,
      day_of_week: day,
      is_active: isOpen,
      start_time: start,
      end_time: end,
    })
  }

  const { error } = await supabase
    .from("working_hours")
    .upsert(upserts, { onConflict: "clinic_id,day_of_week" })

  if (error) return { error: error.message }

  revalidatePath("/configuracoes/horarios")
  return { success: true }
}
