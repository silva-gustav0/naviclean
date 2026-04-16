import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { ArrowLeft, ClipboardList, Check, Clock, DollarSign, Printer } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface Props {
  params: Promise<{ id: string }>
}

const STEP_COLORS: Record<string, string> = {
  pending: "bg-slate-100 text-slate-600",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
}
const STEP_LABELS: Record<string, string> = {
  pending: "Pendente",
  in_progress: "Em andamento",
  completed: "Concluído",
  cancelled: "Cancelado",
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
        <Link href="/tratamentos/planos" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold flex-1">{plan.title as string || "Plano de tratamento"}</h1>
        <button className="flex items-center gap-1.5 border px-3 py-2 rounded-xl text-sm hover:bg-slate-50 transition-colors">
          <Printer className="h-4 w-4" />
          Imprimir
        </button>
      </div>

      {/* Info card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-muted-foreground">Paciente</p>
          <p className="font-semibold mt-0.5">{patient?.full_name ?? "—"}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Profissional</p>
          <p className="font-semibold mt-0.5">{member?.full_name ?? "—"}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Valor total</p>
          <p className="font-semibold mt-0.5">{plan.total_amount ? fmt(Number(plan.total_amount)) : "—"}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Progresso</p>
          <p className="font-semibold mt-0.5">{completedProcedures}/{totalProcedures} procedimentos</p>
        </div>
      </div>

      {/* Progress bar */}
      {totalProcedures > 0 && (
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all"
            style={{ width: `${(completedProcedures / totalProcedures) * 100}%` }}
          />
        </div>
      )}

      {/* Procedures */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-sm flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-cyan-600" />
            Procedimentos
          </h2>
        </div>
        {items.length > 0 ? (
          <div className="divide-y">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  item.status === "completed" ? "bg-emerald-100" : "bg-slate-100"
                }`}>
                  {item.status === "completed"
                    ? <Check className="h-4 w-4 text-emerald-600" />
                    : <Clock className="h-4 w-4 text-slate-400" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{item.services?.name ?? "Procedimento"}</p>
                  {(item.quantity ?? 1) > 1 && <p className="text-xs text-muted-foreground">Qtd: {item.quantity}</p>}
                </div>
                {item.total_price > 0 && (
                  <p className="text-sm font-semibold flex items-center gap-1 shrink-0 text-[#0D3A6B]">
                    <DollarSign className="h-3.5 w-3.5" />
                    {fmt(Number(item.total_price))}
                  </p>
                )}
                <Badge className={`text-[10px] shrink-0 ${STEP_COLORS[item.status] ?? "bg-slate-100 text-slate-600"}`}>
                  {STEP_LABELS[item.status] ?? item.status}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center">
            <p className="text-sm text-muted-foreground">Nenhum procedimento cadastrado</p>
          </div>
        )}
      </div>
    </div>
  )
}
