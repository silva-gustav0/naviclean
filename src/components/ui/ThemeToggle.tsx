"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className={`w-9 h-9 rounded-full bg-surface-container ${className}`} />
  }

  const dark = resolvedTheme === "dark"

  return (
    <button
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label="Alternar tema"
      className={`relative w-9 h-9 rounded-full flex items-center justify-center border border-outline-variant/40 bg-surface-container-lowest hover:bg-surface-container transition-all duration-200 hover:scale-105 active:scale-95 ${className}`}
    >
      {/* Sun */}
      <span
        className="material-symbols-outlined text-nc-secondary absolute transition-all duration-300"
        style={{
          fontSize: 18,
          fontVariationSettings: "'FILL' 1",
          opacity: dark ? 0 : 1,
          transform: dark ? "scale(0.5) rotate(90deg)" : "scale(1) rotate(0deg)",
        }}
      >
        light_mode
      </span>
      {/* Moon */}
      <span
        className="material-symbols-outlined text-primary absolute transition-all duration-300"
        style={{
          fontSize: 18,
          fontVariationSettings: "'FILL' 1",
          opacity: dark ? 1 : 0,
          transform: dark ? "scale(1) rotate(0deg)" : "scale(0.5) rotate(-90deg)",
        }}
      >
        dark_mode
      </span>
    </button>
  )
}
