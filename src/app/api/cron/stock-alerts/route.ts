import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = await createClient()

  // Fetch all active stock items with their batches
  const { data: items, error } = await supabase
    .from("stock_items")
    .select("id, name, minimum_stock, unit, clinic_id, stock_batches(quantity, expiry_date)")
    .eq("is_active", true)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const today = new Date()
  const in30Days = new Date(today.getTime() + 30 * 86400000)
  const in30DaysStr = in30Days.toISOString().split("T")[0]

  let lowStockAlerts = 0
  let expiryAlerts = 0

  for (const item of items ?? []) {
    const batches = (item.stock_batches ?? []) as { quantity: number; expiry_date: string | null }[]
    const totalQty = batches.reduce((sum, b) => sum + Number(b.quantity), 0)

    // Low stock alert
    if (Number(item.minimum_stock) > 0 && totalQty <= Number(item.minimum_stock)) {
      await supabase.from("notifications").insert({
        clinic_id: item.clinic_id,
        channel: "push" as const,
        title: "Estoque baixo",
        message: `${item.name} está com estoque baixo: ${totalQty} ${item.unit} (mínimo: ${item.minimum_stock})`,
        reference_type: "stock_item",
        reference_id: item.id,
      })
      lowStockAlerts++
    }

    // Expiry alerts for batches in the next 30 days
    for (const batch of batches) {
      if (
        batch.expiry_date &&
        batch.quantity > 0 &&
        batch.expiry_date <= in30DaysStr
      ) {
        await supabase.from("notifications").insert({
          clinic_id: item.clinic_id,
          channel: "push" as const,
          title: "Lote próximo do vencimento",
          message: `Lote de ${item.name} vence em ${new Date(batch.expiry_date + "T12:00:00").toLocaleDateString("pt-BR")} (${batch.quantity} ${item.unit} restantes)`,
          reference_type: "stock_item",
          reference_id: item.id,
        })
        expiryAlerts++
      }
    }
  }

  return NextResponse.json({ lowStockAlerts, expiryAlerts })
}
