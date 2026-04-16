"use client"

import { useState, useTransition } from "react"
import { createAppointment } from "@/app/actions/appointments"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Calendar, Clock, User, Stethoscope, CheckCircle, ChevronRight, ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface Member { id: string; name: string; specialty: string | null }
interface Service { id: string; name: string; price: number; duration_minutes: number }
interface WorkingHour { day_of_week: number; start_time: string; end_time: string }

interface Props {
  clinicId: string
  clinicName: string
  members: Member[]
  services: Service[]
  workingHours: WorkingHour[]
  defaultDuration: number
  bufferMinutes: number
}

type Step = "professional" | "service" | "datetime" | "patient" | "confirm"

function generateTimeSlots(startTime: string, endTime: string, durationMinutes: number, bufferMinutes: number): string[] {
  const slots: string[] = []
  const [startH, startM] = startTime.split(":").map(Number)
  const [endH, endM] = endTime.split(":").map(Number)

  let current = startH * 60 + startM
  const endMinutes = endH * 60 + endM
  const step = durationMinutes + bufferMinutes

  while (current + durationMinutes <= endMinutes) {
    const h = Math.floor(current / 60)
    const m = current % 60
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`)
    current += step
  }
  return slots
}

const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

export function BookingClient({ clinicId, members, services, workingHours, defaultDuration, bufferMinutes }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [step, setStep] = useState<Step>("professional")
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [patientName, setPatientName] = useState("")
  const [patientPhone, setPatientPhone] = useState("")
  const [patientEmail, setPatientEmail] = useState("")
  const [done, setDone] = useState(false)

  // Get available time slots for selected date
  const getAvailableSlots = () => {
    if (!selectedDate) return []
    const dayOfWeek = new Date(selectedDate + "T12:00:00").getDay()
    const wh = workingHours.find((h) => h.day_of_week === dayOfWeek)
    if (!wh) return []
    const duration = selectedService?.duration_minutes ?? defaultDuration
    return generateTimeSlots(wh.start_time, wh.end_time, duration, bufferMinutes)
  }

  // Min date = today
  const minDate = new Date().toISOString().split("T")[0]

  function handleBook() {
    if (!selectedMember || !selectedService || !selectedDate || !selectedTime || !patientName) return

    startTransition(async () => {
      try {
        await createAppointment({
          clinicId,
          dentistId: selectedMember.id,
          serviceId: selectedService.id,
          date: selectedDate,
          startTime: selectedTime,
          durationMinutes: selectedService.duration_minutes,
          patientName,
          patientPhone: patientPhone || undefined,
          patientEmail: patientEmail || undefined,
          notes: `Agendamento online`,
        })
        toast.success("Consulta agendada com sucesso!")
        setDone(true)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erro ao agendar consulta")
      }
    })
  }

  if (done) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border py-16 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-emerald-600" />
        </div>
        <h3 className="font-bold text-xl mb-2">Consulta agendada!</h3>
        <p className="text-muted-foreground text-sm mb-2">
          {selectedDate && new Date(selectedDate + "T12:00:00").toLocaleDateString("pt-BR", {
            weekday: "long", day: "numeric", month: "long",
          })} às {selectedTime}
        </p>
        <p className="text-muted-foreground text-sm mb-6">
          com {selectedMember?.name}
        </p>
        <p className="text-xs text-muted-foreground">Você receberá uma confirmação em breve.</p>
      </div>
    )
  }

  const steps: { key: Step; label: string; icon: React.ReactNode }[] = [
    { key: "professional", label: "Profissional", icon: <User className="h-4 w-4" /> },
    { key: "service", label: "Serviço", icon: <Stethoscope className="h-4 w-4" /> },
    { key: "datetime", label: "Data/Hora", icon: <Calendar className="h-4 w-4" /> },
    { key: "patient", label: "Seus dados", icon: <User className="h-4 w-4" /> },
    { key: "confirm", label: "Confirmar", icon: <CheckCircle className="h-4 w-4" /> },
  ]

  const stepIndex = steps.findIndex((s) => s.key === step)

  return (
    <div className="max-w-2xl space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              i < stepIndex ? "bg-emerald-100 text-emerald-700" :
              i === stepIndex ? "bg-[#0D3A6B] text-white" :
              "bg-slate-100 text-slate-400"
            }`}>
              {i < stepIndex ? "✓" : i + 1}
            </div>
            <span className={`text-xs hidden sm:block ${i === stepIndex ? "font-medium" : "text-muted-foreground"}`}>
              {s.label}
            </span>
            {i < steps.length - 1 && <ChevronRight className="h-3 w-3 text-slate-300 shrink-0" />}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border p-6">
        {step === "professional" && (
          <div className="space-y-4">
            <h2 className="font-semibold">Escolha o profissional</h2>
            {members.length === 0 ? (
              <p className="text-muted-foreground text-sm">Nenhum profissional disponível.</p>
            ) : (
              <div className="space-y-2">
                {members.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { setSelectedMember(m); setStep("service") }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left hover:border-blue-300 transition-colors ${
                      selectedMember?.id === m.id ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : ""
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0D3A6B] to-[#1A5599] flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {m.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{m.name}</p>
                      {m.specialty && <p className="text-xs text-muted-foreground">{m.specialty}</p>}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === "service" && (
          <div className="space-y-4">
            <h2 className="font-semibold">Escolha o serviço</h2>
            {services.length === 0 ? (
              <p className="text-muted-foreground text-sm">Nenhum serviço disponível.</p>
            ) : (
              <div className="space-y-2">
                {services.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setSelectedService(s); setStep("datetime") }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left hover:border-blue-300 transition-colors ${
                      selectedService?.id === s.id ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : ""
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-cyan-100 flex items-center justify-center shrink-0">
                      <Stethoscope className="h-4 w-4 text-cyan-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{s.name}</p>
                      <p className="text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 inline mr-1" />{s.duration_minutes} min
                        {s.price > 0 ? ` · ${fmt(s.price)}` : ""}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === "datetime" && (
          <div className="space-y-4">
            <h2 className="font-semibold">Escolha a data e hora</h2>
            <div>
              <Label className="text-xs">Data</Label>
              <Input
                type="date"
                min={minDate}
                value={selectedDate}
                onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime("") }}
                className="mt-1 max-w-xs"
              />
            </div>
            {selectedDate && (
              <div>
                <Label className="text-xs">Horário disponível</Label>
                {getAvailableSlots().length === 0 ? (
                  <p className="text-sm text-muted-foreground mt-2">
                    Sem horários disponíveis neste dia. Escolha outra data.
                  </p>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-2">
                    {getAvailableSlots().map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
                        className={`py-2 rounded-lg border text-sm font-medium transition-colors ${
                          selectedTime === slot
                            ? "bg-[#0D3A6B] text-white border-[#0D3A6B]"
                            : "hover:border-blue-300 hover:bg-blue-50"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === "patient" && (
          <div className="space-y-4">
            <h2 className="font-semibold">Seus dados</h2>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">Nome completo *</Label>
                <Input value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Seu nome" required />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Telefone</Label>
                <Input value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)} placeholder="(11) 99999-9999" type="tel" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Email</Label>
                <Input value={patientEmail} onChange={(e) => setPatientEmail(e.target.value)} placeholder="seu@email.com" type="email" />
              </div>
            </div>
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-4">
            <h2 className="font-semibold">Confirmar agendamento</h2>
            <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Profissional</span>
                <span className="font-medium">{selectedMember?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Serviço</span>
                <span className="font-medium">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data</span>
                <span className="font-medium">
                  {selectedDate && new Date(selectedDate + "T12:00:00").toLocaleDateString("pt-BR")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Horário</span>
                <span className="font-medium">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Paciente</span>
                <span className="font-medium">{patientName}</span>
              </div>
              {selectedService && selectedService.price > 0 && (
                <div className="flex justify-between border-t pt-3">
                  <span className="text-muted-foreground">Valor</span>
                  <span className="font-semibold">{fmt(selectedService.price)}</span>
                </div>
              )}
            </div>
            <Button
              onClick={handleBook}
              disabled={isPending}
              className="w-full bg-[#0D3A6B] hover:bg-[#1A5599] text-white"
            >
              {isPending ? "Agendando..." : "Confirmar agendamento"}
            </Button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            const prevIndex = stepIndex - 1
            if (prevIndex >= 0) setStep(steps[prevIndex].key)
          }}
          disabled={stepIndex === 0}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />Voltar
        </Button>
        {step !== "confirm" && (
          <Button
            onClick={() => {
              if (step === "professional" && selectedMember) setStep("service")
              else if (step === "service" && selectedService) setStep("datetime")
              else if (step === "datetime" && selectedDate && selectedTime) setStep("patient")
              else if (step === "patient" && patientName) setStep("confirm")
            }}
            disabled={
              (step === "professional" && !selectedMember) ||
              (step === "service" && !selectedService) ||
              (step === "datetime" && (!selectedDate || !selectedTime)) ||
              (step === "patient" && !patientName)
            }
            className="flex items-center gap-1 bg-[#0D3A6B] hover:bg-[#1A5599] text-white"
          >
            Continuar <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
