"use client"

import { useTheme } from "next-themes"
import { useEffect, useRef, useState } from "react"

export function ThemeFloater() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const floaterRef = useRef<HTMLButtonElement>(null)
  const isDark = resolvedTheme === "dark"

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const el = floaterRef.current
    if (!el) return

    const saved = (() => {
      try { return JSON.parse(localStorage.getItem("nv_floater_pos") || "null") } catch { return null }
    })()

    const setPos = (x: number, y: number) => {
      const pad = 12
      const w = el.offsetWidth, h = el.offsetHeight
      const maxX = window.innerWidth - w - pad
      const maxY = window.innerHeight - h - pad
      x = Math.max(pad, Math.min(x, maxX))
      y = Math.max(pad, Math.min(y, maxY))
      el.style.left = x + "px"
      el.style.top = y + "px"
      el.style.right = "auto"
      el.style.bottom = "auto"
    }

    if (saved?.x) setPos(saved.x, saved.y)

    let dragging = false, moved = false, startX = 0, startY = 0, origX = 0, origY = 0

    const onDown = (e: MouseEvent | TouchEvent) => {
      const pt = "touches" in e ? e.touches[0] : e
      dragging = true; moved = false
      startX = pt.clientX; startY = pt.clientY
      const r = el.getBoundingClientRect()
      origX = r.left; origY = r.top
      el.style.transition = "none"
      e.preventDefault()
    }

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging) return
      const pt = "touches" in e ? (e as TouchEvent).touches[0] : (e as MouseEvent)
      const dx = pt.clientX - startX, dy = pt.clientY - startY
      if (Math.abs(dx) + Math.abs(dy) > 4) moved = true
      setPos(origX + dx, origY + dy)
    }

    const onUp = () => {
      if (!dragging) return
      dragging = false
      el.style.transition = ""
      if (moved) {
        const r = el.getBoundingClientRect()
        try { localStorage.setItem("nv_floater_pos", JSON.stringify({ x: r.left, y: r.top })) } catch { /* */ }
      } else {
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
      }
    }

    el.addEventListener("mousedown", onDown as EventListener)
    window.addEventListener("mousemove", onMove as EventListener)
    window.addEventListener("mouseup", onUp)
    el.addEventListener("touchstart", onDown as EventListener, { passive: false })
    window.addEventListener("touchmove", onMove as EventListener, { passive: false })
    window.addEventListener("touchend", onUp)

    return () => {
      el.removeEventListener("mousedown", onDown as EventListener)
      window.removeEventListener("mousemove", onMove as EventListener)
      window.removeEventListener("mouseup", onUp)
      el.removeEventListener("touchstart", onDown as EventListener)
      window.removeEventListener("touchmove", onMove as EventListener)
      window.removeEventListener("touchend", onUp)
    }
  }, [resolvedTheme, setTheme])

  if (!mounted) return null

  return (
    <>
      <button
        ref={floaterRef}
        aria-label={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
        data-label={isDark ? "Modo claro" : "Modo escuro"}
        className="theme-floater-btn"
        style={{
          position: "fixed",
          right: 24,
          bottom: 88,
          zIndex: 90,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: isDark ? "var(--nc-secondary)" : "var(--nc-primary-container)",
          color: isDark ? "var(--nc-on-secondary)" : "#fff",
          display: "grid",
          placeItems: "center",
          boxShadow: "0 24px 60px rgba(15,26,68,.14), 0 6px 18px rgba(15,26,68,.08)",
          border: "1px solid rgba(255,255,255,0.08)",
          cursor: "grab",
          touchAction: "none",
          userSelect: "none",
          transition: "background .3s ease, transform .2s ease",
        }}
      >
        {/* Sun icon */}
        <svg
          width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          style={{
            position: "absolute",
            opacity: isDark ? 1 : 0,
            transform: isDark ? "rotate(0) scale(1)" : "rotate(-90deg) scale(0.6)",
            transition: "opacity .3s, transform .5s",
          }}
        >
          <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        {/* Moon icon */}
        <svg
          width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          style={{
            position: "absolute",
            opacity: isDark ? 0 : 1,
            transform: isDark ? "rotate(90deg) scale(0.6)" : "rotate(0) scale(1)",
            transition: "opacity .3s, transform .5s",
          }}
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>

      <style>{`
        .theme-floater-btn:hover { transform: scale(1.05); }
        .theme-floater-btn::after {
          content: attr(data-label);
          position: absolute;
          right: calc(100% + 12px);
          top: 50%;
          transform: translateY(-50%) translateX(6px);
          background: var(--nc-on-surface);
          color: var(--background);
          padding: 6px 10px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity .2s, transform .2s;
        }
        .theme-floater-btn:hover::after { opacity: 1; transform: translateY(-50%) translateX(0); }
      `}</style>
    </>
  )
}
