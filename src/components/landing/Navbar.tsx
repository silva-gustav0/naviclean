"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

const navLinks = [
  { href: "#modulos",   label: "Plataforma" },
  { href: "#produto",   label: "Produto"    },
  { href: "#para-quem", label: "Para quem"  },
  { href: "#planos",    label: "Planos"     },
  { href: "#faq",       label: "Dúvidas"    },
]

function ThemeButton() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="theme-btn-skeleton" />

  const isDark = resolvedTheme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
      className="theme-toggle-btn"
      data-dark={isDark}
    >
      {/* Track */}
      <span className="theme-track">
        {/* Thumb */}
        <span className="theme-thumb">
          {/* Sun */}
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
          {/* Moon */}
          <svg className="theme-icon theme-icon-moon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </span>
      </span>

      <style>{`
        .theme-btn-skeleton {
          width: 52px; height: 28px;
          border-radius: 999px;
          background: var(--nc-outline-variant);
          opacity: 0.4;
          flex-shrink: 0;
        }
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

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 w-full z-50"
      style={{
        height: 68,
        display: "flex",
        alignItems: "center",
        background: scrolled
          ? "color-mix(in oklab, var(--background) 95%, transparent)"
          : "color-mix(in oklab, var(--background) 82%, transparent)",
        backdropFilter: "saturate(120%) blur(14px)",
        WebkitBackdropFilter: "saturate(120%) blur(14px)",
        borderBottom: scrolled ? "1px solid var(--nc-outline-variant)" : "1px solid transparent",
        transition: "background .3s, border-color .3s",
      }}
    >
      <div className="flex items-center justify-between w-full max-w-[1280px] mx-auto px-8 gap-6">

        {/* Left: logo + nav links */}
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2.5" style={{ textDecoration: "none" }}>
            <span style={{
              width: 34, height: 34, borderRadius: 9,
              background: "var(--nc-primary-container)",
              display: "grid", placeItems: "center", flexShrink: 0,
            }}>
              <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                <rect x="4"  y="3"  width="3"  height="14" fill="#fff"/>
                <rect x="17" y="3"  width="3"  height="14" fill="#fff"/>
                <polygon points="7,3 10,3 17,17 14,17" fill="#C9943A"/>
                <rect x="4" y="18.5" width="16" height="1.8" rx="0.9" fill="#C9943A"/>
              </svg>
            </span>
            <span style={{
              fontFamily: "var(--font-headline)",
              fontSize: 22, fontWeight: 500,
              color: "var(--nc-on-surface)",
              letterSpacing: "-0.02em",
            }}>
              Navi<span style={{ color: "var(--nc-secondary)" }}>Clin</span>
            </span>
          </Link>

          <div className="hidden lg:flex gap-7">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="nav-link">
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Right: theme toggle + CTAs */}
        <div className="hidden lg:flex items-center gap-3">
          <ThemeButton />

          <Link
            href="/login"
            className="nav-cta-ghost"
            style={{ textDecoration: "none" }}
          >
            Entrar
          </Link>

          <button
            className="nav-cta-gold"
            onClick={() => document.getElementById("demoModal")?.classList.add("open")}
          >
            Agendar demonstração
          </button>
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="lg:hidden flex items-center gap-2">
          <ThemeButton />
          <button
            className="mobile-menu-btn"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open
                ? <path d="M18 6L6 18M6 6l12 12"/>
                : <><path d="M3 12h18"/><path d="M3 6h18"/><path d="M3 18h18"/></>
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="mobile-menu">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="mobile-nav-link"
            >
              {link.label}
            </a>
          ))}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 12, borderTop: "1px solid var(--nc-outline-variant)" }}>
            <Link href="/login" onClick={() => setOpen(false)} className="mobile-cta-ghost" style={{ textDecoration: "none" }}>
              Entrar
            </Link>
            <button
              onClick={() => { setOpen(false); document.getElementById("demoModal")?.classList.add("open") }}
              className="mobile-cta-gold"
            >
              Agendar demonstração
            </button>
          </div>
        </div>
      )}

      <style>{`
        /* Nav links */
        .nav-link {
          font-size: 14px; font-weight: 500;
          color: var(--nc-on-surface-variant);
          position: relative; padding: 6px 0;
          text-decoration: none;
          transition: color .2s;
        }
        .nav-link::after {
          content: "";
          position: absolute; left: 0; right: 0; bottom: 0;
          height: 1px; background: var(--nc-secondary);
          transform: scaleX(0); transform-origin: left;
          transition: transform .3s;
        }
        .nav-link:hover { color: var(--nc-on-surface); }
        .nav-link:hover::after { transform: scaleX(1); }

        /* Ghost CTA */
        .nav-cta-ghost {
          display: inline-flex; align-items: center;
          padding: 10px 18px; border-radius: 999px;
          font-weight: 500; font-size: 14px;
          border: 1px solid var(--nc-outline-variant);
          color: var(--nc-on-surface);
          background: transparent;
          transition: border-color .2s;
        }
        .nav-cta-ghost:hover { border-color: var(--nc-on-surface); }

        /* Gold CTA */
        .nav-cta-gold {
          display: inline-flex; align-items: center;
          padding: 10px 18px; border-radius: 999px;
          font-weight: 500; font-size: 14px;
          background: var(--nc-secondary);
          color: var(--nc-on-secondary);
          border: none; cursor: pointer;
          box-shadow: 0 8px 32px rgba(201,148,58,0.22);
          transition: transform .15s, box-shadow .2s;
        }
        .nav-cta-gold:hover { transform: translateY(-1px); box-shadow: 0 12px 40px rgba(201,148,58,0.32); }

        /* Mobile */
        .mobile-menu-btn {
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid var(--nc-outline-variant);
          background: transparent;
          color: var(--nc-on-surface-variant);
          cursor: pointer;
        }
        .mobile-menu {
          position: absolute; top: 68px; left: 0; right: 0;
          background: var(--background);
          border-top: 1px solid var(--nc-outline-variant);
          padding: 20px 24px;
          display: flex; flex-direction: column; gap: 10px;
        }
        .mobile-nav-link {
          font-size: 14px; font-weight: 500;
          color: var(--nc-on-surface-variant);
          padding: 4px 0; text-decoration: none;
          transition: color .2s;
        }
        .mobile-nav-link:hover { color: var(--nc-on-surface); }
        .mobile-cta-ghost {
          width: 100%; padding: 12px;
          border-radius: 999px; text-align: center;
          font-size: 14px; font-weight: 500;
          border: 1px solid var(--nc-outline-variant);
          color: var(--nc-on-surface);
          background: transparent;
        }
        .mobile-cta-gold {
          width: 100%; padding: 12px;
          border-radius: 999px; text-align: center;
          font-size: 14px; font-weight: 500; font-family: inherit;
          background: var(--nc-secondary); color: var(--nc-on-secondary);
          border: none; cursor: pointer;
        }
      `}</style>
    </nav>
  )
}
