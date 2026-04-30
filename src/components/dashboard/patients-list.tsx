"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export type PatientListItem = {
  id: string
  full_name: string
  email: string | null
  phone: string | null
  date_of_birth: string | null
  appointmentCount: number
  lastVisitDate: string | null
  status: "novo" | "em_dia" | "retorno" | "em_debito"
  daysSinceVisit: number | null
}

const STATUS_CONFIG = {
  novo: { label: "Novo", className: "bg-blue-50 text-blue-700 border-blue-100" },
  em_dia: { label: "Em dia", className: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  retorno: { label: "Retorno", className: "bg-surface-container-low text-on-surface-variant border-outline-variant/30" },
  em_debito: { label: "Plano pendente", className: "bg-nc-secondary/10 text-nc-secondary border-nc-secondary/20" },
} as const

const STATUS_FILTER_TABS = [
  { key: "todos", label: "Todos" },
  { key: "em_dia", label: "Ativos" },
  { key: "em_debito", label: "Em débito" },
  { key: "retorno", label: "Aniversariantes" }, // placeholder
] as const

type FilterKey = (typeof STATUS_FILTER_TABS)[number]["key"]

export function PatientsList({ patients }: { patients: PatientListItem[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedId = searchParams.get("id")
  const [query, setQuery] = useState("")
  const [filterTab, setFilterTab] = useState<FilterKey>("todos")

  const filtered = patients.filter((p) => {
    const q = query.toLowerCase()
    const matchesQuery =
      p.full_name.toLowerCase().includes(q) ||
      (p.email ?? "").toLowerCase().includes(q) ||
      (p.phone ?? "").includes(q)

    const matchesFilter =
      filterTab === "todos" ||
      (filterTab === "em_dia" && p.status === "em_dia") ||
      (filterTab === "em_debito" && p.status === "em_debito") ||
      filterTab === "retorno"

    return matchesQuery && matchesFilter
  })

  function selectPatient(id: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("id", id)
    router.push(`/pacientes?${params.toString()}`, { scroll: false })
  }

  function getInitials(name: string) {
    return name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const AVATAR_COLORS = [
    "bg-primary",
    "bg-nc-secondary",
    "bg-emerald-600",
    "bg-blue-600",
    "bg-purple-600",
    "bg-pink-600",
    "bg-teal-600",
  ]

  function getAvatarColor(name: string) {
    const code = name.charCodeAt(0) + (name.charCodeAt(1) || 0)
    return AVATAR_COLORS[code % AVATAR_COLORS.length]
  }

  function getStatusLabel(p: PatientListItem) {
    if (p.status === "retorno" && p.daysSinceVisit !== null) {
      return `Retorno em ${Math.max(0, 90 - p.daysSinceVisit)}d`
    }
    return STATUS_CONFIG[p.status]?.label ?? ""
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="relative mb-3">
        <span
          className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline"
          style={{ fontSize: 18 }}
        >
          search
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome, email ou telefone..."
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-card border border-outline-variant/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/50"
        />
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-0.5 mb-3 overflow-x-auto scrollbar-none">
        {STATUS_FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterTab(tab.key)}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold font-headline transition-all whitespace-nowrap shrink-0 ${
              filterTab === tab.key
                ? "bg-primary text-white"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Patient list */}
      <div className="flex-1 overflow-y-auto space-y-1">
        {filtered.length > 0 ? (
          filtered.map((p) => {
            const isSelected = p.id === selectedId
            const initials = getInitials(p.full_name)
            const avatarColor = getAvatarColor(p.full_name)
            const statusLabel = getStatusLabel(p)

            return (
              <button
                key={p.id}
                onClick={() => selectPatient(p.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${
                  isSelected
                    ? "bg-primary text-white shadow-sm"
                    : "hover:bg-surface-container-low"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 font-headline ${
                    isSelected ? "bg-white/20" : avatarColor
                  }`}
                >
                  {initials}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-semibold text-sm truncate font-headline ${
                      isSelected ? "text-white" : "text-primary"
                    }`}
                  >
                    {p.full_name}
                  </p>
                  <p
                    className={`text-xs truncate font-sans ${
                      isSelected ? "text-white/60" : "text-on-surface-variant"
                    }`}
                  >
                    {p.phone ?? p.email ?? "—"}
                  </p>
                </div>

                {/* Status badge */}
                {statusLabel && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap font-sans ${
                      isSelected
                        ? "bg-white/20 text-white border-white/30"
                        : STATUS_CONFIG[p.status].className
                    }`}
                  >
                    {statusLabel}
                  </span>
                )}
              </button>
            )
          })
        ) : (
          <div className="py-8 text-center">
            <span
              className="material-symbols-outlined text-outline text-3xl"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              search_off
            </span>
            <p className="text-on-surface-variant text-sm mt-2 font-sans">
              {query ? `Nenhum resultado para "${query}"` : "Nenhum paciente"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
