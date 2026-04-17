import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"

interface Props {
  params: Promise<{ id: string }>
}

const STEP_COLORS: Record<string, string> = {
  pending:     "bg-surface-container text-on-surface-variant border-outline-variant",
  in_progress: "bg-blue-50 text-blue-700 border-blue-200",
  completed:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled:   "bg-red-50 text-red-600 border-red-200",
}
const STEP_LABELS: Record<string, string> = {
  pending: "Pendente", in_progress: "Em andamento",
  completed: "Concluído", cancelled: "Cancelado",
}

export default async function PlanoDetalhe({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase.from("clinics").select("id").eq("owner_id", user.id).single()
  if (!clinic) redirect("/onboarding")

  const { data: plan } = await supabase
    .from("treatment_plans")
    .select("*, patients(full_name, cpf), clinic_members(full_name), treatment_plan_items(id, service_id, status, quantity, unit_price, total_price, services(name))")
    .eq("id", id)
    .eq("clinic_id", clinic.id)
    .single()

  if (!plan) notFound()

  const patient = plan.patients as { full_name: string; cpf?: string } | null
  const member = plan.clinic_members as { full_name: string } | null
  const items = (plan.treatment_plan_items ?? []) as {
    id: string; status: string; quantity: number | null; unit_price: number; total_price: number; services: { name: string } | null
  }[]
  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  const totalProcedures = items.length
  const completedProcedures = items.filter((i) => i.status === "completed").length

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/tratamentos/planos" className="p-2 hover:bg-surface-container rounded-xl transition-colors">
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>arrow_back</span>
        </Link>
        <h1 className="font-headline font-bold text-2xl text-primary flex-1">{plan.title as string || "Plano de tratamento"}</h1>
        <button className="flex items-center gap-1.5 border border-outline-variant text-on-surface-variant px-3 py-2 rounded-xl text-sm hover:bg-surface-container transition-colors">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>print</span>
          Imprimir
        </button>
      </div>

      {/* Info card */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5 shadow-premium-sm grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-on-surface-variant font-medium mb-0.5">Paciente</p>
          <p className="font-semibold text-on-surface">{patient?.full_name ?? "—"}</p>
        </div>
        <div>
          <p className="text-xs text-on-surface-variant font-medium mb-0.5">Profissional</p>
          <p className="font-semibold text-on-surface">{member?.full_name ?? "—"}</p>
        </div>
        <div>
          <p className="text-xs text-on-surface-variant font-medium mb-0.5">Valor total</p>
          <p className="font-bold text-primary">{plan.total_amount ? fmt(Number(plan.total_amount)) : "—"}</p>
        </div>
        <div>
          <p className="text-xs text-on-surface-variant font-medium mb-0.5">Progresso</p>
          <p className="font-semibold text-on-surface">{completedProcedures}/{totalProcedures} procedimentos</p>
        </div>
      </div>

      {/* Progress bar */}
      {totalProcedures > 0 && (
        <div className="h-2 bg-surface-container rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all"
            style={{ width: `${(completedProcedures / totalProcedures) * 100}%` }}
          />
        </div>
      )}

      {/* Procedures */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-premium-sm">
        <div className="px-5 py-4 border-b border-outline-variant bg-surface-container flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: 18 }}>clinical_notes</span>
          <h2 className="font-semibold text-sm text-on-surface">Procedimentos</h2>
        </div>
        {items.length > 0 ? (
          <div className="divide-y divide-outline-variant/50">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-container transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  item.status === "completed" ? "bg-emerald-50" : "bg-surface-container"
                }`}>
                  <span className={`material-symbols-outlined ${item.status === "completed" ? "text-emerald-600" : "text-on-surface-variant"}`} style={{ fontSize: 16 }}>
                    {item.status === "completed" ? "check_circle" : "schedule"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-on-surface">{item.services?.name ?? "Procedimento"}</p>
                  {(item.quantity ?? 1) > 1 && <p className="text-xs text-on-surface-variant">Qtd: {item.quantity}</p>}
                </div>
                {item.total_price > 0 && (
                  <p className="text-sm font-bold text-primary shrink-0">{fmt(Number(item.total_price))}</p>
                )}
                <span className={`text-[10px] shrink-0 px-2.5 py-0.5 rounded-full border font-medium ${STEP_COLORS[item.status] ?? STEP_COLORS.pending}`}>
                  {STEP_LABELS[item.status] ?? item.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center">
            <span className="material-symbols-outlined text-outline mb-2 block" style={{ fontSize: 32 }}>clinical_notes</span>
            <p className="text-sm text-on-surface-variant">Nenhum procedimento cadastrado</p>
          </div>
        )}
      </div>
    </div>
  )
}
