"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinks = [
  { href: "#funcionalidades", label: "Funcionalidades" },
  { href: "#planos", label: "Planos" },
  { href: "/blog", label: "Blog" },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,74,198,0.05)] border-b border-slate-100/50">
      <div className="flex justify-between items-center px-6 lg:px-8 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm"
            style={{ background: "linear-gradient(135deg, #004ac6 0%, #2563eb 100%)" }}
          >
            N
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900">NaviClin</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-slate-600 hover:text-blue-600 font-medium text-sm tracking-tight transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex gap-3 items-center">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-slate-600 font-semibold">
              Entrar
            </Button>
          </Link>
          <Link href="/cadastro">
            <Button
              size="sm"
              className="rounded-full px-5 font-semibold shadow-lg shadow-blue-500/20"
              style={{ background: "linear-gradient(135deg, #004ac6 0%, #2563eb 100%)" }}
            >
              Começar Grátis
            </Button>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-slate-700"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block text-slate-700 font-medium text-sm"
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-2">
            <Link href="/login" onClick={() => setOpen(false)}>
              <Button variant="outline" className="w-full">Entrar</Button>
            </Link>
            <Link href="/cadastro" onClick={() => setOpen(false)}>
              <Button className="w-full rounded-full" style={{ background: "linear-gradient(135deg, #004ac6 0%, #2563eb 100%)" }}>
                Começar Grátis
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
