import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

const STATUS_COLORS: Record<string, string> = {
  new:       "bg-blue-50 text-blue-700 border-blue-200",
  contacted: "bg-amber-50 text-amber-700 border-amber-200",
  converted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  lost:      "bg-surface-container text-on-surface-variant border-outline-variant",
}
const STATUS_LABELS: Record<string, string> = {
  new: "Novo", contacted: "Contatado", converted: "Convertido", lost: "Perdido",
}

export default async function LeadsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase.from("clinics").select("id").eq("owner_id", user.id).single()
  if (!clinic) redirect("/onboarding")

  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .eq("clinic_id", clinic.id)
    .order("created_at", { ascending: false })
    .limit(100)

  const newCount = (leads ?? []).filter((l) => l.status === "new").length
  const convertedCount = (leads ?? []).filter((l) => l.status === "converted").length

  const kpis = [
    { label: "Total", value: String(leads?.length ?? 0), cls: "text-on-surface" },
    { label: "Novos", value: String(newCount), cls: "text-blue-600" },
    { label: "Convertidos", value: String(convertedCount), cls: "text-emerald-600" },
    { label: "Taxa conversão", value: leads?.length ? `${Math.round((convertedCount / leads.length) * 100)}%` : "0%", cls: "text-primary" },
  ]

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-headline font-extrabold text-3xl text-primary">Leads</h1>
        <p className="text-on-surface-variant text-sm mt-0.5">{leads?.length ?? 0} leads · {newCount} novos · {convertedCount} convertidos</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 shadow-premium-sm">
            <p className={`font-headline font-extrabold text-2xl ${k.cls}`}>{k.value}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {leads && leads.length > 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-premium-sm">
          <div className="divide-y divide-outline-variant/50">
            {leads.map((lead) => (
              <div key={lead.id as string} className="flex items-center gap-4 px-5 py-4 hover:bg-surface-container transition-colors">
                <div className="w-10 h-10 rounded-full surgical-gradient flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {((lead.name ?? lead.email) as string)?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-on-surface">{lead.name as string || "—"}</p>
                  <div className="flex items-center gap-3 text-xs text-on-surface-variant mt-0.5">
                    {lead.email && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined" style={{ fontSize: 12 }}>mail</span>
                        {lead.email as string}
                      </span>
                    )}
                    {lead.phone && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined" style={{ fontSize: 12 }}>phone</span>
                        {lead.phone as string}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-medium ${STATUS_COLORS[lead.status as string] ?? "bg-surface-container text-on-surface-variant border-outline-variant"}`}>
                    {STATUS_LABELS[lead.status as string] ?? lead.status}
                  </span>
                  <p className="text-[10px] text-on-surface-variant mt-1">
                    {new Date(lead.created_at as string).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant shrink-0" style={{ fontSize: 16 }}>chevron_right</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant py-16 text-center shadow-premium-sm">
          <span className="material-symbols-outlined text-outline mb-3 block" style={{ fontSize: 40 }}>groups</span>
          <p className="font-semibold text-on-surface">Nenhum lead ainda</p>
          <p className="text-on-surface-variant text-sm mt-1">Leads do formulário de contato do site público aparecerão aqui.</p>
        </div>
      )}
    </div>
  )
}
