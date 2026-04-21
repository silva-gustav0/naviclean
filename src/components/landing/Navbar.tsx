"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ThemeToggle } from "@/components/ui/ThemeToggle"

const navLinks = [
  { href: "#modulos",   label: "Plataforma" },
  { href: "#produto",   label: "Produto"    },
  { href: "#para-quem", label: "Para quem"  },
  { href: "#planos",    label: "Planos"     },
  { href: "#faq",       label: "Dúvidas"    },
]

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
          <ThemeToggle />

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
          <ThemeToggle />
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
