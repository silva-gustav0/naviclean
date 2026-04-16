"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const insurancePlanSchema = z.object({
  name: z.string().min(1),
  ans_code: z.string().optional(),
})

const priceTableSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["private", "insurance"]),
  insurance_plan_id: z.string().uuid().optional().nullable(),
  is_default: z.boolean().default(false),
})

const servicePriceSchema = z.object({
  service_id: z.string().uuid(),
  price_table_id: z.string().uuid(),
  price: z.number().min(0),
})

async function getClinicId(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data } = await supabase.from("clinics").select("id").eq("owner_id", userId).single()
  return data?.id ?? null
}

export async function createInsurancePlan(values: z.infer<typeof insurancePlanSchema>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const clinicId = await getClinicId(supabase, user.id)
  if (!clinicId) redirect("/onboarding")

  const parsed = insurancePlanSchema.parse(values)

  const { error } = await supabase.from("insurance_plans").insert({
    clinic_id: clinicId,
    name: parsed.name,
    ans_code: parsed.ans_code ?? null,
  })

  if (error) throw new Error(error.message)
  revalidatePath("/configuracoes/convenios")
}

export async function updateInsurancePlan(id: string, values: z.infer<typeof insurancePlanSchema>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const clinicId = await getClinicId(supabase, user.id)
  if (!clinicId) redirect("/onboarding")

  const parsed = insurancePlanSchema.parse(values)

  const { error } = await supabase
    .from("insurance_plans")
    .update({ name: parsed.name, ans_code: parsed.ans_code ?? null })
    .eq("id", id)
    .eq("clinic_id", clinicId)

  if (error) throw new Error(error.message)
  revalidatePath("/configuracoes/convenios")
}

export async function toggleInsurancePlan(id: string, isActive: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const clinicId = await getClinicId(supabase, user.id)
  if (!clinicId) redirect("/onboarding")

  const { error } = await supabase
    .from("insurance_plans")
    .update({ is_active: isActive })
    .eq("id", id)
    .eq("clinic_id", clinicId)

  if (error) throw new Error(error.message)
  revalidatePath("/configuracoes/convenios")
}

export async function createPriceTable(values: z.infer<typeof priceTableSchema>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const clinicId = await getClinicId(supabase, user.id)
  if (!clinicId) redirect("/onboarding")

  const parsed = priceTableSchema.parse(values)

  if (parsed.is_default) {
    await supabase
      .from("price_tables")
      .update({ is_default: false })
      .eq("clinic_id", clinicId)
  }

  const { error } = await supabase.from("price_tables").insert({
    clinic_id: clinicId,
    name: parsed.name,
    type: parsed.type,
    insurance_plan_id: parsed.insurance_plan_id ?? null,
    is_default: parsed.is_default,
  })

  if (error) throw new Error(error.message)
  revalidatePath("/configuracoes/tabelas-preco")
}

export async function updatePriceTable(id: string, values: z.infer<typeof priceTableSchema>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const clinicId = await getClinicId(supabase, user.id)
  if (!clinicId) redirect("/onboarding")

  const parsed = priceTableSchema.parse(values)

  if (parsed.is_default) {
    await supabase
      .from("price_tables")
      .update({ is_default: false })
      .eq("clinic_id", clinicId)
      .neq("id", id)
  }

  const { error } = await supabase
    .from("price_tables")
    .update({
      name: parsed.name,
      type: parsed.type,
      insurance_plan_id: parsed.insurance_plan_id ?? null,
      is_default: parsed.is_default,
    })
    .eq("id", id)
    .eq("clinic_id", clinicId)

  if (error) throw new Error(error.message)
  revalidatePath("/configuracoes/tabelas-preco")
}

export async function upsertServicePrice(values: z.infer<typeof servicePriceSchema>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const clinicId = await getClinicId(supabase, user.id)
  if (!clinicId) redirect("/onboarding")

  const parsed = servicePriceSchema.parse(values)

  const { error } = await supabase.from("service_prices").upsert(
    {
      service_id: parsed.service_id,
      price_table_id: parsed.price_table_id,
      price: parsed.price,
    },
    { onConflict: "service_id,price_table_id" }
  )

  if (error) throw new Error(error.message)
  revalidatePath("/configuracoes/tabelas-preco")
  revalidatePath("/tratamentos")
}
