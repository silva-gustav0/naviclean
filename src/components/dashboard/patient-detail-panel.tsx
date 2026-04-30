"use client"

import { useState } from "react"
import Link from "next/link"
import { EvolutionsTab } from "@/components/dashboard/patient/EvolutionsTab"
import { Odontogram } from "@/components/dashboard/patient/Odontogram"
import { AnamnesisForm } from "@/components/dashboard/patient/AnamnesisForm"
import type { Tables } from "@/types/database"

type Appointment = {
  id: string
  date: string
  start_time: string
  status: string
  services: { name: string } | null
  clinic_members: { full_name: string } | null
}

type Evolution = Tables<"clinical_evolutions">
type FaceMark = Tables<"tooth_face_marks">
type ToothSymbol = Tables<"tooth_symbols">
type Anamnesis = Tables<"anamnesis">

const STATUS_COLORS: Record<string, string> = {
  scheduled: "bg-primary/10 text-primary",
  confirmed: "bg-emerald-50 text-emerald-700",
  waiting_room: "bg-nc-secondary/10 text-nc-secondary",
  in_progress: "bg-primary/10 text-primary",
  completed: "bg-surface-container text-on-surface-variant",
  cancelled: "bg-red-50 text-red-600",
  no_show: "bg-red-50 text-red-600",
}

const STATUS_LABELS: Record<string, string> = {
  scheduled: "Agendado",
  confirmed: "Confirmado",
  waiting_room: "Aguardando",
  in_progress: "Em atendimento",
  completed: "Concluído",
  cancelled: "Cancelado",
  no_show: "Faltou",
}

function getAgeCategory(dateOfBirth: string | null): string {
  if (!dateOfBirth) return "—"
  const age = Math.floor((Date.now() - new Date(dateOfBirth).getTime()) / (365.25 * 24 * 3600 * 1000))
  if (age < 18) return "Menor"
  if (age >= 60) return "Idoso"
  return "Adulto"
}

export type PatientDetail = {
  id: string
  full_name: string
  email: string | null
  phone: string | null
  date_of_birth: string | null
  cpf: string | null
  rg: string | null
  health_insurance: string | null
  address_street: string | null
  address_number: string | null
  address_city: string | null
  address_state: string | null
  gender: string | null
  appointmentCount: number
  lastVisitDate: string | null
  recentAppointments: Appointment[]
  clinicId: string
  evolutions: Evolution[]
  faceMarks: FaceMark[]
  symbols: ToothSymbol[]
  anamnesis: Anamnesis | null
}

const TABS = ["Visão geral", "Histórico", "Odontograma", "Documentos", "Financeiro", "Anamnese"]

export function PatientDetailPanel({ patient }: { patient: PatientDetail }) {
  const [activeTab, setActiveTab] = useState(0)

  const initials = patient.full_name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const ageCategory = getAgeCategory(patient.date_of_birth)

  const address = [
    patient.address_street,
    patient.address_number,
    patient.address_city,
    patient.address_state,
  ]
    .filter(Boolean)
    .join(", ")

  const lastVisitFormatted = patient.lastVisitDate
    ? new Date(patient.lastVisitDate + "T00:00:00").toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      })
    : "—"

  const statCards = [
    { label: "Consultas", value: String(patient.appointmentCount), color: "text-primary" },
    { label: "Planos ativos", value: "—", color: "text-primary" },
    { label: "Em aberto", value: "R$ 0", color: "text-red-500" },
    { label: "Última visita", value: lastVisitFormatted, color: "text-primary" },
  ]

  const infoGrid = [
    { label: "CPF", value: patient.cpf },
    { label: "RG", value: patient.rg },
    { label: "Convênio", value: patient.health_insurance },
    { label: "Endereço", value: address || null },
  ].filter((item) => item.value)

  return (
    <div className="flex flex-col h-full bg-card rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-[#00244a] dark:bg-[#0a1628] px-5 py-5 flex items-start gap-4">
        <div className="w-11 h-11 rounded-full bg-nc-secondary flex items-center justify-center text-white font-bold text-sm font-headline shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-headline font-bold text-white text-base leading-tight truncate">
            {patient.full_name}
          </h3>
          <p className="text-white/50 text-xs mt-0.5 font-sans truncate">
            {patient.email}
            {patient.email && patient.date_of_birth ? " · " : ""}
            {patient.date_of_birth
              ? new Date(patient.date_of_birth).toLocaleDateString("pt-BR")
              : ""}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="text-[10px] font-semibold bg-white/10 text-white/80 px-2 py-0.5 rounded-full font-sans">
              {ageCategory}
            </span>
            {patient.health_insurance && (
              <span className="text-[10px] font-semibold bg-white/10 text-white/80 px-2 py-0.5 rounded-full font-sans">
                {patient.health_insurance}
              </span>
            )}
            <span className="text-[10px] font-semibold bg-white/10 text-white/80 px-2 py-0.5 rounded-full font-sans">
              {patient.appointmentCount} consulta{patient.appointmentCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 shrink-0">
          <Link
            href={`/agenda?paciente=${patient.id}`}
            className="text-[10px] font-bold bg-nc-secondary text-white px-3 py-1.5 rounded-lg font-headline whitespace-nowrap"
          >
            + Novo Agendamento
          </Link>
          <Link
            href={`/pacientes/${patient.id}`}
            className="text-[10px] font-bold bg-white/10 text-white/80 px-3 py-1.5 rounded-lg font-headline text-center whitespace-nowrap hover:bg-white/20 transition-colors"
          >
            Prontuário completo
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-outline-variant/20 px-4 overflow-x-auto scrollbar-none">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-3 py-3 text-xs font-semibold font-headline whitespace-nowrap border-b-2 transition-colors ${
              i === activeTab
                ? "border-nc-secondary text-primary"
                : "border-transparent text-on-surface-variant hover:text-primary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {statCards.map((s) => (
                <div
                  key={s.label}
                  className="bg-background rounded-xl p-3 border border-outline-variant/20 text-center"
                >
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wide font-sans mb-1">
                    {s.label}
                  </p>
                  <p className={`font-headline font-bold text-lg ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {infoGrid.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {infoGrid.map(({ label, value }) => (
                  <div key={label} className="bg-background rounded-xl px-4 py-3 border border-outline-variant/20">
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wide font-sans mb-1">
                      {label}
                    </p>
                    <p className="font-semibold text-primary text-sm font-headline truncate">{value}</p>
                  </div>
                ))}
              </div>
            )}

            <div>
              <h4 className="font-headline font-semibold text-primary text-sm mb-3">Histórico recente</h4>
              {patient.recentAppointments.length > 0 ? (
                <div className="space-y-2">
                  {patient.recentAppointments.map((apt) => (
                    <div key={apt.id} className="flex items-start gap-3 p-3 rounded-xl bg-background border border-outline-variant/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-nc-secondary mt-2 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-primary font-headline truncate">
                          {apt.services?.name ?? "Consulta"}
                        </p>
                        <p className="text-xs text-on-surface-variant font-sans mt-0.5">
                          {new Date(apt.date + "T00:00:00").toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          · {apt.start_time?.slice(0, 5)}
                          {apt.clinic_members?.full_name
                            ? ` · ${apt.clinic_members.full_name}`
                            : ""}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 font-sans ${
                          STATUS_COLORS[apt.status ?? "scheduled"]
                        }`}
                      >
                        {STATUS_LABELS[apt.status ?? "scheduled"]}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-on-surface-variant text-sm font-sans">
                  Nenhuma consulta registrada
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 1 && (
          <EvolutionsTab
            patientId={patient.id}
            clinicId={patient.clinicId}
            evolutions={patient.evolutions}
          />
        )}

        {activeTab === 2 && (
          <Odontogram
            patientId={patient.id}
            clinicId={patient.clinicId}
            faceMarks={patient.faceMarks}
            symbols={patient.symbols}
          />
        )}

        {activeTab === 3 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <span
              className="material-symbols-outlined text-outline text-4xl mb-3"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              folder
            </span>
            <p className="text-on-surface-variant text-sm font-sans">Documentos em breve</p>
          </div>
        )}

        {activeTab === 4 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <span
              className="material-symbols-outlined text-outline text-4xl mb-3"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              payments
            </span>
            <p className="text-on-surface-variant text-sm font-sans">Financeiro do paciente em breve</p>
          </div>
        )}

        {activeTab === 5 && (
          <AnamnesisForm
            patientId={patient.id}
            clinicId={patient.clinicId}
            initial={patient.anamnesis}
          />
        )}
      </div>
    </div>
  )
}
