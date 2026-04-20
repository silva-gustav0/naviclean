"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  /* skeleton enquanto hidrata */
  if (!mounted) {
    return (
      <div
        className={`h-9 w-[72px] rounded-full bg-surface-container-lowest border border-outline-variant/40 ${className}`}
      />
    )
  }

  const dark = resolvedTheme === "dark"

  return (
    <div
      className={`inline-flex items-center gap-0.5 bg-surface-container-lowest border border-outline-variant/40 rounded-full p-1 shadow-premium-sm ${className}`}
      role="group"
      aria-label="Selecionar tema"
    >
      {/* Modo claro */}
      <button
        onClick={() => setTheme("light")}
        aria-label="Modo claro"
        title="Modo claro"
        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
          !dark
            ? "bg-nc-secondary/20 text-nc-secondary scale-105"
            : "text-on-surface-variant/50 hover:text-on-surface-variant hover:bg-surface-container"
        }`}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 15, fontVariationSettings: !dark ? "'FILL' 1" : "'FILL' 0" }}
        >
          light_mode
        </span>
      </button>

      {/* Modo escuro */}
      <button
        onClick={() => setTheme("dark")}
        aria-label="Modo escuro"
        title="Modo escuro"
        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
          dark
            ? "bg-primary/15 text-primary scale-105"
            : "text-on-surface-variant/50 hover:text-on-surface-variant hover:bg-surface-container"
        }`}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 15, fontVariationSettings: dark ? "'FILL' 1" : "'FILL' 0" }}
        >
          dark_mode
        </span>
      </button>
    </div>
  )
}
