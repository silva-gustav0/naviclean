import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AdminLogsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "super_admin") redirect("/dashboard")

  const { data: clinicData } = await supabase.from("clinics").select("id").eq("owner_id", user.id).single()

  const { data: logs } = await supabase
    .from("audit_log")
    .select("id, action, entity_type, entity_id, created_at")
    .eq("clinic_id", clinicData?.id ?? "")
    .order("created_at", { ascending: false })
    .limit(100)

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-headline font-extrabold text-2xl text-primary">Logs do Sistema</h1>
        <p className="text-on-surface-variant text-sm mt-0.5">Auditoria técnica e de segurança</p>
      </div>

      {logs && logs.length > 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-premium-sm">
          <div className="divide-y divide-outline-variant/50">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-4 px-5 py-3.5 hover:bg-surface-container transition-colors">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 bg-blue-50">
                  <span className="material-symbols-outlined text-blue-600" style={{ fontSize: 14 }}>info</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mono font-medium text-on-surface">{log.action}</p>
                  <p className="text-xs text-on-surface-variant">
                    {log.entity_type && `${log.entity_type} `}
                    {log.entity_id && `#${log.entity_id.slice(0, 8)}...`}
                  </p>
                </div>
                <p className="text-xs text-on-surface-variant whitespace-nowrap shrink-0">
                  {new Date(log.created_at as string).toLocaleString("pt-BR")}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant py-16 text-center shadow-premium-sm">
          <span className="material-symbols-outlined text-outline mb-3 block" style={{ fontSize: 40 }}>receipt_long</span>
          <p className="font-semibold text-on-surface">Nenhum log registrado</p>
          <p className="text-on-surface-variant text-sm mt-1">Os logs aparecem aqui conforme as atividades ocorrem.</p>
        </div>
      )}
    </div>
  )
}
