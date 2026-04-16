"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getStripe } from "@/lib/stripe/client"
import { headers } from "next/headers"

export async function createCheckoutSession(priceId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase
    .from("clinics")
    .select("id, name, stripe_customer_id")
    .eq("owner_id", user.id)
    .single()

  if (!clinic) redirect("/onboarding")

  const stripe = getStripe()
  const headersList = await headers()
  const host = headersList.get("host") ?? "localhost:3000"
  const protocol = host.includes("localhost") ? "http" : "https"
  const baseUrl = `${protocol}://${host}`

  // Get or create Stripe customer
  let customerId = clinic.stripe_customer_id as string | null
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: clinic.name as string,
      metadata: { clinic_id: clinic.id, user_id: user.id },
    })
    customerId = customer.id
    await supabase
      .from("clinics")
      .update({ stripe_customer_id: customerId })
      .eq("id", clinic.id)
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/configuracoes/plano?success=1`,
    cancel_url: `${baseUrl}/configuracoes/plano?cancelled=1`,
    subscription_data: {
      metadata: { clinic_id: clinic.id },
      trial_period_days: 14,
    },
  })

  if (!session.url) throw new Error("Erro ao criar sessão de checkout")
  redirect(session.url)
}

export async function createBillingPortalSession() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase
    .from("clinics")
    .select("stripe_customer_id")
    .eq("owner_id", user.id)
    .single()

  if (!clinic?.stripe_customer_id) {
    throw new Error("Nenhuma assinatura ativa. Contrate um plano primeiro.")
  }

  const stripe = getStripe()
  const headersList = await headers()
  const host = headersList.get("host") ?? "localhost:3000"
  const protocol = host.includes("localhost") ? "http" : "https"

  const session = await stripe.billingPortal.sessions.create({
    customer: clinic.stripe_customer_id as string,
    return_url: `${protocol}://${host}/configuracoes/plano`,
  })

  redirect(session.url)
}
