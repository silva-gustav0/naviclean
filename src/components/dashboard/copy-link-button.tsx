"use client"

import { useState } from "react"

interface CopyLinkButtonProps {
  slug: string
  label?: string
  icon?: string
  path?: string
}

export function CopyLinkButton({ slug, label, icon, path }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false)

  const url = path
    ? `https://naviclin.com/c/${slug}${path}`
    : `https://naviclin.com/c/${slug}`

  async function copy() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (label) {
    return (
      <button
        onClick={copy}
        className={`flex items-center gap-2 border text-sm font-semibold px-4 py-2.5 rounded-xl transition-all font-headline ${
          copied
            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
            : "border-outline-variant text-primary hover:bg-surface-container"
        }`}
      >
        <span className="material-symbols-outlined text-xl">
          {copied ? "check_circle" : (icon ?? "link")}
        </span>
        {copied ? "Copiado!" : label}
      </button>
    )
  }

  return (
    <button
      onClick={copy}
      className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all shrink-0 font-headline ${
        copied
          ? "bg-emerald-600 text-white"
          : "surgical-gradient text-white shadow-premium-sm hover:opacity-90"
      }`}
    >
      <span className="flex items-center gap-1.5">
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
          {copied ? "check_circle" : "content_copy"}
        </span>
        {copied ? "Copiado!" : "Copiar"}
      </span>
    </button>
  )
}
