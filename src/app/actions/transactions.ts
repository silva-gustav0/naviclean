"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createTransaction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Não autorizado" }

  const { data: clinic } = await supabase
    .from("clinics")
    .select("id")
    .eq("owner_id", user.id)
    .single()

  if (!clinic) return { error: "Clínica não encontrada" }

  const description = (formData.get("description") as string).trim()
  const amountStr = formData.get("amount") as string
  const type = formData.get("type") as string
  const category = (formData.get("category") as string).trim()
  const due_date = formData.get("due_date") as string

  if (!description) return { error: "Descrição é obrigatória" }
  if (!amountStr || isNaN(parseFloat(amountStr.replace(",", ".")))) return { error: "Valor inválido" }
  if (type !== "income" && type !== "expense") return { error: "Tipo inválido" }

  const { error } = await supabase.from("transactions").insert({
    clinic_id: clinic.id,
    description,
    amount: parseFloat(amountStr.replace(",", ".")),
    type: type as "income" | "expense",
    category: category || "outros",
    due_date: due_date || undefined,
    payment_status: "paid" as const,
  })

  if (error) return { error: error.message }

  revalidatePath("/financeiro")
  return { success: true }
}
