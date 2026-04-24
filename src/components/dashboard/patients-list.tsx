"use client"

import { useState } from "react"
import Link from "next/link"

interface Patient {
  id: string
  full_name: string
  email: string | null
  phone: string | null
  date_of_birth: string | null
}

export function PatientsList({ patients }: { patients: Patient[] }) {
  const [query, setQuery] = useState("")

  const filtered = patients.filter((p) => {
    const q = query.toLowerCase()
    return (
      p.full_name.toLowerCase().includes(q) ||
      (p.email ?? "").toLowerCase().includes(q) ||
      (p.phone ?? "").includes(q)
    )
  })

  return (
    <div className="space-y-4">
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-xl">search</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome, email ou telefone..."
          className="w-full pl-10 pr-4 py-3 text-sm bg-surface-container-lowest border border-outline-variant/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/50"
        />
      </div>

      {filtered.length > 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden shadow-premium-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant/10 bg-surface-container-low">
                <th className="text-left px-5 py-3 font-semibold text-on-surface-variant text-xs uppercase tracking-wide font-headline">Paciente</th>
                <th className="text-left px-5 py-3 font-semibold text-on-surface-variant text-xs uppercase tracking-wide font-headline hidden md:table-cell">Telefone</th>
                <th className="text-left px-5 py-3 font-semibold text-on-surface-variant text-xs uppercase tracking-wide font-headline hidden lg:table-cell">Nascimento</th>
                <th className="text-right px-5 py-3 font-semibold text-on-surface-variant text-xs uppercase tracking-wide font-headline">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-outline-variant/10 last:border-b-0 hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-nc-secondary/15 flex items-center justify-center text-nc-secondary font-bold text-sm shrink-0 font-headline">
                        {p.full_name[0]?.toUpperCase() ?? "?"}
                      </div>
                      <div>
                        <p className="font-semibold text-primary text-sm font-headline">{p.full_name}</p>
                        <p className="text-xs text-on-surface-variant">{p.email ?? "Sem email"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-on-surface-variant text-sm hidden md:table-cell">{p.phone ?? "—"}</td>
                  <td className="px-5 py-4 text-on-surface-variant text-sm hidden lg:table-cell">
                    {p.date_of_birth ? new Date(p.date_of_birth).toLocaleDateString("pt-BR") : "—"}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <Link
                        href={`/agenda?paciente=${p.id}`}
                        className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors text-on-surface-variant"
                        title="Agendar consulta"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>calendar_month</span>
                      </Link>
                      <Link
                        href={`/pacientes/${p.id}`}
                        className="p-2 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-600 dark:hover:text-violet-400 rounded-lg transition-colors text-on-surface-variant"
                        title="Abrir prontuário"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>description</span>
                      </Link>
                      <button
                        className="p-2 hover:bg-surface-container-high rounded-lg transition-colors text-on-surface-variant"
                        title="Editar dados"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
                      </button>
                      {p.phone && (
                        <a
                          href={`https://wa.me/55${p.phone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-colors text-on-surface-variant"
                          title="Abrir WhatsApp"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chat</span>
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : patients.length > 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 py-8 text-center text-sm text-on-surface-variant">
          Nenhum paciente encontrado para &quot;{query}&quot;
        </div>
      ) : null}
    </div>
  )
}
