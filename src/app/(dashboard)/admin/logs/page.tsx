import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ScrollText, Info } from "lucide-react"

export default async function AdminLogsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "super_admin") redirect("/dashboard")

  const { data: logs } = await supabase
    .from("audit_log")
    .select("id, action, entity_type, entity_id, created_at")
    .eq("clinic_id", (await supabase.from("clinics").select("id").eq("owner_id", user.id).single()).data?.id ?? "")
    .order("created_at", { ascending: false })
    .limit(100)

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold">Logs do Sistema</h1>
        <p className="text-muted-foreground text-sm">Auditoria técnica e de segurança</p>
      </div>

      {logs && logs.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
          <div className="divide-y">
            {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-4 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 bg-blue-100 text-blue-700">
                    <Info className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono font-medium">{log.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {log.entity_type && `${log.entity_type} `}
                      {log.entity_id && `#${log.entity_id.slice(0, 8)}...`}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground shrink-0">
                    {new Date(log.created_at as string).toLocaleString("pt-BR")}
                  </p>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border py-16 text-center">
          <ScrollText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold">Nenhum log registrado</p>
        </div>
      )}
    </div>
  )
}
