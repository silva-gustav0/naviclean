"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const commissionRuleSchema = z.object({
  member_id: z.string().uuid(),
  service_id: z.string().uuid().optional().nullable(),
  service_category: z.string().optional().nullable(),
  price_table_id: z.string().uuid().optional().nullable(),
  percentage: z.number().min(0).max(100),
  priority: z.number().int().default(0),
})

const directCostSchema = z.object({
  name: z.string().min(1),
  kind: z.enum(["payment_fee", "external_service"]),
  percentage: z.number().min(0).max(100).optional().nullable(),
  fixed_amount: z.number().min(0).optional().nullable(),
  applies_to_service_id: z.string().uuid().optional().nullable(),
  applies_to_payment_method: z.enum(["cash", "credit_card", "debit_card", "pix", "bank_transfer", "insurance"]).optional().nullable(),
})

async function getClinicId(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data } = await supabase.from("clinics").select("id").eq("owner_id", userId).single()
  return data?.id ?? null
}

export async function createCommissionRule(values: z.infer<typeof commissionRuleSchema>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const clinicId = await getClinicId(supabase, user.id)
  if (!clinicId) redirect("/onboarding")

  const parsed = commissionRuleSchema.parse(values)

  const { error } = await supabase.from("commission_rules").insert({
    clinic_id: clinicId,
    member_id: parsed.member_id,
    service_id: parsed.service_id ?? null,
    service_category: parsed.service_category ?? null,
    price_table_id: parsed.price_table_id ?? null,
    percentage: parsed.percentage,
    priority: parsed.priority,
  })

  if (error) throw new Error(error.message)
  revalidatePath("/configuracoes/comissoes")
}

export async function deleteCommissionRule(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const clinicId = await getClinicId(supabase, user.id)
  if (!clinicId) redirect("/onboarding")

  const { error } = await supabase
    .from("commission_rules")
    .delete()
    .eq("id", id)
    .eq("clinic_id", clinicId)

  if (error) throw new Error(error.message)
  revalidatePath("/configuracoes/comissoes")
}

export async function createDirectCost(values: z.infer<typeof directCostSchema>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const clinicId = await getClinicId(supabase, user.id)
  if (!clinicId) redirect("/onboarding")

  const parsed = directCostSchema.parse(values)

  const { error } = await supabase.from("direct_costs").insert({
    clinic_id: clinicId,
    name: parsed.name,
    kind: parsed.kind,
    percentage: parsed.percentage ?? null,
    fixed_amount: parsed.fixed_amount ?? null,
    applies_to_service_id: parsed.applies_to_service_id ?? null,
    applies_to_payment_method: parsed.applies_to_payment_method ?? null,
  })

  if (error) throw new Error(error.message)
  revalidatePath("/configuracoes/comissoes")
}

export async function deleteDirectCost(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const clinicId = await getClinicId(supabase, user.id)
  if (!clinicId) redirect("/onboarding")

  const { error } = await supabase
    .from("direct_costs")
    .delete()
    .eq("id", id)
    .eq("clinic_id", clinicId)

  if (error) throw new Error(error.message)
  revalidatePath("/configuracoes/comissoes")
}

export async function markCommissionsPaid(commissionIds: string[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const clinicId = await getClinicId(supabase, user.id)
  if (!clinicId) redirect("/onboarding")

  const { error } = await supabase
    .from("commissions")
    .update({ status: "paid", paid_out_at: new Date().toISOString() })
    .in("id", commissionIds)
    .eq("clinic_id", clinicId)

  if (error) throw new Error(error.message)
  revalidatePath("/financeiro/comissoes")
}
