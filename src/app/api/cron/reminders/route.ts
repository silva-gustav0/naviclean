import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/email/send"
import { sendWhatsApp, buildReminderMessage } from "@/lib/whatsapp/send"
import { AppointmentReminderEmail } from "@/emails/AppointmentReminderEmail"
import React from "react"

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = await createClient()

  // Get tomorrow's date
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split("T")[0]

  // Fetch appointments tomorrow that haven't had reminders sent
  const { data: appointments, error } = await supabase
    .from("appointments")
    .select(`
      id,
      date,
      start_time,
      reminder_sent,
      patients (full_name, email, phone),
      clinic_members (profiles (full_name)),
      clinics (name, phone)
    `)
    .eq("date", tomorrowStr)
    .eq("reminder_sent", false)
    .in("status", ["scheduled", "confirmed"])

  if (error) {
    console.error("Cron reminders error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!appointments || appointments.length === 0) {
    return NextResponse.json({ sent: 0, message: "No reminders to send" })
  }

  const results = await Promise.allSettled(
    appointments.map(async (appt) => {
      const patient = appt.patients as unknown as { full_name: string; email: string | null; phone: string | null } | null
      const dentist = appt.clinic_members as unknown as { profiles: { full_name: string } | null } | null
      const clinic = appt.clinics as unknown as { name: string; phone: string | null } | null

      if (!patient) return

      const patientName = patient.full_name
      const clinicName = clinic?.name ?? "Clínica"
      const dentistName = dentist?.profiles?.full_name ?? "Profissional"
      const dateFormatted = new Date(appt.date + "T12:00:00").toLocaleDateString("pt-BR")
      const timeFormatted = appt.start_time.slice(0, 5)

      // Send email if patient has email
      if (patient.email) {
        try {
          await sendEmail({
            to: patient.email,
            subject: `Lembrete: consulta amanhã em ${clinicName}`,
            react: React.createElement(AppointmentReminderEmail, {
              patientName,
              clinicName,
              dentistName,
              date: dateFormatted,
              time: timeFormatted,
              clinicPhone: clinic?.phone ?? undefined,
            }),
          })
        } catch (err) {
          console.error(`Email reminder failed for appt ${appt.id}:`, err)
        }
      }

      // Send WhatsApp if patient has phone
      if (patient.phone) {
        try {
          await sendWhatsApp({
            phone: patient.phone,
            message: buildReminderMessage({
              patientName,
              clinicName,
              date: dateFormatted,
              time: timeFormatted,
            }),
          })
        } catch (err) {
          console.error(`WhatsApp reminder failed for appt ${appt.id}:`, err)
        }
      }

      // Mark as sent
      await supabase
        .from("appointments")
        .update({ reminder_sent: true })
        .eq("id", appt.id)
    })
  )

  const sent = results.filter((r) => r.status === "fulfilled").length

  return NextResponse.json({ sent, total: appointments.length })
}
