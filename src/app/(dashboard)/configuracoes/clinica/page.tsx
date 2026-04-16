import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ClinicForm } from "@/components/dashboard/forms/clinic-form"

export default async function ClinicaConfigPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: clinic } = await supabase.from("clinics").select("*").eq("owner_id", user.id).single()
  if (!clinic) redirect("/onboarding")

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/configuracoes" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Informações da Clínica</h1>
          <p className="text-muted-foreground text-sm">Dados públicos da clínica</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border p-6 space-y-5">
        <div className="flex items-center gap-4 pb-5 border-b">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold">
            {(clinic.name as string)?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-lg">{clinic.name as string}</p>
            <p className="text-sm text-muted-foreground">naviclin.com/c/{clinic.slug as string}</p>
          </div>
        </div>

        <ClinicForm
          clinic={{
            name: clinic.name as string,
            slug: clinic.slug as string,
            phone: clinic.phone as string | null,
            address_city: clinic.address_city as string | null,
            address_state: clinic.address_state as string | null,
          }}
        />
      </div>
    </div>
  )
}
