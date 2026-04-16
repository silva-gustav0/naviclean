import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ClipboardList, Plus, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

const STATUS_COLORS: Record<string, string> = {
  quoted: "bg-slate-100 text-slate-600",
  approved: "bg-blue-100 text-blue-700",
  in_progress: "bg-violet-100 text-violet-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
}
const STATUS_LABELS: Record<string, string> = {
  quoted: "Orçado",
  approved: "Aprovado",
  in_progress: "Em andamento",
  completed: "Concluído",
  cancelled: "Cancelado",
}

export default async function TratamentoPlanosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase.from("clinics").select("id").eq("owner_id", user.id).single()
  if (!clinic) redirect("/onboarding")

  const { data: plans } = await supabase
    .from("treatment_plans")
    .select("id, title, status, total_amount, created_at, patients(full_name), clinic_members(full_name)")
    .eq("clinic_id", clinic.id)
    .order("created_at", { ascending: false })
    .limit(50)

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Planos de Tratamento</h1>
          <p className="text-muted-foreground text-sm">{plans?.length ?? 0} planos</p>
        </div>
      </div>

      {/* Filters summary */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(STATUS_LABELS).map(([key, label]) => {
          const count = (plans ?? []).filter((p) => p.status === key).length
          return (
            <div key={key} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${STATUS_COLORS[key]}`}>
              {label}
              <span className="bg-white/50 dark:bg-black/20 px-1.5 py-0.5 rounded-full font-bold">{count}</span>
            </div>
          )
        })}
      </div>

      {plans && plans.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
          <div className="divide-y">
            {plans.map((plan) => {
              const patient = plan.patients as { full_name: string } | null
              const member = plan.clinic_members as { full_name: string } | null
              return (
                <Link
                  key={plan.id as string}
                  href={`/tratamentos/planos/${plan.id as string}`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950 flex items-center justify-center shrink-0">
                    <ClipboardList className="h-5 w-5 text-cyan-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{plan.title as string || "Plano de tratamento"}</p>
                    <p className="text-xs text-muted-foreground">
                      {patient?.full_name ?? "—"} · Dr(a). {member?.full_name ?? "—"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(plan.created_at as string).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  {plan.total_amount && (
                    <p className="text-sm font-semibold text-[#0D3A6B] shrink-0">{fmt(Number(plan.total_amount))}</p>
                  )}
                  <Badge className={`text-[10px] shrink-0 ${STATUS_COLORS[plan.status as string ?? ""] ?? "bg-slate-100 text-slate-600"}`}>
                    {STATUS_LABELS[plan.status as string ?? ""] ?? plan.status}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </Link>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cyan-50 dark:bg-cyan-950 flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="h-8 w-8 text-cyan-600" />
          </div>
          <h3 className="font-semibold text-base mb-1">Nenhum plano de tratamento</h3>
          <p className="text-muted-foreground text-sm mb-4 max-w-xs mx-auto">
            Crie planos de tratamento para seus pacientes a partir do prontuário.
          </p>
          <Link href="/pacientes" className="text-xs text-blue-600 hover:underline">
            Ir para Pacientes
          </Link>
        </div>
      )}
    </div>
  )
}
