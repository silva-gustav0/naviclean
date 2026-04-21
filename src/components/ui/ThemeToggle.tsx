"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div
        className={className}
        style={{ width: 52, height: 28, borderRadius: 999, background: "var(--nc-outline-variant)", opacity: 0.4, flexShrink: 0 }}
      />
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
      data-dark={isDark}
      className={`theme-toggle-btn ${className}`}
    >
      <span className="theme-track">
        <span className="theme-thumb">
          <svg className="theme-icon theme-icon-sun" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="2"  x2="12" y2="5"/>
            <line x1="12" y1="19" x2="12" y2="22"/>
            <line x1="4.22" y1="4.22"   x2="6.34" y2="6.34"/>
            <line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
            <line x1="2"  y1="12" x2="5"  y2="12"/>
            <line x1="19" y1="12" x2="22" y2="12"/>
            <line x1="4.22" y1="19.78"  x2="6.34" y2="17.66"/>
            <line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/>
          </svg>
          <svg className="theme-icon theme-icon-moon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </span>
      </span>

      <style>{`
        .theme-toggle-btn {
          position: relative;
          display: flex;
          align-items: center;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          flex-shrink: 0;
        }
        .theme-track {
          display: flex;
          align-items: center;
          width: 52px;
          height: 28px;
          border-radius: 999px;
          padding: 3px;
          transition: background 0.35s ease, box-shadow 0.35s ease;
          background: var(--nc-primary-container);
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);
          position: relative;
        }
        .theme-toggle-btn[data-dark="true"] .theme-track {
          background: linear-gradient(135deg, #1a2c4e 0%, #0f1c35 100%);
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(166,200,255,0.15);
        }
        .theme-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          position: relative;
          display: grid;
          place-items: center;
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
                      background 0.35s ease,
                      box-shadow 0.35s ease;
          transform: translateX(0);
          background: #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.25);
        }
        .theme-toggle-btn[data-dark="true"] .theme-thumb {
          transform: translateX(24px);
          background: linear-gradient(135deg, #a6c8ff 0%, #7aabff 100%);
          box-shadow: 0 1px 4px rgba(0,0,0,0.3), 0 0 8px rgba(166,200,255,0.4);
        }
        .theme-icon {
          position: absolute;
          transition: opacity 0.25s ease, transform 0.35s ease;
        }
        .theme-icon-sun {
          color: #C9943A;
          opacity: 1;
          transform: rotate(0deg) scale(1);
        }
        .theme-icon-moon {
          color: #1a2c4e;
          opacity: 0;
          transform: rotate(30deg) scale(0.6);
        }
        .theme-toggle-btn[data-dark="true"] .theme-icon-sun {
          opacity: 0;
          transform: rotate(-30deg) scale(0.6);
        }
        .theme-toggle-btn[data-dark="true"] .theme-icon-moon {
          opacity: 1;
          transform: rotate(0deg) scale(1);
          color: #1a2c4e;
        }
        .theme-toggle-btn:hover .theme-track {
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.2), 0 0 0 3px rgba(201,148,58,0.2);
        }
        .theme-toggle-btn[data-dark="true"]:hover .theme-track {
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.4), 0 0 0 3px rgba(166,200,255,0.2), 0 0 0 1px rgba(166,200,255,0.15);
        }
      `}</style>
    </button>
  )
}
