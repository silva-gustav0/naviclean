import Stripe from "stripe"

let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) throw new Error("STRIPE_SECRET_KEY not configured")
    stripeInstance = new Stripe(key, { apiVersion: "2026-03-25.dahlia" })
  }
  return stripeInstance
}

export const PLAN_PRICE_IDS = {
  solo: process.env.STRIPE_PRICE_SOLO ?? "",
  clinic_starter: process.env.STRIPE_PRICE_CLINIC_STARTER ?? "",
  clinic_pro: process.env.STRIPE_PRICE_CLINIC_PRO ?? "",
} as const

export const PLAN_LABELS: Record<string, string> = {
  solo: "Plano Solo",
  clinic_starter: "Clínica Starter",
  clinic_pro: "Clínica Pro",
  trial: "Trial Gratuito",
}
