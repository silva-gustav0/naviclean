import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

const ACTION_LABELS: Record<string, string> = {
  view_patient: "Visualizou prontuário",
  edit_patient: "Editou paciente",
  create_patient: "Criou paciente",
  create_evolution: "Criou evolução",
  sign_evolution: "Assinou evolução",
  create_prescription: "Emitiu prescrição",
  generate_anamnesis_token: "Gerou link de anamnese",
  login: "Login",
  logout: "Logout",
}

export default async function AuditoriaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase.from("clinics").select("id").eq("owner_id", user.id).single()
  if (!clinic) redirect("/onboarding")

  const { data: logs } = await supabase
    .from("audit_log")
    .select("*, profiles(full_name, email)")
    .eq("clinic_id", clinic.id)
    .order("created_at", { ascending: false })
    .limit(200)

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mb-1">
          <Link href="/configuracoes" className="hover:text-primary transition-colors">Configurações</Link>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
          <span className="text-on-surface">Auditoria</span>
        </div>
        <h1 className="font-headline font-extrabold text-2xl text-primary">Log de Auditoria</h1>
        <p className="text-on-surface-variant text-sm mt-0.5">Registro de atividades sensíveis — LGPD</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 flex items-start gap-2">
        <span className="material-symbols-outlined text-amber-600 shrink-0" style={{ fontSize: 16 }}>info</span>
        Este log registra acessos e modificações em dados sensíveis. Somente o proprietário da clínica pode visualizá-lo.
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-premium-sm">
        {(logs ?? []).length === 0 ? (
          <div className="py-16 text-center">
            <span className="material-symbols-outlined text-outline mb-3 block" style={{ fontSize: 40 }}>receipt_long</span>
            <h3 className="font-semibold text-on-surface mb-1">Nenhum registro de auditoria</h3>
            <p className="text-on-surface-variant text-sm max-w-xs mx-auto">
              Os registros aparecem aqui conforme as atividades ocorrem.
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface-container border-b border-outline-variant">
              <tr>
                <th className="text-left font-medium text-xs text-on-surface-variant px-5 py-3">Data/Hora</th>
                <th className="text-left font-medium text-xs text-on-surface-variant px-4 py-3">Usuário</th>
                <th className="text-left font-medium text-xs text-on-surface-variant px-4 py-3">Ação</th>
                <th className="text-left font-medium text-xs text-on-surface-variant px-4 py-3">Entidade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50">
              {(logs ?? []).map((log) => {
                const profile = log.profiles as { full_name: string | null; email: string | null } | null
                const userName = profile?.full_name ?? profile?.email ?? "Sistema"
                const action = ACTION_LABELS[log.action] ?? log.action
                const createdAt = new Date(log.created_at as string)

                return (
                  <tr key={log.id} className="hover:bg-surface-container transition-colors">
                    <td className="px-5 py-3 text-xs text-on-surface-variant whitespace-nowrap">
                      {createdAt.toLocaleDateString("pt-BR")} {createdAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold text-on-surface">{userName}</td>
                    <td className="px-4 py-3 text-xs text-on-surface">{action}</td>
                    <td className="px-4 py-3 text-xs text-on-surface-variant">
                      <span className="capitalize">{log.entity_type?.replace(/_/g, " ")}</span>
                      {log.entity_id && <span className="text-[10px] ml-1 font-mono opacity-60">{(log.entity_id as string).substring(0, 8)}</span>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
