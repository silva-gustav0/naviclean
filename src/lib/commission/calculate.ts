import { createClient } from "@/lib/supabase/server"

export async function calculateCommissions(transactionId: string): Promise<void> {
  const supabase = await createClient()

  // 1. Fetch transaction with appointment and service info
  const { data: tx } = await supabase
    .from("transactions")
    .select("*, appointments(id, dentist_id, service_id)")
    .eq("id", transactionId)
    .single()

  if (!tx) return

  const appointment = tx.appointments as { id: string; dentist_id: string | null; service_id: string | null } | null
  if (!appointment?.dentist_id) return

  const memberId = appointment.dentist_id
  const serviceId = appointment.service_id
  const clinicId = tx.clinic_id as string
  const grossAmount = Number(tx.amount)

  // 2. Identify the service for category lookup
  let serviceCategory: string | null = null
  if (serviceId) {
    const { data: svc } = await supabase
      .from("services")
      .select("category")
      .eq("id", serviceId)
      .single()
    serviceCategory = svc?.category as string | null ?? null
  }

  // 3. Fetch applicable direct costs
  const { data: directCosts } = await supabase
    .from("direct_costs")
    .select("*")
    .eq("clinic_id", clinicId)
    .eq("is_active", true)

  let directCostsAmount = 0
  for (const dc of directCosts ?? []) {
    const appliesToService = !dc.applies_to_service_id || dc.applies_to_service_id === serviceId
    const appliesToPayment = !dc.applies_to_payment_method || dc.applies_to_payment_method === tx.payment_method

    if (appliesToService && appliesToPayment) {
      if (dc.percentage) {
        directCostsAmount += (grossAmount * Number(dc.percentage)) / 100
      } else if (dc.fixed_amount) {
        directCostsAmount += Number(dc.fixed_amount)
      }
    }
  }

  const netAmount = Math.max(0, grossAmount - directCostsAmount)

  // 4. Fetch best matching commission rule (highest priority match)
  const { data: rules } = await supabase
    .from("commission_rules")
    .select("*")
    .eq("clinic_id", clinicId)
    .eq("member_id", memberId)
    .eq("is_active", true)
    .order("priority", { ascending: false })

  // Find best matching rule
  let bestRule = null
  for (const rule of rules ?? []) {
    const matchService = !rule.service_id || rule.service_id === serviceId
    const matchCategory = !rule.service_category || rule.service_category === serviceCategory
    if (matchService && matchCategory) {
      bestRule = rule
      break
    }
  }

  if (!bestRule) return

  const commissionAmount = (netAmount * Number(bestRule.percentage)) / 100

  // 5. Determine status based on whether transaction is paid
  const status = tx.paid_at ? "released" : "pending"
  const releasedAt = tx.paid_at ? tx.paid_at : null

  // 6. Insert commission record
  await supabase.from("commissions").insert({
    clinic_id: clinicId,
    member_id: memberId,
    transaction_id: transactionId,
    service_id: serviceId ?? null,
    gross_amount: grossAmount,
    direct_costs_amount: directCostsAmount,
    net_amount: netAmount,
    percentage: Number(bestRule.percentage),
    commission_amount: commissionAmount,
    status,
    released_at: releasedAt,
  })
}
