import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
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
        <Link href="/configuracoes" className="p-2 hover:bg-surface-container rounded-xl transition-colors">
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>arrow_back</span>
        </Link>
        <div>
          <h1 className="font-headline font-extrabold text-2xl text-primary">Meu Perfil</h1>
          <p className="text-on-surface-variant text-sm">Suas informações pessoais</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 space-y-6 shadow-premium-sm">
        <div className="flex items-center gap-5 pb-5 border-b border-outline-variant">
          <div className="w-20 h-20 rounded-2xl surgical-gradient flex items-center justify-center text-white text-2xl font-bold shrink-0 shadow-premium-sm">
            {initials}
          </div>
          <div>
            <p className="font-bold text-on-surface">{fullName || "Seu nome"}</p>
            <p className="text-sm text-on-surface-variant">{user.email}</p>
          </div>
        </div>

        <ProfileForm fullName={fullName} email={user.email ?? ""} />
      </div>
    </div>
  )
}
