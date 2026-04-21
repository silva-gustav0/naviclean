"use client"

import Link from "next/link"
import { useState } from "react"

const navLinks = [
  { href: "#modulos",       label: "Plataforma"   },
  { href: "#produto",       label: "Produto"       },
  { href: "#para-quem",     label: "Para quem"     },
  { href: "#planos",        label: "Planos"        },
  { href: "#faq",           label: "Dúvidas"       },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => setScrolled(window.scrollY > 8), { passive: true })
  }

  return (
    <nav
      className="fixed top-0 w-full z-50 transition-all duration-300"
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
      }}
    >
      <div className="flex items-center justify-between w-full max-w-[1280px] mx-auto px-8 gap-6">
        {/* Left: logo + nav */}
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2.5">
            <span
              className="w-[34px] h-[34px] rounded-[9px] flex items-center justify-center"
              style={{ background: "var(--nc-primary-container)" }}
            >
              <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                <rect x="4" y="3" width="3" height="14" fill="#fff"/>
                <rect x="17" y="3" width="3" height="14" fill="#fff"/>
                <polygon points="7,3 10,3 17,17 14,17" fill="#C9943A"/>
                <rect x="4" y="18.5" width="16" height="1.8" rx="0.9" fill="#C9943A"/>
              </svg>
            </span>
            <span className="font-headline text-[22px] font-medium tracking-tight" style={{ color: "var(--nc-on-surface)", letterSpacing: "-0.02em" }}>
              Navi<span style={{ color: "var(--nc-secondary)" }}>Clin</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link text-sm font-medium relative py-1.5"
                style={{ color: "var(--nc-on-surface-variant)" }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Right: CTAs */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/login"
            className="btn-ghost"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 18px",
              borderRadius: 999,
              fontWeight: 500,
              fontSize: 14,
              border: "1px solid var(--nc-outline-variant)",
              color: "var(--nc-on-surface)",
              transition: "border-color .2s, background .2s",
            }}
          >
            Entrar
          </Link>
          <button
            className="btn-gold"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 18px",
              borderRadius: 999,
              fontWeight: 500,
              fontSize: 14,
              background: "var(--nc-secondary)",
              color: "var(--nc-on-secondary)",
              boxShadow: "0 8px 32px rgba(201,148,58,0.22)",
              transition: "transform .15s, background .2s",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => {
              document.getElementById("demoModal")?.classList.add("open")
            }}
          >
            Agendar demonstração
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center border"
          style={{ borderColor: "var(--nc-outline-variant)", color: "var(--nc-on-surface-variant)" }}
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

      {/* Mobile menu */}
      {open && (
        <div
          className="lg:hidden absolute top-[68px] left-0 right-0 border-t px-6 py-5 space-y-3"
          style={{ background: "var(--background)", borderColor: "var(--nc-outline-variant)" }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block text-sm font-medium py-1"
              style={{ color: "var(--nc-on-surface-variant)" }}
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-3 border-t" style={{ borderColor: "var(--nc-outline-variant)" }}>
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="w-full py-3 text-center rounded-full text-sm font-medium border"
              style={{ borderColor: "var(--nc-outline-variant)", color: "var(--nc-on-surface)" }}
            >
              Entrar
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="w-full py-3 text-center rounded-full text-sm font-semibold"
              style={{ background: "var(--nc-secondary)", color: "var(--nc-on-secondary)" }}
            >
              Agendar demonstração
            </button>
          </div>
        </div>
      )}

      <style>{`
        .nav-link::after {
          content: "";
          position: absolute;
          left: 0; right: 0; bottom: 0;
          height: 1px;
          background: var(--nc-secondary);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform .3s;
        }
        .nav-link:hover { color: var(--nc-on-surface) !important; }
        .nav-link:hover::after { transform: scaleX(1); }
        .btn-ghost:hover { border-color: var(--nc-on-surface) !important; }
        .btn-gold:hover { transform: translateY(-1px); }
      `}</style>
    </nav>
  )
}
