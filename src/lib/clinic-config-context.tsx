"use client"

import { createContext, useContext } from "react"

export type ClinicType = "dental" | "medical" | "mixed"

type ClinicConfig = {
  clinicType: ClinicType
  userRole: string
}

const ClinicConfigContext = createContext<ClinicConfig>({
  clinicType: "dental",
  userRole: "clinic_owner",
})

export function ClinicConfigProvider({
  children,
  clinicType,
  userRole,
}: {
  children: React.ReactNode
  clinicType: ClinicType
  userRole: string
}) {
  return (
    <ClinicConfigContext.Provider value={{ clinicType, userRole }}>
      {children}
    </ClinicConfigContext.Provider>
  )
}

export function useClinicConfig() {
  return useContext(ClinicConfigContext)
}

export function getCatalogTypeFilter(
  clinicType: ClinicType,
  userRole: string
): string[] | null {
  if (clinicType === "dental") return ["Odontologia", "Ambos"]
  if (clinicType === "medical") return ["Medicina", "Ambos"]
  // mixed clinic: filter by the professional's own specialty
  if (userRole === "dentist") return ["Odontologia", "Ambos"]
  if (userRole === "doctor") return ["Medicina", "Ambos"]
  // owners / receptionists in mixed clinics see everything
  return null
}
