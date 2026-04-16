import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Users, KeyRound } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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

  const ROLE_COLORS: Record<string, string> = {
    super_admin: "bg-red-100 text-red-700",
    clinic_owner: "bg-violet-100 text-violet-700",
    dentist: "bg-blue-100 text-blue-700",
    receptionist: "bg-emerald-100 text-emerald-700",
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold">Usuários</h1>
        <p className="text-muted-foreground text-sm">{users?.length ?? 0} usuários</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b">
            <tr>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Usuário</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Função</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Cadastro</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {(users ?? []).map((u) => {
              const initials = ((u.full_name as string) ?? "?").split(" ").slice(0, 2).map((n: string) => n[0]).join("").toUpperCase()
              return (
                <tr key={u.id as string} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0D3A6B] to-[#1A5599] flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {initials}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{u.full_name as string || "—"}</p>
                        <p className="text-xs text-muted-foreground">{u.email as string}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={`text-[10px] ${ROLE_COLORS[u.role as string] ?? "bg-slate-100 text-slate-600"}`}>
                      {u.role as string}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date(u.created_at as string).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Reset senha">
                      <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {(!users || users.length === 0) && (
          <div className="py-14 text-center">
            <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Nenhum usuário</p>
          </div>
        )}
      </div>
    </div>
  )
}
