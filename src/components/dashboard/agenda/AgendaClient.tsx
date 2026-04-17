"use client"

import { useState, useTransition } from "react"
import { changeAppointmentStatus, createAppointment } from "@/app/actions/appointments"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import Link from "next/link"

const STATUS_COLORS: Record<string, string> = {
  scheduled:        'bg-surface-container text-on-surface-variant border-outline-variant',
  confirmed:        'bg-blue-50 text-blue-700 border-blue-200',
  waiting_room:     'bg-amber-50 text-amber-700 border-amber-200',
  in_progress:      'bg-primary/10 text-primary border-primary/20',
  awaiting_payment: 'bg-orange-50 text-orange-700 border-orange-200',
  completed:        'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled:        'bg-red-50 text-red-400 border-red-200 opacity-60',
  no_show:          'bg-red-50 text-red-400 border-red-200 opacity-60',
}

const STATUS_DOT: Record<string, string> = {
  scheduled:        'bg-on-surface-variant',
  confirmed:        'bg-blue-500',
  waiting_room:     'bg-amber-500',
  in_progress:      'bg-primary',
  awaiting_payment: 'bg-orange-500',
  completed:        'bg-emerald-500',
  cancelled:        'bg-red-400',
  no_show:          'bg-red-400',
}

const STATUS_LABELS: Record<string, string> = {
  scheduled: 'Agendado', confirmed: 'Confirmado', waiting_room: 'Na recepção',
  in_progress: 'Em atendimento', awaiting_payment: 'Aguardando pgto.',
  completed: 'Concluído', cancelled: 'Cancelado', no_show: 'Faltou',
}

const NEXT_STATUSES: Record<string, { status: string; label: string; cls: string }[]> = {
  scheduled: [
    { status: 'confirmed',    label: 'Confirmar',    cls: 'bg-blue-600 hover:bg-blue-700 text-white' },
    { status: 'no_show',      label: 'Faltou',       cls: 'bg-red-500 hover:bg-red-600 text-white' },
    { status: 'cancelled',    label: 'Cancelar',     cls: 'bg-red-400 hover:bg-red-500 text-white' },
  ],
  confirmed: [
    { status: 'waiting_room', label: 'Check-in na recepção', cls: 'bg-amber-500 hover:bg-amber-600 text-white' },
    { status: 'no_show',      label: 'Faltou',               cls: 'bg-red-500 hover:bg-red-600 text-white' },
    { status: 'cancelled',    label: 'Cancelar',             cls: 'bg-red-400 hover:bg-red-500 text-white' },
  ],
  waiting_room: [
    { status: 'in_progress',  label: 'Chamar / Iniciar', cls: 'surgical-gradient text-white' },
  ],
  in_progress: [
    { status: 'awaiting_payment', label: 'Lib. para pagamento', cls: 'bg-orange-500 hover:bg-orange-600 text-white' },
    { status: 'completed',        label: 'Concluir',            cls: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
  ],
  awaiting_payment: [
    { status: 'completed', label: 'Pagamento recebido', cls: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
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

const inputCls = "w-full mt-1 text-sm border border-outline-variant rounded-lg px-3 py-2 bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"

export function AgendaClient({ clinicId, today, appointments, members, patients, services }: Props) {
  const [view, setView] = useState<'day' | 'week'>('week')
  const [currentDate, setCurrentDate] = useState(new Date(today))
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null)
  const [newApptOpen, setNewApptOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

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
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-headline font-extrabold text-3xl text-primary">Agenda</h1>
          <p className="text-on-surface-variant text-sm mt-0.5">Gerencie os agendamentos da clínica</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex bg-surface-container rounded-xl p-0.5 gap-0.5">
            <button
              onClick={() => setView('day')}
              className={`text-xs px-4 py-2 rounded-lg font-medium transition-all ${view === 'day' ? 'bg-surface-container-lowest shadow-premium-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Dia
            </button>
            <button
              onClick={() => setView('week')}
              className={`text-xs px-4 py-2 rounded-lg font-medium transition-all ${view === 'week' ? 'bg-surface-container-lowest shadow-premium-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Semana
            </button>
          </div>

          {/* Sala de espera link */}
          <Link
            href="/agenda/sala-de-espera"
            className="flex items-center gap-1.5 text-xs font-medium text-on-surface-variant hover:text-primary border border-outline-variant rounded-xl px-3 py-2 transition-colors hover:border-primary/30"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>airline_seat_recline_normal</span>
            Sala de Espera
          </Link>

          {/* New appointment */}
          <Dialog open={newApptOpen} onOpenChange={setNewApptOpen}>
            <DialogTrigger asChild>
              <button className="surgical-gradient text-white text-sm font-semibold flex items-center gap-1.5 px-4 py-2 rounded-xl shadow-premium-sm hover:opacity-90 transition-opacity">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                Novo Agendamento
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-surface-container-lowest border-outline-variant">
              <DialogHeader>
                <DialogTitle className="font-headline font-bold text-primary">Novo Agendamento</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-1">
                <div>
                  <Label className="text-xs font-medium text-on-surface-variant">Paciente *</Label>
                  <select value={formPatient} onChange={(e) => setFormPatient(e.target.value)} className={inputCls}>
                    <option value="">Selecione...</option>
                    {patients.map((p) => <option key={p.id} value={p.id}>{p.full_name}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-xs font-medium text-on-surface-variant">Profissional *</Label>
                  <select value={formMember} onChange={(e) => setFormMember(e.target.value)} className={inputCls}>
                    {members.map((m) => <option key={m.id} value={m.id}>{m.full_name ?? 'Profissional'}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-xs font-medium text-on-surface-variant">Procedimento</Label>
                  <select value={formService} onChange={(e) => setFormService(e.target.value)} className={inputCls}>
                    <option value="">Nenhum</option>
                    {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-xs font-medium text-on-surface-variant">Data</Label>
                    <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-on-surface-variant">Início</Label>
                    <input type="time" value={formStart} onChange={(e) => setFormStart(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-on-surface-variant">Fim</Label>
                    <input type="time" value={formEnd} onChange={(e) => setFormEnd(e.target.value)} className={inputCls} />
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-medium text-on-surface-variant">Observações</Label>
                  <textarea value={formNotes} onChange={(e) => setFormNotes(e.target.value)} rows={2} className={`${inputCls} resize-none`} />
                </div>
                <div className="flex gap-2 justify-end pt-1">
                  <button onClick={() => setNewApptOpen(false)} className="text-sm font-medium text-on-surface-variant border border-outline-variant rounded-xl px-4 py-2 hover:bg-surface-container transition-colors">
                    Cancelar
                  </button>
                  <button onClick={handleCreateAppointment} disabled={isPending} className="surgical-gradient text-white text-sm font-semibold px-5 py-2 rounded-xl shadow-premium-sm hover:opacity-90 disabled:opacity-50 transition-opacity">
                    {isPending ? "Criando..." : "Criar Agendamento"}
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Calendar card */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-premium-sm">
        {/* Navigation bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-outline-variant bg-surface-container">
          <button onClick={prevPeriod} className="p-1.5 hover:bg-surface-container-high rounded-lg transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>chevron_left</span>
          </button>
          <h2 className="font-semibold text-sm text-on-surface">
            {view === 'day'
              ? currentDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
              : `${week[0].getDate()} – ${week[6].getDate()} de ${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`
            }
          </h2>
          <button onClick={nextPeriod} className="p-1.5 hover:bg-surface-container-high rounded-lg transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>chevron_right</span>
          </button>
        </div>

        {view === 'week' ? (
          <>
            {/* Week header row */}
            <div className="grid grid-cols-8 border-b border-outline-variant text-xs bg-surface-container">
              <div className="py-3 px-2 text-center" />
              {week.map((d, i) => {
                const isToday = d.toISOString().split("T")[0] === today
                return (
                  <div key={i} className="py-3 text-center border-l border-outline-variant">
                    <p className="text-on-surface-variant text-[11px] uppercase tracking-wide">{DAYS[d.getDay()]}</p>
                    <button
                      onClick={() => { setCurrentDate(d); setView('day') }}
                      className={`mx-auto mt-1 w-7 h-7 rounded-full flex items-center justify-center font-semibold text-xs transition-all hover:bg-surface-container-high ${isToday ? 'surgical-gradient text-white shadow-premium-sm' : 'text-on-surface'}`}
                    >
                      {d.getDate()}
                    </button>
                  </div>
                )
              })}
            </div>
            {/* Time grid */}
            <div className="overflow-y-auto max-h-[520px]">
              {HOURS.map((hour) => (
                <div key={hour} className="grid grid-cols-8 border-b border-outline-variant/50 last:border-b-0 min-h-[52px]">
                  <div className="py-2 px-3 text-[11px] text-on-surface-variant text-right pt-2 shrink-0">{hour}</div>
                  {week.map((d, i) => {
                    const dateStr = d.toISOString().split("T")[0]
                    const slotAppts = dayAppointments.filter(
                      (a) => a.date === dateStr && a.start_time.startsWith(hour.split(':')[0])
                    )
                    return (
                      <div key={i} className="border-l border-outline-variant/50 py-0.5 px-0.5 cursor-pointer hover:bg-primary/5 transition-colors">
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
          <div className="divide-y divide-outline-variant/50 max-h-[600px] overflow-y-auto">
            {dayAppointments.length === 0 ? (
              <div className="py-16 text-center">
                <span className="material-symbols-outlined text-outline mb-3 block" style={{ fontSize: 40 }}>calendar_month</span>
                <p className="text-on-surface-variant text-sm">Nenhum agendamento neste dia</p>
              </div>
            ) : dayAppointments.map((appt) => (
              <button
                key={appt.id}
                onClick={() => setSelectedAppt(appt)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-surface-container transition-colors text-left group"
              >
                <div className={`w-1.5 h-12 rounded-full shrink-0 ${STATUS_DOT[appt.status ?? 'scheduled']}`} />
                <div className="flex items-center gap-1.5 text-sm font-semibold text-primary w-16 shrink-0">
                  <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 14 }}>schedule</span>
                  {appt.start_time.slice(0, 5)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-on-surface truncate">{appt.patients?.full_name}</p>
                  {appt.services && <p className="text-xs text-on-surface-variant">{appt.services.name}</p>}
                </div>
                <div className="text-xs text-on-surface-variant shrink-0 flex items-center gap-1">
                  <span className="material-symbols-outlined" style={{ fontSize: 13 }}>stethoscope</span>
                  {appt.clinic_members?.full_name?.split(' ')[0] ?? 'Profissional'}
                </div>
                <span className={`text-[10px] shrink-0 px-2 py-0.5 rounded-full border font-medium ${STATUS_COLORS[appt.status ?? 'scheduled']}`}>
                  {STATUS_LABELS[appt.status ?? 'scheduled']}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Appointment detail sheet */}
      <Sheet open={!!selectedAppt} onOpenChange={(o) => !o && setSelectedAppt(null)}>
        <SheetContent side="right" className="w-full sm:w-[420px] bg-surface-container-lowest border-outline-variant">
          {selectedAppt && (
            <>
              <SheetHeader>
                <SheetTitle className="font-headline font-bold text-primary">Detalhes do Agendamento</SheetTitle>
              </SheetHeader>
              <div className="space-y-5 mt-6">
                {/* Patient info */}
                <div className="bg-surface-container rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full surgical-gradient flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {selectedAppt.patients?.full_name?.charAt(0) ?? '?'}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-on-surface">{selectedAppt.patients?.full_name}</p>
                      {selectedAppt.patients?.phone && <p className="text-xs text-on-surface-variant">{selectedAppt.patients.phone}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: 16 }}>schedule</span>
                    {new Date(selectedAppt.date).toLocaleDateString('pt-BR')} · {selectedAppt.start_time.slice(0,5)} às {selectedAppt.end_time.slice(0,5)}
                  </div>
                  {selectedAppt.services && (
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-primary" style={{ fontSize: 16 }}>stethoscope</span>
                      {selectedAppt.services.name}
                    </div>
                  )}
                  {selectedAppt.clinic_members && (
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>person</span>
                      Prof.: {selectedAppt.clinic_members.full_name}
                    </div>
                  )}
                  {selectedAppt.notes && (
                    <p className="text-xs text-on-surface-variant border-l-2 border-nc-secondary pl-3 italic">{selectedAppt.notes}</p>
                  )}
                </div>

                {/* Current status */}
                <div>
                  <p className="text-xs font-medium text-on-surface-variant mb-2">Status atual</p>
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${STATUS_COLORS[selectedAppt.status ?? 'scheduled']}`}>
                    {STATUS_LABELS[selectedAppt.status ?? 'scheduled']}
                  </span>
                </div>

                {/* Available actions */}
                {(NEXT_STATUSES[selectedAppt.status ?? ''] ?? []).length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-on-surface-variant">Ações disponíveis</p>
                    <div className="flex flex-col gap-2">
                      {(NEXT_STATUSES[selectedAppt.status ?? ''] ?? []).map((action) => (
                        <button
                          key={action.status}
                          onClick={() => handleStatusChange(selectedAppt.id, action.status)}
                          disabled={isPending}
                          className={`${action.cls} text-sm font-semibold px-4 py-2.5 rounded-xl transition-opacity disabled:opacity-50`}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-outline-variant pt-4">
                  <Link
                    href={`/pacientes/${selectedAppt.patient_id}`}
                    className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>folder_shared</span>
                    Abrir prontuário do paciente
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
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
