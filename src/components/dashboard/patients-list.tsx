"use client"

import { useState } from "react"
import { Search, Calendar, FileText, Phone } from "lucide-react"

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
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome, email ou telefone..."
          className="w-full pl-10 pr-4 py-3 text-sm bg-white dark:bg-slate-900 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {filtered.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50 dark:bg-slate-800/50">
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Paciente</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground hidden md:table-cell">Telefone</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground hidden lg:table-cell">Nascimento</th>
                <th className="text-right px-5 py-3 font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-semibold text-sm shrink-0">
                        {p.full_name[0]?.toUpperCase() ?? "?"}
                      </div>
                      <div>
                        <p className="font-medium">{p.full_name}</p>
                        <p className="text-xs text-muted-foreground">{p.email ?? "Sem email"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground hidden md:table-cell">{p.phone ?? "—"}</td>
                  <td className="px-5 py-4 text-muted-foreground hidden lg:table-cell">
                    {p.date_of_birth ? new Date(p.date_of_birth).toLocaleDateString("pt-BR") : "—"}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <a href={`/agenda?paciente=${p.id}`} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 rounded-lg transition-colors" title="Agendar">
                        <Calendar className="h-4 w-4" />
                      </a>
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Prontuário">
                        <FileText className="h-4 w-4" />
                      </button>
                      {p.phone && (
                        <a href={`tel:${p.phone.replace(/\D/g, "")}`} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Ligar">
                          <Phone className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {query && filtered.length === 0 && (
            <div className="py-8 text-center text-muted-foreground text-sm">
              Nenhum paciente encontrado para &quot;{query}&quot;
            </div>
          )}
        </div>
      ) : patients.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border py-8 text-center text-sm text-muted-foreground">
          Nenhum paciente encontrado para &quot;{query}&quot;
        </div>
      ) : null}
    </div>
  )
}
