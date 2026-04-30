"use client"

import { useEffect, useRef } from "react"
import { toast } from "sonner"
import { getUpcomingAppointments } from "@/app/actions/appointments"

interface Props {
  memberId: string | null
  clinicId: string
}

export function AppointmentReminder({ memberId, clinicId }: Props) {
  const notifiedRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!memberId) return

    async function check() {
      try {
        const appointments = await getUpcomingAppointments(clinicId, memberId!)
        const now = new Date()
        const nowMinutes = now.getHours() * 60 + now.getMinutes()

        for (const appt of appointments) {
          const [h, m] = appt.start_time.split(":").map(Number)
          const apptMinutes = h * 60 + m
          const diff = apptMinutes - nowMinutes

          if (diff >= 0 && diff <= 15 && !notifiedRef.current.has(appt.id)) {
            notifiedRef.current.add(appt.id)
            const label = diff === 0 ? "agora" : `em ${diff} min`
            toast.warning(
              `Consulta ${label}: ${appt.patients?.full_name ?? "Paciente"}`,
              {
                description: `${appt.start_time.slice(0, 5)}${appt.services ? ` — ${appt.services.name}` : ""}`,
                duration: 30000,
              }
            )
          }
        }
      } catch {
        // Silent — don't interrupt UX on poll failures
      }
    }

    check()
    const id = setInterval(check, 60_000)
    return () => clearInterval(id)
  }, [memberId, clinicId])

  return null
}
