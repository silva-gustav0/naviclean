"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const stockItemSchema = z.object({
  name: z.string().min(1),
  brand: z.string().optional(),
  category: z.string().optional(),
  unit: z.string().min(1),
  minimum_stock: z.number().min(0).default(0),
})

const stockEntrySchema = z.object({
  stock_item_id: z.string().uuid(),
  quantity: z.number().positive(),
  batch_number: z.string().optional(),
  expiry_date: z.string().optional(),
})

const stockExitSchema = z.object({
  stock_item_id: z.string().uuid(),
  quantity: z.number().positive(),
  appointment_id: z.string().uuid().optional(),
  reason: z.string().optional(),
})

async function getClinicId(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data } = await supabase.from("clinics").select("id").eq("owner_id", userId).single()
  return data?.id ?? null
}

export async function createStockItem(values: z.infer<typeof stockItemSchema>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const clinicId = await getClinicId(supabase, user.id)
  if (!clinicId) redirect("/onboarding")

  const parsed = stockItemSchema.parse(values)

  const { error } = await supabase.from("stock_items").insert({
    clinic_id: clinicId,
    name: parsed.name,
    brand: parsed.brand ?? null,
    category: parsed.category ?? null,
    unit: parsed.unit,
    minimum_stock: parsed.minimum_stock,
  })

  if (error) throw new Error(error.message)
  revalidatePath("/estoque")
}

export async function updateStockItem(id: string, values: z.infer<typeof stockItemSchema>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const clinicId = await getClinicId(supabase, user.id)
  if (!clinicId) redirect("/onboarding")

  const parsed = stockItemSchema.parse(values)

  const { error } = await supabase
    .from("stock_items")
    .update({
      name: parsed.name,
      brand: parsed.brand ?? null,
      category: parsed.category ?? null,
      unit: parsed.unit,
      minimum_stock: parsed.minimum_stock,
    })
    .eq("id", id)
    .eq("clinic_id", clinicId)

  if (error) throw new Error(error.message)
  revalidatePath("/estoque")
}

export async function stockEntry(values: z.infer<typeof stockEntrySchema>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const clinicId = await getClinicId(supabase, user.id)
  if (!clinicId) redirect("/onboarding")

  const parsed = stockEntrySchema.parse(values)

  // Create batch
  const { data: batch, error: batchError } = await supabase
    .from("stock_batches")
    .insert({
      clinic_id: clinicId,
      stock_item_id: parsed.stock_item_id,
      quantity: parsed.quantity,
      batch_number: parsed.batch_number ?? null,
      expiry_date: parsed.expiry_date ?? null,
    })
    .select("id")
    .single()

  if (batchError) throw new Error(batchError.message)

  // Record movement
  const { error: movError } = await supabase.from("stock_movements").insert({
    clinic_id: clinicId,
    stock_item_id: parsed.stock_item_id,
    batch_id: batch.id,
    type: "entry",
    quantity: parsed.quantity,
    reason: "manual_entry",
    performed_by: user.id,
  })

  if (movError) throw new Error(movError.message)
  revalidatePath("/estoque")
}

export async function stockExit(values: z.infer<typeof stockExitSchema>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const clinicId = await getClinicId(supabase, user.id)
  if (!clinicId) redirect("/onboarding")

  const parsed = stockExitSchema.parse(values)

  // FEFO: get batches ordered by expiry (nulls last), then by creation date
  const { data: batches } = await supabase
    .from("stock_batches")
    .select("id, quantity, expiry_date")
    .eq("clinic_id", clinicId)
    .eq("stock_item_id", parsed.stock_item_id)
    .gt("quantity", 0)
    .order("expiry_date", { ascending: true, nullsFirst: false })

  if (!batches || batches.length === 0) throw new Error("Sem estoque disponível")

  let remaining = parsed.quantity
  for (const batch of batches) {
    if (remaining <= 0) break

    const batchQty = Number(batch.quantity)
    const toDeduct = Math.min(remaining, batchQty)
    const newQty = batchQty - toDeduct

    await supabase
      .from("stock_batches")
      .update({ quantity: newQty })
      .eq("id", batch.id)

    await supabase.from("stock_movements").insert({
      clinic_id: clinicId,
      stock_item_id: parsed.stock_item_id,
      batch_id: batch.id,
      type: "exit",
      quantity: toDeduct,
      reason: parsed.reason ?? "manual_exit",
      appointment_id: parsed.appointment_id ?? null,
      performed_by: user.id,
    })

    remaining -= toDeduct
  }

  if (remaining > 0) throw new Error("Estoque insuficiente para a quantidade solicitada")
  revalidatePath("/estoque")
}

export async function importNfe(
  clinicId: string,
  nfeKey: string,
  supplierName: string,
  issueDate: string,
  totalAmount: number,
  items: Array<{
    stock_item_id: string | null
    new_item_name: string | null
    new_item_unit: string
    new_item_category: string | null
    quantity: number
    batch_number: string | null
    expiry_date: string | null
  }>
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Check if NFe already imported
  const { data: existing } = await supabase
    .from("nfe_imports")
    .select("id")
    .eq("nfe_key", nfeKey)
    .single()

  if (existing) throw new Error("Esta NF-e já foi importada")

  // Create nfe record
  const { data: nfeImport, error: nfeError } = await supabase
    .from("nfe_imports")
    .insert({
      clinic_id: clinicId,
      nfe_key: nfeKey,
      supplier_name: supplierName,
      issue_date: issueDate,
      total_amount: totalAmount,
      status: "imported",
    })
    .select("id")
    .single()

  if (nfeError) throw new Error(nfeError.message)

  // Process items
  for (const item of items) {
    let stockItemId = item.stock_item_id

    // Create new item if needed
    if (!stockItemId && item.new_item_name) {
      const { data: newItem, error: itemError } = await supabase
        .from("stock_items")
        .insert({
          clinic_id: clinicId,
          name: item.new_item_name,
          unit: item.new_item_unit || "unit",
          category: item.new_item_category ?? null,
          minimum_stock: 0,
        })
        .select("id")
        .single()

      if (itemError) continue
      stockItemId = newItem.id
    }

    if (!stockItemId) continue

    // Create batch
    const { data: batch, error: batchError } = await supabase
      .from("stock_batches")
      .insert({
        clinic_id: clinicId,
        stock_item_id: stockItemId,
        quantity: item.quantity,
        batch_number: item.batch_number ?? null,
        expiry_date: item.expiry_date ?? null,
        nfe_key: nfeKey,
      })
      .select("id")
      .single()

    if (batchError) continue

    // Record movement
    await supabase.from("stock_movements").insert({
      clinic_id: clinicId,
      stock_item_id: stockItemId,
      batch_id: batch.id,
      type: "entry",
      quantity: item.quantity,
      reason: "nfe_import",
      performed_by: user.id,
    })
  }

  // Mark as processed
  await supabase
    .from("nfe_imports")
    .update({ status: "processed" })
    .eq("id", nfeImport.id)

  revalidatePath("/estoque")
}
