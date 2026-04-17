import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

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
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-headline font-extrabold text-3xl text-primary">Permissões por Função</h1>
          <p className="text-on-surface-variant text-sm mt-0.5">Matriz de acesso para cada papel na clínica</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl">
          <span className="material-symbols-outlined text-amber-600" style={{ fontSize: 14 }}>shield</span>
          Apenas proprietários podem alterar permissões
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden overflow-x-auto shadow-premium-sm">
        <table className="w-full text-sm min-w-max">
          <thead className="bg-surface-container border-b border-outline-variant">
            <tr>
              <th className="text-left text-xs font-medium text-on-surface-variant px-5 py-3 w-48">Permissão</th>
              {ROLES.map((r) => (
                <th key={r.key} className="text-center text-xs font-semibold text-on-surface px-4 py-3 min-w-[140px]">
                  {r.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/50">
            {PERMISSIONS.map((perm) => (
              <tr key={perm.key} className="hover:bg-surface-container transition-colors">
                <td className="px-5 py-3 text-sm font-medium text-on-surface">{perm.label}</td>
                {ROLES.map((role) => {
                  const allowed = DEFAULT_MATRIX[role.key]?.[perm.key] ?? false
                  return (
                    <td key={role.key} className="px-4 py-3 text-center">
                      <div className="flex justify-center">
                        {allowed
                          ? <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                              <span className="material-symbols-outlined text-emerald-600" style={{ fontSize: 14 }}>check</span>
                            </div>
                          : <div className="w-6 h-6 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center">
                              <span className="material-symbols-outlined text-outline" style={{ fontSize: 14 }}>close</span>
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

      <p className="text-xs text-on-surface-variant">
        * Estas são as permissões padrão por função. Em breve, será possível customizar individualmente por membro.
      </p>
    </div>
  )
}
