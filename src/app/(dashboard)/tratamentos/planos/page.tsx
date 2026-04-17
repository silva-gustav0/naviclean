import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

const STATUS_COLORS: Record<string, string> = {
  quoted:      "bg-surface-container text-on-surface-variant border-outline-variant",
  approved:    "bg-blue-50 text-blue-700 border-blue-200",
  in_progress: "bg-primary/10 text-primary border-primary/20",
  completed:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled:   "bg-red-50 text-red-600 border-red-200",
}
const STATUS_LABELS: Record<string, string> = {
  quoted: "Orçado", approved: "Aprovado", in_progress: "Em andamento",
  completed: "Concluído", cancelled: "Cancelado",
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
      <div>
        <h1 className="font-headline font-extrabold text-3xl text-primary">Planos de Tratamento</h1>
        <p className="text-on-surface-variant text-sm mt-0.5">{plans?.length ?? 0} planos</p>
      </div>

      {/* Status counters */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(STATUS_LABELS).map(([key, label]) => {
          const count = (plans ?? []).filter((p) => p.status === key).length
          return (
            <div key={key} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${STATUS_COLORS[key]}`}>
              {label}
              <span className="bg-white/60 px-1.5 py-0.5 rounded-full font-bold">{count}</span>
            </div>
          )
        })}
      </div>

      {plans && plans.length > 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-premium-sm">
          <div className="divide-y divide-outline-variant/50">
            {plans.map((plan) => {
              const patient = plan.patients as { full_name: string } | null
              const member = plan.clinic_members as { full_name: string } | null
              return (
                <Link
                  key={plan.id as string}
                  href={`/tratamentos/planos/${plan.id as string}`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-surface-container transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>clinical_notes</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-on-surface">{plan.title as string || "Plano de tratamento"}</p>
                    <p className="text-xs text-on-surface-variant">
                      {patient?.full_name ?? "—"} · Dr(a). {member?.full_name ?? "—"}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {new Date(plan.created_at as string).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  {plan.total_amount && (
                    <p className="text-sm font-bold text-primary shrink-0">{fmt(Number(plan.total_amount))}</p>
                  )}
                  <span className={`text-[10px] shrink-0 px-2.5 py-0.5 rounded-full border font-medium ${STATUS_COLORS[plan.status as string ?? ""] ?? STATUS_COLORS.quoted}`}>
                    {STATUS_LABELS[plan.status as string ?? ""] ?? plan.status}
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant shrink-0 group-hover:text-primary transition-colors" style={{ fontSize: 16 }}>chevron_right</span>
                </Link>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant py-16 text-center shadow-premium-sm">
          <span className="material-symbols-outlined text-outline mb-3 block" style={{ fontSize: 40 }}>clinical_notes</span>
          <h3 className="font-semibold text-on-surface text-base mb-1">Nenhum plano de tratamento</h3>
          <p className="text-on-surface-variant text-sm mb-4 max-w-xs mx-auto">
            Crie planos de tratamento para seus pacientes a partir do prontuário.
          </p>
          <Link href="/pacientes" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1 justify-center">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
            Ir para Pacientes
          </Link>
        </div>
      )}
    </div>
  )
}
