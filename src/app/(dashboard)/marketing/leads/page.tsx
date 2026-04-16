import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Users, Phone, Mail, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  converted: "bg-emerald-100 text-emerald-700",
  lost: "bg-slate-100 text-slate-500",
}
const STATUS_LABELS: Record<string, string> = {
  new: "Novo",
  contacted: "Contatado",
  converted: "Convertido",
  lost: "Perdido",
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

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold">Leads</h1>
        <p className="text-muted-foreground text-sm">{leads?.length ?? 0} leads · {newCount} novos · {convertedCount} convertidos</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: String(leads?.length ?? 0), color: "" },
          { label: "Novos", value: String(newCount), color: "text-blue-600" },
          { label: "Convertidos", value: String(convertedCount), color: "text-emerald-600" },
          { label: "Taxa conversão", value: leads?.length ? `${Math.round((convertedCount / leads.length) * 100)}%` : "0%", color: "text-violet-600" },
        ].map((k) => (
          <div key={k.label} className="bg-white dark:bg-slate-900 border rounded-2xl p-4">
            <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {leads && leads.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
          <div className="divide-y">
            {leads.map((lead) => (
              <div key={lead.id as string} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-600 font-bold text-sm shrink-0">
                  {((lead.name ?? lead.email) as string)?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{lead.name as string || "—"}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    {lead.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {lead.email as string}
                      </span>
                    )}
                    {lead.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {lead.phone as string}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <Badge className={`text-[10px] ${STATUS_COLORS[lead.status as string] ?? "bg-slate-100 text-slate-500"}`}>
                    {STATUS_LABELS[lead.status as string] ?? lead.status}
                  </Badge>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {new Date(lead.created_at as string).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950 flex items-center justify-center mx-auto mb-3">
            <Users className="h-7 w-7 text-orange-500" />
          </div>
          <p className="font-semibold">Nenhum lead ainda</p>
          <p className="text-muted-foreground text-sm mt-1">Leads do formulário de contato do site público aparecerão aqui.</p>
        </div>
      )}
    </div>
  )
}
