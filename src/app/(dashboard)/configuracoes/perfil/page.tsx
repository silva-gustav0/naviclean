import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ProfileForm } from "@/components/dashboard/forms/profile-form"

export default async function PerfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
  const fullName = (profile?.full_name as string) ?? (user.user_metadata?.full_name as string) ?? ""
  const initials = fullName.split(" ").slice(0, 2).map((n: string) => n[0]).join("").toUpperCase() || "?"

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/configuracoes" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Meu Perfil</h1>
          <p className="text-muted-foreground text-sm">Suas informações pessoais</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border p-6 space-y-6">
        <div className="flex items-center gap-5 pb-5 border-b">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {initials}
          </div>
          <div>
            <p className="font-bold">{fullName || "Seu nome"}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <ProfileForm fullName={fullName} email={user.email ?? ""} />
      </div>
    </div>
  )
}
