"use client"

import Link from "next/link"
import { useState } from "react"

const navLinks = [
  { href: "#funcionalidades", label: "Funcionalidades" },
  { href: "#planos", label: "Planos" },
  { href: "/blog", label: "Blog" },
  { href: "/sobre", label: "Sobre" },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/10 shadow-[0_4px_20px_rgba(0,36,74,0.06)]">
      <div className="flex justify-between items-center px-6 lg:px-8 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm surgical-gradient">
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
              className="text-on-surface-variant hover:text-primary font-medium text-sm tracking-tight transition-colors duration-200 font-sans"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex gap-3 items-center">
          <Link
            href="/login"
            className="text-on-surface-variant hover:text-primary font-semibold text-sm px-4 py-2 rounded-lg transition-colors font-sans"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="surgical-gradient text-white px-5 py-2.5 rounded-lg font-headline font-bold text-sm shadow-premium-sm hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Começar Grátis
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-on-surface-variant hover:text-primary transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span className="material-symbols-outlined text-2xl">
            {open ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-surface border-t border-outline-variant/10 px-6 py-5 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block text-on-surface-variant font-medium text-sm font-sans hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-outline-variant/10">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="w-full py-3 text-center border border-outline-variant/30 rounded-lg text-primary font-bold text-sm font-headline hover:bg-surface-container-low transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              onClick={() => setOpen(false)}
              className="w-full py-3 text-center surgical-gradient text-white rounded-lg font-bold text-sm font-headline shadow-premium-sm"
            >
              Começar Grátis
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
