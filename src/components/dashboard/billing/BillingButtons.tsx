"use client"

import { useState } from "react"
import { createCheckoutSession, createBillingPortalSession } from "@/app/actions/billing"
import { Loader2, CreditCard, Settings } from "lucide-react"

export function CheckoutButton({
  priceId,
  highlight,
  label,
}: {
  priceId: string
  highlight: boolean
  label: string
}) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      await createCheckoutSession(priceId)
    } catch {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-70 ${
        highlight
          ? "bg-blue-600 hover:bg-blue-700 text-white"
          : "border-2 border-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
      }`}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
      {label}
    </button>
  )
}

export function BillingPortalButton() {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      await createBillingPortalSession()
    } catch {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium text-white transition-colors disabled:opacity-70"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Settings className="h-4 w-4" />}
      Gerenciar
    </button>
  )
}
