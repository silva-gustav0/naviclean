import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Shield, Check, X } from "lucide-react"

const ROLES = [
  { key: "clinic_owner", label: "Proprietário" },
  { key: "dentist", label: "Dentista Filiado" },
  { key: "independent_professional", label: "Prof. Independente" },
  { key: "receptionist", label: "Recepcionista" },
]

const PERMISSIONS = [
  { key: "view_dashboard", label: "Ver dashboard" },
  { key: "manage_appointments", label: "Gerenciar agenda" },
  { key: "view_patients", label: "Ver pacientes" },
  { key: "edit_patients", label: "Editar pacientes" },
  { key: "view_records", label: "Ver prontuário" },
  { key: "edit_records", label: "Editar prontuário" },
  { key: "view_financial", label: "Ver financeiro" },
  { key: "manage_financial", label: "Gerenciar financeiro" },
  { key: "view_stock", label: "Ver estoque" },
  { key: "manage_stock", label: "Gerenciar estoque" },
  { key: "manage_team", label: "Gerenciar equipe" },
  { key: "manage_settings", label: "Configurações" },
  { key: "view_reports", label: "Ver relatórios" },
  { key: "export_data", label: "Exportar dados" },
]

const DEFAULT_MATRIX: Record<string, Record<string, boolean>> = {
  clinic_owner: Object.fromEntries(PERMISSIONS.map((p) => [p.key, true])),
  dentist: {
    view_dashboard: true, manage_appointments: true, view_patients: true,
    edit_patients: false, view_records: true, edit_records: true,
    view_financial: false, manage_financial: false, view_stock: false,
    manage_stock: false, manage_team: false, manage_settings: false,
    view_reports: false, export_data: false,
  },
  independent_professional: {
    view_dashboard: true, manage_appointments: true, view_patients: true,
    edit_patients: false, view_records: true, edit_records: true,
    view_financial: true, manage_financial: false, view_stock: false,
    manage_stock: false, manage_team: false, manage_settings: false,
    view_reports: true, export_data: false,
  },
  receptionist: {
    view_dashboard: true, manage_appointments: true, view_patients: true,
    edit_patients: true, view_records: false, edit_records: false,
    view_financial: false, manage_financial: false, view_stock: true,
    manage_stock: false, manage_team: false, manage_settings: false,
    view_reports: false, export_data: false,
  },
}

export default async function PermissoesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase.from("clinics").select("id").eq("owner_id", user.id).single()
  if (!clinic) redirect("/onboarding")

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Permissões por Função</h1>
          <p className="text-muted-foreground text-sm">Matriz de acesso para cada papel na clínica</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 px-3 py-2 rounded-xl">
          <Shield className="h-3.5 w-3.5 text-amber-600" />
          Apenas proprietários podem alterar permissões
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-max">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b">
            <tr>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3 w-48">Permissão</th>
              {ROLES.map((r) => (
                <th key={r.key} className="text-center text-xs font-medium text-muted-foreground px-4 py-3 min-w-[140px]">
                  {r.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {PERMISSIONS.map((perm) => (
              <tr key={perm.key} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-5 py-3 text-sm font-medium">{perm.label}</td>
                {ROLES.map((role) => {
                  const allowed = DEFAULT_MATRIX[role.key]?.[perm.key] ?? false
                  return (
                    <td key={role.key} className="px-4 py-3 text-center">
                      <div className="flex justify-center">
                        {allowed
                          ? <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                            </div>
                          : <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                              <X className="h-3.5 w-3.5 text-slate-400" />
                            </div>
                        }
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">
        * Estas são as permissões padrão por função. Em breve, será possível customizar individualmente por membro.
      </p>
    </div>
  )
}
