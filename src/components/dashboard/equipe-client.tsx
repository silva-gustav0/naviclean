"use client"

import { useState } from "react"
import Link from "next/link"
import { InviteMemberModal } from "@/components/dashboard/modals/invite-member-modal"

const ROLE_LABELS_LOCAL: Record<string, string> = {
  clinic_owner: "Proprietário",
  dentist: "Dentista",
  doctor: "Médico",
  receptionist: "Recepcionista",
  independent_professional: "Prof. Independente",
}

type TabKey = "todos" | "dentistas" | "recepcao" | "auxiliares"

const TABS = [
  { key: "todos" as TabKey, label: "Todos" },
  { key: "dentistas" as TabKey, label: "Dentistas" },
  { key: "recepcao" as TabKey, label: "Recepção" },
  { key: "auxiliares" as TabKey, label: "Auxiliares" },
]

export type EquipeMember = {
  id: string
  role: string
  specialty: string | null
  is_active: boolean
  full_name: string | null
  email: string | null
  consultations: number
}

// Gradientes variados para os cards
const CARD_GRADIENTS = [
  "from-[#00244a] via-[#0d3a6b] to-[#1a4e88]",
  "from-[#00244a] via-[#0a3260] to-[#153b75]",
  "from-[#001e40] via-[#0d3560] to-[#1e5080]",
  "from-[#00244a] via-[#123470] to-[#0f4a82]",
]

export function EquipeClient({ members }: { members: EquipeMember[] }) {
  const [activeTab, setActiveTab] = useState<TabKey>("todos")

  const filtered = members.filter((m) => {
    if (activeTab === "todos") return true
    if (activeTab === "dentistas") return ["dentist", "doctor", "clinic_owner"].includes(m.role)
    if (activeTab === "recepcao") return m.role === "receptionist"
    if (activeTab === "auxiliares") return m.role === "independent_professional"
    return true
  })

  return (
    <div className="space-y-5">
      {/* Tabs + ações */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1 bg-surface-container-low rounded-xl p-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-headline font-semibold transition-all ${
                activeTab === tab.key
                  ? "bg-primary text-white shadow-sm"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/equipe/permissoes"
            className="text-primary border border-outline-variant text-sm font-semibold px-4 py-2 rounded-xl hover:bg-surface-container transition-colors font-headline"
          >
            Permissões
          </Link>
          <InviteMemberModal />
        </div>
      </div>

      {/* Grid de cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((m, idx) => {
          const name = m.full_name ?? "Sem nome"
          const email = m.email ?? "—"
          const initials = name
            .split(" ")
            .slice(0, 2)
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
          const gradient = CARD_GRADIENTS[idx % CARD_GRADIENTS.length]

          return (
            <div
              key={m.id}
              className={`bg-white rounded-2xl overflow-hidden border border-[#c3c6d0]/20 shadow-sm ${
                !m.is_active ? "opacity-60" : ""
              }`}
            >
              {/* Header com gradiente */}
              <div className={`relative bg-gradient-to-br ${gradient} h-20`}>
                <button className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                  <span className="material-symbols-outlined text-white/50" style={{ fontSize: 18 }}>
                    more_horiz
                  </span>
                </button>
              </div>

              {/* Conteúdo */}
              <div className="px-5 pb-5 -mt-6 relative">
                {/* Avatar sobrepondo o header */}
                <div className="w-12 h-12 rounded-full bg-nc-secondary flex items-center justify-center text-white font-bold text-base font-headline border-2 border-white mb-3 shadow-sm">
                  {initials}
                </div>

                {/* Info */}
                <div className="mb-3">
                  <p className="font-headline font-bold text-primary text-sm">{name}</p>
                  <p className="text-xs text-on-surface-variant font-sans">
                    {ROLE_LABELS_LOCAL[m.role] ?? m.role}
                    {m.specialty ? ` · ${m.specialty}` : ""}
                  </p>
                  <p className="text-xs text-outline mt-0.5 font-sans truncate">{email}</p>
                </div>

                {/* Ações rápidas */}
                <div className="flex gap-1.5 mb-4">
                  <Link
                    href="/agenda"
                    className="text-[10px] font-semibold px-2.5 py-1 rounded-full border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-colors font-headline"
                  >
                    Agenda
                  </Link>
                  <Link
                    href="/pacientes"
                    className="text-[10px] font-semibold px-2.5 py-1 rounded-full border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-colors font-headline"
                  >
                    Pacientes
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#c3c6d0]/20">
                  <div className="text-center">
                    <p className="text-[9px] text-on-surface-variant uppercase tracking-wide font-sans">Consultas</p>
                    <p className="font-headline font-bold text-primary text-sm">
                      {m.consultations > 0 ? m.consultations : "—"}
                    </p>
                  </div>
                  <div className="text-center border-x border-[#c3c6d0]/20">
                    <p className="text-[9px] text-on-surface-variant uppercase tracking-wide font-sans">Comissão</p>
                    <p className="font-headline font-bold text-primary text-sm">—</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] text-on-surface-variant uppercase tracking-wide font-sans">Avaliação</p>
                    <p className="font-headline font-bold text-primary text-sm">—</p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Card "Convidar membro" */}
        <div className="bg-card rounded-2xl border-2 border-dashed border-outline-variant/40 flex flex-col items-center justify-center p-8 min-h-[260px] hover:border-nc-secondary/40 transition-colors group cursor-pointer">
          <div className="w-10 h-10 rounded-full border-2 border-dashed border-[#c3c6d0]/50 flex items-center justify-center mb-3 group-hover:border-nc-secondary/50 transition-colors">
            <span
              className="material-symbols-outlined text-outline group-hover:text-nc-secondary transition-colors"
              style={{ fontSize: 20 }}
            >
              add
            </span>
          </div>
          <p className="font-headline font-semibold text-on-surface-variant text-sm group-hover:text-primary transition-colors">
            Convidar membro
          </p>
          <p className="text-xs text-outline mt-1 text-center font-sans">
            Envie um link de cadastro por email
          </p>
        </div>
      </div>
    </div>
  )
}
