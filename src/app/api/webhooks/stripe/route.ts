import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { getStripe } from "@/lib/stripe/client"
import { createClient } from "@/lib/supabase/server"
import type Stripe from "stripe"

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
  }

  let event: Stripe.Event
  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    return NextResponse.json({ error: `Webhook error: ${err instanceof Error ? err.message : "unknown"}` }, { status: 400 })
  }

  const supabase = await createClient()

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription
      const clinicId = sub.metadata.clinic_id
      if (!clinicId) break

      const status = sub.status === "trialing" ? "trialing"
        : sub.status === "active" ? "active"
        : sub.status === "past_due" ? "past_due"
        : "cancelled"

      // Determine plan from price ID
      const priceId = sub.items.data[0]?.price.id ?? ""
      const plan = priceId === process.env.STRIPE_PRICE_SOLO ? "basic"
        : priceId === process.env.STRIPE_PRICE_CLINIC_STARTER ? "professional"
        : priceId === process.env.STRIPE_PRICE_CLINIC_PRO ? "enterprise"
        : "basic"

      await supabase
        .from("clinics")
        .update({
          subscription_status: status as "active" | "past_due" | "cancelled" | "trialing",
          subscription_plan: plan as "trial" | "basic" | "professional" | "enterprise",
          stripe_subscription_id: sub.id,
        })
        .eq("id", clinicId)
      break
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription
      const clinicId = sub.metadata.clinic_id
      if (!clinicId) break

      await supabase
        .from("clinics")
        .update({
          subscription_status: "cancelled",
          subscription_plan: "trial",
        })
        .eq("id", clinicId)
      break
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice & { subscription?: string | null }
      const sub = typeof invoice.subscription === "string"
        ? await getStripe().subscriptions.retrieve(invoice.subscription)
        : null

      const clinicId = sub?.metadata?.clinic_id
      if (!clinicId) break

      await supabase
        .from("clinics")
        .update({ subscription_status: "past_due" })
        .eq("id", clinicId)
      break
    }
  }

  return NextResponse.json({ received: true })
}
