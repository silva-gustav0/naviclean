"use client"

import { useState, useTransition } from "react"
import { changeAppointmentStatus, createAppointment } from "@/app/actions/appointments"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, ChevronLeft, ChevronRight, Clock, User, Stethoscope } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

const STATUS_COLORS: Record<string, string> = {
  scheduled: 'bg-slate-100 text-slate-700 border-slate-300',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-300',
  waiting_room: 'bg-amber-100 text-amber-700 border-amber-300',
  in_progress: 'bg-violet-100 text-violet-700 border-violet-300',
  awaiting_payment: 'bg-orange-100 text-orange-700 border-orange-300',
  completed: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  cancelled: 'bg-red-50 text-red-400 border-red-200 opacity-60',
  no_show: 'bg-red-50 text-red-400 border-red-200 opacity-60',
}

const STATUS_LABELS: Record<string, string> = {
  scheduled: 'Agendado', confirmed: 'Confirmado', waiting_room: 'Na recepção',
  in_progress: 'Em atendimento', awaiting_payment: 'Aguardando pgto.',
  completed: 'Concluído', cancelled: 'Cancelado', no_show: 'Faltou',
}

const NEXT_STATUSES: Record<string, { status: string; label: string; color: string }[]> = {
  scheduled: [
    { status: 'confirmed', label: 'Confirmar', color: 'bg-blue-600' },
    { status: 'no_show', label: 'Faltou', color: 'bg-red-500' },
    { status: 'cancelled', label: 'Cancelar', color: 'bg-red-400' },
  ],
  confirmed: [
    { status: 'waiting_room', label: 'Check-in na recepção', color: 'bg-amber-500' },
    { status: 'no_show', label: 'Faltou', color: 'bg-red-500' },
    { status: 'cancelled', label: 'Cancelar', color: 'bg-red-400' },
  ],
  waiting_room: [
    { status: 'in_progress', label: 'Chamar / Iniciar', color: 'bg-violet-600' },
  ],
  in_progress: [
    { status: 'awaiting_payment', label: 'Lib. para pagamento', color: 'bg-orange-500' },
    { status: 'completed', label: 'Concluir', color: 'bg-emerald-600' },
  ],
  awaiting_payment: [
    { status: 'completed', label: 'Pagamento recebido', color: 'bg-emerald-600' },
  ],
}

type Appointment = {
  id: string
  date: string
  start_time: string
  end_time: string
  status: string | null
  notes: string | null
  patient_id: string
  dentist_id: string
  service_id: string | null
  patients: { full_name: string; phone: string | null } | null
  services: { name: string } | null
  clinic_members: { full_name: string | null } | null
}

type Member = { id: string; full_name: string | null; role: string; cro: string | null }
type Patient = { id: string; full_name: string; phone: string | null; whatsapp: string | null }
type Service = { id: string; name: string; duration_minutes: number; price: number | null }

interface Props {
  clinicId: string
  today: string
  appointments: Appointment[]
  members: Member[]
  patients: Patient[]
  services: Service[]
}

const HOURS = Array.from({ length: 14 }, (_, i) => `${(7 + i).toString().padStart(2, '0')}:00`)
const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

function getWeekDates(ref: Date) {
  const day = ref.getDay()
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(ref)
    d.setDate(ref.getDate() - day + i)
    return d
  })
}

export function AgendaClient({ clinicId, today, appointments, members, patients, services }: Props) {
  const [view, setView] = useState<'day' | 'week'>('week')
  const [currentDate, setCurrentDate] = useState(new Date(today))
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null)
  const [newApptOpen, setNewApptOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Form state for new appointment
  const [formPatient, setFormPatient] = useState("")
  const [formMember, setFormMember] = useState(members[0]?.id ?? "")
  const [formService, setFormService] = useState("")
  const [formDate, setFormDate] = useState(today)
  const [formStart, setFormStart] = useState("09:00")
  const [formEnd, setFormEnd] = useState("09:30")
  const [formNotes, setFormNotes] = useState("")

  const week = getWeekDates(currentDate)
  const viewDate = currentDate.toISOString().split("T")[0]

  const dayAppointments = appointments.filter((a) =>
    view === 'day' ? a.date === viewDate : week.some((d) => d.toISOString().split("T")[0] === a.date)
  )

  function prevPeriod() {
    const d = new Date(currentDate)
    d.setDate(d.getDate() - (view === 'day' ? 1 : 7))
    setCurrentDate(d)
  }

  function nextPeriod() {
    const d = new Date(currentDate)
    d.setDate(d.getDate() + (view === 'day' ? 1 : 7))
    setCurrentDate(d)
  }

  async function handleStatusChange(apptId: string, newStatus: string) {
    startTransition(async () => {
      try {
        await changeAppointmentStatus(apptId, newStatus as Parameters<typeof changeAppointmentStatus>[1])
        setSelectedAppt(null)
        toast.success(`Status atualizado: ${STATUS_LABELS[newStatus]}`)
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : "Erro ao atualizar status")
      }
    })
  }

  async function handleCreateAppointment() {
    if (!formPatient) { toast.error("Selecione um paciente"); return }
    if (!formMember) { toast.error("Selecione um profissional"); return }
    startTransition(async () => {
      try {
        await createAppointment({
          clinicId,
          patientId: formPatient,
          dentistId: formMember,
          serviceId: formService || undefined,
          date: formDate,
          startTime: formStart,
          endTime: formEnd,
          notes: formNotes || undefined,
        })
        toast.success("Agendamento criado!")
        setNewApptOpen(false)
        setFormPatient("")
        setFormNotes("")
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : "Erro ao criar agendamento")
      }
    })
  }

  return (
    <div className="space-y-4 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Agenda</h1>
          <p className="text-muted-foreground text-sm">Gerencie os agendamentos da clínica</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 rounded-lg p-0.5">
            <button onClick={() => setView('day')} className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${view === 'day' ? 'bg-white shadow-sm' : ''}`}>Dia</button>
            <button onClick={() => setView('week')} className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${view === 'week' ? 'bg-white shadow-sm' : ''}`}>Semana</button>
          </div>
          <Dialog open={newApptOpen} onOpenChange={setNewApptOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-[#0D3A6B] hover:bg-[#1A5599] text-white gap-1.5">
                <Plus className="h-4 w-4" />Novo Agendamento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Novo Agendamento</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Paciente *</Label>
                  <select value={formPatient} onChange={(e) => setFormPatient(e.target.value)} className="w-full mt-1 text-sm border rounded px-2 py-1.5 bg-white dark:bg-slate-800">
                    <option value="">Selecione...</option>
                    {patients.map((p) => <option key={p.id} value={p.id}>{p.full_name}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-xs">Profissional *</Label>
                  <select value={formMember} onChange={(e) => setFormMember(e.target.value)} className="w-full mt-1 text-sm border rounded px-2 py-1.5 bg-white dark:bg-slate-800">
                    {members.map((m) => <option key={m.id} value={m.id}>{m.full_name ?? 'Profissional'}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-xs">Procedimento</Label>
                  <select value={formService} onChange={(e) => setFormService(e.target.value)} className="w-full mt-1 text-sm border rounded px-2 py-1.5 bg-white dark:bg-slate-800">
                    <option value="">Nenhum</option>
                    {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-xs">Data</Label>
                    <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} className="w-full mt-1 text-sm border rounded px-2 py-1.5 bg-white dark:bg-slate-800" />
                  </div>
                  <div>
                    <Label className="text-xs">Início</Label>
                    <input type="time" value={formStart} onChange={(e) => setFormStart(e.target.value)} className="w-full mt-1 text-sm border rounded px-2 py-1.5 bg-white dark:bg-slate-800" />
                  </div>
                  <div>
                    <Label className="text-xs">Fim</Label>
                    <input type="time" value={formEnd} onChange={(e) => setFormEnd(e.target.value)} className="w-full mt-1 text-sm border rounded px-2 py-1.5 bg-white dark:bg-slate-800" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Observações</Label>
                  <textarea value={formNotes} onChange={(e) => setFormNotes(e.target.value)} rows={2} className="w-full mt-1 text-sm border rounded px-2 py-1.5 bg-white dark:bg-slate-800 resize-none" />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => setNewApptOpen(false)}>Cancelar</Button>
                  <Button size="sm" onClick={handleCreateAppointment} disabled={isPending} className="bg-[#0D3A6B] text-white">
                    {isPending ? "Criando..." : "Criar Agendamento"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <button onClick={prevPeriod} className="p-1.5 hover:bg-slate-100 rounded-lg">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h2 className="font-semibold text-sm">
            {view === 'day'
              ? currentDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
              : `${week[0].getDate()} - ${week[6].getDate()} de ${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`
            }
          </h2>
          <button onClick={nextPeriod} className="p-1.5 hover:bg-slate-100 rounded-lg">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {view === 'week' ? (
          <>
            {/* Week header */}
            <div className="grid grid-cols-8 border-b text-xs">
              <div className="py-3 px-2 text-muted-foreground text-center" />
              {week.map((d, i) => {
                const isToday = d.toISOString().split("T")[0] === today
                return (
                  <div key={i} className="py-3 text-center border-l">
                    <p className="text-muted-foreground">{DAYS[d.getDay()]}</p>
                    <button
                      onClick={() => { setCurrentDate(d); setView('day') }}
                      className={`mx-auto mt-1 w-7 h-7 rounded-full flex items-center justify-center font-semibold hover:bg-slate-100 transition-colors ${isToday ? 'bg-[#0D3A6B] text-white hover:bg-[#1A5599]' : ''}`}
                    >
                      {d.getDate()}
                    </button>
                  </div>
                )
              })}
            </div>
            {/* Time slots */}
            <div className="overflow-y-auto max-h-[520px]">
              {HOURS.map((hour) => (
                <div key={hour} className="grid grid-cols-8 border-b last:border-b-0 min-h-[52px]">
                  <div className="py-2 px-3 text-xs text-muted-foreground text-right pt-2 shrink-0">{hour}</div>
                  {week.map((d, i) => {
                    const dateStr = d.toISOString().split("T")[0]
                    const slotAppts = dayAppointments.filter(
                      (a) => a.date === dateStr && a.start_time.startsWith(hour.split(':')[0])
                    )
                    return (
                      <div key={i} className="border-l py-0.5 px-0.5 cursor-pointer hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors">
                        {slotAppts.map((appt) => (
                          <button
                            key={appt.id}
                            onClick={() => setSelectedAppt(appt)}
                            className={`w-full text-left text-[10px] px-1.5 py-1 rounded border font-medium truncate ${STATUS_COLORS[appt.status ?? 'scheduled']}`}
                          >
                            {appt.start_time.slice(0, 5)} {appt.patients?.full_name?.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Day view — list */
          <div className="divide-y max-h-[600px] overflow-y-auto">
            {dayAppointments.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground text-sm">
                Nenhum agendamento neste dia
              </div>
            ) : dayAppointments.map((appt) => (
              <button
                key={appt.id}
                onClick={() => setSelectedAppt(appt)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors text-left"
              >
                <div className={`w-2 h-12 rounded-full shrink-0 ${(STATUS_COLORS[appt.status ?? 'scheduled'] ?? '').split(' ')[0]}`} />
                <div className="flex items-center gap-1.5 text-sm font-medium w-20 shrink-0">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  {appt.start_time.slice(0, 5)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{appt.patients?.full_name}</p>
                  {appt.services && <p className="text-xs text-muted-foreground">{appt.services.name}</p>}
                </div>
                <div className="text-xs text-muted-foreground shrink-0 flex items-center gap-1">
                  <Stethoscope className="h-3 w-3" />
                  {appt.clinic_members?.full_name?.split(' ')[0] ?? 'Profissional'}
                </div>
                <Badge className={`text-[10px] shrink-0 ${STATUS_COLORS[appt.status ?? 'scheduled']}`}>
                  {STATUS_LABELS[appt.status ?? 'scheduled']}
                </Badge>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Appointment detail sheet */}
      <Sheet open={!!selectedAppt} onOpenChange={(o) => !o && setSelectedAppt(null)}>
        <SheetContent side="right" className="w-full sm:w-[420px]">
          {selectedAppt && (
            <>
              <SheetHeader>
                <SheetTitle>Detalhes do Agendamento</SheetTitle>
              </SheetHeader>
              <div className="space-y-5 mt-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-[#0D3A6B]" />
                    <div>
                      <p className="font-medium text-sm">{selectedAppt.patients?.full_name}</p>
                      {selectedAppt.patients?.phone && <p className="text-xs text-muted-foreground">{selectedAppt.patients.phone}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#0D3A6B]" />
                    <p className="text-sm">{new Date(selectedAppt.date).toLocaleDateString('pt-BR')} das {selectedAppt.start_time.slice(0,5)} às {selectedAppt.end_time.slice(0,5)}</p>
                  </div>
                  {selectedAppt.services && (
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-[#0D3A6B]" />
                      <p className="text-sm">{selectedAppt.services.name}</p>
                    </div>
                  )}
                  {selectedAppt.clinic_members && (
                    <p className="text-xs text-muted-foreground">Prof.: {selectedAppt.clinic_members.full_name}</p>
                  )}
                  {selectedAppt.notes && <p className="text-xs text-muted-foreground border-l-2 border-slate-200 pl-3">{selectedAppt.notes}</p>}
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-2">Status atual</p>
                  <Badge className={`${STATUS_COLORS[selectedAppt.status ?? 'scheduled']}`}>
                    {STATUS_LABELS[selectedAppt.status ?? 'scheduled']}
                  </Badge>
                </div>

                {(NEXT_STATUSES[selectedAppt.status ?? ''] ?? []).length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Ações disponíveis</p>
                    <div className="flex flex-col gap-2">
                      {(NEXT_STATUSES[selectedAppt.status ?? ''] ?? []).map((action) => (
                        <Button
                          key={action.status}
                          size="sm"
                          onClick={() => handleStatusChange(selectedAppt.id, action.status)}
                          disabled={isPending}
                          className={`${action.color} text-white hover:opacity-90`}
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <Link
                    href={`/pacientes/${selectedAppt.patient_id}`}
                    className="text-xs text-[#0D3A6B] underline-offset-2 hover:underline"
                  >
                    Abrir prontuário do paciente →
                  </Link>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
