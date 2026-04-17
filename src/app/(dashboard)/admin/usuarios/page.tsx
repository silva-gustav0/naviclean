import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

const ROLE_COLORS: Record<string, string> = {
  super_admin: "bg-red-50 text-red-600 border-red-200",
  clinic_owner: "bg-primary/10 text-primary border-primary/20",
  dentist: "bg-blue-50 text-blue-700 border-blue-200",
  receptionist: "bg-emerald-50 text-emerald-700 border-emerald-200",
}

export default async function AdminUsuariosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "super_admin") redirect("/dashboard")

  const { data: users } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, created_at, avatar_url")
    .order("created_at", { ascending: false })
    .limit(200)

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-headline font-extrabold text-2xl text-primary">Usuários</h1>
        <p className="text-on-surface-variant text-sm mt-0.5">{users?.length ?? 0} usuários</p>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-premium-sm">
        <table className="w-full text-sm">
          <thead className="bg-surface-container border-b border-outline-variant">
            <tr>
              <th className="text-left text-xs font-medium text-on-surface-variant px-5 py-3">Usuário</th>
              <th className="text-left text-xs font-medium text-on-surface-variant px-4 py-3">Função</th>
              <th className="text-left text-xs font-medium text-on-surface-variant px-4 py-3">Cadastro</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/50">
            {(users ?? []).map((u) => {
              const initials = ((u.full_name as string) ?? "?").split(" ").slice(0, 2).map((n: string) => n[0]).join("").toUpperCase()
              return (
                <tr key={u.id as string} className="hover:bg-surface-container transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full surgical-gradient flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {initials}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-on-surface">{u.full_name as string || "—"}</p>
                        <p className="text-xs text-on-surface-variant">{u.email as string}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-medium ${ROLE_COLORS[u.role as string] ?? "bg-surface-container text-on-surface-variant border-outline-variant"}`}>
                      {u.role as string ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-on-surface-variant">
                    {new Date(u.created_at as string).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3">
                    <button className="p-1.5 hover:bg-surface-container rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 14 }}>key</span>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {(!users || users.length === 0) && (
          <div className="py-14 text-center">
            <span className="material-symbols-outlined text-outline mb-2 block" style={{ fontSize: 32 }}>group</span>
            <p className="text-sm text-on-surface-variant">Nenhum usuário encontrado</p>
          </div>
        )}
      </div>
    </div>
  )
}
