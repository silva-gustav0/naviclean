"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

export function CopyLinkButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(`https://naviclin.com/c/${slug}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={copy}
      className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all shrink-0 ${
        copied
          ? "bg-emerald-600 text-white"
          : "bg-orange-500 hover:bg-orange-600 text-white"
      }`}
    >
      <span className="flex items-center gap-1.5">
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? "Copiado!" : "Copiar"}
      </span>
    </button>
  )
}
