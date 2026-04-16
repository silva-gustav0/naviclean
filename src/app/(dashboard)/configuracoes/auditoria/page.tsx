import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ScrollText, Search } from "lucide-react"
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
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <Link href="/configuracoes" className="hover:text-foreground transition-colors">Configurações</Link>
          <span>/</span>
          <span>Auditoria</span>
        </div>
        <h1 className="text-2xl font-bold">Log de Auditoria</h1>
        <p className="text-muted-foreground text-sm">Registro de atividades sensíveis — LGPD</p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm text-amber-800 dark:text-amber-200">
        Este log registra acessos e modificações em dados sensíveis. Somente o proprietário da clínica pode visualizá-lo.
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
        {(logs ?? []).length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
              <ScrollText className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="font-semibold mb-1">Nenhum registro de auditoria</h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Os registros aparecem aqui conforme as atividades ocorrem.
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b">
              <tr>
                <th className="text-left font-medium text-xs text-muted-foreground px-5 py-3">Data/Hora</th>
                <th className="text-left font-medium text-xs text-muted-foreground px-4 py-3">Usuário</th>
                <th className="text-left font-medium text-xs text-muted-foreground px-4 py-3">Ação</th>
                <th className="text-left font-medium text-xs text-muted-foreground px-4 py-3">Entidade</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {(logs ?? []).map((log) => {
                const profile = log.profiles as { full_name: string | null; email: string | null } | null
                const userName = profile?.full_name ?? profile?.email ?? "Sistema"
                const action = ACTION_LABELS[log.action] ?? log.action
                const createdAt = new Date(log.created_at as string)

                return (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {createdAt.toLocaleDateString("pt-BR")} {createdAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-4 py-3 text-xs font-medium">{userName}</td>
                    <td className="px-4 py-3 text-xs">{action}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
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
