"use client"

import Link from "next/link"
import { useState } from "react"
import { ThemeToggle } from "@/components/ui/ThemeToggle"

const navLinks = [
  { href: "#funcionalidades", label: "Funcionalidades" },
  { href: "#planos",          label: "Planos"          },
  { href: "/blog",            label: "Blog"            },
  { href: "/sobre",           label: "Sobre"           },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 glass-header border-b border-outline-variant/10 shadow-[0_4px_20px_rgba(0,36,74,0.06)]">
      <div className="flex justify-between items-center px-6 lg:px-8 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm surgical-gradient shadow-glow-navy">
            N
          </div>
          <span className="text-xl font-extrabold tracking-tight text-primary font-headline">NaviClin</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-on-surface-variant hover:text-primary font-medium text-sm tracking-tight transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex gap-2 items-center">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-on-surface-variant hover:text-primary font-semibold text-sm px-4 py-2 rounded-full transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="btn-pill-arrow group flex items-center gap-2 surgical-gradient text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-glow-navy hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 font-headline"
          >
            Começar Grátis
            <span className="arrow-circle w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-white" style={{ fontSize: 12 }}>arrow_forward</span>
            </span>
          </Link>
        </div>

        {/* Mobile: toggle + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center border border-outline-variant/40 bg-surface-container-lowest text-on-surface-variant hover:text-primary transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <span className="material-symbols-outlined text-xl">
              {open ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-surface border-t border-outline-variant/10 px-6 py-5 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block text-on-surface-variant font-medium text-sm hover:text-primary transition-colors py-1"
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-3 border-t border-outline-variant/10">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="w-full py-3 text-center border border-outline-variant/30 rounded-2xl text-primary font-bold text-sm font-headline hover:bg-surface-container-low transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              onClick={() => setOpen(false)}
              className="w-full py-3 text-center surgical-gradient text-white rounded-2xl font-bold text-sm font-headline shadow-glow-navy"
            >
              Começar Grátis
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
